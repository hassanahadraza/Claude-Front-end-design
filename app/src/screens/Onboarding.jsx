import { useState } from 'react';
import Icon from '../components/Icon.jsx';
import { Button, StepHeader, GoalBadge, ProgressBar, Hint, Screen } from '../components/ui.jsx';
import {
  BANKS, PAYDAYS, GOAL_TYPES, DEADLINE_OPTIONS, eur, monthLabel,
  activeGoals, planOptions, monthlyAmount, split, goalStatus,
} from '../data.js';

const parseAmount = (v) => parseInt(String(v).replace(/[^\d]/g, ''), 10) || 0;

export function Welcome({ go }) {
  return (
    <Screen
      white
      bodyClass="welcome"
      footer={
        <>
          <Button onClick={() => go('bank')}>Get started</Button>
          <Button variant="ghost">I already have an account</Button>
        </>
      }
    >
      <div className="brandline">
        <span className="logo"><Icon name="steady" size={20} /></span>
        <span className="word">steady</span>
      </div>
      <div>
        <h1 className="h1 display">Save for what matters, on every payday.</h1>
        <p className="sub">Steady looks at your real spending and suggests an amount you can save each month without feeling it.</p>
      </div>
      <div className="preview">
        {[['travel', 'Japan trip', 900, 2000], ['emergency', 'Emergency fund', 780, 4600]].map(([k, name, saved, target]) => (
          <div key={k} className="preview-goal">
            <div className="row-flex">
              <GoalBadge goal={k} />
              <div className="grow">
                <div className="strong">{name}</div>
                <div className="caption num">{eur(saved)} of {eur(target)}</div>
              </div>
              <span className="strong num">{Math.round((saved / target) * 100)}%</span>
            </div>
            <ProgressBar value={saved / target} color={`var(--g-${k})`} />
          </div>
        ))}
      </div>
      <div className="values">
        <div className="value">
          <span className="badge b-brand sm"><Icon name="cal" size={16} /></span>
          <div><b>One save a month</b><span className="small">Moves on payday, before spending starts.</span></div>
        </div>
        <div className="value">
          <span className="badge b-brand sm"><Icon name="spark" size={16} /></span>
          <div><b>An amount that fits you</b><span className="small">Suggested from your last 3 months.</span></div>
        </div>
      </div>
    </Screen>
  );
}

export function ConnectBank({ state, set, go, back }) {
  const [query, setQuery] = useState('');
  const bank = BANKS.find((b) => b.id === state.bank);
  const shown = BANKS.filter((b) => b.name.toLowerCase().includes(query.toLowerCase()));
  return (
    <Screen footer={<Button onClick={() => go('income')}>Continue with {bank.name}</Button>}>
      <StepHeader step={1} onBack={back} />
      <div>
        <h1 className="h1">Connect your main account</h1>
        <p className="sub">Pick the account your salary goes into. We use it to understand your spending.</p>
      </div>
      <label className="search">
        <Icon name="search" size={16} />
        <input id="bank-search" placeholder="Search banks" value={query} onChange={(e) => setQuery(e.target.value)} />
      </label>
      <div className="list" role="radiogroup" aria-label="Bank">
        {shown.map((b) => (
          <button key={b.id} className="bank" role="radio" aria-checked={state.bank === b.id} onClick={() => set({ bank: b.id })}>
            <span className="init">{b.initials}</span>
            <span className="grow strong">{b.name}</span>
            <span className="radio">{state.bank === b.id && <Icon name="check" size={14} strokeWidth={3} />}</span>
          </button>
        ))}
        {!shown.length && <p className="small pad">No banks match “{query}”.</p>}
      </div>
      <div className="secure">
        <Icon name="lock" size={16} />
        <p>Read-only access. Steady can see transactions but can never move money without your approval. Disconnect anytime.</p>
      </div>
    </Screen>
  );
}

