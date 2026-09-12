import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';

export function ThemeToggle() {
  const { resolvedTheme, toggleTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="btn-icon"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      id="theme-toggle-btn"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 36,
        height: 36,
        borderRadius: '0.625rem',
        flexShrink: 0,
        cursor: 'pointer',
        transition: 'all 0.18s ease',
      }}
    >
      {isDark ? (
        <Sun size={17} color="var(--amber)" />
      ) : (
        <Moon size={17} color="var(--blue)" />
      )}
    </button>
  );
}
