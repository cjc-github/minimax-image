import type { GenerationSettings, StyleConfig } from '../types';

interface SettingsPanelProps {
  settings: GenerationSettings;
  onSettingsChange: (settings: GenerationSettings) => void;
  subjectReference: string | null;
  onSubjectReferenceChange: (file: string | null) => void;
  isLoading: boolean;
}

const ASPECT_RATIOS = ['1:1', '16:9', '4:3', '3:2', '3:4', '9:16', '21:9'];
const STYLE_TYPES = ['漫画', '元气', '中世纪', '水彩'] as const;

export const SettingsPanel = ({
  settings,
  onSettingsChange,
  subjectReference,
  onSubjectReferenceChange,
  isLoading,
}: SettingsPanelProps) => {
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert('文件大小必须小于10MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        onSubjectReferenceChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const updateSettings = (updates: Partial<GenerationSettings>) => {
    onSettingsChange({ ...settings, ...updates });
  };

  const updateStyle = (updates: Partial<StyleConfig>) => {
    const newStyle = { ...settings.style, ...updates };
    updateSettings({ style: newStyle });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">⚙️ 生成设置</h2>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">🤖 选择模型</label>
          <select
            value={settings.model}
            onChange={(e) => updateSettings({ model: e.target.value as 'image-01' | 'image-01-live' })}
            disabled={isLoading}
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="image-01">image-01（标准版）</option>
            <option value="image-01-live">image-01-live（画风控制版）</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">📐 图片比例</label>
          <select
            value={settings.aspect_ratio}
            onChange={(e) => updateSettings({ aspect_ratio: e.target.value as GenerationSettings['aspect_ratio'] })}
            disabled={isLoading}
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            {ASPECT_RATIOS.map((ratio) => (
              <option key={ratio} value={ratio}>
                {ratio}
              </option>
            ))}
          </select>
        </div>

        {settings.model === 'image-01' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📏 宽度：{settings.width} 像素
              </label>
              <input
                type="range"
                min="512"
                max="2048"
                step="8"
                value={settings.width}
                onChange={(e) => updateSettings({ width: parseInt(e.target.value) })}
                disabled={isLoading}
                className="w-full"
              />
              <div className="text-xs text-gray-500 mt-1">范围：512-2048（必须是8的倍数）</div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📏 高度：{settings.height} 像素
              </label>
              <input
                type="range"
                min="512"
                max="2048"
                step="8"
                value={settings.height}
                onChange={(e) => updateSettings({ height: parseInt(e.target.value) })}
                disabled={isLoading}
                className="w-full"
              />
              <div className="text-xs text-gray-500 mt-1">范围：512-2048（必须是8的倍数）</div>
            </div>
          </>
        )}

        {settings.model === 'image-01-live' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">🎨 画风类型</label>
              <select
                value={settings.style?.style_type || '漫画'}
                onChange={(e) => updateStyle({ style_type: e.target.value as StyleConfig['style_type'] })}
                disabled={isLoading}
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                {STYLE_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🎨 画风强度：{settings.style?.style_weight || 0.8}
              </label>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.1"
                value={settings.style?.style_weight || 0.8}
                onChange={(e) => updateStyle({ style_weight: parseFloat(e.target.value) })}
                disabled={isLoading}
                className="w-full"
              />
            </div>
          </>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            🖼️ 生成数量：{settings.n} 张
          </label>
          <input
            type="range"
            min="1"
            max="9"
            value={settings.n}
            onChange={(e) => updateSettings({ n: parseInt(e.target.value) })}
            disabled={isLoading}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            🎲 随机种子（可选）
          </label>
          <input
            type="number"
            value={settings.seed || ''}
            onChange={(e) => updateSettings({ seed: e.target.value ? parseInt(e.target.value) : undefined })}
            placeholder="留空则随机生成"
            disabled={isLoading}
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
          <div className="text-xs text-gray-500 mt-1">输入相同种子可生成相似图片</div>
        </div>

        <div className="border-t pt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            👤 角色参考（可选）
          </label>
          <input
            type="file"
            accept="image/jpeg,image/png"
            onChange={handleFileUpload}
            disabled={isLoading}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
          />
          {subjectReference && (
            <div className="mt-2 relative inline-block">
              <img
                src={subjectReference}
                alt="角色参考图"
                className="w-24 h-24 object-cover rounded-lg border-2 border-primary-300"
              />
              <button
                onClick={() => onSubjectReferenceChange(null)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                disabled={isLoading}
              >
                ✕
              </button>
            </div>
          )}
          <div className="text-xs text-gray-500 mt-2">上传单人正面照片作为角色参考</div>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="watermark"
            checked={settings.aigc_watermark}
            onChange={(e) => updateSettings({ aigc_watermark: e.target.checked })}
            disabled={isLoading}
            className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
          />
          <label htmlFor="watermark" className="text-sm text-gray-700 cursor-pointer">
            🏷️ 添加AI水印
          </label>
        </div>
      </div>
    </div>
  );
};
