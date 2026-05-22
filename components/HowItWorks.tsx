'use client';

import { useState } from 'react';

const STEPS = [
  {
    number: '01',
    title: 'Enter your AI tools & what you pay.',
    description:
      'Add each subscription — tool, plan, monthly spend, and seat count. The form takes under 2 minutes. Your data is auto-saved so you can pick up where you left off.',
    visual: (
      <div className="bg-white rounded-lg border border-neutral-200 p-5 space-y-3 font-mono text-xs">
        <p className="text-xs font-semibold text-neutral-400 uppercase tracking-widest mb-4">Your tools</p>
        {[
          { tool: 'Cursor', plan: 'Business', spend: '$200', seats: '5' },
          { tool: 'GitHub Copilot', plan: 'Enterprise', spend: '$195', seats: '5' },
          { tool: 'Claude', plan: 'Team', spend: '$150', seats: '5' },
        ].map((row, i) => (
          <div key={i} className="grid grid-cols-4 gap-2 items-center py-2 border-b border-neutral-100 last:border-0">
            <span className="text-neutral-800 font-medium text-xs col-span-1">{row.tool}</span>
            <span className="text-neutral-500 text-xs">{row.plan}</span>
            <span className="text-neutral-800 font-semibold text-xs">{row.spend}<span className="text-neutral-400 font-normal">/mo</span></span>
            <span className="text-neutral-400 text-xs">{row.seats} seats</span>
          </div>
        ))}
        <div className="pt-2">
          <div className="inline-flex items-center gap-1.5 text-xs text-neutral-400 border border-dashed border-neutral-200 rounded px-3 py-1.5">
            <span className="text-base leading-none">+</span> Add another tool
          </div>
        </div>
      </div>
    ),
  },
  {
    number: '02',
    title: 'Get an instant, specific audit.',
    description:
      'Our engine runs the numbers immediately — no waiting. It checks every tool against official pricing, flags redundancies, and calculates exact dollar savings per tool.',
    visual: (
      <div className="space-y-3">
        <div className="bg-white rounded-lg border-2 border-accent-300 p-4 text-center">
          <p className="text-xs text-neutral-400 uppercase tracking-widest mb-1">Monthly Savings Found</p>
          <p className="text-4xl font-bold text-accent-500">$345</p>
          <p className="text-xs text-neutral-500 mt-1">$4,140 / year</p>
        </div>
        {[
          { tool: 'Cursor + Copilot', verdict: 'Redundant', savings: '$195', color: 'text-red-600 bg-red-50 border-red-200' },
          { tool: 'Claude Team', verdict: 'Downgrade', savings: '$150', color: 'text-amber-600 bg-amber-50 border-amber-200' },
          { tool: 'ChatGPT Plus', verdict: 'Optimal', savings: '—', color: 'text-green-600 bg-green-50 border-green-200' },
        ].map((item, i) => (
          <div key={i} className="bg-white rounded border border-neutral-200 px-4 py-3 flex items-center justify-between">
            <span className="text-sm font-medium text-neutral-700">{item.tool}</span>
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-neutral-600">{item.savings}</span>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${item.color}`}>{item.verdict}</span>
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    number: '03',
    title: 'Share with your team & act on it.',
    description:
      'Every audit gets a permanent shareable link. Send it to your finance lead or CTO. High-savings teams get a free Credex consultation to unlock even more savings through AI credits.',
    visual: (
      <div className="space-y-4">
        <div className="bg-white rounded-lg border border-neutral-200 p-5">
          <p className="text-xs text-neutral-400 mb-3 font-semibold uppercase tracking-widest">Your audit link</p>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-neutral-50 border border-neutral-200 rounded px-3 py-2 font-mono text-xs text-neutral-500 truncate">
              spendlens.app/audit/a3f2b9c1…
            </div>
            <button className="shrink-0 bg-primary-500 text-white text-xs font-semibold px-3 py-2 rounded hover:bg-primary-600 transition-colors">
              Copy
            </button>
          </div>
        </div>
        <div className="bg-primary-50 border border-primary-200 rounded-lg p-5">
          <p className="text-xs font-semibold text-primary-700 uppercase tracking-widest mb-2">High savings detected</p>
          <p className="text-sm text-neutral-700 leading-relaxed">
            Your team qualifies for a free Credex consultation. We can often unlock an additional 20%+ through AI credits.
          </p>
          <a href="#" className="inline-flex items-center gap-1.5 text-sm text-primary-600 font-semibold mt-3 hover:underline">
            Book free consultation →
          </a>
        </div>
      </div>
    ),
  },
];

export default function HowItWorks() {
  const [active, setActive] = useState(0);

  return (
    <section className="container-lg py-24">
      {/* Section header */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-50 border border-primary-200 rounded-full text-xs font-semibold text-primary-600 uppercase tracking-widest mb-4">
          How it works
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900">
          From subscriptions to savings<br />in under 2 minutes.
        </h2>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Left — step list */}
        <div className="space-y-0 divide-y divide-neutral-200 border-t border-neutral-200">
          {STEPS.map((step, i) => {
            const isActive = active === i;
            return (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`w-full text-left px-0 py-6 transition-all duration-200 focus-visible:outline-none group ${isActive ? '' : 'hover:opacity-80'}`}
              >
                <p className={`text-xs font-bold uppercase tracking-widest mb-2 transition-colors ${isActive ? 'text-primary-500' : 'text-neutral-300'}`}>
                  Step {step.number}
                </p>
                <h3 className={`text-xl font-bold leading-snug transition-colors ${isActive ? 'text-neutral-900' : 'text-neutral-400'}`}>
                  {step.title}
                </h3>
                {isActive && (
                  <p className="text-neutral-600 text-sm leading-relaxed mt-3 animate-fade-in">
                    {step.description}
                  </p>
                )}
              </button>
            );
          })}
        </div>

        {/* Right — visual card */}
        <div className="lg:sticky lg:top-24">
          <div className="animate-fade-in" key={active}>
            {STEPS[active].visual}
          </div>
        </div>
      </div>
    </section>
  );
}
