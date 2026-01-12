import { AgeGroup, Gender, ClothingLength, OutputStyle, AspectRatio } from "./types";

// Phân nhóm vùng miền để hiển thị khoa học hơn
export const VIETNAM_REGIONS = {
  "Tây Bắc & Đông Bắc (Miền Bắc)": [
    "Hà Giang", "Lào Cai", "Cao Bằng", "Yên Bái", "Sơn La", "Hòa Bình", "Bắc Kạn", "Lạng Sơn", "Điện Biên", "Lai Châu"
  ],
  "Đồng Bằng Sông Hồng & Duyên Hải (Miền Bắc)": [
    "Hà Nội", "Quảng Ninh", "Hải Phòng", "Ninh Bình", "Bắc Ninh", "Nam Định", "Thái Bình", "Vĩnh Phúc"
  ],
  "Bắc Trung Bộ (Miền Trung)": [
    "Thanh Hóa", "Nghệ An", "Hà Tĩnh", "Quảng Bình", "Quảng Trị", "Thừa Thiên Huế"
  ],
  "Duyên Hải Nam Trung Bộ (Miền Trung)": [
    "Đà Nẵng", "Quảng Nam", "Quảng Ngãi", "Bình Định", "Phú Yên", "Khánh Hòa", "Ninh Thuận", "Bình Thuận"
  ],
  "Tây Nguyên": [
    "Lâm Đồng", "Đắk Lắk", "Gia Lai", "Kon Tum", "Đắk Nông"
  ],
  "Đông Nam Bộ (Miền Nam)": [
    "TP. Hồ Chí Minh", "Bà Rịa - Vũng Tàu", "Tây Ninh", "Đồng Nai", "Bình Dương"
  ],
  "Đồng Bằng Sông Cửu Long (Miền Tây)": [
    "Cần Thơ", "Kiên Giang", "An Giang", "Tiền Giang", "Bến Tre", "Đồng Tháp", "Cà Mau", "Bạc Liêu", "Sóc Trăng"
  ]
};

