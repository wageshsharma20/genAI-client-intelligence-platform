import SourceBadge from './SourceBadge';
import ReviewControls from './ReviewControls';

export default function NextAction({ action, reviewStatus, onReview }) {
  if (!action) return null;

  return (
    <div className="relative bg-[#3B82F6] rounded-lg p-6 overflow-hidden">
      {/* Decorative geometric shapes */}
      <div className="absolute top-0 left-0 w-48 h-48 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3" />

      <div className="relative">
        <h3 className="font-extrabold text-white text-lg tracking-tight flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
            <span className="text-xl">🎯</span>
          </div>
          Recommended Next Action
        </h3>

        <div className="bg-white rounded-lg p-5">
          <p className="text-base font-bold text-[#111827]">{action.action}</p>
          <p className="text-sm text-gray-600 mt-2 leading-relaxed">{action.rationale}</p>

          <div className="flex items-center gap-3 mt-3">
            <SourceBadge sourceType={action.source_type} confidence={action.confidence} />
            {action.linked_to && action.linked_to.length > 0 && (
              <span className="text-[10px] font-bold tracking-wider uppercase text-gray-400">
                Linked: {action.linked_to.join(' · ')}
              </span>
            )}
          </div>

          <ReviewControls
            fieldPath="recommended_next_action"
            value={action.action}
            status={reviewStatus}
            onReview={onReview}
          />
        </div>
      </div>
    </div>
  );
}
