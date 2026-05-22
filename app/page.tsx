import Link from 'next/link';
import { ArrowRight, TrendingDown } from 'lucide-react';
import FaqAccordion from '@/components/FaqAccordion';
import ToolLogos from '@/components/ToolLogos';
import HowItWorks from '@/components/HowItWorks';

export default function LandingPage() {
  return (
    <div className="page-wrapper">
      {/* ── Nav ───────────────────────────────────────────────── */}
      <nav className="border-b border-neutral-200 bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container-lg flex items-center h-14">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-xl text-primary-600 tracking-tight">SpendLens</span>
            <span className="text-sm text-neutral-400">by <a href="https://credex.rocks" target="_blank" rel="noopener noreferrer" className="text-primary-500 hover:underline">Credex</a></span>
          </div>
        </div>
      </nav>

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="container-lg pt-20 pb-12 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent-100 text-accent-700 rounded-full text-xs font-semibold mb-6 border border-accent-200">
          <TrendingDown className="w-3.5 h-3.5" />
          Teams save $200–$2,000/month on average
        </div>

        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-neutral-900 leading-tight max-w-3xl mx-auto mb-6">
          Is your team overpaying for{' '}
          <span className="text-primary-500">AI tools?</span>
        </h1>

        <p className="text-lg text-neutral-600 max-w-xl mx-auto mb-10 leading-relaxed">
          Enter your AI subscriptions and get an instant, free audit — with specific savings recommendations your finance team will trust.
        </p>

        <Link href="/audit/new" id="hero-cta" className="btn-primary text-base px-8 py-4 inline-flex">
          Start Free Audit
          <ArrowRight className="w-5 h-5" />
        </Link>

        <p className="text-xs text-neutral-400 mt-4">No login · No credit card · 2 minutes</p>
      </section>

      {/* ── Tool logos — inline strip ──────────────────────────── */}
      <section className="border-y border-neutral-200 bg-neutral-50 py-4">
        <div className="container-lg">
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-widest shrink-0">Covers</span>
            <ToolLogos />
          </div>
        </div>
      </section>

      {/* ── How it works ──────────────────────────────────────── */}
      <HowItWorks />

      {/* ── FAQ ───────────────────────────────────────────────── */}
      <section className="bg-neutral-50 border-t border-neutral-200 py-20">
        <div className="container-lg">
          <h2 className="font-display text-3xl text-neutral-900 text-center mb-10">
            Frequently asked questions
          </h2>
          <div className="max-w-2xl mx-auto">
            <FaqAccordion />
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────── */}
      <footer className="border-t border-neutral-200 bg-white py-8">
        <div className="container-lg flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-neutral-400">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-neutral-600">SpendLens</span>
            <span>by <a href="https://credex.rocks" target="_blank" rel="noopener noreferrer" className="text-primary-500 hover:underline">Credex</a></span>
          </div>
          <span>AI spend intelligence for engineering teams</span>
        </div>
      </footer>
    </div>
  );
}
