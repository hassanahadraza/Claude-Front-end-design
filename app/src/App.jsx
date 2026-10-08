import { useEffect, useRef, useState } from 'react';
import Icon from './components/Icon.jsx';
import { StatusBar } from './components/ui.jsx';
import { Welcome, ConnectBank, Income, Goals, Targets, Plan, Done } from './screens/Onboarding.jsx';
import Dashboard from './screens/Dashboard.jsx';
import { initialState } from './data.js';

const SCREENS = [
  { id: 'welcome', label: 'Welcome', group: 'Onboarding', C: Welcome },
  { id: 'bank', label: 'Connect your bank', group: 'Onboarding', C: ConnectBank },
  { id: 'income', label: 'Income and payday', group: 'Onboarding', C: Income },
  { id: 'goals', label: 'Choose goals', group: 'Onboarding', C: Goals },
  { id: 'targets', label: 'Set targets', group: 'Onboarding', C: Targets },
  { id: 'plan', label: 'Suggested plan', group: 'Onboarding', C: Plan },
  { id: 'done', label: 'All set', group: 'Onboarding', C: Done },
  { id: 'home', label: 'Home', group: 'Dashboard', C: Dashboard },
];

export default function App() {
  const [state, setState] = useState(initialState);
  const [history, setHistory] = useState(['welcome']);
  const screenRef = useRef(null);
  const current = history[history.length - 1];
  const { C } = SCREENS.find((s) => s.id === current);

  const set = (patch) => setState((s) => ({ ...s, ...patch }));
  const go = (id) => setHistory((h) => (h[h.length - 1] === id ? h : [...h, id]));
  const back = () => setHistory((h) => (h.length > 1 ? h.slice(0, -1) : h));
  const jump = (id) => setHistory([id]);
  const reset = () => { setState(initialState); setHistory(['welcome']); };

  // New screen starts at the top.
  useEffect(() => { screenRef.current?.querySelector('.screen')?.scrollTo(0, 0); }, [current]);

  return (
    <div className="stage">
      <aside className="side">
        <div className="side-brand">
          <span className="logo"><Icon name="steady" size={20} /></span>
          <div>
            <div className="side-title">Steady</div>
            <div className="side-sub">Clickable prototype</div>
          </div>
        </div>
        <p className="side-text">Tap through onboarding on the phone. Your bank, income, payday, goals and plan carry through to the dashboard.</p>
        {['Onboarding', 'Dashboard'].map((g) => (
          <div key={g} className="side-group">
            <div className="side-label">{g}</div>
            <ol>
              {SCREENS.filter((s) => s.group === g).map((s) => (
                <li key={s.id}>
                  <button className={`side-link ${s.id === current ? 'on' : ''}`} onClick={() => jump(s.id)} aria-current={s.id === current ? 'step' : undefined}>
                    <span className="side-num">{String(SCREENS.indexOf(s) + 1).padStart(2, '0')}</span>
                    {s.label}
                  </button>
                </li>
              ))}
            </ol>
          </div>
        ))}
        <button className="side-reset" onClick={reset}>Start over</button>
      </aside>

      <main className="phone" ref={screenRef} aria-label="Steady app">
        <StatusBar />
        <C key={current} state={state} set={set} go={go} back={back} />
        <div className="home-ind"><i /></div>
      </main>
    </div>
  );
}
