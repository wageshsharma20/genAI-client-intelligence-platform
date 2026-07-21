import { useState } from 'react';

export default function ReviewControls({ fieldPath, value, status, onReview }) {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value || ''));

  const handleApprove = () => onReview(fieldPath, 'approved', null);
  const handleReject = () => onReview(fieldPath, 'rejected', null);
  const handleSaveEdit = () => {
    onReview(fieldPath, 'edited', editValue);
    setEditing(false);
  };

  return (
    <div className="mt-3 pt-3 border-t-2 border-[#F3F4F6]">
      {editing ? (
        <div className="space-y-3">
          <textarea
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="w-full p-3 text-sm bg-[#F3F4F6] rounded-md border-0 focus:bg-white focus:border-2 focus:border-[#3B82F6] focus:outline-none transition-all duration-200"
            rows={3}
          />
          <div className="flex gap-2">
            <button
              onClick={handleSaveEdit}
              className="h-9 px-4 text-xs font-bold tracking-wide uppercase bg-[#3B82F6] text-white rounded-md hover:bg-[#2563EB] hover:scale-105 transition-all duration-200"
            >
              Save
            </button>
            <button
              onClick={() => setEditing(false)}
              className="h-9 px-4 text-xs font-bold tracking-wide uppercase bg-[#F3F4F6] text-[#111827] rounded-md hover:bg-[#E5E7EB] hover:scale-105 transition-all duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <button
            onClick={handleApprove}
            className={`h-8 px-3 text-[10px] font-bold tracking-wider uppercase rounded-md transition-all duration-200 hover:scale-105 ${
              status === 'approved'
                ? 'bg-[#10B981] text-white'
                : 'bg-[#10B981]/10 text-[#10B981] hover:bg-[#10B981] hover:text-white'
            }`}
          >
            ✓ Approve
          </button>
          <button
            onClick={() => setEditing(true)}
            className={`h-8 px-3 text-[10px] font-bold tracking-wider uppercase rounded-md transition-all duration-200 hover:scale-105 ${
              status === 'edited'
                ? 'bg-[#F59E0B] text-white'
                : 'bg-[#F59E0B]/10 text-[#F59E0B] hover:bg-[#F59E0B] hover:text-white'
            }`}
          >
            ✎ Edit
          </button>
          <button
            onClick={handleReject}
            className={`h-8 px-3 text-[10px] font-bold tracking-wider uppercase rounded-md transition-all duration-200 hover:scale-105 ${
              status === 'rejected'
                ? 'bg-[#EF4444] text-white'
                : 'bg-[#EF4444]/10 text-[#EF4444] hover:bg-[#EF4444] hover:text-white'
            }`}
          >
            ✕ Reject
          </button>
          {status && status !== 'pending' && (
            <span className="text-[10px] font-bold tracking-wider uppercase text-gray-400 ml-2">
              {status}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
