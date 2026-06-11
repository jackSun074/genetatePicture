import { useEffect, useState } from 'react';
import { ConfigPanel } from './components/ConfigPanel';
import { GenerationForm } from './components/GenerationForm';
import { HistoryPanel } from './components/HistoryPanel';
import { ImageResults } from './components/ImageResults';
import { downloadImage } from './lib/download';
import { ImageApiError, generateImages } from './lib/imageApi';
import { buildPrompt } from './lib/prompt';
import { clearConfig, clearHistory, emptyConfig, loadConfig, loadHistory, prependHistory, saveConfig } from './lib/storage';
import { hasErrors, validateForm, type ValidationErrors } from './lib/validation';
import type { ApiConfig, GeneratedImage, GenerationFormValues, HistoryItem } from './types';

const defaultForm: GenerationFormValues = {
  prompt: '',
  negativePrompt: '',
  aspectRatio: '1:1',
  style: '写实',
  size: '1024x1024',
  quality: 'standard',
  count: 1,
};

export default function App() {
  const [config, setConfig] = useState<ApiConfig>(emptyConfig);
  const [form, setForm] = useState<GenerationFormValues>(defaultForm);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [requestError, setRequestError] = useState('');
  const [notice, setNotice] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);

  const finalPrompt = buildPrompt(form);

  useEffect(() => {
    setConfig(loadConfig());
    setHistory(loadHistory());
  }, []);

  function handleSaveConfig() {
    saveConfig(config);
    setNotice('配置已保存到当前浏览器。');
    setRequestError('');
  }

  function handleClearConfig() {
    clearConfig();
    setConfig(emptyConfig);
    setNotice('配置已清空。');
    setRequestError('');
  }

  function handleClearHistory() {
    clearHistory();
    setHistory([]);
    setNotice('历史记录已清空。');
    setRequestError('');
  }

  async function handleGenerate() {
    const nextErrors = validateForm(config, form);
    setErrors(nextErrors);
    setRequestError('');
    setNotice('');

    if (hasErrors(nextErrors)) {
      setRequestError('请先修正表单中的问题。');
      return;
    }

    setIsGenerating(true);

    try {
      const result = await generateImages({ config, form, finalPrompt });
      const now = new Date().toISOString();
      const historyItems = result.map((image): HistoryItem => ({
        id: `history-${image.id}`,
        image,
        prompt: form.prompt,
        finalPrompt,
        model: config.model,
        aspectRatio: form.aspectRatio,
        style: form.style,
        size: form.size,
        quality: form.quality,
        count: form.count,
        createdAt: now,
      }));

      setImages(result);
      setHistory((current) => prependHistory(current, historyItems));
      setNotice(`生成成功，共 ${result.length} 张图片。`);
    } catch (error) {
      setRequestError(error instanceof ImageApiError ? error.message : '生成失败，请稍后重试。');
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleCopy(value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setNotice('已复制到剪贴板。');
      setRequestError('');
    } catch {
      setRequestError('复制失败，请手动复制链接。');
    }
  }

  async function handleDownload(image: GeneratedImage) {
    await downloadImage(image);
  }

  return (
    <main className="app-shell">
      <header className="hero">
        <div>
          <p className="eyebrow">Pure Frontend AI Image Tool</p>
          <h1>AI 生图工作台</h1>
          <p>
            填写你的自定义中转站完整请求地址、API Key 和模型名，直接在浏览器中生成图片。
          </p>
        </div>
        <div className="hero-card">
          <span>接口模式</span>
          <strong>用户自定义完整 URL</strong>
          <small>不会自动拼接 /v1/images/generations</small>
        </div>
      </header>

      <div className="workspace">
        <ConfigPanel
          config={config}
          errors={errors}
          showApiKey={showApiKey}
          onChange={setConfig}
          onSave={handleSaveConfig}
          onClear={handleClearConfig}
          onToggleApiKey={() => setShowApiKey((value) => !value)}
        />

        <GenerationForm
          form={form}
          errors={errors}
          isGenerating={isGenerating}
          finalPrompt={finalPrompt}
          onChange={setForm}
          onSubmit={handleGenerate}
        />

        <ImageResults
          images={images}
          isGenerating={isGenerating}
          error={requestError}
          notice={notice}
          onDownload={handleDownload}
          onCopy={(image) => handleCopy(image.src)}
        />
      </div>

      <HistoryPanel history={history} onClear={handleClearHistory} onCopy={handleCopy} />
    </main>
  );
}
