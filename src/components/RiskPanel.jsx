import SourceBadge from './SourceBadge';
import EvidenceQuote from './EvidenceQuote';
import ReviewControls from './ReviewControls';

export default function RiskPanel({ riskFlags, reviewStatuses, onReview }) {
  if (!riskFlags || riskFlags.length === 0) return null;

  const severityStyle = {
    high: 'bg-[#DC2626] text-white',
    medium: 'bg-[#D97706] text-white',
    low: 'bg-[#D1D5DB] text-[#374151]',
  };

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-lg">
      <div className="px-4 py-3 border-b border-[#E5E7EB] flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626]" />
        <h3 className="text-sm font-semibold text-[#111827]">Risk flags</h3>
        <span className="text-[11px] text-[#9CA3AF]">({riskFlags.length})</span>
      </div>

      <div className="divide-y divide-[#F3F4F6]">
        {riskFlags.map((rf, i) => (
          <div key={i} className="px-4 py-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-1.5 py-0.5 text-[10px] font-medium uppercase rounded ${severityStyle[rf.severity] || severityStyle.low}`}>
                    {rf.severity}
                  </span>
                  <SourceBadge sourceType={rf.source_type} />
                </div>
                <p className="text-sm text-[#111827]">{rf.flag}</p>
              </div>
            </div>
            <EvidenceQuote evidence={rf.evidence} />
            <ReviewControls
              fieldPath={`risk_flags[${i}]`}
              value={rf.flag}
              status={reviewStatuses[`risk_flags[${i}]`]}
              onReview={onReview}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
