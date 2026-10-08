// Sample data and plan logic for the prototype. Month index 0 = October 2026, the first payday save.

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const eur = (n) => '€' + Math.round(n).toLocaleString('en-US');
export const round5 = (n) => Math.round(n / 5) * 5;
export const monthLabel = (i) => {
  const m = 9 + i;
  return `${MONTHS[m % 12]} ${2026 + Math.floor(m / 12)}`;
};
export const DEADLINE_OPTIONS = Array.from({ length: 48 }, (_, i) => i);

export const BANKS = [
  { id: 'erste', name: 'Erste Bank', initials: 'EB' },
  { id: 'revolut', name: 'Revolut', initials: 'RV' },
  { id: 'n26', name: 'N26', initials: 'N2' },
  { id: 'raiffeisen', name: 'Raiffeisen', initials: 'RB' },
  { id: 'unicredit', name: 'UniCredit Bank Austria', initials: 'UC' },
];

export const PAYDAYS = [
  { id: '1st', label: '1st', first: '1 November', last: '1 Feb', next: '1 Mar', inDays: 10, history: ['1 Feb', '1 Jan', '1 Dec'] },
  { id: '15th', label: '15th', first: '15 October', last: '15 Feb', next: '15 Mar', inDays: 24, history: ['15 Feb', '15 Jan', '15 Dec'] },
  { id: '25th', label: '25th', first: '25 October', last: '25 Jan', next: '25 Feb', inDays: 6, history: ['25 Jan', '25 Dec', '25 Nov'] },
  { id: 'last', label: 'Last day', first: '31 October', last: '31 Jan', next: '28 Feb', inDays: 9, history: ['31 Jan', '31 Dec', '30 Nov'] },
];

export const GOAL_TYPES = {
  travel: { label: 'Travel', hint: 'Trips and holidays', icon: 'plane', name: 'Japan trip', target: 2000, by: 8 },
  emergency: { label: 'Emergency fund', hint: 'Your safety net', icon: 'shield', name: 'Emergency fund', target: 4600, by: null },
  car: { label: 'A car', hint: 'New or used', icon: 'car', name: 'First car', target: 8000, by: 26 },
  move: { label: 'A move', hint: 'Deposit and moving costs', icon: 'box', name: 'Moving out', target: 3500, by: 10 },
};

export const initialState = {
  bank: 'erste',
  income: 2800,
  essentials: 1540,
  spending: 840,
  payday: '25th',
  option: 'suggested',
  goals: Object.fromEntries(
    Object.entries(GOAL_TYPES).map(([k, g]) => [k, { on: k === 'travel' || k === 'emergency', name: g.name, target: g.target, by: g.by }]),
  ),
  extra: null, // { goal, amount } once the dashboard tip is accepted
  tipDismissed: false,
};

export const activeGoals = (s) => Object.keys(s.goals).filter((k) => s.goals[k].on);

export function planOptions(s) {
  const suggested = round5(Math.max(0, s.income - s.essentials - s.spending));
  return { gentle: round5(suggested * 0.7), suggested, stretch: suggested + 100 };
}

export const monthlyAmount = (s) => planOptions(s)[s.option];

// Split the monthly amount across goals, weighted by what each goal needs per month.
// Goals without a date are spread over two years.
export function split(s, total = monthlyAmount(s)) {
  const keys = activeGoals(s);
  if (!keys.length || total <= 0) return keys.map((k) => ({ key: k, monthly: 0 }));
  const weights = keys.map((k) => {
    const g = s.goals[k];
    return g.target / (g.by == null ? 24 : g.by + 1);
  });
  const sum = weights.reduce((a, b) => a + b, 0);
  let left = total;
  return keys.map((k, i) => {
    const monthly = i === keys.length - 1 ? left : round5((total * weights[i]) / sum);
    left -= monthly;
    return { key: k, monthly };
  });
}

// When will a goal be reached, given what's already saved and the monthly amount?
export function goalStatus(goal, monthly, saved = 0, startIndex = 0) {
  if (saved >= goal.target) return { text: 'Goal reached', tone: 'ok' };
  if (monthly <= 0) return { text: 'Not funded yet', tone: 'late' };
  const ready = startIndex + Math.ceil((goal.target - saved) / monthly) - 1;
  if (goal.by == null) return { text: `Ready by ${monthLabel(ready)}`, tone: '' };
  if (ready <= goal.by) return { text: `On track for ${monthLabel(goal.by)}`, tone: 'ok' };
  const late = ready - goal.by;
  return { text: `${late} ${late === 1 ? 'month' : 'months'} after your date`, tone: 'late' };
}

// Dashboard snapshot: four payday saves in (Oct–Jan), viewed on 19 Feb 2027.
export const SAVES_SO_FAR = 4;
export const SNAPSHOT_MONTH_INDEX = SAVES_SO_FAR; // next save is the 5th
