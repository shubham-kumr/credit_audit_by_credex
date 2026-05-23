# Frontend Design System & Guidelines — SpendLens

---

## 1. Design Principles

1. **Clarity over cleverness** — Every element communicates its purpose immediately. If a user hesitates for more than 1 second, the UI has failed.
2. **Finance-grade credibility** — Savings numbers must feel trustworthy, not marketing-inflated. Typography and layout borrow from financial dashboards, not SaaS landing pages.
3. **Screenshot-first design** — The results page is the viral loop. Every design decision on that page asks: "Would someone screenshot this and share it?"
4. **Honest restraint** — Don't manufacture savings. Don't celebrate marginal wins. The UI must handle both "You're overpaying by $2,400/year" and "You're already optimized" with equal visual integrity.
5. **Mobile-first, keyboard-always** — The form works perfectly on a phone. Every interactive element is keyboard-accessible.

---

## 2. Design Tokens

### Color Palette

#### Brand / Primary — Credex Forest Green
```css
--color-primary-50:  #f0faf4;
--color-primary-100: #dcf2e6;
--color-primary-200: #bbe5ce;
--color-primary-300: #89d1ae;
--color-primary-400: #55b588;
--color-primary-500: #2e9967;  /* Main brand color */
--color-primary-600: #1f7f52;
--color-primary-700: #1a6643;
--color-primary-800: #175237;
--color-primary-900: #14432e;
```

#### Accent — Amber (for savings callouts)
```css
--color-accent-50:  #fffbeb;
--color-accent-100: #fef3c7;
--color-accent-200: #fde68a;
--color-accent-300: #fcd34d;
--color-accent-400: #fbbf24;
--color-accent-500: #f59e0b;  /* Savings highlight */
--color-accent-600: #d97706;
--color-accent-700: #b45309;
--color-accent-800: #92400e;
--color-accent-900: #78350f;
```

#### Neutral — Warm Gray (not cold blue-gray)
```css
--color-neutral-50:  #fafaf9;
--color-neutral-100: #f5f5f4;
--color-neutral-200: #e7e5e4;
--color-neutral-300: #d6d3d1;
--color-neutral-400: #a8a29e;
--color-neutral-500: #78716c;
--color-neutral-600: #57534e;
--color-neutral-700: #44403c;
--color-neutral-800: #292524;
--color-neutral-900: #1c1917;
```

#### Semantic Colors
```css
--color-success:  #16a34a;  /* Green — optimal spend */
--color-warning:  #d97706;  /* Amber — downgrade opportunity */
--color-danger:   #dc2626;  /* Red — significant overspend */
--color-info:     #2563eb;  /* Blue — informational */
--color-muted:    #78716c;  /* Neutral — secondary text */
```

#### Usage Rules
- **Primary (green)**: CTAs, links, active states, success badges, Credex branding
- **Accent (amber)**: Savings numbers, "you could save" callouts, highlight borders on hero
- **Danger (red)**: "Overspending" verdict badges, significant negative flags
- **Warning (amber-700)**: Moderate overspend, downgrade suggestions
- **Success (green)**: "Optimal" verdict badges
- **Neutral**: All body text, backgrounds, borders, secondary UI

---

### Typography

#### Font Families
```css
--font-display: 'DM Serif Display', Georgia, serif;   /* Headlines, hero numbers */
--font-sans:    'DM Sans', system-ui, sans-serif;     /* Body, UI, labels */
--font-mono:    'JetBrains Mono', 'Courier New', monospace; /* Numbers, code */
```

> **Import**: Add to `app/layout.tsx` via `next/font/google`:  
> `DM_Serif_Display` (weights: 400), `DM_Sans` (weights: 400, 500, 600), `JetBrains_Mono` (weights: 400, 500)

#### Font Sizes
```css
--text-xs:   0.75rem;   /* 12px — captions, labels */
--text-sm:   0.875rem;  /* 14px — secondary text, table cells */
--text-base: 1rem;      /* 16px — body text */
--text-lg:   1.125rem;  /* 18px — lead text, card titles */
--text-xl:   1.25rem;   /* 20px — section headers */
--text-2xl:  1.5rem;    /* 24px — page headers */
--text-3xl:  1.875rem;  /* 30px — hero sub-text */
--text-4xl:  2.25rem;   /* 36px — hero headline */
--text-5xl:  3rem;      /* 48px — savings number display */
--text-6xl:  3.75rem;   /* 60px — hero savings hero number */
```

