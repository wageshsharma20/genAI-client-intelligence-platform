import { useState } from 'react';

export default function EvidenceQuote({ evidence }) {
  const [open, setOpen] = useState(false);

  if (!evidence || evidence.length === 0) return null;

  return (
    <div className="mt-2">
      <button
        onClick={() => setOpen(!open)}
        className="text-[11px] font-medium text-[#6B7280] hover:text-[#111827] transition-colors flex items-center gap-1"
      >
        <svg className={`w-3 h-3 transition-transform ${open ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
        {open ? 'Hide' : 'Show'} evidence ({evidence.length})
      </button>

      {open && (
        <div className="mt-2 space-y-1.5">
          {evidence.map((e, i) => (
            <div key={i} className="flex gap-2 pl-4 border-l-2 border-[#E5E7EB]">
              <span className="text-[11px] font-medium text-[#9CA3AF] uppercase shrink-0">{e.speaker}</span>
              <span className="text-xs text-[#6B7280] italic">"{e.quote}"</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
