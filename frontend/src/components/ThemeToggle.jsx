import { useTheme } from '../theme/ThemeContext';

export default function ThemeToggle({ compact = false }) {
  const { toggleTheme, isDark } = useTheme();

  return (
    <div className={`theme-switch ${compact ? 'theme-switch--compact' : ''}`}>
      {!compact && <span className="theme-switch__label">Light</span>}
      <button
        type="button"
        className={`theme-switch__track ${isDark ? 'is-on' : ''}`}
        role="switch"
        aria-checked={isDark}
        aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
        title={isDark ? 'Dark theme' : 'Light theme'}
        onClick={toggleTheme}
      >
        <span className="theme-switch__knob" />
      </button>
      {!compact && <span className="theme-switch__label">Dark</span>}
      {compact && <span className="theme-switch__label">{isDark ? 'Dark' : 'Light'}</span>}
    </div>
  );
}
