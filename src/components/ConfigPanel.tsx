import type { ApiConfig } from '../types';
import type { ValidationErrors } from '../lib/validation';

interface ConfigPanelProps {
  config: ApiConfig;
  errors: ValidationErrors;
  showApiKey: boolean;
  onChange: (config: ApiConfig) => void;
  onSave: () => void;
  onClear: () => void;
  onToggleApiKey: () => void;
}

export function ConfigPanel({
  config,
  errors,
  showApiKey,
  onChange,
  onSave,
  onClear,
  onToggleApiKey,
}: ConfigPanelProps) {
  return (
    <section className="panel" aria-labelledby="config-title">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">接口配置</p>
          <h2 id="config-title">自定义中转站</h2>
        </div>
        <span className="status-dot" aria-label={config.requestUrl ? '已填写请求地址' : '未填写请求地址'} />
      </div>

      <div className="field-group">
        <label htmlFor="requestUrl">完整请求地址 *</label>
        <input
          id="requestUrl"
          type="url"
          value={config.requestUrl}
          placeholder="https://api.example.com/images"
          onChange={(event) => onChange({ ...config, requestUrl: event.target.value })}
          aria-invalid={Boolean(errors.requestUrl)}
          aria-describedby={errors.requestUrl ? 'requestUrl-error' : 'requestUrl-help'}
        />
        {errors.requestUrl ? (
          <p className="field-error" id="requestUrl-error" role="alert">
            {errors.requestUrl}
          </p>
        ) : (
          <p className="field-help" id="requestUrl-help">
            请求会直接发送到这里，不会自动拼接路径。
          </p>
        )}
      </div>

      <div className="field-group">
        <label htmlFor="apiKey">API Key *</label>
        <div className="input-action">
          <input
            id="apiKey"
            type={showApiKey ? 'text' : 'password'}
            value={config.apiKey}
            placeholder="sk-..."
            onChange={(event) => onChange({ ...config, apiKey: event.target.value })}
            aria-invalid={Boolean(errors.apiKey)}
            aria-describedby={errors.apiKey ? 'apiKey-error' : 'apiKey-help'}
          />
          <button type="button" className="ghost-button compact" onClick={onToggleApiKey}>
            {showApiKey ? '隐藏' : '显示'}
          </button>
        </div>
        {errors.apiKey ? (
          <p className="field-error" id="apiKey-error" role="alert">
            {errors.apiKey}
          </p>
        ) : (
          <p className="field-help" id="apiKey-help">
            Key 仅保存在当前浏览器 localStorage。
          </p>
        )}
      </div>

      <div className="field-group">
        <label htmlFor="model">模型 *</label>
        <input
          id="model"
          type="text"
          value={config.model}
          placeholder="gptimage-2"
          onChange={(event) => onChange({ ...config, model: event.target.value })}
          aria-invalid={Boolean(errors.model)}
          aria-describedby={errors.model ? 'model-error' : undefined}
        />
        {errors.model && (
          <p className="field-error" id="model-error" role="alert">
            {errors.model}
          </p>
        )}
      </div>

      <div className="button-row">
        <button type="button" className="primary-button" onClick={onSave}>
          保存配置
        </button>
        <button type="button" className="ghost-button" onClick={onClear}>
          清空配置
        </button>
      </div>
    </section>
  );
}
