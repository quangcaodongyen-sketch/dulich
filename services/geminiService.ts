
import { GoogleGenAI, Type } from "@google/genai";
import { AppState, EditMode, BeautifyLevel, Gender, AgeGroup, ClothingLength } from "../types";

/**
 * Khởi tạo client GoogleGenAI.
 * Ưu tiên API_KEY từ state (người dùng nhập), sau đó mới tới process.env.API_KEY.
 */
const getAIClient = (userApiKey?: string) => {
  const apiKey = userApiKey || process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key không tìm thấy. Vui lòng nhập API Key trong phần Cấu hình AI.");
  }
  return new GoogleGenAI({ apiKey });
};

export const fileToGenerativePart = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const base64Data = base64String.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const generateWorldSuggestions = async (userApiKey?: string): Promise<string[]> => {
  const ai = getAIClient(userApiKey);
  const prompt = `Bạn là một chuyên gia du lịch quốc tế. Hãy gợi ý 10 địa danh nổi tiếng thế giới (Tên - Quốc gia). Trả về dưới dạng mảng JSON các chuỗi ký tự.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });
    
    return response.text ? JSON.parse(response.text.trim()) : [];
  } catch (error) {
    console.error("Lỗi khi lấy gợi ý thế giới:", error);
    return ["Tháp Eiffel, Pháp", "Núi Phú Sĩ, Nhật Bản", "Tượng Nữ thần Tự do, Mỹ", "Đấu trường La Mã, Ý"];
  }
};

export const processImageWithAI = async (state: AppState): Promise<{ imageUrl: string; description: string }> => {
  if (!state.imageInput) throw new Error("Vui lòng chọn ảnh gốc.");

  const ai = getAIClient(state.userApiKey);
  const base64Image = await fileToGenerativePart(state.imageInput);

  const instructions = [];
  
  if (state.activeModes.includes(EditMode.VIETNAM_TRAVEL)) {
    const loc = state.vietnamLocation;
    const place = loc.customLandmark || loc.landmark || "địa danh nổi tiếng";
    instructions.push(`Đặt người vào bối cảnh du lịch tại ${place}, tỉnh ${loc.province}. Phong cách bối cảnh: ${loc.style}.`);
  }
  
  if (state.activeModes.includes(EditMode.WORLD_TRAVEL)) {
    instructions.push(`Đặt người vào bối cảnh du lịch thế giới tại: ${state.worldLocationChoice}.`);
  }
  
  if (state.activeModes.includes(EditMode.OUTFIT)) {
    instructions.push(`Thay đổi trang phục thành: ${state.outfitPrompt || "thời trang du lịch sang trọng"}. Độ dài: ${state.clothingLength}. Phụ kiện: ${state.outfitAccessories.join(", ")}.`);
  }
  
  if (state.activeModes.includes(EditMode.POSE)) {
    instructions.push(`Chỉnh sửa tư thế người trong ảnh thành: ${state.posePrompt}.`);
  }

  if (state.activeModes.includes(EditMode.ADD_ONS)) {
    instructions.push(`Thêm các vật thể sau vào ảnh: ${state.addOnsPrompt}.`);
  }

  const weatherText = state.weatherConditions.length > 0 ? `Thời tiết: ${state.weatherConditions.join(", ")}.` : "";
  const bgDetailsText = state.backgroundDetails.length > 0 ? `Chi tiết bối cảnh: ${state.backgroundDetails.join(", ")}.` : "";

  const finalPrompt = `
    HÀNH ĐỘNG: Chỉnh sửa ảnh du lịch chuyên nghiệp.
    YÊU CẦU CỐT LÕI: Giữ nguyên đặc điểm khuôn mặt và danh tính của người trong ảnh gốc.
    
    CÁC THAY ĐỔI:
    ${instructions.join("\n")}
    ${weatherText}
    ${bgDetailsText}
    
    THÔNG SỐ KỸ THUẬT:
    - Biểu cảm: ${state.expression}.
    - Cấp độ làm đẹp da: ${state.beautifyLevel}.
    - Phong cách nghệ thuật: ${state.outputStyle}.
    - Tỉ lệ khung hình mong muốn: ${state.aspectRatio}.
    - Chất lượng: 8K, Photorealistic, chi tiết cực cao.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { text: finalPrompt },
          { inlineData: { mimeType: state.imageInput.type, data: base64Image } }
        ]
      },
      config: {
        imageConfig: {
          aspectRatio: state.aspectRatio === "1:1" ? "1:1" : (state.aspectRatio.includes("16:9") ? "16:9" : "3:4")
        }
      }
    });

    let imageUrl = "";
    let description = "";
    
    const candidates = response.candidates;
    if (candidates && candidates.length > 0) {
      const parts = candidates[0].content.parts;
      for (const part of parts) {
        if (part.inlineData) {
          imageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        } else if (part.text) {
          description = part.text;
        }
      }
    }

    if (!imageUrl) {
      throw new Error("Mô hình không trả về dữ liệu hình ảnh. Có thể do nội dung vi phạm chính sách an toàn hoặc lỗi hệ thống.");
    }

    return { imageUrl, description: description || "Ảnh của bạn đã được tạo thành công!" };
  } catch (error: any) {
    console.error("Lỗi AI:", error);
    if (error.message?.includes("API_KEY_INVALID")) {
       throw new Error("API Key không hợp lệ. Vui lòng kiểm tra lại trong phần Cấu hình AI.");
    }
    throw new Error(error.message || "Không thể xử lý ảnh.");
  }
};