export function Income({ state, set, go, back }) {
  const [text, setText] = useState(state.income.toLocaleString('en-US'));
  const payday = PAYDAYS.find((p) => p.id === state.payday);
  return (
    <Screen footer={<Button disabled={!state.income} onClick={() => go('goals')}>Continue</Button>}>
      <StepHeader step={2} onBack={back} />
      <div>
        <h1 className="h1">What do you earn each month?</h1>
        <p className="sub">After tax. Together with your spending, this sets your suggested amount.</p>
      </div>
      <div>
        <label className="label" htmlFor="income">Monthly income</label>
        <div className="amount-field">
          <span>€</span>
          <input
            id="income"
            inputMode="numeric"
            value={text}
            onChange={(e) => { setText(e.target.value); set({ income: parseAmount(e.target.value) }); }}
            onBlur={() => setText(state.income.toLocaleString('en-US'))}
          />
        </div>
      </div>
      <div className="found">
        <span className="badge b-brand xs"><Icon name="wallet" size={16} /></span>
        <p><b>We found your salary.</b> About €2,790 arrives from Nordwind GmbH around the 25th of each month.</p>
      </div>
      <div>
        <p className="label">When do you get paid?</p>
        <div className="chips">
          {PAYDAYS.map((p) => (
            <button key={p.id} className="chip" aria-pressed={state.payday === p.id} onClick={() => set({ payday: p.id })}>{p.label}</button>
          ))}
        </div>
        <Hint icon="cal">
          Your monthly save moves on {p_label(payday)}, right after your salary lands.
        </Hint>
      </div>
    </Screen>
  );
}

const p_label = (p) => (p.id === 'last' ? 'the last day of the month' : `the ${p.label}`);

export function Goals({ state, set, go, back }) {
  const n = activeGoals(state).length;
  const toggle = (k) => set({ goals: { ...state.goals, [k]: { ...state.goals[k], on: !state.goals[k].on } } });
  return (
    <Screen
      footer={<Button disabled={!n} onClick={() => go('targets')}>{n ? `Continue with ${n} goal${n > 1 ? 's' : ''}` : 'Pick at least one goal'}</Button>}
    >
      <StepHeader step={3} onBack={back} />
      <div>
        <h1 className="h1">What are you saving for?</h1>
        <p className="sub">Pick one or more. You can add or change goals anytime.</p>
      </div>
      <div className="tiles">
        {Object.entries(GOAL_TYPES).map(([k, g]) => (
          <button key={k} className="tile" aria-pressed={state.goals[k].on} onClick={() => toggle(k)}>
            <span className="tile-top">
              <GoalBadge goal={k} />
              <span className="chk"><Icon name="check" size={14} strokeWidth={3} /></span>
            </span>
            <span>
              <b>{g.label}</b>
              <span className="small">{g.hint}</span>
            </span>
          </button>
        ))}
      </div>
      <Hint>Most people start with an emergency fund plus one thing they're excited about.</Hint>
    </Screen>
  );
}

export function Targets({ state, set, go, back }) {
  const update = (k, patch) => set({ goals: { ...state.goals, [k]: { ...state.goals[k], ...patch } } });
  return (
    <Screen footer={<Button onClick={() => go('plan')}>See my plan</Button>}>
      <StepHeader step={4} onBack={back} />
      <div>
        <h1 className="h1">How much, and by when?</h1>
        <p className="sub">A rough number is fine. You can change it later.</p>
      </div>
      <div className="stack-12">
        {activeGoals(state).map((k) => (
          <TargetCard key={k} k={k} goal={state.goals[k]} essentials={state.essentials} onChange={(p) => update(k, p)} />
        ))}
      </div>
    </Screen>
  );
}

function TargetCard({ k, goal, essentials, onChange }) {
  const [text, setText] = useState(eur(goal.target));
  return (
    <div className="card stack-14">
      <div className="row-flex">
        <GoalBadge goal={k} />
        <div className="grow">
          <div className="caption">{GOAL_TYPES[k].label}</div>
          <input className="name-input strong" aria-label={`${GOAL_TYPES[k].label} name`} value={goal.name} onChange={(e) => onChange({ name: e.target.value })} />
        </div>
        <Icon name="right" size={16} className="muted" />
      </div>
      <div className="fields">
        <div className="field">
          <label htmlFor={`t-${k}`}>Target</label>
          <input
            id={`t-${k}`}
            className="num"
            inputMode="numeric"
            value={text}
            onChange={(e) => { setText(e.target.value); const v = parseAmount(e.target.value); if (v > 0) onChange({ target: v }); }}
            onBlur={() => setText(eur(goal.target))}
          />
        </div>
        <div className="field">
          <label htmlFor={`d-${k}`}>By</label>
          <select id={`d-${k}`} value={goal.by ?? ''} onChange={(e) => onChange({ by: e.target.value === '' ? null : +e.target.value })}>
            <option value="">No deadline</option>
            {DEADLINE_OPTIONS.map((i) => <option key={i} value={i}>{monthLabel(i)}</option>)}
          </select>
        </div>
      </div>
      {k === 'emergency' && <Hint>3 months of your essentials is about {eur(Math.round((essentials * 3) / 100) * 100)}. A good first target.</Hint>}
    </div>
  );
}

