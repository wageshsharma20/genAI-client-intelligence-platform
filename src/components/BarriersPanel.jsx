import SourceBadge from './SourceBadge';
import EvidenceQuote from './EvidenceQuote';
import ReviewControls from './ReviewControls';

export default function BarriersPanel({ barriers, pendingActions, reviewStatuses, onReview }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Key Barriers */}
      <div className="relative bg-[#F59E0B] rounded-lg p-6 overflow-hidden">
        {/* Decorative shape */}
        <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/10 rounded-full" />

        <div className="relative">
          <h3 className="font-extrabold text-white text-lg tracking-tight flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <span className="text-lg">🚧</span>
            </div>
            Key Barriers
          </h3>

          {!barriers || barriers.length === 0 ? (
            <p className="text-white/80 font-medium italic">None identified</p>
          ) : (
            <div className="space-y-3">
              {barriers.map((b, i) => (
                <div key={i} className="bg-white rounded-lg p-4 transition-all duration-200 hover:scale-[1.01]">
                  <p className="text-sm font-bold text-[#111827]">{b.barrier}</p>
                  <div className="mt-2">
                    <SourceBadge sourceType={b.source_type} />
                  </div>
                  <EvidenceQuote evidence={b.evidence} />
                  <ReviewControls
                    fieldPath={`key_barriers[${i}]`}
                    value={b.barrier}
                    status={reviewStatuses?.[`key_barriers[${i}]`]}
                    onReview={onReview}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Pending Actions */}
      <div className="relative bg-[#111827] rounded-lg p-6 overflow-hidden">
        {/* Decorative shape */}
        <div className="absolute -top-6 -left-6 w-24 h-24 bg-white/5 rounded-full" />

        <div className="relative">
          <h3 className="font-extrabold text-white text-lg tracking-tight flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <span className="text-lg">📋</span>
            </div>
            Pending Actions
          </h3>

          {!pendingActions || pendingActions.length === 0 ? (
            <p className="text-white/60 font-medium italic">None identified</p>
          ) : (
            <div className="space-y-3">
              {pendingActions.map((a, i) => (
                <div key={i} className="bg-white rounded-lg p-4 transition-all duration-200 hover:scale-[1.01]">
                  <p className="text-sm font-bold text-[#111827]">{a.action}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-[10px] font-bold tracking-wider uppercase text-gray-500">
                      Owner: <span className="text-[#111827] capitalize">{a.owner}</span>
                    </span>
                    {a.due && (
                      <span className="text-[10px] font-bold tracking-wider uppercase text-gray-500">
                        Due: <span className="text-[#111827]">{a.due}</span>
                      </span>
                    )}
                    <SourceBadge sourceType={a.source_type} />
                  </div>
                  <EvidenceQuote evidence={a.evidence} />
                  <ReviewControls
                    fieldPath={`pending_actions[${i}]`}
                    value={a.action}
                    status={reviewStatuses?.[`pending_actions[${i}]`]}
                    onReview={onReview}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