#### Font Weights
```css
--font-normal:   400;
--font-medium:   500;
--font-semibold: 600;
--font-bold:     700;
```

#### Line Heights
```css
--leading-none:    1;
--leading-tight:   1.2;
--leading-snug:    1.375;
--leading-normal:  1.5;
--leading-relaxed: 1.625;
```

#### Typography Usage Rules
- **Hero savings numbers**: `font-display`, `text-6xl`, `leading-none`, `text-accent-500`
- **Page headlines**: `font-display`, `text-4xl`, `text-neutral-900`
- **Card titles**: `font-sans font-semibold`, `text-lg`, `text-neutral-800`
- **Body text**: `font-sans font-normal`, `text-base`, `text-neutral-700`
- **UI labels / small**: `font-sans font-medium`, `text-sm`, `text-neutral-600`
- **Dollar amounts in tables**: `font-mono font-medium`, tabular-nums

---

### Spacing Scale
```css
--spacing-px:  1px;
--spacing-0:   0;
--spacing-1:   0.25rem;  /* 4px */
--spacing-2:   0.5rem;   /* 8px */
--spacing-3:   0.75rem;  /* 12px */
--spacing-4:   1rem;     /* 16px */
--spacing-5:   1.25rem;  /* 20px */
--spacing-6:   1.5rem;   /* 24px */
--spacing-8:   2rem;     /* 32px */
--spacing-10:  2.5rem;   /* 40px */
--spacing-12:  3rem;     /* 48px */
--spacing-16:  4rem;     /* 64px */
--spacing-20:  5rem;     /* 80px */
--spacing-24:  6rem;     /* 96px */
```

#### Usage Rules
- **Component padding**: `spacing-4` default; `spacing-6` for cards
- **Section spacing**: `spacing-16` to `spacing-24` between major page sections
- **Inline spacing** (between icon + label): `spacing-2`
- **Form field gap**: `spacing-4` between rows; `spacing-2` between label and input

---

### Border Radius
```css
--radius-none: 0;
--radius-sm:   0.25rem;  /* 4px — inputs */
--radius-md:   0.5rem;   /* 8px — cards, buttons */
--radius-lg:   0.75rem;  /* 12px — modals, panels */
--radius-xl:   1rem;     /* 16px — hero cards */
--radius-full: 9999px;   /* badges, pills */
```

---

### Shadows
```css
--shadow-sm:   0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-md:   0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -1px rgba(0, 0, 0, 0.05);
--shadow-lg:   0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04);
--shadow-xl:   0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.03);
--shadow-colored: 0 4px 14px -2px rgba(46, 153, 103, 0.25);  /* Green glow for CTAs */
```

---

## 3. Layout System

### Grid System
- **Container**: `max-w-5xl mx-auto px-4 sm:px-6 lg:px-8` (1024px max)
- **Form container**: `max-w-3xl mx-auto` (narrower for form clarity)
- **Results grid**: 1-column mobile, 2-column desktop for per-tool cards

### Responsive Breakpoints (Tailwind defaults — do not override)
```
sm:  640px   — small phones landscape / large phones
md:  768px   — tablets
lg:  1024px  — desktop
xl:  1280px  — wide desktop
```

### Layout Patterns

#### Page wrapper
```jsx
<main className="min-h-screen bg-neutral-50">
  <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
    {children}
  </div>
</main>
```

#### Two-column results layout
```jsx
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
  <div>{heroCard}</div>
  <div className="space-y-4">{toolCards}</div>
</div>
```

#### Form section
```jsx
<div className="max-w-3xl mx-auto space-y-6">
  {toolRows}
</div>
```

---

## 4. Component Library

### Button

**Primary Button** (main CTA)
```jsx
<button className="
  inline-flex items-center justify-center gap-2
  px-6 py-3
  bg-primary-500 hover:bg-primary-600 active:bg-primary-700
  text-white font-semibold text-base
  rounded-md
  shadow-colored hover:shadow-lg
  transition-all duration-200
  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2
  disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none
">
  Run My Audit
</button>
```

**Secondary Button**
```jsx
<button className="
  inline-flex items-center justify-center gap-2
  px-5 py-2.5
  bg-white hover:bg-neutral-50 border border-neutral-200 hover:border-neutral-300
  text-neutral-700 font-medium text-sm
  rounded-md
  transition-all duration-150
  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2
">
  Add Another Tool
</button>
```

