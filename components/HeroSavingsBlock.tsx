'use client';

import { useEffect, useRef, useState } from 'react';

interface Props {
  monthlySavings: number;
  annualSavings: number;
}

function useCountUp(target: number, duration = 800) {
  const [value, setValue] = useState(0);
  const raf = useRef<number>(0);

  useEffect(() => {
    if (target === 0) { setValue(0); return; }
    const start = performance.now();
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) raf.current = requestAnimationFrame(animate);
    };
    raf.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf.current);
  }, [target, duration]);

  return value;
}

export default function HeroSavingsBlock({ monthlySavings, annualSavings }: Props) {
  const monthly = useCountUp(monthlySavings);
  const annual = useCountUp(annualSavings);
  const isOptimal = monthlySavings === 0;

  if (isOptimal) {
    return (
      <div className="bg-green-50 border-2 border-green-200 rounded-xl p-8 text-center">
        <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="font-display text-2xl text-neutral-800 mb-2">You&apos;re spending well</h2>
        <p className="text-neutral-600 text-sm">
          Your AI stack is optimized for your team size and use case. No significant savings identified.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border-2 border-accent-300 rounded-xl p-8 text-center shadow-xl">
      <p className="text-xs font-semibold text-neutral-400 uppercase tracking-widest mb-3">
        Total Monthly Savings
      </p>
      <p
        className="font-display text-6xl text-accent-500 leading-none mb-1 tabular-nums"
        aria-label={`$${monthlySavings} per month`}
      >
        ${monthly.toLocaleString()}
      </p>
      <p className="text-neutral-500 text-base mt-4">
        That&apos;s{' '}
        <span className="font-semibold text-neutral-700">
          ${annual.toLocaleString()}/year
        </span>{' '}
        your team is leaving on the table
      </p>
    </div>
  );
}
