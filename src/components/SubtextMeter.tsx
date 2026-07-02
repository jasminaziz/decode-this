import { useEffect, useState } from 'react';

interface SubtextMeterProps {
  level: number;
  label: string;
}

// A semicircular dial, 0 to 100. Below 70 the fill is Loudmouth Pink; at 70
// and above it switches to Whistleblower Yellow (The One Yellow Rule: yellow
// marks the extreme register only, never a gradient blend between the two).
export function SubtextMeter({ level, label }: SubtextMeterProps) {
  const clamped = Math.max(0, Math.min(100, level));
  const reduceMotion =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const [animatedLevel, setAnimatedLevel] = useState(reduceMotion ? clamped : 0);

  useEffect(() => {
    if (reduceMotion) {
      setAnimatedLevel(clamped);
      return;
    }
    // Mount at 0, then move to the real value on the next frame so the
    // stroke-dashoffset transition actually has a change to animate.
    const frame = requestAnimationFrame(() => setAnimatedLevel(clamped));
    return () => cancelAnimationFrame(frame);
  }, [clamped, reduceMotion]);

  const radius = 80;
  const circumference = Math.PI * radius; // half circle
  const offset = circumference - (animatedLevel / 100) * circumference;
  const fillColor = animatedLevel >= 70 ? 'var(--color-whistleblower-yellow)' : 'var(--color-loudmouth-pink)';

  return (
    <div className="flex flex-col items-center gap-2">
      <svg viewBox="0 0 180 100" className="w-full max-w-[220px]" role="img" aria-label={`Subtext level ${clamped} out of 100: ${label}`}>
        <path
          d="M 10 90 A 80 80 0 0 1 170 90"
          fill="none"
          stroke="var(--color-institutional-border)"
          strokeWidth="14"
          strokeLinecap="round"
        />
        {/* Ink outline behind the fill: pink-on-beige measures 2.97:1, just
            under the 3:1 floor for graphical UI components, so the arc
            doesn't rely on hue contrast alone. */}
        <path
          d="M 10 90 A 80 80 0 0 1 170 90"
          fill="none"
          stroke="var(--color-ink)"
          strokeWidth="18"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: reduceMotion ? 'none' : 'stroke-dashoffset 0.8s var(--ease-reveal)' }}
        />
        <path
          d="M 10 90 A 80 80 0 0 1 170 90"
          fill="none"
          stroke={fillColor}
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition: reduceMotion ? 'none' : 'stroke-dashoffset 0.8s var(--ease-reveal), stroke 0.3s ease-out',
          }}
        />
        <text x="90" y="80" textAnchor="middle" className="font-display text-[2.5rem] font-extrabold fill-ink">
          {clamped}
        </text>
      </svg>
      <p className="font-meta text-xs tracking-wide text-laminate-grey uppercase">{label}</p>
    </div>
  );
}
