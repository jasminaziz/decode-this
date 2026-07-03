import { useState } from 'react';

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

const CHIP_CLASSES = (isSelected: boolean) =>
  `rounded-none border px-3 py-2 font-meta text-[13px] tracking-wide uppercase transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink ${
    isSelected
      ? 'border-ink bg-ink text-break-room-beige'
      : 'border-institutional-border bg-transparent text-laminate-grey hover:border-ink hover:text-ink'
  }`;

export function ContextChips({ selected, onChange }: ContextChipsProps) {
  // OTHER opens a free-text field; whatever is typed there becomes the
  // context, so a preset click always switches other mode off.
  const [otherActive, setOtherActive] = useState(false);
  const [otherValue, setOtherValue] = useState('');

  function selectPreset(value: string, isSelected: boolean) {
    setOtherActive(false);
    onChange(isSelected ? null : value);
  }

  function toggleOther() {
    if (otherActive) {
      setOtherActive(false);
      onChange(null);
    } else {
      setOtherActive(true);
      onChange(otherValue.trim() || null);
    }
  }

  return (
    <div role="group" aria-label="Who the message is from">
      <div className="flex flex-wrap gap-2">
        {CONTEXTS.map(({ value, label }) => {
          const isSelected = !otherActive && selected === value;
          return (
            <button
              key={value}
              type="button"
              aria-pressed={isSelected}
              onClick={() => selectPreset(value, isSelected)}
              className={CHIP_CLASSES(isSelected)}
            >
              {label}
            </button>
          );
        })}
        <button type="button" aria-pressed={otherActive} onClick={toggleOther} className={CHIP_CLASSES(otherActive)}>
          other
        </button>
      </div>
      {otherActive && (
        <input
          type="text"
          value={otherValue}
          onChange={(e) => {
            setOtherValue(e.target.value);
            onChange(e.target.value.trim() || null);
          }}
          placeholder="my landlord"
          maxLength={40}
          autoFocus
          aria-label="Type who the message is from"
          className="border-institutional-border placeholder:text-laminate-grey/70 mt-2 block w-full max-w-[28ch] border bg-white px-3 py-2 font-meta text-[13px] tracking-wide text-ink focus:border-ink focus:outline-none"
        />
      )}
    </div>
  );
}
