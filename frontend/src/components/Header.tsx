import { useState } from 'react';

interface HeaderProps {
  apiKey: string;
  onApiKeyChange: (key: string) => void;
}

export const Header = ({ apiKey, onApiKeyChange }: HeaderProps) => {
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [tempApiKey, setTempApiKey] = useState(apiKey);

  const handleSaveApiKey = () => {
    if (tempApiKey.trim()) {
      onApiKeyChange(tempApiKey);
      setShowApiKeyInput(false);
    }
  };

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-primary-500 to-primary-700 w-10 h-10 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">MiniMax 图片生成器</h1>
              <p className="text-sm text-gray-600">使用AI创建精美图片</p>
            </div>
          </div>

          <div>
            <button
              onClick={() => setShowApiKeyInput(!showApiKeyInput)}
              className={`px-6 py-3 rounded-lg font-medium transition-all shadow-md ${
                apiKey
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-red-600 text-white hover:bg-red-700 animate-pulse'
              }`}
            >
              {apiKey ? '✓ 已设置 API Key' : '⚠️ 请设置 API Key'}
            </button>
          </div>
        </div>

        {showApiKeyInput && (
          <div className="mt-4 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-200">
            <div className="flex items-center mb-3">
              <svg className="w-6 h-6 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-800">设置 MiniMax API 密钥</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              请输入您的MiniMax API密钥以使用图片生成功能
            </p>
            <div className="flex space-x-2 mb-4">
              <input
                type="password"
                value={tempApiKey}
                onChange={(e) => setTempApiKey(e.target.value)}
                placeholder="在这里粘贴您的API密钥..."
                className="flex-1 p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && tempApiKey.trim()) {
                    handleSaveApiKey();
                  }
                }}
              />
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleSaveApiKey}
                disabled={!tempApiKey.trim()}
                className={`px-6 py-2 rounded-lg font-medium transition-all ${
                  tempApiKey.trim()
                    ? 'bg-green-600 text-white hover:bg-green-700 shadow-md'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                保存密钥
              </button>
              <button
                onClick={() => {
                  setTempApiKey(apiKey);
                  setShowApiKeyInput(false);
                }}
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                取消
              </button>
            </div>
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>💡 如何获取API密钥？</strong><br/>
                1. 访问 <a href="https://platform.minimaxi.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">MiniMax开放平台</a><br/>
                2. 注册/登录您的账户<br/>
                3. 进入"账户管理 &gt; 接口密钥"<br/>
                4. 复制API密钥并粘贴到上方输入框
              </p>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
