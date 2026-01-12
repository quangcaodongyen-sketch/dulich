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

  // Generic checkbox toggler
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
      const suggestions = await generateWorldSuggestions();
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
      <div className="p-6 border-b border-blue-100 bg-blue-50">
        <h2 className="text-lg font-bold text-blue-900">Tuỳ chỉnh AI</h2>
        <p className="text-sm text-blue-600">Chọn các tính năng muốn áp dụng</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
        
        {/* MODE SELECTOR - MULTI SELECT */}
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

        {/* DYNAMIC CONTROLS BASED ON ACTIVE MODES */}
        <div className="space-y-4">

          {/* COMPANION CONTROLS (Updated) */}
          {state.activeModes.includes(EditMode.COMPANION) && (
              <div className="bg-pink-50 p-4 rounded-xl border border-pink-200 animate-fade-in space-y-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <span className="text-xl">👫</span>
                        <label className="text-sm font-bold text-pink-900">Ghép thêm người</label>
                    </div>
                  </div>

                  {/* Source Toggle */}
                  <div className="flex bg-pink-100 p-1 rounded-lg mb-3">
                      <button 
                        onClick={() => updateState({ companionSettings: { ...state.companionSettings, source: 'ai' } })}
                        className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
                            state.companionSettings.source === 'ai' ? 'bg-white text-pink-700 shadow-sm' : 'text-pink-400 hover:text-pink-600'
                        }`}
                      >
                          ✨ AI Tự tạo
                      </button>
                      <button 
                        onClick={() => updateState({ companionSettings: { ...state.companionSettings, source: 'upload' } })}
                        className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
                            state.companionSettings.source === 'upload' ? 'bg-white text-pink-700 shadow-sm' : 'text-pink-400 hover:text-pink-600'
                        }`}
                      >
                          📤 Tải ảnh lên
                      </button>
                  </div>
                  
                  {/* Content based on Source */}
                  {state.companionSettings.source === 'ai' ? (
                      <div className="grid grid-cols-2 gap-3">
                         <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Giới tính:</label>
                            <select 
                                className="w-full p-2 text-sm border border-pink-300 rounded-lg focus:ring-pink-500"
                                value={state.companionSettings.gender}
                                onChange={(e) => updateState({ companionSettings: { ...state.companionSettings, gender: e.target.value as Gender } })}
                            >
                                {GENDER_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                            </select>
                         </div>
                         <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Độ tuổi:</label>
                            <select 
                                className="w-full p-2 text-sm border border-pink-300 rounded-lg focus:ring-pink-500"
                                value={state.companionSettings.ageGroup}
                                onChange={(e) => updateState({ companionSettings: { ...state.companionSettings, ageGroup: e.target.value as AgeGroup } })}
                            >
                                {AGE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                            </select>
                         </div>
                      </div>
                  ) : (
                      <div className="space-y-2">
                           <label className="block text-xs font-semibold text-gray-600">Chọn ảnh người cần ghép:</label>
                           <label className={`
                              flex items-center gap-3 p-3 rounded-xl border-2 border-dashed transition-all cursor-pointer
                              ${state.companionSettings.image 
                                  ? 'border-pink-400 bg-pink-50' 
                                  : 'border-pink-300 hover:bg-pink-50 hover:border-pink-400'}
                           `}>
                               <div className="relative w-12 h-12 bg-white rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm">
                                   {state.companionSettings.imagePreview ? (
                                       <img src={state.companionSettings.imagePreview} alt="Companion" className="w-full h-full object-cover" />
                                   ) : (
                                       <span className="text-2xl text-pink-300">+</span>
                                   )}
                               </div>
                               <div className="flex-1">
                                   <p className="text-sm font-medium text-pink-900">
                                       {state.companionSettings.image ? state.companionSettings.image.name : "Nhấn để tải ảnh lên"}
                                   </p>
                                   <p className="text-[10px] text-gray-500">AI sẽ tự động tách nền và hòa trộn</p>
                               </div>
                               <input type="file" accept="image/*" className="hidden" onChange={handleCompanionImageUpload} />
                           </label>
                      </div>
                  )}

                  <div>
                     <label className="block text-xs font-semibold text-gray-600 mb-1">
                         {state.companionSettings.source === 'upload' ? 'Chỉnh sửa trang phục (Tuỳ chọn):' : 'Trang phục người ghép:'}
                     </label>
                     <input 
                        type="text"
                        className="w-full p-2 text-sm border border-pink-300 rounded-lg focus:ring-pink-500"
                        placeholder="VD: Áo đôi, Vest đen, Váy trắng..."
                        value={state.companionSettings.outfit}
                        onChange={(e) => updateState({ companionSettings: { ...state.companionSettings, outfit: e.target.value } })}
                     />
                  </div>
                  <div>
                     <label className="block text-xs font-semibold text-gray-600 mb-1">Hành động tương tác:</label>
                     <input 
                        type="text"
                        className="w-full p-2 text-sm border border-pink-300 rounded-lg focus:ring-pink-500"
                        placeholder="VD: Nắm tay, Đứng cạnh, Khoác vai..."
                        value={state.companionSettings.action}
                        onChange={(e) => updateState({ companionSettings: { ...state.companionSettings, action: e.target.value } })}
                     />
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
              
              {/* Clothing Length */}
              <div>
                 <label className="block text-xs font-semibold text-gray-600 mb-1">Độ dài:</label>
                 <div className="flex gap-2">
                    {CLOTHING_LENGTH_OPTIONS.map((opt) => (
                        <button
                            key={opt.value}
                            onClick={() => updateState({ clothingLength: opt.value })}
                            className={`px-3 py-1.5 text-xs rounded-md border transition-all ${
                                state.clothingLength === opt.value
                                ? 'bg-blue-700 text-white border-blue-800'
                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                            }`}
                        >
                           {state.clothingLength === opt.value && "✓ "} {opt.label}
                        </button>
                    ))}
                 </div>
              </div>

              {/* Accessories Checkboxes */}
              <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Phụ kiện & Giày dép:</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {OUTFIT_ACCESSORIES_OPTIONS.map(opt => (
                          <label key={opt.id} className="flex items-center gap-2 text-xs text-gray-800 cursor-pointer select-none p-2 border border-transparent hover:bg-blue-100/50 rounded-md transition-colors bg-white/50">
                              <input 
                                  type="checkbox"
                                  className="rounded text-blue-800 focus:ring-blue-500 h-3.5 w-3.5 border-gray-300"
                                  checked={state.outfitAccessories.includes(opt.id)}
                                  onChange={() => toggleArrayItem('outfitAccessories', opt.id)}
                              />
                              {opt.label}
                          </label>
                      ))}
                  </div>
              </div>

              <textarea
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                rows={2}
                placeholder="Mô tả thêm (VD: Váy hoa nhí, Vest đen...)"
                value={state.outfitPrompt}
                onChange={(e) => updateState({ outfitPrompt: e.target.value })}
              />
            </div>
          )}

          {/* POSE CONTROLS - Enhanced */}
          {state.activeModes.includes(EditMode.POSE) && (
            <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-200 animate-fade-in">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">💃</span>
                <label className="text-sm font-bold text-blue-900">Động tác tay/chân</label>
              </div>
              
              {/* Quick Pose Chips */}
              <div className="flex flex-wrap gap-2 mb-3">
                 {POSE_SUGGESTIONS.map(pose => (
                     <button
                        key={pose}
                        onClick={() => updateState({ posePrompt: pose })}
                        className="px-2 py-1 text-xs bg-white border border-blue-200 rounded-full text-blue-700 hover:bg-blue-100"
                     >
                        {pose}
                     </button>
                 ))}
              </div>

              <textarea
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                rows={2}
                placeholder="Ví dụ: Đang ngồi uống cà phê, Đang chạy bộ..."
                value={state.posePrompt}
                onChange={(e) => updateState({ posePrompt: e.target.value })}
              />
            </div>
          )}

          {/* VIETNAM TRAVEL CONTROLS */}
          {state.activeModes.includes(EditMode.VIETNAM_TRAVEL) && (
            <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-200 animate-fade-in space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">🇻🇳</span>
                <label className="text-sm font-bold text-blue-900">Du lịch Việt Nam</label>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Tỉnh / Thành phố</label>
                <select
                  className="w-full p-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                  value={state.vietnamLocation.province}
                  onChange={(e) => updateState({
                    vietnamLocation: { ...state.vietnamLocation, province: e.target.value, landmark: "" }
                  })}
                >
                  <option value="">-- Chọn điểm đến --</option>
                  {Object.entries(VIETNAM_REGIONS).map(([region, provinces]) => (
                    <optgroup key={region} label={region} className="font-bold text-blue-900 bg-gray-100">
                      {provinces.map(prov => (
                        <option key={prov} value={prov} className="text-gray-700 bg-white">
                          {prov}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Chọn địa danh có sẵn</label>
                <select
                  className="w-full p-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                  value={state.vietnamLocation.landmark}
                  onChange={(e) => updateState({
                    vietnamLocation: { ...state.vietnamLocation, landmark: e.target.value, customLandmark: "" }
                  })}
                  disabled={!state.vietnamLocation.province}
                >
                  <option value="">
                    {state.vietnamLocation.province ? "-- Chọn địa danh --" : "-- Chọn tỉnh trước --"}
                  </option>
                  {state.vietnamLocation.province && VIETNAM_DATA[state.vietnamLocation.province]?.map((lm) => (
                    <option key={lm} value={lm}>{lm}</option>
                  ))}
                </select>
              </div>

              {/* MANUAL INPUT FOR LANDMARK */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Hoặc nhập địa điểm cụ thể</label>
                 <input
                    type="text"
                    className="w-full p-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm placeholder-gray-400"
                    placeholder="VD: Cầu sông Hàn, Chợ đêm Helio..."
                    value={state.vietnamLocation.customLandmark}
                    onChange={(e) => updateState({
                        vietnamLocation: { ...state.vietnamLocation, customLandmark: e.target.value, landmark: "" }
                    })}
                 />
              </div>

              <div>
                 <label className="block text-xs font-medium text-gray-500 mb-1">Thời điểm trong ngày</label>
                 <div className="flex flex-wrap gap-2">
                    {STYLE_OPTIONS.map((s) => (
                        <button
                            key={s.value}
                            onClick={() => updateState({ vietnamLocation: {...state.vietnamLocation, style: s.value}})}
                            className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                                state.vietnamLocation.style === s.value 
                                ? 'bg-blue-600 border-blue-600 text-white shadow-md' 
                                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                            {s.label}
                        </button>
                    ))}
                 </div>
              </div>
            </div>
          )}

          {/* WORLD TRAVEL CONTROLS */}
          {state.activeModes.includes(EditMode.WORLD_TRAVEL) && (
            <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-200 animate-fade-in space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">🌍</span>
                <label className="text-sm font-bold text-blue-900">Du lịch Thế giới</label>
              </div>

              <div className="flex justify-between items-center">
                <label className="block text-xs font-medium text-gray-500">Địa điểm</label>
                <button 
                  onClick={handleGetWorldSuggestions}
                  disabled={isLoadingSuggestions}
                  className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center"
                >
                  {isLoadingSuggestions ? "Đang tìm..." : "🔄 Gợi ý mới"}
                </button>
              </div>
              
              {state.worldSuggestions.length > 0 && (
                  <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto custom-scrollbar">
                      {state.worldSuggestions.map((sugg, idx) => (
                          <button
                            key={idx}
                            onClick={() => updateState({ worldLocationChoice: sugg })}
                            className={`text-left p-2 rounded-md text-sm border ${
                                state.worldLocationChoice === sugg 
                                ? 'bg-blue-100 border-blue-500 text-blue-900' 
                                : 'bg-white border-gray-200 hover:bg-gray-50'
                            }`}
                          >
                              {sugg}
                          </button>
                      ))}
                  </div>
              )}

              <input
                type="text"
                className="w-full p-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="VD: Paris, Tokyo..."
                value={state.worldLocationChoice}
                onChange={(e) => updateState({ worldLocationChoice: e.target.value })}
              />
            </div>
          )}

          {/* ADD-ONS CONTROLS */}
          {state.activeModes.includes(EditMode.ADD_ONS) && (
             <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-200 animate-fade-in">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">🚲</span>
                <label className="text-sm font-bold text-blue-900">Thêm vật thể</label>
              </div>
              <textarea
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                rows={2}
                placeholder="Ví dụ: Đàn bướm, Bó hoa..."
                value={state.addOnsPrompt}
                onChange={(e) => updateState({ addOnsPrompt: e.target.value })}
              />
            </div>
          )}
        </div>

        {/* WEATHER SECTION */}
        <div className="pt-4 border-t border-gray-100">
            <h3 className="text-sm font-bold text-blue-900 mb-3 flex items-center gap-2">
                🌦️ Thời tiết & Khí hậu (Chọn nhiều)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {WEATHER_OPTIONS.map(opt => (
                     <label key={opt.id} className={`
                        cursor-pointer text-xs p-2 rounded-lg border flex items-center gap-2 transition-all select-none
                        ${state.weatherConditions.includes(opt.id) 
                            ? 'bg-blue-600 border-blue-600 text-white shadow-md' 
                            : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}
                     `}>
                        <input 
                            type="checkbox"
                            className="hidden"
                            checked={state.weatherConditions.includes(opt.id)}
                            onChange={() => toggleArrayItem('weatherConditions', opt.id)}
                        />
                        <span>{state.weatherConditions.includes(opt.id) ? '✓' : ''} {opt.label}</span>
                    </label>
                ))}
            </div>
        </div>


        {/* GENERAL SETTINGS */}
        <div className="space-y-4 pt-4 border-t border-gray-100">
            <h3 className="text-sm font-bold text-blue-900">Cài đặt chung</h3>
            
            {/* Background Details */}
             <div className="bg-emerald-50/50 p-3 rounded-lg border border-emerald-100">
                <label className="block text-xs font-bold text-emerald-800 mb-2">
                    ✨ Làm sống động:
                </label>
                <div className="grid grid-cols-2 gap-2">
                    {BACKGROUND_DETAILS_OPTIONS.map(opt => (
                        <label key={opt.id} className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer p-1 hover:bg-emerald-100/50 rounded transition-colors select-none">
                            <input 
                                type="checkbox"
                                className="rounded text-emerald-600 focus:ring-emerald-500 h-3.5 w-3.5 border-emerald-300"
                                checked={state.backgroundDetails.includes(opt.id)}
                                onChange={() => toggleArrayItem('backgroundDetails', opt.id)}
                            />
                            {opt.label}
                        </label>
                    ))}
                </div>
            </div>

            {/* Age, Gender & Expression */}
            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Giới tính chính</label>
                  <select
                    className="w-full p-2 bg-white border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                    value={state.gender}
                    onChange={(e) => updateState({ gender: e.target.value as Gender })}
                  >
                    {GENDER_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
               </div>
               <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Độ tuổi chính</label>
                  <select
                    className="w-full p-2 bg-white border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                    value={state.ageGroup}
                    onChange={(e) => updateState({ ageGroup: e.target.value as AgeGroup })}
                  >
                    {AGE_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
               </div>
               
               {/* EXPRESSION SELECTOR */}
               <div className="col-span-2">
                   <label className="block text-xs font-medium text-gray-700 mb-1">Biểu cảm khuôn mặt</label>
                   <select
                        className="w-full p-2 bg-white border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                        value={state.expression}
                        onChange={(e) => updateState({ expression: e.target.value })}
                   >
                       {EXPRESSION_OPTIONS.map(opt => (
                           <option key={opt.value} value={opt.value}>{opt.label}</option>
                       ))}
                   </select>
               </div>
            </div>

            {/* Beautify Slider */}
            <div>
                <label className="flex justify-between text-xs font-medium text-gray-700 mb-1">
                    Làm đẹp
                    <span className="text-blue-600 capitalize font-bold">{state.beautifyLevel}</span>
                </label>
                <input 
                    type="range" 
                    min="0" 
                    max="3" 
                    step="1" 
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    value={[BeautifyLevel.OFF, BeautifyLevel.LIGHT, BeautifyLevel.MEDIUM, BeautifyLevel.HIGH].indexOf(state.beautifyLevel)}
                    onChange={(e) => {
                        const levels = [BeautifyLevel.OFF, BeautifyLevel.LIGHT, BeautifyLevel.MEDIUM, BeautifyLevel.HIGH];
                        updateState({ beautifyLevel: levels[parseInt(e.target.value)] });
                    }}
                />
            </div>

            {/* Style Output */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Phong cách</label>
                    <select 
                        className="w-full p-2 bg-white border border-gray-300 rounded-md text-sm"
                        value={state.outputStyle}
                        onChange={(e) => updateState({ outputStyle: e.target.value as OutputStyle })}
                    >
                        {OUTPUT_STYLE_OPTIONS.map(s => (
                            <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                    </select>
                </div>
                 <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Tỉ lệ</label>
                    <select 
                        className="w-full p-2 bg-white border border-gray-300 rounded-md text-sm"
                        value={state.aspectRatio}
                        onChange={(e) => updateState({ aspectRatio: e.target.value as AspectRatio })}
                    >
                        {ASPECT_RATIO_OPTIONS.map(r => (
                            <option key={r.value} value={r.value}>{r.label}</option>
                        ))}
                    </select>
                </div>
            </div>
        </div>

      </div>

      <div className="p-6 border-t border-gray-100 bg-gray-50">
        <button
          onClick={onSubmit}
          disabled={!isReadyToSubmit}
          className={`w-full py-4 px-6 rounded-xl text-white font-bold text-lg shadow-lg transform transition-all duration-200 ${
            isReadyToSubmit
              ? 'bg-blue-800 hover:bg-blue-900 hover:scale-[1.02] shadow-blue-900/20'
              : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          {state.isGenerating ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Đang xử lý...
            </span>
          ) : (
            "✨ TẠO ẢNH NGAY"
          )}
        </button>
      </div>
    </div>
  );
};

export default ControlPanel;