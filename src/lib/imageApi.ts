import type { GeneratedImage, GenerateImagesParams } from '../types';

interface ImageApiResponseItem {
  url?: string;
  b64_json?: string;
}

interface ImageApiResponse {
  data?: ImageApiResponseItem[];
  error?: {
    message?: string;
  };
}

export class ImageApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ImageApiError';
  }
}

export async function generateImages({ config, form, finalPrompt }: GenerateImagesParams): Promise<GeneratedImage[]> {
  let response: Response;

  try {
    response = await fetch(config.requestUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: config.model,
        prompt: finalPrompt,
        size: form.size,
        quality: form.quality,
        n: form.count,
      }),
    });
  } catch {
    throw new ImageApiError('请求失败，请检查请求地址、网络或 CORS 设置。');
  }

  const payload = await readJson(response);

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new ImageApiError('API Key 无效或无权限。');
    }

    throw new ImageApiError(payload?.error?.message || `接口请求失败，HTTP 状态码：${response.status}`);
  }

  if (!Array.isArray(payload?.data)) {
    throw new ImageApiError('接口响应格式不符合预期：缺少 data 数组。');
  }

  const now = new Date().toISOString();
  const images = payload.data.flatMap((item, index): GeneratedImage[] => {
    if (item.url) {
      return [
        {
          id: makeId(index),
          src: item.url,
          type: 'url',
          createdAt: now,
        },
      ];
    }

    if (item.b64_json) {
      return [
        {
          id: makeId(index),
          src: `data:image/png;base64,${item.b64_json}`,
          type: 'base64',
          createdAt: now,
        },
      ];
    }

    return [];
  });

  if (images.length === 0) {
    throw new ImageApiError('接口响应格式不符合预期：未找到图片 URL 或 base64 数据。');
  }

  return images;
}

async function readJson(response: Response): Promise<ImageApiResponse | null> {
  try {
    return (await response.json()) as ImageApiResponse;
  } catch {
    return null;
  }
}

function makeId(index: number): string {
  return `${Date.now()}-${index}-${Math.random().toString(16).slice(2)}`;
}
