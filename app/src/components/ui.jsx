import Icon from './Icon.jsx';
import { GOAL_TYPES } from '../data.js';

export function Button({ variant = 'primary', size, className = '', children, ...props }) {
  return (
    <button className={`btn ${variant} ${size === 'sm' ? 'sm' : ''} ${className}`} {...props}>
      {children}
    </button>
  );
}

export function StepHeader({ step, total = 5, onBack }) {
  return (
    <div className="stephead">
      <button className="back" aria-label="Back" onClick={onBack}>
        <Icon name="left" />
      </button>
      <div className="steps" aria-hidden="true">
        {Array.from({ length: total }, (_, i) => (
          <i key={i} className={i < step ? 'on' : ''} />
        ))}
      </div>
      <span className="caption muted">
        {step} of {total}
      </span>
    </div>
  );
}

export function GoalBadge({ goal, size = 44, iconSize = 24 }) {
  return (
    <span className={`badge b-${goal}`} style={{ width: size, height: size, borderRadius: size * 0.3 }}>
      <Icon name={GOAL_TYPES[goal].icon} size={iconSize} />
    </span>
  );
}

export function ProgressBar({ value, color = 'var(--brand)' }) {
  return (
    <div className="track" role="progressbar" aria-valuenow={Math.round(value * 100)} aria-valuemin={0} aria-valuemax={100}>
      <i style={{ width: `${Math.min(1, value) * 100}%`, background: color }} />
    </div>
  );
}

export function Hint({ icon = 'spark', tone = '', children }) {
  return (
    <p className={`hint ${tone}`}>
      <Icon name={icon} size={14} />
      <span>{children}</span>
    </p>
  );
}

export function StatusBar() {
  return (
    <div className="status">
      <span className="num">9:41</span>
      <svg width="68" height="13" viewBox="0 0 68 13" aria-hidden="true">
        <rect x="0" y="8" width="3" height="4" rx="1" fill="currentColor" />
        <rect x="5" y="6" width="3" height="6" rx="1" fill="currentColor" />
        <rect x="10" y="3" width="3" height="9" rx="1" fill="currentColor" />
        <rect x="15" y="0" width="3" height="12" rx="1" fill="currentColor" />
        <path d="M30 3.5a9 9 0 0 1 12 0l-1.4 1.5a7 7 0 0 0-9.2 0zM32.6 6.4a5 5 0 0 1 6.8 0L36 10z" fill="currentColor" />
        <rect x="45.5" y="0.5" width="20" height="11" rx="3.5" stroke="currentColor" strokeOpacity=".4" fill="none" />
        <rect x="47.5" y="2.5" width="16" height="7" rx="2" fill="currentColor" />
        <rect x="66.5" y="4" width="1.5" height="4" rx=".75" fill="currentColor" fillOpacity=".4" />
      </svg>
    </div>
  );
}

// A screen inside the phone: scrollable body plus an optional pinned footer.
export function Screen({ children, footer, bodyClass = '', white = false }) {
  return (
    <div className={`screen-wrap ${white ? 'white' : ''}`}>
      <div className={`screen ${bodyClass}`}>{children}</div>
      {footer && <div className="foot">{footer}</div>}
    </div>
  );
}