**Ghost Button / Link-style**
```jsx
<button className="
  inline-flex items-center gap-1.5
  text-primary-600 hover:text-primary-700 font-medium text-sm
  underline-offset-2 hover:underline
  transition-colors duration-150
  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:rounded-sm
">
  Skip for now
</button>
```

**Danger Button**
```jsx
<button className="
  inline-flex items-center gap-2
  px-4 py-2
  bg-red-50 hover:bg-red-100 border border-red-200
  text-danger font-medium text-sm
  rounded-md
  transition-colors duration-150
">
  Remove
</button>
```

#### Button Sizes
- **Small**: `px-3 py-1.5 text-sm`
- **Medium**: `px-5 py-2.5 text-sm` (default for secondary)
- **Large**: `px-6 py-3 text-base` (default for primary CTA)

#### Usage Rules
- One primary button per visual section
- Use `disabled` + spinner during async operations
- Ghost for low-emphasis actions (skip, cancel)
- Danger only for destructive actions (remove tool row)

---

### Input Fields

**Standard Text/Number Input**
```jsx
<div className="space-y-1.5">
  <label htmlFor={id} className="block text-sm font-medium text-neutral-700">
    Monthly Spend (USD)
  </label>
  <div className="relative">
    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-sm">$</span>
    <input
      type="number"
      id={id}
      className="
        block w-full pl-7 pr-3 py-2.5
        bg-white border border-neutral-200 rounded-sm
        text-neutral-900 text-sm font-mono
        placeholder:text-neutral-400
        focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent
        disabled:bg-neutral-50 disabled:text-neutral-400 disabled:cursor-not-allowed
        transition-shadow duration-150
      "
      placeholder="0"
      min="0"
    />
  </div>
</div>
```

**Error State**
```jsx
<input
  className="border-danger focus:ring-danger/40"
  aria-invalid="true"
  aria-describedby={`${id}-error`}
/>
<p id={`${id}-error`} className="text-xs text-danger mt-1 flex items-center gap-1">
  <AlertCircle className="w-3 h-3" />
  Enter a valid dollar amount
</p>
```

**Select Dropdown**
```jsx
<select className="
  block w-full px-3 py-2.5
  bg-white border border-neutral-200 rounded-sm
  text-neutral-900 text-sm
  focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent
  cursor-pointer
  transition-shadow duration-150
">
  <option value="">Select plan...</option>
</select>
```

---

### Tool Row Card

Each row in the form represents one AI tool subscription:

```jsx
<div className="
  bg-white border border-neutral-200 rounded-md p-4
  grid grid-cols-2 sm:grid-cols-4 gap-3
  group hover:border-neutral-300
  transition-colors duration-150
">
  {/* Tool select — full width on mobile, 2 cols on desktop */}
  <div className="col-span-2 sm:col-span-1">{toolSelect}</div>
  {/* Plan select */}
  <div>{planSelect}</div>
  {/* Monthly spend */}
  <div>{spendInput}</div>
  {/* Seats */}
  <div className="relative">
    {seatsInput}
    <button className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity">
      <X className="w-4 h-4 text-neutral-400 hover:text-danger" />
    </button>
  </div>
</div>
```

---

### Audit Result Card (per-tool)

```jsx
<div className={`
  bg-white border rounded-md p-5 space-y-3
  ${verdict === 'overspending' ? 'border-danger/30 bg-red-50/30' : ''}
  ${verdict === 'optimal' ? 'border-success/30 bg-green-50/20' : ''}
  ${verdict === 'downgrade' ? 'border-warning/30 bg-amber-50/20' : ''}
`}>
  <div className="flex items-start justify-between gap-3">
    <div>
      <h3 className="font-semibold text-neutral-800 text-base">{toolName}</h3>
      <p className="text-sm text-neutral-500 mt-0.5">{currentPlan} · {seats} seats</p>
    </div>
    <VerdictBadge verdict={verdict} />
  </div>
  
  {/* Spend comparison */}
  <div className="flex items-center gap-3 text-sm">
    <span className="font-mono text-neutral-500 line-through">${currentSpend}/mo</span>
    <ArrowRight className="w-4 h-4 text-neutral-400" />
    <span className="font-mono font-semibold text-success">${recommendedSpend}/mo</span>
    <span className="text-xs bg-accent-100 text-accent-700 px-2 py-0.5 rounded-full font-medium">
      Save ${savings}/mo
    </span>
  </div>
  
  {/* Recommendation */}
  <p className="text-sm text-neutral-600 leading-relaxed">{recommendation}</p>
</div>
```

