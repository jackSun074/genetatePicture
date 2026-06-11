export type ImageType = 'url' | 'base64';

export interface ApiConfig {
  requestUrl: string;
  apiKey: string;
  model: string;
}

export interface GenerationFormValues {
  prompt: string;
  negativePrompt: string;
  aspectRatio: string;
  style: string;
  size: string;
  quality: string;
  count: number;
}

export interface GeneratedImage {
  id: string;
  src: string;
  type: ImageType;
  createdAt: string;
}

export interface HistoryItem {
  id: string;
  image: GeneratedImage;
  prompt: string;
  finalPrompt: string;
  model: string;
  aspectRatio: string;
  style: string;
  size: string;
  quality: string;
  count: number;
  createdAt: string;
}

export interface GenerateImagesParams {
  config: ApiConfig;
  form: GenerationFormValues;
  finalPrompt: string;
}
