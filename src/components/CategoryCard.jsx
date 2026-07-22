import SourceBadge from './SourceBadge';
import EvidenceQuote from './EvidenceQuote';
import ReviewControls from './ReviewControls';

const STATUS_DOT = {
  on_track: 'bg-[#059669]',
  partial: 'bg-[#D97706]',
  off_track: 'bg-[#DC2626]',
  missing: 'bg-[#D1D5DB]',
};

export default function CategoryCard({ title, data, fieldPath, reviewStatus, onReview }) {
  if (!data) return null;

  const statusColor = STATUS_DOT[data.status] || STATUS_DOT.missing;

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-lg p-4 hover:border-[#D1D5DB] transition-colors">
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-sm font-semibold text-[#111827]">{title}</h3>
        <SourceBadge sourceType={data.source_type} confidence={data.confidence} />
      </div>

      {data.status && (
        <div className="flex items-center gap-1.5 mb-2">
          <span className={`w-1.5 h-1.5 rounded-full ${statusColor}`} />
          <span className="text-xs text-[#6B7280] capitalize">{data.status?.replace('_', ' ')}</span>
        </div>
      )}

      {data.details && (
        <p className="text-xs text-[#6B7280] leading-relaxed">{data.details}</p>
      )}

      {/* Numeric stats */}
      <div className="flex gap-4 mt-2">
        {data.steps_avg != null && (
          <div>
            <span className="text-lg font-semibold text-[#111827]">{data.steps_avg.toLocaleString()}</span>
            <span className="text-[11px] text-[#9CA3AF] ml-1">steps/day</span>
          </div>
        )}
        {data.avg_hours != null && (
          <div>
            <span className="text-lg font-semibold text-[#111827]">{data.avg_hours}</span>
            <span className="text-[11px] text-[#9CA3AF] ml-1">hrs avg</span>
          </div>
        )}
        {data.avg_liters != null && (
          <div>
            <span className="text-lg font-semibold text-[#111827]">{data.avg_liters}</span>
            <span className="text-[11px] text-[#9CA3AF] ml-1">L/day</span>
          </div>
        )}
      </div>

      {data.quality && (
        <p className="text-xs text-[#6B7280] mt-1">Quality: {data.quality}</p>
      )}

      {data.reported_symptoms && data.reported_symptoms.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {data.reported_symptoms.map((s, i) => (
            <span key={i} className="px-1.5 py-0.5 text-[11px] bg-[#F3F4F6] text-[#6B7280] rounded">{s}</span>
          ))}
        </div>
      )}

      {data.rationale && (
        <p className="text-xs text-[#6B7280] mt-1">{data.rationale}</p>
      )}

      <EvidenceQuote evidence={data.evidence} />
      <ReviewControls fieldPath={fieldPath} value={data.details || data.rationale} status={reviewStatus} onReview={onReview} />
    </div>
  );
}
