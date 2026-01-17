
export enum EditMode {
  POSE = 'pose',
  OUTFIT = 'outfit',
  VIETNAM_TRAVEL = 'vietnam_travel',
  WORLD_TRAVEL = 'world_travel',
  BEAUTIFY_ONLY = 'beautify_only',
  ADD_ONS = 'add_ons',
  COMPANION = 'companion', // Ghép thêm người
}

export enum BeautifyLevel {
  OFF = 'off',
  LIGHT = 'light',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export enum OutputStyle {
  PHOTOREALISTIC = 'photorealistic',
  CINEMATIC = 'cinematic',
  MAGAZINE = 'magazine',
  TRAVEL_BLOG = 'travel_blog',
  ANIME = 'anime',
  VINTAGE_FILM = 'vintage_film',
  CYBERPUNK = 'cyberpunk',
  OIL_PAINTING = 'oil_painting',
}

export enum AspectRatio {
  SQUARE = '1:1',
  PORTRAIT_9_16 = '9:16',
  PORTRAIT_3_4 = '3:4',
  PORTRAIT_4_5 = '4:5',
  PORTRAIT_2_3 = '2:3',
  LANDSCAPE_16_9 = '16:9',
  LANDSCAPE_4_3 = '4:3',
  LANDSCAPE_3_2 = '3:2',
  LANDSCAPE_21_9 = '21:9',
}

export enum Gender {
  AUTO = 'auto',
  MALE = 'male',
  FEMALE = 'female',
}

export enum AgeGroup {
  AUTO = 'auto',
  CHILD = 'child', // < 12
  TEEN = 'teen', // 13-19
  YOUNG_ADULT = 'young_adult', // 20-30
  ADULT = 'adult', // 30-50
  ELDERLY = 'elderly', // 50+
}

export enum ClothingLength {
  AUTO = 'auto',
  LONG = 'long', 
  SHORT = 'short', 
}

export interface VietnamLocation {
  province: string;
  landmark: string;
  customLandmark: string;
  style: string;
}

export interface CompanionSettings {
  source: 'ai' | 'upload'; // Nguồn: AI tạo hoặc Upload
  image: File | null;      // File ảnh người ghép (nếu source = upload)
  imagePreview: string | null; // Preview ảnh người ghép
  gender: Gender;
  ageGroup: AgeGroup;
  outfit: string;
  action: string;
}

export interface AppState {
  userApiKey: string; // Key do người dùng nhập
  imageInput: File | null;
  imagePreviewUrl: string | null;
  activeModes: EditMode[]; 
  posePrompt: string; 
  expression: string; 
  outfitPrompt: string;
  clothingLength: ClothingLength; 
  outfitAccessories: string[]; 
  vietnamLocation: VietnamLocation;
  worldLocationChoice: string;
  worldSuggestions: string[];
  beautifyLevel: BeautifyLevel;
  addOnsPrompt: string;
  backgroundDetails: string[]; 
  weatherConditions: string[]; 
  companionSettings: CompanionSettings; 
  outputStyle: OutputStyle;
  aspectRatio: AspectRatio;
  gender: Gender;
  ageGroup: AgeGroup;
  isGenerating: boolean;
  generatedImage: string | null;
  generatedDescription: string | null;
  error: string | null;
}

export const DEFAULT_STATE: AppState = {
  userApiKey: "",
  imageInput: null,
  imagePreviewUrl: null,
  activeModes: [EditMode.VIETNAM_TRAVEL], 
  posePrompt: "",
  expression: "smiling_naturally",
  outfitPrompt: "",
  clothingLength: ClothingLength.AUTO,
  outfitAccessories: [],
  vietnamLocation: {
    province: "",
    landmark: "",
    customLandmark: "",
    style: "realistic",
  },
  worldLocationChoice: "",
  worldSuggestions: [],
  beautifyLevel: BeautifyLevel.LIGHT,
  addOnsPrompt: "",
  backgroundDetails: [],
  weatherConditions: [],
  companionSettings: {
    source: 'ai',
    image: null,
    imagePreview: null,
    gender: Gender.MALE,
    ageGroup: AgeGroup.YOUNG_ADULT,
    outfit: "",
    action: "standing next to main character",
  },
  outputStyle: OutputStyle.PHOTOREALISTIC,
  aspectRatio: AspectRatio.PORTRAIT_9_16, 
  gender: Gender.AUTO,
  ageGroup: AgeGroup.AUTO,
  isGenerating: false,
  generatedImage: null,
  generatedDescription: null,
  error: null,
};
