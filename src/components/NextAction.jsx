import SourceBadge from './SourceBadge';
import ReviewControls from './ReviewControls';

export default function NextAction({ action, reviewStatus, onReview }) {
  if (!action) return null;

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-lg">
      <div className="px-4 py-3 border-b border-[#E5E7EB] flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
        <h3 className="text-sm font-semibold text-[#111827]">Recommended next action</h3>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <p className="text-sm font-medium text-[#111827]">{action.action}</p>
            <p className="text-xs text-[#6B7280] mt-1">{action.rationale}</p>
            {action.linked_to && action.linked_to.length > 0 && (
              <div className="flex items-center gap-1.5 mt-2">
                <span className="text-[11px] text-[#9CA3AF]">Linked to:</span>
                {action.linked_to.map((link, i) => (
                  <span key={i} className="px-1.5 py-0.5 text-[10px] bg-[#F3F4F6] text-[#6B7280] rounded">{link}</span>
                ))}
              </div>
            )}
          </div>
          <SourceBadge sourceType={action.source_type} confidence={action.confidence} />
        </div>
        <ReviewControls
          fieldPath="recommended_next_action"
          value={action.action}
          status={reviewStatus}
          onReview={onReview}
        />
      </div>
    </div>
  );
}