// Dữ liệu chi tiết địa danh
export const VIETNAM_DATA: Record<string, string[]> = {
  // --- TÂY BẮC & ĐÔNG BẮC ---
  "Hà Giang": ["Cột cờ Lũng Cú", "Sông Nho Quế & Hẻm Tu Sản", "Đèo Mã Pí Lèng", "Nhà của Pao", "Ruộng bậc thang Hoàng Su Phì", "Phố cổ Đồng Văn", "Dinh thự Vua Mèo"],
  "Lào Cai": ["Đỉnh Fansipan", "Bản Cát Cát (Sapa)", "Nhà thờ đá Sapa", "Đèo Ô Quy Hồ", "Thung lũng Mường Hoa", "Y Tý - Biển mây"],
  "Cao Bằng": ["Thác Bản Giốc", "Hang Pác Bó - Suối Lê Nin", "Động Ngườm Ngao", "Hồ Thang Hen"],
  "Yên Bái": ["Mù Cang Chải (Mùa lúa chín)", "Đèo Khau Phạ", "Suối Giàng", "Hồ Thác Bà"],
  "Sơn La": ["Đồi chè Trái Tim (Mộc Châu)", "Thác Dải Yếm", "Rừng thông Bản Áng", "Đỉnh Pha Luông"],
  "Hòa Bình": ["Thung lũng Mai Châu", "Thủy điện Hòa Bình", "Đèo Thung Khe", "Suối khoáng Kim Bôi"],
  "Bắc Kạn": ["Hồ Ba Bể", "Động Puông", "Ao Tiên"],
  "Lạng Sơn": ["Đỉnh Mẫu Sơn", "Ải Chi Lăng", "Thành nhà Mạc", "Động Tam Thanh"],
  "Điện Biên": ["Đèo Pha Đin", "Cánh đồng Mường Thanh", "Hồ Pá Khoang", "A Pa Chải"],
  "Lai Châu": ["Đèo Ô Quy Hồ", "Đỉnh Putaleng", "Cao nguyên Sìn Hồ"],

  // --- ĐỒNG BẰNG SÔNG HỒNG ---
  "Hà Nội": ["Hồ Gươm & Cầu Thê Húc", "Phố cổ Hà Nội", "Văn Miếu Quốc Tử Giám", "Hoàng thành Thăng Long", "Hồ Tây hoàng hôn", "Cầu Long Biên", "Nhà hát lớn"],
  "Quảng Ninh": ["Vịnh Hạ Long (Du thuyền)", "Đảo Cô Tô", "Yên Tử", "Bãi Cháy - Sun World", "Bảo tàng Quảng Ninh", "Vịnh Bái Tử Long"],
  "Hải Phòng": ["Đảo Cát Bà", "Vịnh Lan Hạ", "Bãi biển Đồ Sơn", "Tuyệt Tình Cốc"],
  "Ninh Bình": ["Tràng An", "Tam Cốc - Bích Động", "Hang Múa (View rồng)", "Chùa Bái Đính", "Cố đô Hoa Lư"],
  "Bắc Ninh": ["Chùa Phật Tích", "Đền Đô", "Làng tranh Đông Hồ"],
  "Nam Định": ["Nhà thờ đổ Hải Lý", "Vườn quốc gia Xuân Thủy", "Phủ Dầy"],
  "Thái Bình": ["Biển Đồng Châu", "Biển Vô Cực (Quang Lang)", "Chùa Keo"],
  "Vĩnh Phúc": ["Tam Đảo (Nhà thờ đá)", "Hồ Đại Lải", "Thiền viện Trúc Lâm Tây Thiên"],

  // --- BẮC TRUNG BỘ ---
  "Thanh Hóa": ["Pù Luông (Ruộng bậc thang)", "Biển Sầm Sơn", "Thành nhà Hồ", "Suối cá thần Cẩm Lương"],
  "Nghệ An": ["Làng Sen quê Bác", "Biển Cửa Lò", "Đồi chè Thanh Chương", "Vườn quốc gia Pù Mát"],
  "Hà Tĩnh": ["Biển Thiên Cầm", "Ngã ba Đồng Lộc", "Hồ Kẻ Gỗ"],
  "Quảng Bình": ["Động Phong Nha", "Động Thiên Đường", "Hang Sơn Đoòng", "Bãi biển Nhật Lệ", "Suối Moọc"],
  "Quảng Trị": ["Thành cổ Quảng Trị", "Cầu Hiền Lương", "Địa đạo Vịnh Mốc"],
  "Thừa Thiên Huế": ["Đại Nội Huế", "Lăng Khải Định", "Chùa Thiên Mụ", "Sông Hương - Cầu Tràng Tiền", "Lăng Minh Mạng"],

  // --- NAM TRUNG BỘ ---
  "Đà Nẵng": ["Cầu Vàng (Bà Nà Hills)", "Biển Mỹ Khê", "Ngũ Hành Sơn", "Cầu Rồng (Phun lửa)", "Bán đảo Sơn Trà"],
  "Quảng Nam": ["Phố cổ Hội An", "Thánh địa Mỹ Sơn", "Cù Lao Chàm", "Rừng dừa Bảy Mẫu"],
  "Quảng Ngãi": ["Đảo Lý Sơn", "Cổng Tò Vò", "Biển Mỹ Khê (Quảng Ngãi)"],
  "Bình Định": ["Eo Gió (Quy Nhơn)", "Kỳ Co", "Tháp Đôi", "Ghềnh Ráng Tiên Sa"],
  "Phú Yên": ["Gành Đá Đĩa", "Bãi Xép (Hoa vàng cỏ xanh)", "Mũi Điện", "Nhà thờ Mằng Lăng"],
  "Khánh Hòa": ["Biển Nha Trang", "Vinpearl Land", "Tháp Bà Ponagar", "Đảo Bình Ba", "Hòn Chồng"],
  "Ninh Thuận": ["Vịnh Vĩnh Hy", "Hang Rái", "Đồi cát Nam Cương", "Tháp Chàm Po Klong Garai"],
  "Bình Thuận": ["Mũi Né (Đồi cát bay)", "Bàu Trắng", "Hải đăng Kê Gà", "Đảo Phú Quý"],

  // --- TÂY NGUYÊN ---
  "Lâm Đồng": ["Đà Lạt (Quảng trường Lâm Viên)", "Hồ Xuân Hương", "Thung lũng Tình Yêu", "Núi Langbiang", "Cổng trời Bali", "Săn mây Cầu Đất"],
  "Đắk Lắk": ["Hồ Lắk", "Buôn Đôn", "Bảo tàng Thế giới Cà phê", "Thác Dray Nur"],
  "Gia Lai": ["Biển Hồ (Pleiku)", "Núi lửa Chư Đăng Ya", "Chùa Minh Thành"],
  "Kon Tum": ["Nhà thờ gỗ Kon Tum", "Cầu treo Kon Klor", "Ngã ba Đông Dương"],
  "Đắk Nông": ["Hồ Tà Đùng (Vịnh Hạ Long Tây Nguyên)", "Thác Liêng Nung"],

  // --- ĐÔNG NAM BỘ ---
  "TP. Hồ Chí Minh": ["Nhà thờ Đức Bà", "Bưu điện Thành phố", "Landmark 81", "Phố đi bộ Nguyễn Huệ", "Chợ Bến Thành", "Dinh Độc Lập"],
  "Bà Rịa - Vũng Tàu": ["Tượng Chúa Kitô Vua", "Hải đăng Vũng Tàu", "Biển Hồ Tràm", "Đồi Con Heo", "Mũi Nghinh Phong"],
  "Tây Ninh": ["Núi Bà Đen (Đỉnh mây)", "Tòa Thánh Tây Ninh", "Hồ Dầu Tiếng"],
  "Đồng Nai": ["Khu du lịch Bửu Long", "Vườn quốc gia Nam Cát Tiên", "Thác Giang Điền"],
  "Bình Dương": ["Chùa Bà Thiên Hậu", "Khu du lịch Đại Nam", "Nhà thờ Phú Cường"],

  // --- MIỀN TÂY ---
  "Cần Thơ": ["Chợ nổi Cái Răng", "Bến Ninh Kiều", "Nhà cổ Bình Thủy", "Cồn Sơn"],
  "Kiên Giang": ["Phú Quốc (Cầu Hôn)", "Grand World Phú Quốc", "Bãi Sao", "Quần đảo Nam Du", "Hà Tiên"],
  "An Giang": ["Rừng tràm Trà Sư", "Miếu Bà Chúa Xứ", "Thất Sơn (Bảy Núi)", "Hồ Tà Pạ"],
  "Tiền Giang": ["Cù lao Thới Sơn", "Chùa Vĩnh Tràng", "Trại rắn Đồng Tâm"],
  "Bến Tre": ["Cồn Phụng", "Vườn trái cây Cái Mơn"],
  "Đồng Tháp": ["Làng hoa Sa Đéc", "Vườn quốc gia Tràm Chim", "Khu di tích Xẻo Quýt"],
  "Cà Mau": ["Mũi Cà Mau (Cột mốc)", "Rừng U Minh Hạ", "Chợ nổi Cà Mau"],
  "Bạc Liêu": ["Cánh đồng điện gió", "Nhà công tử Bạc Liêu", "Chùa Xiêm Cán"],
  "Sóc Trăng": ["Chùa Dơi", "Chùa Som Rông", "Chợ nổi Ngã Năm"]
};

