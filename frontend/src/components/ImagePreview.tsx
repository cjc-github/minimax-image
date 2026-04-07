import { useState } from 'react';
import type { GeneratedImage } from '../types';

interface ImagePreviewProps {
  images: GeneratedImage[];
  onClearAll: () => void;
}

export const ImagePreview = ({ images, onClearAll }: ImagePreviewProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const downloadImage = async (url: string, index: number) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `生成的图片-${index + 1}.png`;
      link.click();
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error('下载图片失败:', error);
    }
  };

  const copyToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      alert('图片链接已复制到剪贴板！');
    } catch (error) {
      console.error('复制链接失败:', error);
    }
  };

  const downloadAll = async () => {
    for (let i = 0; i < images.length; i++) {
      await downloadImage(images[i].url, i);
      if (i < images.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
  };

  if (images.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">🖼️ 生成的图片</h2>
        <div className="text-center py-12 text-gray-500">
          <svg className="w-20 h-20 mx-auto mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-lg mb-2">还没有生成任何图片</p>
          <p className="text-sm mt-2">输入图片描述，点击"🎨 生成图片"按钮开始创作！</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            🖼️ 生成的图片（共 {images.length} 张）
          </h2>
          <div className="flex space-x-2">
            <button
              onClick={downloadAll}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md"
            >
              📥 下载全部
            </button>
            <button
              onClick={onClearAll}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-md"
            >
              🗑️ 清空全部
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <div key={`${image.url}-${index}`} className="relative group">
              <img
                src={image.url}
                alt={`生成的图片 ${index + 1}`}
                className="w-full h-64 object-cover rounded-lg cursor-pointer transition-transform group-hover:scale-105 shadow-md"
                onClick={() => setSelectedImage(image.url)}
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all rounded-lg flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 flex space-x-2 transition-opacity">
                  <button
                    onClick={() => downloadImage(image.url, index)}
                    className="p-3 bg-white rounded-full hover:bg-gray-100 shadow-lg"
                    title="下载"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </button>
                  <button
                    onClick={() => copyToClipboard(image.url)}
                    className="p-3 bg-white rounded-full hover:bg-gray-100 shadow-lg"
                    title="复制链接"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white px-3 py-1 rounded text-sm font-medium">
                #{index + 1}
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-6xl max-h-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img
              src={selectedImage}
              alt="预览"
              className="max-w-full max-h-screen object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
            <div className="absolute -bottom-16 left-0 right-0 flex justify-center space-x-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const index = images.findIndex(img => img.url === selectedImage);
                  downloadImage(selectedImage, index);
                }}
                className="px-6 py-3 bg-white text-black rounded-lg hover:bg-gray-100 font-medium shadow-lg"
              >
                📥 下载
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  copyToClipboard(selectedImage);
                }}
                className="px-6 py-3 bg-white text-black rounded-lg hover:bg-gray-100 font-medium shadow-lg"
              >
                📋 复制链接
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
