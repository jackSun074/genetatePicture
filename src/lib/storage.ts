import type { ApiConfig, HistoryItem } from '../types';

const CONFIG_KEY = 'ai-image-generator:config';
const HISTORY_KEY = 'ai-image-generator:history';
const HISTORY_LIMIT = 50;

export const emptyConfig: ApiConfig = {
  requestUrl: '',
  apiKey: '',
  model: '',
};

export function loadConfig(): ApiConfig {
  try {
    const raw = localStorage.getItem(CONFIG_KEY);
    if (!raw) {
      return emptyConfig;
    }

    return { ...emptyConfig, ...JSON.parse(raw) };
  } catch {
    return emptyConfig;
  }
}

export function saveConfig(config: ApiConfig): void {
  localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
}

export function clearConfig(): void {
  localStorage.removeItem(CONFIG_KEY);
}

export function loadHistory(): HistoryItem[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveHistory(history: HistoryItem[]): void {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, HISTORY_LIMIT)));
}

export function prependHistory(current: HistoryItem[], items: HistoryItem[]): HistoryItem[] {
  const next = [...items, ...current].slice(0, HISTORY_LIMIT);
  saveHistory(next);
  return next;
}

export function clearHistory(): void {
  localStorage.removeItem(HISTORY_KEY);
}
