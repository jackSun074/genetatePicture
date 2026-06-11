import type { ApiConfig, GenerationFormValues } from '../types';

export interface ValidationErrors {
  requestUrl?: string;
  apiKey?: string;
  model?: string;
  prompt?: string;
}

export function validateForm(config: ApiConfig, form: GenerationFormValues): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!config.requestUrl.trim()) {
    errors.requestUrl = '请输入完整请求地址。';
  } else if (!isValidUrl(config.requestUrl)) {
    errors.requestUrl = '请输入完整请求地址，例如 https://api.example.com/images。';
  }

  if (!config.apiKey.trim()) {
    errors.apiKey = '请输入 API Key。';
  }

  if (!config.model.trim()) {
    errors.model = '请输入模型名。';
  }

  if (!form.prompt.trim()) {
    errors.prompt = '请输入提示词。';
  }

  return errors;
}

export function hasErrors(errors: ValidationErrors): boolean {
  return Object.keys(errors).length > 0;
}

function isValidUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}
