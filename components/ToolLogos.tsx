'use client';

const TOOLS = [
  { name: 'Cursor',         slug: 'cursor' },
  { name: 'GitHub Copilot', slug: 'githubcopilot' },
  { name: 'Claude',         slug: 'anthropic' },
  { name: 'ChatGPT',        slug: 'chatgpt' },
  { name: 'Anthropic API',  slug: 'anthropic' },
  { name: 'OpenAI API',     slug: 'openai' },
  { name: 'Gemini',         slug: 'googlegemini' },
  { name: 'Windsurf',       slug: 'windsurf' },
];

const OpenAISVG = (
  <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" aria-hidden="true" fill="#78716c">
    <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zm-9.023 12.644a4.478 4.478 0 0 1-2.88-1.044l.142-.081 4.779-2.759a.795.795 0 0 0 .4-.69v-6.741l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.5 4.512zm-9.678-4.131a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.032.067L9.56 19.238a4.503 4.503 0 0 1-6.08-1.917zm-1.3-10.853A4.469 4.469 0 0 1 4.541 5.54l-.016.087v5.518a.805.805 0 0 0 .402.694l5.835 3.365-2.02 1.168a.076.076 0 0 1-.071 0L4.15 13.79a4.501 4.501 0 0 1-.865-7.51zm16.625 3.862-5.843-3.369 2.02-1.163a.076.076 0 0 1 .071 0l4.521 2.607a4.502 4.502 0 0 1-.697 8.137v-5.518a.799.799 0 0 0-.072-.694zm2.01-3.023-.143-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.37 8.87V6.537a.071.071 0 0 1 .028-.061l4.519-2.607a4.496 4.496 0 0 1 6.068 1.945zm-12.64 4.135-2.02-1.164a.08.08 0 0 1-.038-.057V6.537a4.496 4.496 0 0 1 7.375-3.453l-.142.08-4.778 2.758a.795.795 0 0 0-.397.69zm1.097-2.365 2.602-1.5 2.6 1.497v2.994l-2.597 1.5-2.605-1.5z" />
  </svg>
);

const SVG_FALLBACKS: Record<string, React.ReactNode> = {
  chatgpt: OpenAISVG,
  openai:  OpenAISVG,
  windsurf: (
    <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 shrink-0" aria-hidden="true">
      <path d="M3 18 L12 4 L21 18 Z" fill="#78716c" opacity="0.85" />
      <path d="M6 18 L12 8 L18 18 Z" fill="#78716c" opacity="0.4" />
    </svg>
  ),
};

export default function ToolLogos() {
  return (
    <div className="flex items-center justify-center flex-wrap gap-x-6 gap-y-3" aria-label="Supported AI tools">
      {TOOLS.map(({ name, slug }) => {
        const fallback = SVG_FALLBACKS[slug];
        return (
          <div key={name} className="flex items-center gap-1.5">
            {fallback ? (
              fallback
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={`https://cdn.simpleicons.org/${slug}/78716c`}
                alt={`${name} logo`}
                width={16}
                height={16}
                className="w-4 h-4 object-contain shrink-0"
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
              />
            )}
            <span className="text-sm text-neutral-500 whitespace-nowrap">{name}</span>
          </div>
        );
      })}
    </div>
  );
}