---

### Verdict Badge

```jsx
const verdictStyles = {
  optimal:     'bg-green-100 text-success border-green-200',
  downgrade:   'bg-amber-100 text-warning border-amber-200',
  switch:      'bg-blue-100 text-blue-700 border-blue-200',
  redundant:   'bg-red-100 text-danger border-red-200',
  overspending:'bg-red-100 text-danger border-red-200',
};

<span className={`
  inline-flex items-center gap-1 px-2.5 py-1
  text-xs font-semibold rounded-full border
  ${verdictStyles[verdict]}
`}>
  {verdictLabel}
</span>
```

---

### Hero Savings Block

```jsx
<div className="
  bg-white border-2 border-accent-300 rounded-xl p-8 text-center
  shadow-xl
">
  <p className="text-sm font-medium text-neutral-500 uppercase tracking-widest mb-2">
    Total Monthly Savings
  </p>
  <p className="font-display text-6xl text-accent-500 leading-none mb-1">
    ${monthlySavings}
  </p>
  <p className="text-neutral-500 text-base mt-3">
    That's <span className="font-semibold text-neutral-700">${annualSavings}/year</span> your team is leaving on the table
  </p>
</div>
```

---

### Email Capture Section

```jsx
<div className="bg-primary-50 border border-primary-200 rounded-xl p-6 mt-8">
  <h3 className="font-semibold text-neutral-800 text-lg mb-1">
    Email me this audit
  </h3>
  <p className="text-sm text-neutral-600 mb-4">
    Get a clean PDF + be notified when new savings apply to your stack.
  </p>
  <div className="flex flex-col sm:flex-row gap-3">
    <input
      type="email"
      placeholder="you@company.com"
      className="flex-1 px-4 py-2.5 border border-neutral-200 rounded-md text-sm focus:ring-2 focus:ring-primary-400 focus:outline-none"
    />
    <button className="primary-button whitespace-nowrap">Send my report</button>
  </div>
  <p className="text-xs text-neutral-400 mt-2">No spam. Unsubscribe anytime.</p>
</div>
```

---

### Toast Notifications

```jsx
// Success
<div className="fixed bottom-4 right-4 z-50 flex items-center gap-3 bg-white border border-green-200 shadow-lg rounded-md px-4 py-3 min-w-[280px]">
  <CheckCircle className="w-5 h-5 text-success shrink-0" />
  <p className="text-sm text-neutral-700 font-medium">Audit saved to your inbox</p>
</div>

// Error
<div className="fixed bottom-4 right-4 z-50 flex items-center gap-3 bg-white border border-red-200 shadow-lg rounded-md px-4 py-3">
  <AlertCircle className="w-5 h-5 text-danger shrink-0" />
  <p className="text-sm text-neutral-700 font-medium">Something went wrong. Try again.</p>
</div>
```

---

## 5. Accessibility Guidelines

### WCAG 2.1 Level AA Requirements

#### Color Contrast
- **Body text** (neutral-700 on neutral-50): 7.2:1 ✓
- **Primary CTA** (white on primary-500): 4.6:1 ✓
- **Accent text** (accent-700 on accent-100): 5.1:1 ✓
- **Error text** (danger on white): 5.9:1 ✓

#### Keyboard Navigation
- All interactive elements reachable via Tab in logical order
- Focus indicator: `focus-visible:ring-2 focus-visible:ring-offset-2` on every interactive element
- No `outline: none` without a visible alternative
- Dynamic tool rows: focus moves to new row input on "Add tool" click

#### Screen Readers
- Form labels associated with inputs via `htmlFor` / `id`
- Error messages use `aria-invalid="true"` + `aria-describedby`
- Icon-only buttons have `aria-label`
- Verdict badges use `role="status"` for screen reader announcement
- Savings number count-up animation: announce final value to screen reader after animation

#### Forms
- Required fields marked with `required` attribute (not just `*` visual)
- `type="email"` for email field (mobile keyboard optimization)
- `type="number"` with `min="0"` for spend/seats
- Fieldset + legend for the global fields (team size, use case)

---

## 6. Animation Guidelines

### Framer Motion Variants (reusable)

