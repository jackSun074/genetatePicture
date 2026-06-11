import type { GeneratedImage } from '../types';

export async function downloadImage(image: GeneratedImage): Promise<void> {
  if (image.type === 'base64') {
    triggerDownload(image.src, `generated-${image.id}.png`);
    return;
  }

  try {
    const response = await fetch(image.src);
    if (!response.ok) {
      throw new Error('download failed');
    }

    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    triggerDownload(objectUrl, `generated-${image.id}.png`);
    URL.revokeObjectURL(objectUrl);
  } catch {
    window.open(image.src, '_blank', 'noopener,noreferrer');
  }
}

function triggerDownload(href: string, filename: string): void {
  const anchor = document.createElement('a');
  anchor.href = href;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
}