export const STYLE_OPTIONS = [
  { value: "realistic", label: "📸 Thực tế" },
  { value: "cinematic", label: "🎬 Điện ảnh" },
  { value: "vintage", label: "🎞️ Cổ điển" },
  { value: "dreamy", label: "☁️ Mộng mơ" },
  { value: "sunrise", label: "🌅 Bình minh" },
  { value: "sunset", label: "🌇 Hoàng hôn" },
];

export const OUTPUT_STYLE_OPTIONS = [
    { value: OutputStyle.PHOTOREALISTIC, label: "Ảnh thật (Photorealistic)" },
    { value: OutputStyle.CINEMATIC, label: "Điện ảnh (Cinematic)" },
    { value: OutputStyle.MAGAZINE, label: "Tạp chí (Magazine)" },
    { value: OutputStyle.TRAVEL_BLOG, label: "Travel Blog" },
    { value: OutputStyle.ANIME, label: "Anime / Hoạt hình" },
    { value: OutputStyle.VINTAGE_FILM, label: "Phim nhựa (Vintage Film)" },
    { value: OutputStyle.CYBERPUNK, label: "Cyberpunk / Tương lai" },
    { value: OutputStyle.OIL_PAINTING, label: "Tranh sơn dầu" },
];

export const ASPECT_RATIO_OPTIONS = [
    { value: AspectRatio.SQUARE, label: "1:1 (Vuông - Instagram)" },
    { value: AspectRatio.PORTRAIT_9_16, label: "9:16 (Dọc - TikTok/Story)" },
    { value: AspectRatio.PORTRAIT_3_4, label: "3:4 (Dọc - Phổ biến)" },
    { value: AspectRatio.PORTRAIT_4_5, label: "4:5 (Dọc - Facebook)" },
    { value: AspectRatio.PORTRAIT_2_3, label: "2:3 (Dọc - Tiêu chuẩn)" },
    { value: AspectRatio.LANDSCAPE_16_9, label: "16:9 (Ngang - YouTube)" },
    { value: AspectRatio.LANDSCAPE_4_3, label: "4:3 (Ngang - TV/Màn hình)" },
    { value: AspectRatio.LANDSCAPE_3_2, label: "3:2 (Ngang - DSLR)" },
    { value: AspectRatio.LANDSCAPE_21_9, label: "21:9 (Ngang - Điện ảnh)" },
];

