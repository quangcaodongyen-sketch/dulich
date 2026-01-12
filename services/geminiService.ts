
import { GoogleGenAI, Type } from "@google/genai";
import { AppState, EditMode, BeautifyLevel, Gender, AgeGroup, ClothingLength } from "../types";
import { WEATHER_OPTIONS, OUTFIT_ACCESSORIES_OPTIONS, BACKGROUND_DETAILS_OPTIONS, EXPRESSION_OPTIONS } from "../constants";

// API_KEY sẽ được Vercel tự động tiêm vào process.env.API_KEY
const getAIClient = () => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing. Please configure it in Vercel Environment Variables.");
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

// Helper to convert File to Base64
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

export const generateWorldSuggestions = async (): Promise<string[]> => {
  const ai = getAIClient();
  const prompt = `
    Bạn là trợ lý du lịch AI. Hãy gợi ý 10 địa điểm du lịch nổi tiếng trên thế giới đa dạng về châu lục (Á, Âu, Mỹ, Phi, Đại Dương).
    Mỗi gợi ý bao gồm Tên địa điểm, Quốc gia và một mô tả rất ngắn (vibe, thời tiết).
    Định dạng trả về là JSON Array string thuần túy.
    Ví dụ: ["Kyoto, Nhật Bản - Mùa thu lá đỏ", "Paris, Pháp - Lãng mạn tháp Eiffel"]
  `;

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
    
    if (response.text) {
      return JSON.parse(response.text.trim());
    }
    return [];
  } catch (error) {
    console.error("Error fetching world suggestions:", error);
    return ["Paris, Pháp", "Tokyo, Nhật Bản", "New York, Mỹ", "London, Anh", "Sydney, Úc"]; // Fallback
  }
};

