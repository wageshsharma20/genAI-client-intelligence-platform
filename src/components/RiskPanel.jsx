import SourceBadge from './SourceBadge';
import EvidenceQuote from './EvidenceQuote';
import ReviewControls from './ReviewControls';

export default function RiskPanel({ riskFlags, reviewStatuses, onReview }) {
  if (!riskFlags) return null;

  return (
    <div className="relative bg-[#EF4444] rounded-lg p-6 overflow-hidden">
      {/* Decorative geometric shape */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-8 w-24 h-24 bg-white/5 rounded-full translate-y-1/2" />

      <div className="relative">
        <h3 className="font-extrabold text-white text-lg tracking-tight flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
            <span className="text-xl">⚠️</span>
          </div>
          Risk / Attention Flags
        </h3>

        {riskFlags.length === 0 ? (
          <p className="text-white/80 font-medium italic">No risk signals identified in this transcript.</p>
        ) : (
          <div className="space-y-3">
            {riskFlags.map((flag, i) => (
              <div key={i} className="bg-white rounded-lg p-5 transition-all duration-200 hover:scale-[1.01]">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className="text-sm font-bold text-[#111827]">{flag.flag}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-md ${
                        flag.severity === 'high' ? 'bg-[#EF4444] text-white' :
                        flag.severity === 'medium' ? 'bg-[#F59E0B] text-white' :
                        'bg-[#FEF3C7] text-[#92400E]'
                      }`}>
                        {flag.severity}
                      </span>
                      <SourceBadge sourceType={flag.source_type} />
                    </div>
                  </div>
                </div>
                <EvidenceQuote evidence={flag.evidence} />
                <ReviewControls
                  fieldPath={`risk_flags[${i}]`}
                  value={flag.flag}
                  status={reviewStatuses?.[`risk_flags[${i}]`]}
                  onReview={onReview}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
