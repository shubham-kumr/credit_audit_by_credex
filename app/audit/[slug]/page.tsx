'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { AuditOutput } from '@/lib/types';
import HeroSavingsBlock from '@/components/HeroSavingsBlock';
import AuditResultCard from '@/components/AuditResultCard';
import EmailCapture from '@/components/EmailCapture';
import ShareButton from '@/components/ShareButton';
import SkeletonLoader from '@/components/SkeletonLoader';

interface AuditData extends AuditOutput {
  slug: string;
  ai_summary: string | null;
  summary_generated: boolean;
}

export default function AuditResultsPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [data, setData] = useState<AuditData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isOwner, setIsOwner] = useState(false);

  const appUrl = typeof window !== 'undefined' ? window.location.href : '';

  useEffect(() => {
    async function load() {
      // 1. Check sessionStorage first (client just completed the form)
      const cached = sessionStorage.getItem(`audit_${slug}`);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          setData(parsed);
          setIsOwner(true);
          setLoading(false);

          // Try to fetch AI summary in background — silently skip if DB not ready
          fetch(`/api/audit/${slug}`, { cache: 'no-store' })
            .then((r) => {
              if (!r.ok) return null;
              return r.json();
            })
            .then((apiData) => {
              if (apiData?.ai_summary) {
                setData((prev) => prev ? { ...prev, ai_summary: apiData.ai_summary, summary_generated: true } : prev);
              }
            })
            .catch(() => {});
          return;
        } catch {}
      }

      // 2. Fetch from API (shared link visitor)
      try {
        const res = await fetch(`/api/audit/${slug}`);
        if (res.status === 404) {
          setError('404');
          setLoading(false);
          return;
        }
        if (!res.ok) throw new Error('Server error');
        const apiData = await res.json();
        setData(apiData);
        setIsOwner(false);
      } catch {
        setError('server');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [slug]);

  // ── Loading ───────────────────────────────────────────────
  if (loading) {
    return (
      <div className="page-wrapper">
        <NavBar />
        <main className="container-lg py-12">
          <SkeletonLoader />
        </main>
      </div>
    );
  }

  // ── 404 ───────────────────────────────────────────────────
  if (error === '404' || !data) {
    return (
      <div className="page-wrapper">
        <NavBar />
        <main className="container-md py-20 text-center">
          <p className="text-6xl mb-6">🔍</p>
          <h1 className="font-display text-3xl text-neutral-900 mb-3">Audit not found</h1>
          <p className="text-neutral-600 mb-8">This audit link has expired or doesn&apos;t exist.</p>
          <Link href="/audit/new" className="btn-primary">
            Run a new audit
          </Link>
        </main>
      </div>
    );
  }

  // ── Error ─────────────────────────────────────────────────
  if (error === 'server') {
    return (
      <div className="page-wrapper">
        <NavBar />
        <main className="container-md py-20 text-center">
          <p className="text-6xl mb-6">⚠️</p>
          <h1 className="font-display text-3xl text-neutral-900 mb-3">Something went wrong</h1>
          <p className="text-neutral-600 mb-8">We couldn&apos;t load this audit. Please try again.</p>
          <Link href="/audit/new" className="btn-primary">
            Start a new audit
          </Link>
        </main>
      </div>
    );
  }

  const { results, total_monthly_savings, total_annual_savings, savings_tier, ai_summary, summary_generated } = data;
  const isHighIntent = savings_tier === 'high_intent';
  const isOptimal = savings_tier === 'optimal';

  const summary = ai_summary ?? generateClientSummary(data);

  return (
    <div className="page-wrapper">
      <NavBar />

      <main className="container-lg py-12">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl text-neutral-900">Your AI Spend Audit</h1>
            <p className="text-neutral-500 text-sm mt-1">
              {results.length} tool{results.length !== 1 ? 's' : ''} reviewed
            </p>
          </div>
          <ShareButton url={appUrl} />
        </div>

        {/* Hero savings */}
        <HeroSavingsBlock
          monthlySavings={total_monthly_savings}
          annualSavings={total_annual_savings}
        />

        {/* AI Summary */}
        <div className="mt-6 p-5 bg-white border border-neutral-200 rounded-md">
          <p className="text-xs font-semibold text-neutral-400 uppercase tracking-widest mb-2">
            {summary_generated ? 'AI Analysis' : 'Analysis'}
          </p>
          <p className="text-neutral-700 leading-relaxed text-sm">{summary}</p>
        </div>

        {/* High-intent CTA */}
        {isHighIntent && (
          <div className="mt-6 p-6 bg-primary-500 text-white rounded-xl">
            <h2 className="font-display text-2xl mb-2">You could save ${total_monthly_savings.toFixed(0)}/month</h2>
            <p className="text-primary-100 text-sm mb-4 leading-relaxed">
              At this savings level, a free 20-minute Credex consultation can often unlock an additional 20%+ through our AI credit program.
            </p>
            <a
              href="https://credex.rocks"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white text-primary-600 font-semibold px-5 py-2.5 rounded-md hover:bg-primary-50 transition-colors"
              id="credex-cta"
            >
              Book a free Credex consultation
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        )}

        {/* Standard CTA */}
        {!isHighIntent && !isOptimal && (
          <div className="mt-6 p-5 bg-primary-50 border border-primary-200 rounded-xl flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <p className="font-semibold text-neutral-800 text-sm">Want to save even more?</p>
              <p className="text-neutral-600 text-xs mt-0.5">Credex can help unlock additional savings through AI credits.</p>
            </div>
            <a
              href="https://credex.rocks"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary text-sm shrink-0"
            >
              Learn about Credex <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}

        {/* Per-tool cards */}
        <div className="mt-8">
          <h2 className="font-semibold text-neutral-800 text-lg mb-4">Per-tool breakdown</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 stagger-children">
            {results.map((result, i) => (
              <AuditResultCard key={`${result.tool}-${i}`} result={result} index={i} />
            ))}
          </div>
        </div>

        {/* Email capture (own audit) or run your own CTA (shared) */}
        {isOwner ? (
          <EmailCapture auditId={slug} monthlySavings={total_monthly_savings} />
        ) : (
          <div className="mt-8 p-6 bg-neutral-100 border border-neutral-200 rounded-xl text-center">
            <h3 className="font-semibold text-neutral-800 text-lg mb-2">Run your own audit</h3>
            <p className="text-neutral-600 text-sm mb-4">
              Find out if your team is overpaying for AI tools — free and instant.
            </p>
            <Link href="/audit/new" className="btn-primary" id="run-own-audit-cta">
              Start my free audit
            </Link>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-200 mt-16 py-8">
        <div className="container-lg text-center text-xs text-neutral-400">
          SpendLens by{' '}
          <a href="https://credex.rocks" target="_blank" rel="noopener noreferrer" className="text-primary-500 hover:underline">
            Credex
          </a>
          {' '}· AI spend intelligence for engineering teams
        </div>
      </footer>
    </div>
  );
}

function NavBar() {
  return (
    <nav className="border-b border-neutral-200 bg-white/80 backdrop-blur-sm sticky top-0 z-40">
      <div className="container-lg flex items-center justify-between h-14">
        <Link href="/" className="font-display text-xl text-primary-600 tracking-tight hover:text-primary-700 transition-colors">
          SpendLens
        </Link>
        <Link href="/audit/new" className="btn-secondary text-xs py-1.5 px-3">
          New audit
        </Link>
      </div>
    </nav>
  );
}

// Client-side fallback summary (no AI)
function generateClientSummary(data: AuditData): string {
  const { results, total_monthly_savings, total_annual_savings } = data;
  if (total_monthly_savings === 0) {
    return 'Your AI tool stack appears well-optimized. Each tool is correctly sized with no significant redundancies or overspending patterns detected.';
  }
  const top = results.reduce((a, b) => (b.monthly_savings > a.monthly_savings ? b : a), results[0]);
  return `Your team's AI stack has ${results.length} tool${results.length > 1 ? 's' : ''} under review, and we've identified $${total_monthly_savings.toFixed(0)}/month ($${total_annual_savings.toFixed(0)}/year) in potential savings. The biggest opportunity is ${top?.recommended_action ?? 'optimizing your current plans'}. Acting on these recommendations could meaningfully reduce your AI spend without disrupting your team's workflow.`;
}
