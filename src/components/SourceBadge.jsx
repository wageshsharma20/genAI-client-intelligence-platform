const BADGE_CONFIG = {
  confirmed_fact: {
    bg: 'bg-[#10B981]',
    text: 'text-white',
    label: 'CONFIRMED',
  },
  client_reported: {
    bg: 'bg-[#3B82F6]',
    text: 'text-white',
    label: 'CLIENT-REPORTED',
  },
  ai_inference: {
    bg: 'bg-[#8B5CF6]',
    text: 'text-white',
    label: 'AI INFERENCE',
  },
  missing: {
    bg: 'bg-[#E5E7EB]',
    text: 'text-gray-500',
    label: 'MISSING',
  },
};

export default function SourceBadge({ sourceType, confidence }) {
  const config = BADGE_CONFIG[sourceType] || BADGE_CONFIG.missing;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase rounded-md ${config.bg} ${config.text}`}>
      {config.label}
      {sourceType === 'ai_inference' && confidence != null && (
        <span className="font-semibold opacity-80">{Math.round(confidence * 100)}%</span>
      )}
    </span>
  );
}
