import { useEffect, useRef, useState } from 'react';
import { ContextChips } from './components/ContextChips';
import { SubtextMeter } from './components/SubtextMeter';
import { ReplyCard } from './components/ReplyCard';

interface DecodeResult {
  translation: string;
  subtext_level: number;
  subtext_label: string;
  tells: string[];
  replies: {
    diplomatic: string;
    straight: string;
    unhinged: string;
  };
}

// Mirrors the server-side cap in api/decode.ts so nobody finds out at submit.
const MAX_MESSAGE_LENGTH = 4000;

// The decode takes several seconds; the wait is played as institutional
// process. Ink and grey only: loading is before the reveal, so The Latent
// Colour Rule applies.
const LOADING_LINES = [
  'Reading between the lines…',
  'Assessing sincerity levels…',
  'Measuring passive aggression…',
  'Consulting HR…',
  'Drafting replies…',
];

function App() {
  const [message, setMessage] = useState('');
  const [context, setContext] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DecodeResult | null>(null);
  const [loadingLine, setLoadingLine] = useState(0);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading) return;
    setLoadingLine(0);
    const id = setInterval(() => setLoadingLine((i) => (i + 1) % LOADING_LINES.length), 1800);
    return () => clearInterval(id);
  }, [loading]);

  // The reveal announces itself: scroll the translation into view when it
  // lands, instantly rather than smoothly under prefers-reduced-motion.
  useEffect(() => {
    if (!result) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    resultsRef.current?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  }, [result]);

  async function handleDecode() {
    if (!message.trim() || loading) return;
    setLoading(true);
    setError(null);
    // The previous result stays on screen until a new one replaces it, so a
    // failed re-decode never leaves the user with less than they had.
    try {
      const response = await fetch('/api/decode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, context }),
      });
      let data: { error?: string } & DecodeResult;
      try {
        data = await response.json();
      } catch {
        throw new Error("Couldn't decode that one. Try again in a moment.");
      }
      if (!response.ok) {
        throw new Error(data.error ?? 'Something went wrong');
      }
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  function handleTextareaKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      handleDecode();
    }
  }

  const remaining = MAX_MESSAGE_LENGTH - message.length;

  return (
    <div className="mx-auto min-h-screen max-w-lg px-4 py-8">
      <header className="mb-6">
        <p className="font-meta text-xs tracking-wide text-laminate-grey uppercase">Decode This</p>
        <h1 className="font-display text-2xl font-extrabold text-ink">
          Paste it. See what it actually means.
        </h1>
      </header>

      {/* The message card: institutional, over-formal, flat. No accent
          colour appears here (The Latent Colour Rule). Once the decode has
          fired it visibly recedes, caught out, until interacted with. */}
      <div
        className={`border-institutional-border border bg-white p-4 transition-opacity ${
          result ? 'opacity-60 focus-within:opacity-100 hover:opacity-100' : ''
        }`}
      >
        <label htmlFor="message" className="font-meta mb-2 block text-xs tracking-wide text-laminate-grey uppercase">
          Message to decode
        </label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleTextareaKeyDown}
          placeholder="sure, whatever works for you"
          rows={4}
          maxLength={MAX_MESSAGE_LENGTH}
          className="border-institutional-border placeholder:text-laminate-grey/70 mb-1 w-full max-w-[70ch] resize-none border bg-white p-3 font-body text-[15px] text-ink focus:border-ink focus:outline-none"
        />
        {remaining <= 400 && (
          <p className="font-meta mb-3 text-[11px] tracking-wide text-laminate-grey uppercase">
            {remaining} characters left
          </p>
        )}

        <p className="font-meta mt-3 mb-2 text-xs tracking-wide text-laminate-grey uppercase">From (optional)</p>
        <ContextChips selected={context} onChange={setContext} />

        <button
          type="button"
          onClick={handleDecode}
          disabled={loading || !message.trim()}
          className={`mt-5 w-full bg-ink px-6 py-3 font-display text-base font-extrabold tracking-wide text-break-room-beige uppercase transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink ${
            loading ? '' : 'hover:opacity-90 disabled:opacity-40'
          }`}
        >
          {loading ? (
            <span className="animate-pulse motion-reduce:animate-none">Decoding…</span>
          ) : (
            'Decode'
          )}
        </button>

        <p className="font-meta mt-3 text-[11px] tracking-wide text-laminate-grey uppercase">
          Decoded and discarded. Nothing is stored.
        </p>
      </div>

      {error && (
        <div className="border-ink mt-4 border-2 bg-white px-4 py-3" role="alert">
          <p className="font-meta text-sm tracking-wide text-ink uppercase">{error}</p>
        </div>
      )}

      {/* Loading theatre: a processing docket where the results will land.
          aria-hidden because the focused button already announces
          "Decoding" once; a new line every 1.8s would be noise. */}
      {loading && (
        <div className="border-institutional-border mt-4 border bg-white px-4 py-3" aria-hidden="true">
          <p
            key={loadingLine}
            className="animate-reveal-in font-meta text-sm tracking-wide text-laminate-grey uppercase"
          >
            {LOADING_LINES[loadingLine]}
          </p>
        </div>
      )}

      <div aria-live="polite">
        {result && (
          <div ref={resultsRef} key={result.translation} className="mt-8 scroll-mt-4 space-y-8">
            <div className="animate-reveal-in">
              <p className="font-meta mb-2 text-xs tracking-wide text-laminate-grey uppercase">The translation</p>
              <h2 className="font-display text-loudmouth-pink-ink text-3xl leading-tight font-extrabold">
                {result.translation}
              </h2>
            </div>

            <div className="animate-reveal-in" style={{ animationDelay: '150ms' }}>
              <SubtextMeter level={result.subtext_level} label={result.subtext_label} />
            </div>

            {result.tells.length > 0 && (
              <div className="animate-reveal-in" style={{ animationDelay: '300ms' }}>
                <p className="font-meta mb-2 text-xs tracking-wide text-laminate-grey uppercase">The tells</p>
                <div className="flex flex-wrap gap-2">
                  {result.tells.map((tell) => (
                    <span
                      key={tell}
                      className="border-ink bg-break-room-beige border px-2 py-1 font-meta text-xs text-ink"
                    >
                      {tell}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div>
              <p
                className="animate-reveal-in font-meta mb-2 text-xs tracking-wide text-laminate-grey uppercase"
                style={{ animationDelay: '450ms' }}
              >
                Replies you could send
              </p>
              <div className="space-y-4">
                <ReplyCard variant="diplomatic" text={result.replies.diplomatic} delayMs={450} />
                <ReplyCard variant="straight" text={result.replies.straight} delayMs={600} />
                <ReplyCard variant="unhinged" text={result.replies.unhinged} delayMs={750} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
