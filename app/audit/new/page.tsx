import type { Metadata } from 'next';
import Link from 'next/link';
import SpendForm from '@/components/SpendForm';

export const metadata: Metadata = {
  title: 'Audit Your AI Spend — SpendLens',
  description: 'Enter your team\'s AI tool subscriptions to get a free, instant audit with specific savings recommendations.',
};

export default function AuditNewPage() {
  return (
    <div className="page-wrapper">
      {/* Nav */}
      <nav className="border-b border-neutral-200 bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container-lg flex items-center justify-between h-14">
          <Link href="/" className="font-display text-xl text-primary-600 tracking-tight hover:text-primary-700 transition-colors">
            SpendLens
          </Link>
          <span className="text-xs text-neutral-400">Step 1 of 2 — Enter your tools</span>
        </div>
      </nav>

      <main className="container-md py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl sm:text-4xl text-neutral-900 mb-3">
            Audit your AI tool spend
          </h1>
          <p className="text-neutral-600 leading-relaxed">
            Add each AI subscription your team pays for. We&apos;ll flag redundancies, wrong plan tiers, and cheaper alternatives — with exact dollar savings.
          </p>
        </div>

        {/* Restore banner is handled by the form store's localStorage persistence */}

        {/* The form */}
        <SpendForm />
      </main>
    </div>
  );
}
