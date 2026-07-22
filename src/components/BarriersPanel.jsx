import SourceBadge from './SourceBadge';
import EvidenceQuote from './EvidenceQuote';
import ReviewControls from './ReviewControls';

export default function BarriersPanel({ barriers, pendingActions, reviewStatuses, onReview }) {
  const hasBarriers = barriers && barriers.length > 0;
  const hasActions = pendingActions && pendingActions.length > 0;

  if (!hasBarriers && !hasActions) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Barriers */}
      {hasBarriers && (
        <div className="bg-white border border-[#E5E7EB] rounded-lg">
          <div className="px-4 py-3 border-b border-[#E5E7EB]">
            <h3 className="text-sm font-semibold text-[#111827]">Key barriers</h3>
          </div>
          <div className="divide-y divide-[#F3F4F6]">
            {barriers.map((b, i) => (
              <div key={i} className="px-4 py-3">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm text-[#111827]">{b.barrier}</p>
                  <SourceBadge sourceType={b.source_type} />
                </div>
                <EvidenceQuote evidence={b.evidence} />
                <ReviewControls
                  fieldPath={`key_barriers[${i}]`}
                  value={b.barrier}
                  status={reviewStatuses[`key_barriers[${i}]`]}
                  onReview={onReview}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pending Actions */}
      {hasActions && (
        <div className="bg-white border border-[#E5E7EB] rounded-lg">
          <div className="px-4 py-3 border-b border-[#E5E7EB]">
            <h3 className="text-sm font-semibold text-[#111827]">Pending actions</h3>
          </div>
          <div className="divide-y divide-[#F3F4F6]">
            {pendingActions.map((a, i) => (
              <div key={i} className="px-4 py-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#111827]">{a.action}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[11px] text-[#9CA3AF]">Owner: {a.owner}</span>
                      {a.due && <span className="text-[11px] text-[#9CA3AF]">Due: {a.due}</span>}
                    </div>
                  </div>
                  <SourceBadge sourceType={a.source_type} />
                </div>
                <EvidenceQuote evidence={a.evidence} />
                <ReviewControls
                  fieldPath={`pending_actions[${i}]`}
                  value={a.action}
                  status={reviewStatuses[`pending_actions[${i}]`]}
                  onReview={onReview}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
