import type { GenerationFormValues } from '../types';

export function buildPrompt(form: GenerationFormValues): string {
  const parts = [form.prompt.trim()];

  if (form.style.trim()) {
    parts.push(`Style: ${form.style.trim()}`);
  }

  if (form.aspectRatio.trim()) {
    parts.push(`Aspect ratio: ${form.aspectRatio.trim()}`);
  }

  if (form.negativePrompt.trim()) {
    parts.push(`Avoid: ${form.negativePrompt.trim()}`);
  }

  return parts.filter(Boolean).join('\n');
}
