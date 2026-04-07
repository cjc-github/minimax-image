import { useState } from 'react';

interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  promptOptimizer: boolean;
  onPromptOptimizerChange: (value: boolean) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

const MAX_CHARS = 1500;

export const PromptInput = ({
  value,
  onChange,
  promptOptimizer,
  onPromptOptimizerChange,
  onSubmit,
  isLoading,
}: PromptInputProps) => {
  const [showTemplates, setShowTemplates] = useState(false);

  const templates = [
    'men Dressing in white t shirt, full-body stand front view',
    'beautiful landscape with mountains and lake',
    'portrait of a person in cyberpunk style',
    'cozy coffee shop interior',
    'fantasy castle on a hill',
  ];

  const handleTemplateSelect = (template: string) => {
    onChange(template);
    setShowTemplates(false);
  };

  const handleSubmit = () => {
    if (value.trim() && !isLoading) {
      onSubmit();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">📝 输入图片描述</h2>
        <button
          onClick={() => setShowTemplates(!showTemplates)}
          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          {showTemplates ? '隐藏模板' : '显示模板'}
        </button>
      </div>

      {showTemplates && (
        <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
          <p className="text-sm text-gray-700 mb-3 font-medium">✨ 快速模板（点击使用）：</p>
          <div className="flex flex-wrap gap-2">
            {templates.map((template, index) => (
              <button
                key={index}
                onClick={() => handleTemplateSelect(template)}
                className="text-xs px-4 py-2 bg-white text-primary-700 border border-primary-300 rounded-full hover:bg-primary-50 hover:border-primary-400 transition-all shadow-sm"
              >
                {template.length > 25 ? template.substring(0, 25) + '...' : template}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value.slice(0, MAX_CHARS))}
          placeholder="在这里输入您想要生成的图片描述，例如：'一只可爱的橘猫在阳光下打盹'..."
          className="w-full h-40 p-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none text-base"
          disabled={isLoading}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
              handleSubmit();
            }
          }}
        />
        <div className="absolute bottom-3 right-3 text-sm text-gray-500 bg-white px-2 py-1 rounded">
          {value.length} / {MAX_CHARS}
        </div>
      </div>

      <div className="flex items-center mt-4 space-x-2">
        <input
          type="checkbox"
          id="promptOptimizer"
          checked={promptOptimizer}
          onChange={(e) => onPromptOptimizerChange(e.target.checked)}
          className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
          disabled={isLoading}
        />
        <label htmlFor="promptOptimizer" className="text-sm text-gray-700 cursor-pointer">
          启用 Prompt 优化器（AI自动优化描述）
        </label>
      </div>

      <div className="mt-6">
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className={`w-full py-4 px-6 rounded-lg font-bold text-lg transition-all shadow-lg ${
            isLoading
              ? 'bg-gray-400 text-white cursor-not-allowed'
              : value.trim()
              ? 'bg-gradient-to-r from-primary-600 to-blue-600 text-white hover:from-primary-700 hover:to-blue-700 transform hover:scale-105'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              正在生成图片，请稍候...
            </span>
          ) : (
            '🎨 生成图片'
          )}
        </button>
        
        {!isLoading && value.trim() && (
          <p className="text-center text-xs text-gray-500 mt-2">
            💡 按 Ctrl+Enter (Windows) 或 Cmd+Enter (Mac) 可快速生成
          </p>
        )}
      </div>
    </div>
  );
};
