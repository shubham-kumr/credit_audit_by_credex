'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQS = [
  {
    q: 'Is this really free?',
    a: 'Yes, completely free. SpendLens is a tool built by Credex to help teams audit their AI spend. No credit card, no login required.',
  },
  {
    q: 'How accurate is the pricing data?',
    a: 'All pricing is sourced directly from official vendor pages (Cursor, Anthropic, OpenAI, GitHub, Google, Windsurf) and verified as of May 2025. Each price entry includes its source URL. Pricing changes quarterly — always double-check before cancelling subscriptions.',
  },
  {
    q: 'Does my data get stored?',
    a: 'Your tool spend data is saved to generate your shareable audit URL. No email or personal information is collected until you optionally submit the email capture form. Your data is never sold.',
  },
  {
    q: 'What AI tools does the audit cover?',
    a: 'Cursor, GitHub Copilot, Claude (Anthropic), ChatGPT (OpenAI), Anthropic API, OpenAI API, Google Gemini, and Windsurf. More tools will be added based on demand.',
  },
  {
    q: 'What is Credex and why are they offering this?',
    a: 'Credex helps startups and engineering teams access AI tool credits at discounted rates. SpendLens surfaces where you\'re overpaying so we can help you spend smarter — sometimes through Credex credits at up to 30% off official pricing.',
  },
];

export default function FaqAccordion() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="space-y-2" id="faq">
      {FAQS.map((faq, i) => (
        <div key={i} className="border border-neutral-200 rounded-md overflow-hidden bg-white">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-neutral-50 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-400"
            aria-expanded={open === i}
            id={`faq-btn-${i}`}
            aria-controls={`faq-panel-${i}`}
          >
            <span className="font-medium text-neutral-800 text-sm pr-4">{faq.q}</span>
            <ChevronDown
              className={`w-4 h-4 text-neutral-400 shrink-0 transition-transform duration-200 ${open === i ? 'rotate-180' : ''}`}
            />
          </button>
          {open === i && (
            <div
              id={`faq-panel-${i}`}
              role="region"
              aria-labelledby={`faq-btn-${i}`}
              className="px-5 pb-4 text-sm text-neutral-600 leading-relaxed border-t border-neutral-100 pt-3 animate-slide-down"
            >
              {faq.a}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
