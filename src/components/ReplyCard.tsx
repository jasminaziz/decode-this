import { useState } from 'react';

type Variant = 'diplomatic' | 'straight' | 'unhinged';

interface ReplyCardProps {
  variant: Variant;
  text: string;
  delayMs: number;
}

const VARIANT_STYLES: Record<Variant, string> = {
  // Quiet: no colour, just ink on beige. First rung of the intensity ladder.
  diplomatic: 'bg-white border-institutional-border text-ink',
  // Confident: Loudmouth Pink earns its keep here (The Latent Colour Rule
  // means it appears nowhere before this point in the whole interface).
  straight: 'bg-white border-loudmouth-pink text-ink',
  // Loudest: pink and yellow both present, the only place both appear at once.
  // Body text is Ink, not beige: beige-on-pink measures 2.97:1 and fails AA.
  unhinged: 'bg-loudmouth-pink border-ink text-ink -rotate-1',
};

// Text-safe tints: FF2E93 fails AA as small text on both white (3.46) and
// pink-on-pink isn't applicable, so straight uses the deep ink-pink tint.
// Yellow direct on pink measures 2.34 and fails outright (handled below with
// a stamp badge instead of plain text).
const VARIANT_LABEL_STYLES: Record<Variant, string> = {
  diplomatic: 'text-laminate-grey',
  straight: 'text-loudmouth-pink-ink',
  unhinged: '',
};

export function ReplyCard({ variant, text, delayMs }: ReplyCardProps) {
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'failed'>('idle');

  async function handleCopy() {
    // Clipboard access can be refused (in-app webviews, permissions); say so
    // rather than failing silently.
    try {
      await navigator.clipboard.writeText(text);
      setCopyState('copied');
    } catch {
      setCopyState('failed');
    }
    setTimeout(() => setCopyState('idle'), 1500);
  }

  return (
    <div
      className={`animate-reveal-in shadow-stamped border-2 p-4 ${VARIANT_STYLES[variant]}`}
      style={{ animationDelay: `${delayMs}ms` }}
    >
      <div className="mb-2 flex items-center justify-between">
        {variant === 'unhinged' ? (
          <span className="bg-ink text-whistleblower-yellow px-1.5 py-0.5 font-meta text-xs tracking-wide uppercase">
            {variant}
          </span>
        ) : (
          <span className={`font-meta text-xs tracking-wide uppercase ${VARIANT_LABEL_STYLES[variant]}`}>
            {variant}
          </span>
        )}
        {/* Negative margin cancels the padding visually, so the tap target
            reaches 44px without shifting the layout. */}
        <button
          type="button"
          onClick={handleCopy}
          className="-m-3 p-3 font-meta text-xs tracking-wide uppercase underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-ink"
        >
          {copyState === 'idle' ? 'copy' : copyState === 'copied' ? 'copied' : 'copy failed'}
        </button>
      </div>
      <p className="font-body text-[15px] leading-relaxed">{text}</p>
    </div>
  );
}
