import type { GenerationFormValues } from '../types';
import type { ValidationErrors } from '../lib/validation';

interface GenerationFormProps {
  form: GenerationFormValues;
  errors: ValidationErrors;
  isGenerating: boolean;
  finalPrompt: string;
  onChange: (form: GenerationFormValues) => void;
  onSubmit: () => void;
}

const aspectRatios = ['1:1', '16:9', '9:16', '4:3', '3:4'];
const styles = ['写实', '动漫', '摄影', '插画', '电影感', '产品图'];
const sizes = ['1024x1024', '1536x864', '864x1536', '1024x768', '768x1024'];
const qualities = ['standard', 'hd'];

export function GenerationForm({ form, errors, isGenerating, finalPrompt, onChange, onSubmit }: GenerationFormProps) {
  return (
    <section className="panel form-panel" aria-labelledby="generation-title">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">生成参数</p>
          <h2 id="generation-title">提示词与画面控制</h2>
        </div>
      </div>

      <div className="field-group">
        <label htmlFor="prompt">主提示词 *</label>
        <textarea
          id="prompt"
          value={form.prompt}
          placeholder="描述你想生成的画面，例如：一只穿宇航服的橘猫站在月球上"
          onChange={(event) => onChange({ ...form, prompt: event.target.value })}
          aria-invalid={Boolean(errors.prompt)}
          aria-describedby={errors.prompt ? 'prompt-error' : undefined}
        />
        {errors.prompt && (
          <p className="field-error" id="prompt-error" role="alert">
            {errors.prompt}
          </p>
        )}
      </div>

      <div className="field-group">
        <label htmlFor="negativePrompt">负面提示词</label>
        <input
          id="negativePrompt"
          value={form.negativePrompt}
          placeholder="blurry, low quality, watermark"
          onChange={(event) => onChange({ ...form, negativePrompt: event.target.value })}
        />
      </div>

      <div className="control-grid">
        <div className="field-group">
          <label htmlFor="aspectRatio">画面比例</label>
          <select
            id="aspectRatio"
            value={form.aspectRatio}
            onChange={(event) => onChange({ ...form, aspectRatio: event.target.value })}
          >
            {aspectRatios.map((ratio) => (
              <option key={ratio} value={ratio}>
                {ratio}
              </option>
            ))}
          </select>
        </div>

        <div className="field-group">
          <label htmlFor="style">风格</label>
          <select id="style" value={form.style} onChange={(event) => onChange({ ...form, style: event.target.value })}>
            {styles.map((style) => (
              <option key={style} value={style}>
                {style}
              </option>
            ))}
          </select>
        </div>

        <div className="field-group">
          <label htmlFor="size">尺寸</label>
          <select id="size" value={form.size} onChange={(event) => onChange({ ...form, size: event.target.value })}>
            {sizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        <div className="field-group">
          <label htmlFor="quality">质量</label>
          <select
            id="quality"
            value={form.quality}
            onChange={(event) => onChange({ ...form, quality: event.target.value })}
          >
            {qualities.map((quality) => (
              <option key={quality} value={quality}>
                {quality}
              </option>
            ))}
          </select>
        </div>

        <div className="field-group">
          <label htmlFor="count">生成数量</label>
          <input
            id="count"
            type="number"
            min="1"
            max="4"
            value={form.count}
            onChange={(event) => onChange({ ...form, count: Number(event.target.value) })}
          />
        </div>
      </div>

      <div className="prompt-preview">
        <p className="eyebrow">最终 Prompt 预览</p>
        <pre>{finalPrompt || '填写主提示词后会在这里预览最终发送内容。'}</pre>
      </div>

      <button type="button" className="generate-button" onClick={onSubmit} disabled={isGenerating}>
        {isGenerating ? '正在生成...' : '生成图片'}
      </button>
    </section>
  );
}