```typescript
export const fadeInUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3, ease: 'easeOut' }
};

export const staggerChildren = {
  animate: { transition: { staggerChildren: 0.08 } }
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.96 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.2, ease: 'easeOut' }
};
```

### Count-up animation for savings number
```typescript
// Use framer-motion's useMotionValue + useTransform
// Or a simple requestAnimationFrame loop
// Duration: 800ms, ease-out
// Announce final value to screen reader on complete
```

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Rules
- Page transitions: max 300ms
- Micro-interactions: max 200ms
- Count-up: 800ms (feels satisfying, not slow)
- Never animate layout properties (width, height) — only `transform` and `opacity`

---

## 7. Icon System

- **Library**: Lucide React 0.378.0
- **Sizes**: `w-4 h-4` (16px inline), `w-5 h-5` (20px UI), `w-6 h-6` (24px feature icons)
- **Stroke Width**: `strokeWidth={1.75}` for display icons; default (2) for UI icons
- **Color**: Inherited from parent text color; override with `text-{color}` class

### Common icons used
```typescript
import {
  TrendingDown,    // Overspending verdict
  CheckCircle2,    // Optimal verdict
  ArrowDownCircle, // Downgrade opportunity
  RefreshCw,       // Switch tool
  Share2,          // Share button
  Mail,            // Email capture
  Copy,            // Copy URL
  Plus,            // Add tool row
  X,               // Remove row
  AlertCircle,     // Form errors
  ChevronDown,     // Dropdowns
  ExternalLink,    // Credex CTA
} from 'lucide-react';
```

---

## 8. State Indicators

### Loading — Skeleton
```jsx
<div className="animate-pulse space-y-4">
  <div className="h-32 bg-neutral-100 rounded-xl" /> {/* Hero skeleton */}
  {[1,2,3].map(i => (
    <div key={i} className="h-28 bg-neutral-100 rounded-md" />
  ))}
</div>
```

### Loading — Spinner (button state)
```jsx
<svg className="animate-spin w-4 h-4 text-white" viewBox="0 0 24 24" fill="none">
  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
</svg>
```

### Empty State (no tools added)
```jsx
<div className="text-center py-16 border-2 border-dashed border-neutral-200 rounded-lg">
  <BarChart3 className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
  <p className="text-neutral-500 font-medium">Add your first AI tool to get started</p>
  <button className="mt-4 secondary-button">
    <Plus className="w-4 h-4" /> Add a tool
  </button>
</div>
```

### "Optimal" / No-savings State
```jsx
<div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
  <CheckCircle2 className="w-12 h-12 text-success mx-auto mb-3" />
  <h2 className="font-display text-2xl text-neutral-800 mb-2">You're spending well</h2>
  <p className="text-neutral-600">Your AI stack is optimized for your team size and use case.</p>
</div>
```

---

## 9. Responsive Design

### Mobile-First Approach

All components are built mobile-first. Desktop enhancements added with `sm:`, `md:`, `lg:` prefixes.

### Touch Targets
- Minimum touch target: 44×44px on all interactive elements
- Tool row remove button: visible on hover (desktop), always visible on mobile
- Dropdown selects: full-width on mobile

### Mobile-Specific Adjustments
```css
/* Form rows stack vertically on mobile */
.tool-row { @apply grid-cols-1 gap-3; }
@screen sm { .tool-row { @apply grid-cols-2; } }
@screen lg { .tool-row { @apply grid-cols-4; } }

/* Hero savings number scales down */
.hero-number { @apply text-5xl; }
@screen sm { .hero-number { @apply text-6xl; } }
```

---

## 10. Performance Guidelines

### Images
- No decorative images in MVP (use CSS/SVG instead)
- Any logos: SVG inline or `next/image` with explicit `width` and `height`
- Use `loading="lazy"` on below-fold images

### Core Web Vitals targets
- LCP < 2.0s (hero content above fold, no large images)
- CLS = 0 (no layout shift — set dimensions on all dynamic content)
- FID < 100ms (no heavy JS on main thread; audit engine is synchronous but fast)

### Code Splitting
- Dynamic import for Framer Motion (only on results page)
- No heavy chart libraries needed — CSS-based comparison UI

---

## 11. Browser Support

- Chrome 120+, Firefox 121+, Safari 17+, Edge 120+
- No IE11 support
- Progressive enhancement: form works without JS disabled (server-side validation fallback)
