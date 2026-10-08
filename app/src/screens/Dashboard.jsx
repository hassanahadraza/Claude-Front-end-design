import Icon from '../components/Icon.jsx';
import { Button, GoalBadge, ProgressBar, Hint } from '../components/ui.jsx';
import { PAYDAYS, eur, monthLabel, monthlyAmount, split, goalStatus, SAVES_SO_FAR, SNAPSHOT_MONTH_INDEX } from '../data.js';

const TIP_AMOUNT = 64;

export default function Dashboard({ state, set, go }) {
  const amount = monthlyAmount(state);
  const payday = PAYDAYS.find((p) => p.id === state.payday);
  const parts = split(state);

  const goals = parts.map(({ key, monthly }) => {
    const g = state.goals[key];
    const extra = state.extra?.goal === key ? state.extra.amount : 0;
    const saved = Math.min(g.target, monthly * SAVES_SO_FAR + extra);
    return { key, g, monthly, saved, status: goalStatus(g, monthly, saved, SNAPSHOT_MONTH_INDEX) };
  });
  const total = goals.reduce((a, x) => a + x.saved, 0);
  // Suggest the extra for the goal with a date first; fall back to the first goal.
  const tipGoal = goals.find((x) => x.g.by != null) ?? goals[0];
  const usual = state.essentials + state.spending;
  const spent = Math.round(usual * 0.68 / 10) * 10;
  const showTip = tipGoal && !state.extra && !state.tipDismissed;

  return (
    <div className="screen-wrap">
      <div className="screen dash">
        <div className="topbar">
          <span className="avatar">A</span>
          <div className="grow">
            <div className="caption">Good morning</div>
            <div className="h3">Alex</div>
          </div>
          <button className="iconbtn" aria-label="Notifications"><Icon name="bell" /><span className="dot" /></button>
        </div>

        <section className="total-card">
          <div className="stack-6">
            <span className="lbl">Total saved</span>
            <span className="big num">{eur(total)}</span>
            <span className="gain"><Icon name="up" size={16} /><span className="num">+{eur(amount)} on {payday.last}</span></span>
          </div>
          <div className="next">
            <span className="next-ico"><Icon name="cal" size={16} /></span>
            <div className="grow">
              <div className="t1">Next save · in {payday.inDays} days</div>
              <div className="t2 num">{eur(amount)} on {payday.next}</div>
            </div>
            <Button size="sm" variant="white" onClick={() => go('plan')}>Review</Button>
          </div>
        </section>

        {showTip && (
          <section className="tip">
            <span className="pill sm"><Icon name="spark" size={14} />Steady noticed</span>
            <p>You've spent <b className="num">{eur(TIP_AMOUNT)}</b> less on eating out than usual this month. Want to move it to {tipGoal.g.name}?</p>
            <div className="acts">
              <Button size="sm" onClick={() => set({ extra: { goal: tipGoal.key, amount: TIP_AMOUNT } })}>Add {eur(TIP_AMOUNT)}</Button>
              <Button size="sm" variant="secondary" onClick={() => set({ tipDismissed: true })}>Not now</Button>
            </div>
          </section>
        )}
        {state.extra && (
          <div className="toast"><Icon name="check" size={16} />Added {eur(state.extra.amount)} to {state.goals[state.extra.goal].name}.</div>
        )}

        <section className="stack-12">
          <div className="sec-h">
            <span className="h3">Your goals</span>
            <button className="link" onClick={() => go('goals')}><Icon name="plus" size={16} />Add goal</button>
          </div>
          {goals.map(({ key, g, monthly, saved, status }) => (
            <div key={key} className="card stack-14">
              <div className="row-flex">
                <GoalBadge goal={key} />
                <div className="grow">
                  <div className="strong">{g.name}</div>
                  <div className="small num">{eur(saved)} of {eur(g.target)}</div>
                </div>
                <span className="strong num">{Math.round((saved / g.target) * 100)}%</span>
              </div>
              <ProgressBar value={saved / g.target} color={`var(--g-${key})`} />
              <div className="gfoot">
                <Icon name="cal" size={14} />
                <span className="num">{eur(monthly)} each payday</span>
                <span className={`tag ${status.tone}`}>{status.tone === 'ok' && <Icon name="check" size={14} strokeWidth={2.6} />}{status.text}</span>
              </div>
            </div>
          ))}
        </section>

        <section className="card stack-12">
          <div className="sec-h"><span className="h3 sm">February so far</span><span className="caption num">19 of 28 days</span></div>
          <ProgressBar value={spent / usual} color="var(--ink)" />
          <div className="small num split-line"><span>{eur(spent)} spent</span><span>usually {eur(usual)} a month</span></div>
          <Hint icon="check" tone="ok">You're on a normal pace. Your {eur(amount)} save is covered.</Hint>
        </section>

        <section className="stack-12">
          <div className="sec-h"><span className="h3">Recent saves</span><button className="link">See all<Icon name="right" size={16} /></button></div>
          <div className="card">
            {state.extra && (
              <div className="act">
                <GoalBadge goal={state.extra.goal} size={40} iconSize={16} />
                <div className="grow"><div className="strong">Extra save</div><div className="caption">Today · {state.goals[state.extra.goal].name}</div></div>
                <span className="v">+{eur(state.extra.amount)}</span>
              </div>
            )}
            {payday.history.map((d) => (
              <div key={d} className="act">
                <span className="badge b-brand" style={{ width: 40, height: 40, borderRadius: 12 }}><Icon name="down" size={16} /></span>
                <div className="grow"><div className="strong">Payday save</div><div className="caption">{d} · {goals.length > 2 ? `${goals.length} goals` : goals.map((x) => x.g.name).join(', ')}</div></div>
                <span className="v">+{eur(amount)}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
      <nav className="tabbar" aria-label="Main">
        <div className="tabs">
          {[['Home', 'home'], ['Goals', 'target'], ['Activity', 'list'], ['Profile', 'user']].map(([l, i], n) => (
            <button key={l} className={`tab ${n === 0 ? 'on' : ''}`} aria-current={n === 0 ? 'page' : undefined}><Icon name={i} />{l}</button>
          ))}
        </div>
      </nav>
    </div>
  );
}
