const BADGE_STYLES = {
  confirmed_fact: 'bg-[#ECFDF5] text-[#059669]',
  client_reported: 'bg-[#EFF6FF] text-[#2563EB]',
  ai_inference: 'bg-[#F5F3FF] text-[#7C3AED]',
  missing: 'bg-[#F3F4F6] text-[#6B7280]',
};

const LABELS = {
  confirmed_fact: 'Confirmed',
  client_reported: 'Client-reported',
  ai_inference: 'AI inference',
  missing: 'Missing',
};

export default function SourceBadge({ sourceType, confidence }) {
  if (!sourceType) return null;

  const style = BADGE_STYLES[sourceType] || BADGE_STYLES.missing;
  const label = LABELS[sourceType] || sourceType;

  return (
    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-medium ${style}`}>
      {label}
      {sourceType === 'ai_inference' && confidence != null && (
        <span className="opacity-60">{Math.round(confidence * 100)}%</span>
      )}
    </span>
  );
}
