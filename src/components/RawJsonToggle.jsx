import { useState } from 'react';

export default function RawJsonToggle({ rawJson }) {
  const [visible, setVisible] = useState(false);

  if (!rawJson) return null;

  let formatted = rawJson;
  try {
    let cleaned = rawJson.trim();
    if (cleaned.startsWith('```json')) cleaned = cleaned.slice(7);
    else if (cleaned.startsWith('```')) cleaned = cleaned.slice(3);
    if (cleaned.endsWith('```')) cleaned = cleaned.slice(0, -3);
    formatted = JSON.stringify(JSON.parse(cleaned.trim()), null, 2);
  } catch {
    // show raw if can't parse
  }

  return (
    <div>
      <button
        onClick={() => setVisible(!visible)}
        className="text-xs font-bold tracking-wider uppercase text-gray-400 hover:text-[#111827] flex items-center gap-1.5 transition-all duration-200 hover:scale-105"
      >
        <svg className={`w-3 h-3 transition-transform duration-200 ${visible ? 'rotate-90' : ''}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M6 6L14 10L6 14V6Z" />
        </svg>
        {visible ? 'Hide' : 'Show'} Raw JSON
      </button>

      {visible && (
        <pre className="mt-3 p-6 bg-[#111827] text-[#10B981] text-xs rounded-lg overflow-auto max-h-96 font-mono leading-relaxed">
          {formatted}
        </pre>
      )}
    </div>
  );
}
