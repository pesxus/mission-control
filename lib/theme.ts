// Theme types and utilities
export type Theme = 'light' | 'dark' | 'midnight';

export const themes: Record<Theme, { name: string; label: string }> = {
  light: { name: 'light', label: 'Light' },
  dark: { name: 'dark', label: 'Dark' },
  midnight: { name: 'midnight', label: 'Midnight' },
};

export function isValidTheme(value: string | null): value is Theme {
  return value === 'light' || value === 'dark' || value === 'midnight';
}
