import React, { useState } from 'react';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import ControlPanel from './components/ControlPanel';
import ResultDisplay from './components/ResultDisplay';
import { AppState, DEFAULT_STATE } from './types';
import { processImageWithAI } from './services/geminiService';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(DEFAULT_STATE);

  const updateState = (updates: Partial<AppState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  const handleImageUpload = (file: File) => {
    // Create local preview
    const url = URL.createObjectURL(file);
    updateState({
      imageInput: file,
      imagePreviewUrl: url,
      generatedImage: null, // Reset previous result
      generatedDescription: null
    });
  };

  const handleSubmit = async () => {
    if (!state.imageInput) return;

    updateState({ isGenerating: true, error: null });

    try {
      const { imageUrl, description } = await processImageWithAI(state);
      updateState({
        generatedImage: imageUrl,
        generatedDescription: description,
      });
    } catch (err: any) {
      updateState({ error: err.message || "Có lỗi xảy ra." });
      alert(`Lỗi: ${err.message}`);
    } finally {
      updateState({ isGenerating: false });
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans pb-12">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* INTRO */}
        {!state.imagePreviewUrl && (
           <div className="text-center mb-12 space-y-4 pt-10">
              <h2 className="text-4xl md:text-6xl font-extrabold text-blue-900 tracking-tight">
                Du lịch <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Thế giới</span> <br className="hidden md:block" /> ngay tại nhà
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Biến hóa phong cách, thay đổi trang phục và thời tiết, check-in mọi địa điểm với công nghệ AI tiên tiến nhất.
              </p>
           </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: INPUT & CONTROLS */}
          <div className="lg:col-span-5 space-y-6 sticky top-24">
             <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <ImageUploader 
                  currentImage={state.imagePreviewUrl} 
                  onImageUpload={handleImageUpload} 
                />
             </div>
             
             {state.imagePreviewUrl && (
               <div className="h-[700px]"> {/* Increased height for new controls */}
                 <ControlPanel 
                   state={state} 
                   updateState={updateState} 
                   onSubmit={handleSubmit} 
                 />
               </div>
             )}
          </div>

          {/* RIGHT COLUMN: RESULT */}
          <div className="lg:col-span-7">
             {state.imagePreviewUrl ? (
                 <ResultDisplay 
                   imageUrl={state.generatedImage} 
                   description={state.generatedDescription} 
                   isGenerating={state.isGenerating} 
                 />
             ) : (
               // Landing State Placeholders
               <div className="grid grid-cols-2 gap-4 opacity-40 pointer-events-none select-none">
                  <div className="space-y-4 mt-12">
                      <div className="bg-slate-300 rounded-xl h-64 w-full animate-pulse"></div>
                      <div className="bg-slate-300 rounded-xl h-48 w-full animate-pulse"></div>
                  </div>
                  <div className="space-y-4">
                      <div className="bg-slate-300 rounded-xl h-48 w-full animate-pulse"></div>
                      <div className="bg-slate-300 rounded-xl h-64 w-full animate-pulse"></div>
                  </div>
               </div>
             )}
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;