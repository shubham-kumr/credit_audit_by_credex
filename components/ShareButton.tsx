'use client';

import { useState } from 'react';
import { Copy, Share2 } from 'lucide-react';

interface Props {
  url: string;
}

export default function ShareButton({ url }: Props) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    // Web Share API on mobile
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My AI Spend Audit — SpendLens',
          text: 'I just audited my team\'s AI tool spend. Check it out!',
          url,
        });
        return;
      } catch {
        // User cancelled or API unavailable — fall through to clipboard
      }
    }

    // Clipboard fallback
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked — show the URL
      prompt('Copy this link:', url);
    }
  }

  return (
    <button
      onClick={handleShare}
      className="btn-secondary gap-2"
      aria-label="Share audit link"
      id="share-audit-btn"
    >
      {copied ? (
        <>
          <Copy className="w-4 h-4 text-success" />
          <span className="text-success">Copied!</span>
        </>
      ) : (
        <>
          <Share2 className="w-4 h-4" />
          Share this audit
        </>
      )}
    </button>
  );
}
