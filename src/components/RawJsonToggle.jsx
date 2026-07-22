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
  } catch { /* show raw */ }

  return (
    <div>
      <button
        onClick={() => setVisible(!visible)}
        className="text-[11px] font-medium text-[#6B7280] hover:text-[#111827] transition-colors"
      >
        {visible ? 'Hide' : 'Show'} raw JSON
      </button>

      {visible && (
        <pre className="mt-2 p-4 bg-[#111827] text-[#A5F3FC] text-xs rounded-lg overflow-auto max-h-80 font-mono leading-relaxed">
          {formatted}
        </pre>
      )}
    </div>
  );
}
