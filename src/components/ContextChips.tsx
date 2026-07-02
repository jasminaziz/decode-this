// Labels drop the "from" prefix; the field label above reads "From
// (optional)", memo-style, so the sentence completes as FROM: MY BOSS.
const CONTEXTS = [
  { value: 'boss', label: 'my boss' },
  { value: 'client', label: 'a client' },
  { value: 'colleague', label: 'a colleague' },
  { value: 'group chat', label: 'the group chat' },
  { value: 'mum', label: 'my mum' },
  { value: 'flatmate', label: 'my flatmate' },
  { value: 'ex', label: 'an ex' },
] as const;

interface ContextChipsProps {
  selected: string | null;
  onChange: (value: string | null) => void;
}

export function ContextChips({ selected, onChange }: ContextChipsProps) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Who the message is from">
      {CONTEXTS.map(({ value, label }) => {
        const isSelected = selected === value;
        return (
          <button
            key={value}
            type="button"
            aria-pressed={isSelected}
            onClick={() => onChange(isSelected ? null : value)}
            className={`rounded-none border px-3 py-2 font-meta text-[13px] tracking-wide uppercase transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink ${
              isSelected
                ? 'border-ink bg-ink text-break-room-beige'
                : 'border-institutional-border bg-transparent text-laminate-grey hover:border-ink hover:text-ink'
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