export const GENDER_OPTIONS = [
  { value: Gender.AUTO, label: "Tự động" },
  { value: Gender.MALE, label: "Nam" },
  { value: Gender.FEMALE, label: "Nữ" },
];

export const AGE_OPTIONS = [
  { value: AgeGroup.AUTO, label: "Tự động" },
  { value: AgeGroup.CHILD, label: "Trẻ em (<12)" },
  { value: AgeGroup.TEEN, label: "Thiếu niên (13-19)" },
  { value: AgeGroup.YOUNG_ADULT, label: "Thanh niên (20-30)" },
  { value: AgeGroup.ADULT, label: "Trung niên (31-50)" },
  { value: AgeGroup.ELDERLY, label: "Cao tuổi (50+)" },
];

export const BACKGROUND_DETAILS_OPTIONS = [
    { id: "flowers", label: "🌸 Hoa & Cây cảnh" },
    { id: "animals", label: "🕊️ Động vật" },
    { id: "crowd", label: "👥 Người tham quan (Mờ)" },
    { id: "street_vendors", label: "🏪 Quán xá/Cửa tiệm" },
    { id: "fireworks", label: "🎆 Pháo hoa" },
    { id: "lanterns", label: "🏮 Đèn lồng" },
    { id: "balloons", label: "🎈 Bóng bay" },
    { id: "autumn_leaves", label: "🍂 Lá thu rơi" },
    { id: "cherry_blossom", label: "🌸 Hoa anh đào rơi" },
];

export const CLOTHING_LENGTH_OPTIONS = [
  { value: ClothingLength.AUTO, label: "Tự động" },
  { value: ClothingLength.LONG, label: "Dài / Kín đáo" },
  { value: ClothingLength.SHORT, label: "Ngắn / Mát mẻ" },
];

export const OUTFIT_ACCESSORIES_OPTIONS = [
  { id: "hat", label: "👒 Mũ/Nón" },
  { id: "glasses", label: "🕶️ Kính râm" },
  { id: "shoes", label: "👟 Sneaker" },
  { id: "high_heels", label: "👠 Cao gót" },
  { id: "sandals", label: "👡 Sandal" },
  { id: "scarf", label: "🧣 Khăn quàng" },
  { id: "jewelry", label: "💍 Trang sức" },
  { id: "bag", label: "👜 Túi xách" },
  { id: "camera", label: "📷 Máy ảnh" },
];

export const WEATHER_OPTIONS = [
  { id: "sunny", label: "☀️ Nắng đẹp" },
  { id: "cloudy", label: "☁️ Nhiều mây" },
  { id: "rainy", label: "🌧️ Mưa" },
  { id: "stormy", label: "⛈️ Bão/Giông" },
  { id: "windy", label: "🍃 Gió mạnh" },
  { id: "snowy", label: "❄️ Tuyết rơi" },
  { id: "gloomy", label: "🌫️ Âm u/Sương mù" },
  { id: "icy", label: "🧊 Băng giá" },
  { id: "rainbow", label: "🌈 Cầu vồng" },
  { id: "starry", label: "✨ Đêm đầy sao" },
  { id: "aurora", label: "🌌 Cực quang" },
];

// New options for expressions
export const EXPRESSION_OPTIONS = [
    { value: "smiling_naturally", label: "😊 Cười tự nhiên" },
    { value: "laughing_happily", label: "😆 Cười tươi / Vui vẻ" },
    { value: "cool_confident", label: "😎 Ngầu / Lạnh lùng" },
    { value: "thoughtful", label: "🤔 Suy tư / Deep" },
    { value: "dreamy", label: "😌 Mơ màng" },
    { value: "surprised", label: "😲 Ngạc nhiên" },
    { value: "winking", label: "😉 Nháy mắt" },
];

// Quick suggestions for Poses
export const POSE_SUGGESTIONS = [
    "Giơ tay chữ V (Peace sign)",
    "Bắn tim (Heart finger)",
    "Khoanh tay trước ngực",
    "Đang bước đi tự nhiên",
    "Vuốt tóc nhẹ nhàng",
    "Cầm ly cà phê",
    "Ngồi thư giãn",
    "Nhìn xa xăm"
];