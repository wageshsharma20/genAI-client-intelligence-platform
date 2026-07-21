export default function ReviewBar({ reviewStatuses }) {
  const counts = { approved: 0, edited: 0, rejected: 0, pending: 0 };

  const totalFields = Object.keys(reviewStatuses).length;

  Object.values(reviewStatuses).forEach((status) => {
    if (status === 'approved') counts.approved++;
    else if (status === 'edited') counts.edited++;
    else if (status === 'rejected') counts.rejected++;
  });

  counts.pending = totalFields - counts.approved - counts.edited - counts.rejected;

  const stats = [
    { label: 'Approved', count: counts.approved, color: 'bg-[#10B981]' },
    { label: 'Edited', count: counts.edited, color: 'bg-[#F59E0B]' },
    { label: 'Rejected', count: counts.rejected, color: 'bg-[#EF4444]' },
    { label: 'Pending', count: counts.pending, color: 'bg-[#E5E7EB]' },
  ];

  return (
    <div className="bg-white rounded-lg p-6">
      <h3 className="font-bold text-[#111827] text-sm tracking-tight mb-4">Review Progress</h3>

      {/* Progress bar */}
      <div className="flex h-3 rounded-full overflow-hidden bg-[#F3F4F6] mb-4">
        {totalFields > 0 && (
          <>
            {counts.approved > 0 && (
              <div className="bg-[#10B981] transition-all duration-300" style={{ width: `${(counts.approved / totalFields) * 100}%` }} />
            )}
            {counts.edited > 0 && (
              <div className="bg-[#F59E0B] transition-all duration-300" style={{ width: `${(counts.edited / totalFields) * 100}%` }} />
            )}
            {counts.rejected > 0 && (
              <div className="bg-[#EF4444] transition-all duration-300" style={{ width: `${(counts.rejected / totalFields) * 100}%` }} />
            )}
          </>
        )}
      </div>

      <div className="flex items-center gap-6">
        {stats.map(({ label, count, color }) => (
          <div key={label} className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-sm ${color}`} />
            <span className="text-xs font-bold text-[#111827]">{count}</span>
            <span className="text-[10px] font-semibold tracking-wider uppercase text-gray-400">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
