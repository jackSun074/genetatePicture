import type { HistoryItem } from '../types';

interface HistoryPanelProps {
  history: HistoryItem[];
  onClear: () => void;
  onCopy: (src: string) => void;
}

export function HistoryPanel({ history, onClear, onCopy }: HistoryPanelProps) {
  return (
    <section className="panel history-panel" aria-labelledby="history-title">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">本地历史</p>
          <h2 id="history-title">最近生成</h2>
        </div>
        <button type="button" className="ghost-button compact" onClick={onClear} disabled={history.length === 0}>
          清空
        </button>
      </div>

      {history.length === 0 ? (
        <div className="empty-state slim">
          <p>暂无历史记录。</p>
        </div>
      ) : (
        <div className="history-list">
          {history.map((item) => (
            <article className="history-item" key={item.id}>
              <img src={item.image.src} alt="历史生成图片" loading="lazy" />
              <div>
                <h3>{item.prompt}</h3>
                <p>{formatTime(item.createdAt)}</p>
                <p>
                  {item.model} · {item.aspectRatio} · {item.style}
                </p>
                <button type="button" className="ghost-button compact" onClick={() => onCopy(item.image.src)}>
                  复制链接
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function formatTime(value: string): string {
  return new Intl.DateTimeFormat('zh-CN', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(value));
}
