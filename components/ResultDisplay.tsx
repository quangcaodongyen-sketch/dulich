import React from 'react';

interface ResultDisplayProps {
  imageUrl: string | null;
  description: string | null;
  isGenerating: boolean;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ imageUrl, description, isGenerating }) => {
  
  if (isGenerating) {
     return (
      <div className="w-full h-full min-h-[400px] bg-blue-950 rounded-2xl flex flex-col items-center justify-center text-white p-8 relative overflow-hidden shadow-2xl">
         <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-800 via-blue-950 to-black opacity-80"></div>
         <div className="relative z-10 flex flex-col items-center">
             <div className="w-20 h-20 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mb-6 shadow-[0_0_15px_rgba(96,165,250,0.5)]"></div>
             <h3 className="text-xl font-bold animate-pulse text-blue-200">Đang thiết kế chuyến đi...</h3>
             <p className="text-blue-300/80 mt-2 text-center max-w-md text-sm">AI đang phối trang phục, điều chỉnh thời tiết và ánh sáng.</p>
         </div>
      </div>
     )
  }

  if (!imageUrl) {
    return (
      <div className="w-full h-full min-h-[400px] bg-slate-50 rounded-2xl flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-300">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span className="text-lg font-medium">Kết quả sẽ hiển thị tại đây</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-blue-100">
      <div className="relative group">
        <img src={imageUrl} alt="Generated Result" className="w-full h-auto object-contain max-h-[700px] bg-slate-100" />
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <a 
                href={imageUrl} 
                download="dulich-ai-output.png"
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-full shadow-lg font-bold text-sm flex items-center gap-2 backdrop-blur-sm transition-all"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Tải ảnh 4K
            </a>
        </div>
      </div>
      <div className="p-6 bg-white border-t border-gray-100">
         <div className="flex items-start gap-3">
            <div className="mt-1 bg-blue-100 p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
            <div>
                <h4 className="text-sm font-bold text-blue-900 uppercase tracking-wide mb-1">Thông tin ảnh</h4>
                <p className="text-gray-600 leading-relaxed text-sm">{description}</p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default ResultDisplay;