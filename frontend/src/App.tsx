import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { PromptInput } from './components/PromptInput';
import { SettingsPanel } from './components/SettingsPanel';
import { ImagePreview } from './components/ImagePreview';
import { useImageGeneration } from './hooks/useImageGeneration';
import { initializeApiService } from './services/api';
import type { GenerationSettings } from './types';

const DEFAULT_SETTINGS: GenerationSettings = {
  model: 'image-01',
  aspect_ratio: '1:1',
  width: 1024,
  height: 1024,
  n: 1,
  prompt_optimizer: false,
  aigc_watermark: false,
  style: {
    style_type: '漫画',
    style_weight: 0.8,
  },
};

function App() {
  const [apiKey, setApiKey] = useState<string>(() => {
    const saved = localStorage.getItem('minimax_api_key');
    return saved || '';
  });
  const [prompt, setPrompt] = useState('');
  const [promptOptimizer, setPromptOptimizer] = useState(false);
  const [settings, setSettings] = useState<GenerationSettings>(DEFAULT_SETTINGS);
  const [subjectReference, setSubjectReference] = useState<string | null>(null);

  const { images, isLoading, error, generate, clearImages } = useImageGeneration();
  const [debugMode, setDebugMode] = useState(false);

  useEffect(() => {
    if (apiKey) {
      initializeApiService(apiKey);
      localStorage.setItem('minimax_api_key', apiKey);
    }
  }, [apiKey]);

  const handleGenerate = () => {
    if (!apiKey) {
      alert('⚠️ 请先设置您的API密钥！点击右上角的"请设置 API Key"按钮。');
      return;
    }

    if (!prompt.trim()) {
      alert('⚠️ 请输入图片描述！');
      return;
    }

    generate(prompt, { ...settings, prompt_optimizer: promptOptimizer }, subjectReference || undefined);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header apiKey={apiKey} onApiKeyChange={setApiKey} />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {!apiKey && (
          <div className="mb-6 p-4 bg-yellow-50 border-2 border-yellow-300 rounded-lg">
            <p className="text-yellow-800">
              <strong>⚠️ 提示：</strong> 请先设置您的MiniMax API密钥才能生成图片。点击右上角的<strong>"⚠️ 请设置 API Key"</strong>按钮。
            </p>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-2 border-red-300 rounded-lg">
            <p className="text-red-800">
              <strong>❌ 错误：</strong> {error}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <PromptInput
              value={prompt}
              onChange={setPrompt}
              promptOptimizer={promptOptimizer}
              onPromptOptimizerChange={setPromptOptimizer}
              onSubmit={handleGenerate}
              isLoading={isLoading}
            />

            <ImagePreview images={images} onClearAll={clearImages} />
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <SettingsPanel
                settings={settings}
                onSettingsChange={setSettings}
                subjectReference={subjectReference}
                onSubjectReferenceChange={setSubjectReference}
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>

        {/* 调试信息面板 */}
        {debugMode && images.length > 0 && (
          <div className="mt-6 p-4 bg-gray-100 border-2 border-gray-300 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold">🔧 调试信息</h3>
              <button
                onClick={() => setDebugMode(false)}
                className="text-gray-600 hover:text-gray-800"
              >
                关闭
              </button>
            </div>
            <div className="space-y-2 text-sm">
              <p><strong>生成图片数量：</strong> {images.length}</p>
              <div>
                <strong>图片URL列表：</strong>
                <ul className="ml-4 mt-2 space-y-1">
                  {images.map((img, idx) => (
                    <li key={idx} className="break-all">
                      <a href={img.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">
                        图片 {idx + 1}: {img.url}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <p><strong>生成时间：</strong> {new Date(images[0]?.timestamp).toLocaleString()}</p>
            </div>
          </div>
        )}

        {/* 启用调试按钮 */}
        {!debugMode && (
          <button
            onClick={() => setDebugMode(true)}
            className="fixed bottom-4 right-4 px-4 py-2 bg-gray-800 text-white rounded-full shadow-lg hover:bg-gray-900"
          >
            🔧 调试
          </button>
        )}

        <footer className="mt-12 text-center text-gray-600">
          <p className="text-lg">✨ 由 MiniMax AI 强力驱动 ✨</p>
          <p className="text-sm mt-2">
            <a
              href="https://platform.minimaxi.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              获取您的API密钥
            </a>
          </p>
        </footer>
      </main>
    </div>
  );
}

export default App;