const NOTES = {
  gentle: (o) => `Leaves ${eur(o.suggested - o.gentle)} extra each month for everyday spending.`,
  suggested: () => 'Fits your usual spending with no changes.',
  stretch: () => `Means about ${eur(100)} less for everyday spending each month.`,
};

export function Plan({ state, set, go, back }) {
  const o = planOptions(state);
  const amount = monthlyAmount(state);
  const payday = PAYDAYS.find((p) => p.id === state.payday);
  const total = Math.max(state.income, 1);
  return (
    <Screen
      footer={
        <>
          <Button disabled={!amount} onClick={() => go('done')}>Save {eur(amount)} on {p_label(payday).replace(' of the month', '')}</Button>
          <p className="caption center">You can pause or change this anytime.</p>
        </>
      }
    >
      <StepHeader step={5} onBack={back} />
      <div className="stack-12">
        <span className="pill"><Icon name="spark" size={16} />Steady suggestion</span>
        {o.suggested > 0 ? (
          <h1 className="h1">You can comfortably save <span className="num">{eur(o.suggested)}</span> each payday.</h1>
        ) : (
          <h1 className="h1">Your spending uses all of your income right now.</h1>
        )}
        <p className="sub flush">Based on your last 3 months of spending.</p>
      </div>
      <div className="card stack-14">
        <div className="stackbar" aria-hidden="true">
          <i style={{ width: `${(state.essentials / total) * 100}%`, background: 'var(--ink)' }} />
          <i style={{ width: `${(state.spending / total) * 100}%`, background: 'var(--line-2)' }} />
          <i style={{ flex: 1, background: 'var(--brand)' }} />
        </div>
        <div className="rows">
          <div className="row"><span className="k">Monthly income</span><span className="v">{eur(state.income)}</span></div>
          <div className="row"><span className="k"><i style={{ background: 'var(--ink)' }} />Bills and essentials</span><span className="v">−{eur(state.essentials)}</span></div>
          <div className="row"><span className="k"><i style={{ background: 'var(--line-2)' }} />Everyday spending</span><span className="v">−{eur(state.spending)}</span></div>
          <div className="row total"><span className="k"><i style={{ background: 'var(--brand)' }} />Comfortable to save</span><span className="v">{eur(o.suggested)}</span></div>
        </div>
      </div>
      <div>
        <p className="label">Choose your monthly amount</p>
        <div className="seg">
          {[['gentle', 'Gentle'], ['suggested', 'Suggested'], ['stretch', 'Stretch']].map(([k, l]) => (
            <button key={k} className="opt" aria-pressed={state.option === k} onClick={() => set({ option: k })}>
              <span>{l}</span><b>{eur(o[k])}</b>
            </button>
          ))}
        </div>
        <Hint>{NOTES[state.option](o)}</Hint>
      </div>
      <div className="card">
        <div className="sec-h mb-14"><span className="h3 sm">How it's split</span></div>
        <div className="stack-14">
          {split(state).map(({ key, monthly }) => {
            const g = state.goals[key];
            const s = goalStatus(g, monthly);
            return (
              <div key={key} className="row-flex">
                <GoalBadge goal={key} size={40} iconSize={16} />
                <div className="grow">
                  <div className="strong">{g.name}</div>
                  <div className={`caption ${s.tone}`}>{s.text}</div>
                </div>
                <div className="amt">{eur(monthly)}<small>per month</small></div>
              </div>
            );
          })}
        </div>
      </div>
    </Screen>
  );
}

export function Done({ state, go }) {
  const amount = monthlyAmount(state);
  const payday = PAYDAYS.find((p) => p.id === state.payday);
  return (
    <Screen white bodyClass="centered" footer={<Button variant="dark" onClick={() => go('home')}>Go to my dashboard</Button>}>
      <div className="stack-20">
        <span className="done-mark"><Icon name="check" size={36} strokeWidth={2.2} /></span>
        <div>
          <h1 className="h1">You're all set, Alex.</h1>
          <p className="sub">Your first {eur(amount)} moves on {payday.first}, right after your salary arrives.</p>
        </div>
      </div>
      <div className="card canvas stack-14">
        {split(state).map(({ key, monthly }) => (
          <div key={key} className="row-flex">
            <GoalBadge goal={key} size={40} iconSize={16} />
            <div className="grow">
              <div className="strong">{state.goals[key].name}</div>
              <div className="caption">{eur(state.goals[key].target)} goal</div>
            </div>
            <div className="amt">{eur(monthly)}<small>each payday</small></div>
          </div>
        ))}
      </div>
      <Hint icon="bell">We'll send one short note the day before each save. Nothing else.</Hint>
    </Screen>
  );
}
