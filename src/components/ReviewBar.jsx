export default function ReviewBar({ reviewStatuses }) {
  const total = Object.keys(reviewStatuses).length;
  const counts = { approved: 0, edited: 0, rejected: 0 };

  Object.values(reviewStatuses).forEach((s) => {
    if (counts[s] !== undefined) counts[s]++;
  });
  const pending = total - counts.approved - counts.edited - counts.rejected;
  const reviewed = counts.approved + counts.edited + counts.rejected;

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-lg px-4 py-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-[#111827]">Review progress</span>
        <span className="text-[11px] text-[#9CA3AF]">{reviewed}/{total} reviewed</span>
      </div>

      <div className="flex h-1.5 rounded-full overflow-hidden bg-[#F3F4F6]">
        {total > 0 && (
          <>
            {counts.approved > 0 && <div className="bg-[#059669]" style={{ width: `${(counts.approved / total) * 100}%` }} />}
            {counts.edited > 0 && <div className="bg-[#D97706]" style={{ width: `${(counts.edited / total) * 100}%` }} />}
            {counts.rejected > 0 && <div className="bg-[#DC2626]" style={{ width: `${(counts.rejected / total) * 100}%` }} />}
          </>
        )}
      </div>

      <div className="flex items-center gap-4 mt-2">
        {[
          { label: 'Approved', count: counts.approved, color: 'bg-[#059669]' },
          { label: 'Edited', count: counts.edited, color: 'bg-[#D97706]' },
          { label: 'Rejected', count: counts.rejected, color: 'bg-[#DC2626]' },
          { label: 'Pending', count: pending, color: 'bg-[#D1D5DB]' },
        ].map(({ label, count, color }) => (
          <div key={label} className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${color}`} />
            <span className="text-[11px] text-[#6B7280]">{count} {label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
