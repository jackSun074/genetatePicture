import type { GeneratedImage } from '../types';

interface ImageResultsProps {
  images: GeneratedImage[];
  isGenerating: boolean;
  error: string;
  notice: string;
  onDownload: (image: GeneratedImage) => void;
  onCopy: (image: GeneratedImage) => void;
}

export function ImageResults({ images, isGenerating, error, notice, onDownload, onCopy }: ImageResultsProps) {
  return (
    <section className="panel results-panel" aria-labelledby="results-title">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">生成结果</p>
          <h2 id="results-title">图片预览</h2>
        </div>
      </div>

      {error && (
        <div className="message error-message" role="alert">
          {error}
        </div>
      )}

      {notice && !error && (
        <div className="message success-message" role="status">
          {notice}
        </div>
      )}

      {isGenerating && (
        <div className="loading-card" role="status" aria-live="polite">
          <div className="spinner" />
          <p>正在请求中转站生成图片，请稍候。</p>
        </div>
      )}

      {!isGenerating && images.length === 0 && (
        <div className="empty-state">
          <p>还没有生成结果。</p>
          <span>填写配置和提示词后，点击“生成图片”。</span>
        </div>
      )}

      {images.length > 0 && (
        <div className="image-grid">
          {images.map((image) => (
            <article className="image-card" key={image.id}>
              <img src={image.src} alt="AI 生成结果" loading="lazy" />
              <div className="image-actions">
                <button type="button" className="ghost-button compact" onClick={() => onDownload(image)}>
                  下载
                </button>
                <button type="button" className="ghost-button compact" onClick={() => onCopy(image)}>
                  复制链接
                </button>
                {image.type === 'url' && (
                  <a className="ghost-link" href={image.src} target="_blank" rel="noreferrer">
                    打开原图
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
