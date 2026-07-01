const CONTEXTS = [
  { value: 'boss', label: 'from my boss' },
  { value: 'client', label: 'from a client' },
  { value: 'group chat', label: 'from the group chat' },
  { value: 'mum', label: 'from my mum' },
] as const;

interface ContextChipsProps {
  selected: string | null;
  onChange: (value: string | null) => void;
}

export function ContextChips({ selected, onChange }: ContextChipsProps) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Message context">
      {CONTEXTS.map(({ value, label }) => {
        const isSelected = selected === value;
        return (
          <button
            key={value}
            type="button"
            aria-pressed={isSelected}
            onClick={() => onChange(isSelected ? null : value)}
            className={`rounded-none border px-3 py-1.5 font-meta text-[13px] tracking-wide uppercase transition-colors ${
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
