# Steady — clickable prototype

React + Vite prototype of Steady's onboarding and home dashboard.

```bash
cd app
npm install
npm run dev      # http://localhost:5173
npm run build    # static build in dist/
```

## Flow

1. Welcome
2. Connect your bank (read-only)
3. Monthly income and payday
4. Choose goals: Travel, Emergency fund, Car, Move
5. Targets and dates per goal
6. Suggested plan: a monthly amount based on income minus essentials and everyday spending, with Gentle / Suggested / Stretch options and a split across goals
7. All set
8. Home dashboard (shown four paydays in)

Choices made during onboarding (bank, income, payday, goals, targets, plan) carry through to the dashboard.
On wide screens a side panel lets you jump to any screen; on phones the prototype fills the screen.

## Structure

- `src/data.js` — sample data and plan logic (suggested amount, split, goal status)
- `src/components/` — `Icon`, and shared UI (`Button`, `StepHeader`, `GoalBadge`, `ProgressBar`, `Hint`, `Screen`, `StatusBar`)
- `src/screens/Onboarding.jsx` — onboarding screens
- `src/screens/Dashboard.jsx` — home dashboard
- `src/styles.css` — design tokens (mirroring the Figma variables) and styles
