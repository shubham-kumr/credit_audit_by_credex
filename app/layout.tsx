import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'SpendLens — Free AI Tool Spend Auditor',
  description:
    'Find out if your team is overpaying for AI tools. Get a free, instant audit of your AI subscriptions — Cursor, Copilot, Claude, ChatGPT, and more.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'https://spendlens.vercel.app'),
  openGraph: {
    title: 'SpendLens — Free AI Tool Spend Auditor',
    description: 'Is your team overpaying for AI tools? Find out in 2 minutes.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SpendLens — Free AI Tool Spend Auditor',
    description: 'Is your team overpaying for AI tools? Find out in 2 minutes.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={inter.variable}
    >
      <body className="font-sans bg-neutral-50 text-neutral-900 antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
