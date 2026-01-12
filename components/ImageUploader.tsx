import React, { useCallback } from 'react';

interface ImageUploaderProps {
  currentImage: string | null;
  onImageUpload: (file: File) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ currentImage, onImageUpload }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageUpload(e.target.files[0]);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onImageUpload(e.dataTransfer.files[0]);
    }
  }, [onImageUpload]);

  return (
    <div className="w-full">
      <label className="block text-sm font-bold text-blue-900 mb-2">Ảnh gốc</label>
      <div
        className={`relative border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center transition-all duration-200 h-80 sm:h-96 ${
          currentImage ? 'border-blue-300 bg-blue-50' : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
        }`}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        {currentImage ? (
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-lg">
            <img
              src={currentImage}
              alt="Preview"
              className="max-w-full max-h-full object-contain shadow-md"
            />
            <div className="absolute inset-0 bg-blue-900/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
              <p className="text-white font-medium bg-blue-900/80 px-4 py-2 rounded-full backdrop-blur-sm border border-blue-400">Thay đổi ảnh</p>
            </div>
          </div>
        ) : (
          <div className="text-center p-6">
            <div className="mx-auto h-16 w-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="mt-1 text-base text-gray-700 font-semibold">
              Tải ảnh lên để bắt đầu
            </p>
            <p className="mt-1 text-sm text-gray-500">Kéo thả hoặc click vào đây</p>
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
};

export default ImageUploader;