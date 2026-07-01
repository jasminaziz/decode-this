import { useState } from 'react';
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

function App() {
  const [message, setMessage] = useState('');
  const [context, setContext] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DecodeResult | null>(null);

  async function handleDecode() {
    if (!message.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/decode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, context }),
      });
      const data = await response.json();
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

  return (
    <div className="mx-auto min-h-screen max-w-lg px-4 py-8">
      <header className="mb-6">
        <p className="font-meta text-xs tracking-wide text-laminate-grey uppercase">Decode This</p>
        <h1 className="font-display text-2xl font-extrabold text-ink">
          Paste it. See what it actually means.
        </h1>
      </header>

      {/* The message card: institutional, over-formal, flat. No accent
          colour appears here (The Latent Colour Rule). */}
      <div className="border-institutional-border border bg-white p-4">
        <label htmlFor="message" className="font-meta mb-2 block text-xs tracking-wide text-laminate-grey uppercase">
          Message to decode
        </label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="sure, whatever works for you"
          rows={4}
          className="border-institutional-border placeholder:text-laminate-grey/70 mb-4 w-full max-w-[70ch] resize-none border bg-white p-3 font-body text-[15px] text-ink focus:border-ink focus:outline-none"
        />

        <p className="font-meta mb-2 text-xs tracking-wide text-laminate-grey uppercase">Context (optional)</p>
        <ContextChips selected={context} onChange={setContext} />

        <button
          type="button"
          onClick={handleDecode}
          disabled={loading || !message.trim()}
          className="mt-5 w-full bg-ink px-6 py-3 font-display text-base font-extrabold tracking-wide text-break-room-beige uppercase transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          {loading ? 'Decoding…' : 'Decode'}
        </button>

        <p className="font-meta mt-3 text-[11px] tracking-wide text-laminate-grey uppercase">
          Decoded and discarded. Nothing is stored.
        </p>
      </div>

      {error && (
        <p className="font-meta mt-4 text-sm tracking-wide text-ink" role="alert">
          {error}
        </p>
      )}

      {result && (
        <div className="mt-8 space-y-8">
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

          <div className="space-y-4">
            <ReplyCard variant="diplomatic" text={result.replies.diplomatic} delayMs={450} />
            <ReplyCard variant="straight" text={result.replies.straight} delayMs={600} />
            <ReplyCard variant="unhinged" text={result.replies.unhinged} delayMs={750} />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
