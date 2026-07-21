import { useState } from 'react';

export default function EvidenceQuote({ evidence }) {
  const [expanded, setExpanded] = useState(false);

  if (!evidence || evidence.length === 0) return null;

  return (
    <div className="mt-3">
      <button
        onClick={() => setExpanded(!expanded)}
        className="text-xs font-semibold text-[#3B82F6] hover:text-[#2563EB] flex items-center gap-1.5 tracking-wide uppercase transition-all duration-200"
      >
        <svg className={`w-3 h-3 transition-transform duration-200 ${expanded ? 'rotate-90' : ''}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M6 6L14 10L6 14V6Z" />
        </svg>
        {expanded ? 'Hide' : 'Show'} evidence ({evidence.length})
      </button>

      {expanded && (
        <div className="mt-2 space-y-2">
          {evidence.map((e, i) => (
            <div key={i} className="bg-[#F3F4F6] rounded-md p-3 text-xs">
              <span className="font-bold text-[#111827] uppercase tracking-wider text-[10px]">{e.speaker}</span>
              <p className="text-gray-600 mt-0.5 italic">"{e.quote}"</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