export const processImageWithAI = async (state: AppState): Promise<{ imageUrl: string; description: string }> => {
  if (!state.imageInput) throw new Error("Vui lòng chọn ảnh gốc.");

  const ai = getAIClient();
  const base64Image = await fileToGenerativePart(state.imageInput);

  // 1. Beautify Logic
  let beautifyInstruction = "Ensure skin texture looks realistic with visible pores.";
  if (state.beautifyLevel === BeautifyLevel.OFF) {
      beautifyInstruction = "Do not apply any skin smoothing. Keep face raw.";
  } else if (state.beautifyLevel === BeautifyLevel.LIGHT) {
      beautifyInstruction = "Subtle Retouch: Maintain skin texture, only remove temporary blemishes.";
  } else if (state.beautifyLevel === BeautifyLevel.MEDIUM) {
      beautifyInstruction = "Portrait Retouch: Even skin tone but keep pores visible.";
  } else if (state.beautifyLevel === BeautifyLevel.HIGH) {
      beautifyInstruction = "High-End Glamour Retouch: Professional skin tone, bright eyes, sharp details.";
  }

  // 2. Feature Flags
  const usePose = state.activeModes.includes(EditMode.POSE);
  const useOutfit = state.activeModes.includes(EditMode.OUTFIT);
  const useVietnam = state.activeModes.includes(EditMode.VIETNAM_TRAVEL);
  const useWorld = state.activeModes.includes(EditMode.WORLD_TRAVEL);
  const useAddOns = state.activeModes.includes(EditMode.ADD_ONS);
  const useCompanion = state.activeModes.includes(EditMode.COMPANION);

  // 3. Character Specs
  let characterSpecPrompt = state.gender !== Gender.AUTO ? `\n- Giới tính: ${state.gender === Gender.MALE ? 'Nam' : 'Nữ'}.` : "";
  if (state.ageGroup !== AgeGroup.AUTO) {
    characterSpecPrompt += `\n- Độ tuổi: ${state.ageGroup}.`;
  }
  
  const exprOption = EXPRESSION_OPTIONS.find(e => e.value === state.expression);
  characterSpecPrompt += `\n- Biểu cảm: ${exprOption ? exprOption.label : "Tự nhiên"}.`;

  // 4. Lively Background Details
  let livelyDetailsPrompt = "";
  if (state.backgroundDetails?.length > 0) {
      const details = state.backgroundDetails.map(id => BACKGROUND_DETAILS_OPTIONS.find(o => o.id === id)?.label || id).join(", ");
      livelyDetailsPrompt += `\n- Chi tiết bối cảnh: ${details}.`;
  }

  // 5. Weather Logic
  let weatherPrompt = "";
  if (state.weatherConditions?.length > 0) {
      const conditions = state.weatherConditions.map(id => WEATHER_OPTIONS.find(o => o.id === id)?.label || id).join(", ");
      weatherPrompt = `\n- Thời tiết: ${conditions}.`;
  }

  // 6. Outfit Construction
  let outfitInstruction = "";
  if (useOutfit) {
      outfitInstruction += `\n- Thay trang phục: ${state.outfitPrompt || "Thời trang du lịch"}.`;
      if (state.clothingLength === ClothingLength.LONG) outfitInstruction += " (Trang phục dài).";
      if (state.clothingLength === ClothingLength.SHORT) outfitInstruction += " (Trang phục ngắn).";
      if (state.outfitAccessories.length > 0) {
          const accs = state.outfitAccessories.map(id => OUTFIT_ACCESSORIES_OPTIONS.find(o => o.id === id)?.label || id).join(", ");
          outfitInstruction += `\n- Phụ kiện: ${accs}.`;
      }
  }

  // 7. Companion Construction
  let companionPrompt = "";
  let companionImagePart = null;
  if (useCompanion) {
      const comp = state.companionSettings;
      if (comp.source === 'upload' && comp.image) {
          const companionBase64 = await fileToGenerativePart(comp.image);
          companionImagePart = { inlineData: { mimeType: comp.image.type, data: companionBase64 } };
          companionPrompt = `\n- Ghép người từ ảnh thứ 2: ${comp.action}.`;
      } else {
           companionPrompt = `\n- Tạo người đồng hành AI: ${comp.gender}, ${comp.ageGroup}, ${comp.outfit}, ${comp.action}.`;
      }
  }

  // FINAL PROMPT
  let finalPrompt = `
    Action: Pro AI Photo Editor. Recreate this image in 8K quality.
    Core: Keep face identity. ${characterSpecPrompt}
    Retouch: ${beautifyInstruction}
    ${weatherPrompt}
    Changes:
    ${outfitInstruction}
    ${companionPrompt}
    ${usePose ? `\n- Pose: ${state.posePrompt}.` : ""}
    ${useVietnam ? `\n- Location VN: ${state.vietnamLocation.landmark}, ${state.vietnamLocation.province}. Style: ${state.vietnamLocation.style}.` : ""}
    ${useWorld ? `\n- Location World: ${state.worldLocationChoice}.` : ""}
    ${useAddOns ? `\n- Add-ons: ${state.addOnsPrompt}.` : ""}
    ${livelyDetailsPrompt}
    Params: Style ${state.outputStyle}, Aspect Ratio ${state.aspectRatio}.
  `;

  try {
    const parts: any[] = [
        { text: finalPrompt },
        { inlineData: { mimeType: state.imageInput.type, data: base64Image } }
    ];
    if (companionImagePart) parts.push(companionImagePart);

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image', 
      contents: { parts },
    });

    let generatedImageUrl = "";
    let description = "Success";
    const responseParts = response.candidates?.[0]?.content?.parts;
    if (responseParts) {
      for (const part of responseParts) {
        if (part.inlineData) generatedImageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        if (part.text) description = part.text;
      }
    }

    if (!generatedImageUrl) throw new Error("Image generation failed.");
    return { imageUrl: generatedImageUrl, description };
  } catch (error: any) {
    console.error("AI Error:", error);
    throw new Error(error.message || "Lỗi xử lý AI.");
  }
};
