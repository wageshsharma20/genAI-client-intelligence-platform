import { useState } from 'react';

export default function ReviewControls({ fieldPath, value, status, onReview }) {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(value || '');

  const handleSave = () => {
    onReview(fieldPath, 'edited', editValue);
    setEditing(false);
  };

  if (status === 'approved') {
    return (
      <div className="mt-2 flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-[#059669]" />
        <span className="text-[11px] font-medium text-[#059669]">Approved</span>
      </div>
    );
  }

  if (status === 'rejected') {
    return (
      <div className="mt-2 flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626]" />
        <span className="text-[11px] font-medium text-[#DC2626]">Rejected</span>
      </div>
    );
  }

  if (status === 'edited') {
    return (
      <div className="mt-2 flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
        <span className="text-[11px] font-medium text-[#D97706]">Edited</span>
      </div>
    );
  }

  if (editing) {
    return (
      <div className="mt-2 space-y-2">
        <textarea
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          className="w-full p-2 text-xs border border-[#D1D5DB] rounded-md focus:outline-none focus:border-[#2563EB] bg-white resize-none"
          rows={2}
        />
        <div className="flex gap-2">
          <button onClick={handleSave} className="px-2.5 py-1 text-[11px] font-medium bg-[#2563EB] text-white rounded-md hover:bg-[#1D4ED8] transition-colors">
            Save
          </button>
          <button onClick={() => setEditing(false)} className="px-2.5 py-1 text-[11px] font-medium text-[#6B7280] hover:text-[#111827] transition-colors">
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-2 flex items-center gap-1">
      <button
        onClick={() => onReview(fieldPath, 'approved')}
        className="px-2 py-0.5 text-[11px] font-medium text-[#059669] hover:bg-[#ECFDF5] rounded transition-colors"
      >
        Approve
      </button>
      <button
        onClick={() => setEditing(true)}
        className="px-2 py-0.5 text-[11px] font-medium text-[#D97706] hover:bg-[#FFFBEB] rounded transition-colors"
      >
        Edit
      </button>
      <button
        onClick={() => onReview(fieldPath, 'rejected')}
        className="px-2 py-0.5 text-[11px] font-medium text-[#DC2626] hover:bg-[#FEF2F2] rounded transition-colors"
      >
        Reject
      </button>
    </div>
  );
}
