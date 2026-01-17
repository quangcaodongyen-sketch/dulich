
import React, { useState } from 'react';
import { AppState, EditMode, BeautifyLevel, OutputStyle, AspectRatio, VietnamLocation, Gender, AgeGroup, ClothingLength } from '../types';
import { VIETNAM_DATA, VIETNAM_REGIONS, STYLE_OPTIONS, GENDER_OPTIONS, AGE_OPTIONS, BACKGROUND_DETAILS_OPTIONS, WEATHER_OPTIONS, OUTFIT_ACCESSORIES_OPTIONS, CLOTHING_LENGTH_OPTIONS, OUTPUT_STYLE_OPTIONS, EXPRESSION_OPTIONS, POSE_SUGGESTIONS, ASPECT_RATIO_OPTIONS } from '../constants';
import { generateWorldSuggestions } from '../services/geminiService';

interface ControlPanelProps {
  state: AppState;
  updateState: (updates: Partial<AppState>) => void;
  onSubmit: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ state, updateState, onSubmit }) => {
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [showKeyInput, setShowKeyInput] = useState(!state.userApiKey);

  const toggleMode = (mode: EditMode) => {
    const currentModes = state.activeModes;
    let newModes: EditMode[];

    if (currentModes.includes(mode)) {
      newModes = currentModes.filter(m => m !== mode);
    } else {
      newModes = [...currentModes, mode];
    }
    updateState({ activeModes: newModes });
  };

  const toggleArrayItem = (key: keyof AppState, item: string) => {
      const list = state[key] as string[];
      let newList;
      if (list.includes(item)) {
          newList = list.filter(i => i !== item);
      } else {
          newList = [...list, item];
      }
      updateState({ [key]: newList });
  };

  const handleCompanionImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          const url = URL.createObjectURL(file);
          updateState({
              companionSettings: {
                  ...state.companionSettings,
                  image: file,
                  imagePreview: url
              }
          });
      }
  };

  const handleGetWorldSuggestions = async () => {
    setIsLoadingSuggestions(true);
    try {
      const suggestions = await generateWorldSuggestions(state.userApiKey);
      updateState({ worldSuggestions: suggestions });
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  const isReadyToSubmit = state.imageInput && !state.isGenerating;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-blue-100 flex flex-col h-full overflow-hidden">
      <div className="p-6 border-b border-blue-100 bg-blue-50 flex justify-between items-center">
        <div>
           <h2 className="text-lg font-bold text-blue-900">Tuỳ chỉnh AI</h2>
           <p className="text-sm text-blue-600">Thiết kế chuyến đi của bạn</p>
        </div>
        <button 
          onClick={() => setShowKeyInput(!showKeyInput)}
          className={`p-2 rounded-full transition-colors ${showKeyInput ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border border-blue-200'}`}
          title="Cấu hình API Key"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
        
        {/* API KEY INPUT SECTION */}
        {showKeyInput && (
          <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 animate-fade-in space-y-2">
            <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-amber-900 uppercase">Cấu hình API Key</label>
                <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-[10px] text-blue-600 underline">Lấy Key miễn phí tại đây</a>
            </div>
            <input 
              type="password"
              className="w-full p-2 text-sm border border-amber-300 rounded-lg focus:ring-amber-500 bg-white"
              placeholder="Dán Gemini API Key của bạn..."
              value={state.userApiKey}
              onChange={(e) => updateState({ userApiKey: e.target.value })}
            />
            <p className="text-[10px] text-amber-700 leading-tight">Key của bạn sẽ được lưu tạm thời trong phiên làm việc này để xử lý ảnh.</p>
          </div>
        )}

        {/* MODE SELECTOR */}
        <div className="space-y-3">
          <label className="text-sm font-bold text-blue-900 uppercase tracking-wider">Tính năng</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-2">
            {[
              { id: EditMode.VIETNAM_TRAVEL, label: '🇻🇳 Việt Nam', icon: '🗺️' },
              { id: EditMode.WORLD_TRAVEL, label: '🌍 Thế giới', icon: '✈️' },
              { id: EditMode.POSE, label: 'Dáng & Cử chỉ', icon: '💃' },
              { id: EditMode.OUTFIT, label: 'Trang phục', icon: '👗' },
              { id: EditMode.COMPANION, label: 'Ghép đôi', icon: '👫' },
              { id: EditMode.ADD_ONS, label: 'Thêm vật', icon: '🚲' },
              { id: EditMode.BEAUTIFY_ONLY, label: 'Làm đẹp', icon: '✨' },
            ].map((m) => {
              const isActive = state.activeModes.includes(m.id);
              return (
                <button
                  key={m.id}
                  onClick={() => toggleMode(m.id)}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl text-sm font-medium transition-all duration-200 border relative h-24 ${
                    isActive
                      ? 'bg-blue-100 border-blue-600 text-blue-900 shadow-sm ring-1 ring-blue-600'
                      : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-blue-300'
                  }`}
                >
                  {isActive && (
                    <div className="absolute top-2 right-2 h-4 w-4 bg-blue-600 text-white rounded flex items-center justify-center text-[10px]">✓</div>
                  )}
                  <span className="text-xl mb-1">{m.icon}</span>
                  {m.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* DYNAMIC CONTROLS */}
        <div className="space-y-4">
          {/* COMPANION CONTROLS */}
          {state.activeModes.includes(EditMode.COMPANION) && (
              <div className="bg-pink-50 p-4 rounded-xl border border-pink-200 animate-fade-in space-y-3">
                  <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">👫</span>
                      <label className="text-sm font-bold text-pink-900">Ghép thêm người</label>
                  </div>
                  <div className="flex bg-pink-100 p-1 rounded-lg mb-3">
                      <button onClick={() => updateState({ companionSettings: { ...state.companionSettings, source: 'ai' } })} className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${state.companionSettings.source === 'ai' ? 'bg-white text-pink-700 shadow-sm' : 'text-pink-400'}`}>✨ AI Tự tạo</button>
                      <button onClick={() => updateState({ companionSettings: { ...state.companionSettings, source: 'upload' } })} className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${state.companionSettings.source === 'upload' ? 'bg-white text-pink-700 shadow-sm' : 'text-pink-400'}`}>📤 Tải ảnh lên</button>
                  </div>
                  {state.companionSettings.source === 'ai' ? (
                      <div className="grid grid-cols-2 gap-3">
                         <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Giới tính:</label>
                            <select className="w-full p-2 text-sm border border-pink-300 rounded-lg" value={state.companionSettings.gender} onChange={(e) => updateState({ companionSettings: { ...state.companionSettings, gender: e.target.value as Gender } })}>
                                {GENDER_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                            </select>
                         </div>
                         <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Độ tuổi:</label>
                            <select className="w-full p-2 text-sm border border-pink-300 rounded-lg" value={state.companionSettings.ageGroup} onChange={(e) => updateState({ companionSettings: { ...state.companionSettings, ageGroup: e.target.value as AgeGroup } })}>
                                {AGE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                            </select>
                         </div>
                      </div>
                  ) : (
                      <div className="space-y-2">
                           <label className={`flex items-center gap-3 p-3 rounded-xl border-2 border-dashed transition-all cursor-pointer ${state.companionSettings.image ? 'border-pink-400 bg-pink-50' : 'border-pink-300 hover:bg-pink-50'}`}>
                               <div className="relative w-12 h-12 bg-white rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm">
                                   {state.companionSettings.imagePreview ? <img src={state.companionSettings.imagePreview} alt="Companion" className="w-full h-full object-cover" /> : <span className="text-2xl text-pink-300">+</span>}
                               </div>
                               <div className="flex-1">
                                   <p className="text-sm font-medium text-pink-900">{state.companionSettings.image ? state.companionSettings.image.name : "Nhấn để tải ảnh lên"}</p>
                                   <p className="text-[10px] text-gray-500">AI sẽ tự động tách nền</p>
                               </div>
                               <input type="file" accept="image/*" className="hidden" onChange={handleCompanionImageUpload} />
                           </label>
                      </div>
                  )}
                  <div>
                     <label className="block text-xs font-semibold text-gray-600 mb-1">Trang phục/Hành động:</label>
                     <input type="text" className="w-full p-2 text-sm border border-pink-300 rounded-lg" placeholder="VD: Nắm tay, Đứng cạnh, Áo đôi..." value={state.companionSettings.action} onChange={(e) => updateState({ companionSettings: { ...state.companionSettings, action: e.target.value } })} />
                  </div>
              </div>
          )}
          
          {/* OUTFIT CONTROLS */}
          {state.activeModes.includes(EditMode.OUTFIT) && (
            <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-200 animate-fade-in space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">👗</span>
                <label className="text-sm font-bold text-blue-900">Chi tiết Trang phục</label>
              </div>
              <div className="flex gap-2">
                 {CLOTHING_LENGTH_OPTIONS.map((opt) => (
                     <button key={opt.value} onClick={() => updateState({ clothingLength: opt.value })} className={`px-3 py-1.5 text-xs rounded-md border transition-all ${state.clothingLength === opt.value ? 'bg-blue-700 text-white border-blue-800' : 'bg-white text-gray-700 border-gray-300'}`}>{opt.label}</button>
                 ))}
              </div>
              <textarea className="w-full p-3 border border-gray-300 rounded-lg text-sm" rows={2} placeholder="Mô tả thêm trang phục..." value={state.outfitPrompt} onChange={(e) => updateState({ outfitPrompt: e.target.value })} />
            </div>
          )}

          {/* VIETNAM TRAVEL CONTROLS */}
          {state.activeModes.includes(EditMode.VIETNAM_TRAVEL) && (
            <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-200 animate-fade-in space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">🇻🇳</span>
                <label className="text-sm font-bold text-blue-900">Du lịch Việt Nam</label>
              </div>
              <select className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-sm" value={state.vietnamLocation.province} onChange={(e) => updateState({ vietnamLocation: { ...state.vietnamLocation, province: e.target.value, landmark: "" } })}>
                  <option value="">-- Chọn tỉnh/thành phố --</option>
                  {Object.entries(VIETNAM_REGIONS).map(([region, provinces]) => (
                    <optgroup key={region} label={region}>{provinces.map(prov => <option key={prov} value={prov}>{prov}</option>)}</optgroup>
                  ))}
              </select>
              <select className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-sm" value={state.vietnamLocation.landmark} onChange={(e) => updateState({ vietnamLocation: { ...state.vietnamLocation, landmark: e.target.value, customLandmark: "" } })} disabled={!state.vietnamLocation.province}>
                  <option value="">{state.vietnamLocation.province ? "-- Chọn địa danh --" : "-- Chọn tỉnh trước --"}</option>
                  {state.vietnamLocation.province && VIETNAM_DATA[state.vietnamLocation.province]?.map((lm) => <option key={lm} value={lm}>{lm}</option>)}
              </select>
              <input type="text" className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-sm" placeholder="Hoặc nhập địa điểm cụ thể..." value={state.vietnamLocation.customLandmark} onChange={(e) => updateState({ vietnamLocation: { ...state.vietnamLocation, customLandmark: e.target.value, landmark: "" } })} />
            </div>
          )}

          {/* WORLD TRAVEL CONTROLS */}
          {state.activeModes.includes(EditMode.WORLD_TRAVEL) && (
            <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-200 animate-fade-in space-y-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2"><span className="text-xl">🌍</span><label className="text-sm font-bold text-blue-900">Thế giới</label></div>
                <button onClick={handleGetWorldSuggestions} disabled={isLoadingSuggestions} className="text-[10px] text-blue-600 hover:underline">{isLoadingSuggestions ? "Đang tìm..." : "Gợi ý mới"}</button>
              </div>
              <input type="text" className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-sm" placeholder="VD: Paris, Tokyo..." value={state.worldLocationChoice} onChange={(e) => updateState({ worldLocationChoice: e.target.value })} />
            </div>
          )}
        </div>

        {/* GENERAL SETTINGS */}
        <div className="space-y-4 pt-4 border-t border-gray-100">
            <h3 className="text-sm font-bold text-blue-900">Cài đặt chung</h3>
            <div className="grid grid-cols-2 gap-4">
               <select className="w-full p-2 bg-white border border-gray-300 rounded-md text-sm" value={state.gender} onChange={(e) => updateState({ gender: e.target.value as Gender })}>
                    {GENDER_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
               </select>
               <select className="w-full p-2 bg-white border border-gray-300 rounded-md text-sm" value={state.ageGroup} onChange={(e) => updateState({ ageGroup: e.target.value as AgeGroup })}>
                    {AGE_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
               </select>
            </div>
            <div>
                <label className="flex justify-between text-xs font-medium text-gray-700 mb-1">Làm đẹp: <span className="text-blue-600 font-bold">{state.beautifyLevel}</span></label>
                <input type="range" min="0" max="3" step="1" className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" value={[BeautifyLevel.OFF, BeautifyLevel.LIGHT, BeautifyLevel.MEDIUM, BeautifyLevel.HIGH].indexOf(state.beautifyLevel)} onChange={(e) => {
                    const levels = [BeautifyLevel.OFF, BeautifyLevel.LIGHT, BeautifyLevel.MEDIUM, BeautifyLevel.HIGH];
                    updateState({ beautifyLevel: levels[parseInt(e.target.value)] });
                }} />
            </div>
        </div>
      </div>

      <div className="p-6 border-t border-gray-100 bg-gray-50">
        <button onClick={onSubmit} disabled={!isReadyToSubmit} className={`w-full py-4 px-6 rounded-xl text-white font-bold text-lg shadow-lg transform transition-all duration-200 ${isReadyToSubmit ? 'bg-blue-800 hover:bg-blue-900 hover:scale-[1.02]' : 'bg-gray-300 cursor-not-allowed'}`}>
          {state.isGenerating ? "ĐANG XỬ LÝ..." : "✨ TẠO ẢNH NGAY"}
        </button>
      </div>
    </div>
  );
};

export default ControlPanel;
