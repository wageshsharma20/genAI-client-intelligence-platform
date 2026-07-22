export default function ExportButton({ data, reviewStatuses, editedValues }) {
  const handleExport = () => {
    const exportData = {
      ...data,
      review: {
        status: Object.values(reviewStatuses).every(s => s === 'approved') ? 'approved' : 'edited',
        reviewer: 'coach',
        edited_fields: Object.entries(reviewStatuses).filter(([, s]) => s === 'edited').map(([f]) => f),
        reviewer_notes: null,
        reviewed_at: new Date().toISOString(),
      },
      _review_decisions: reviewStatuses,
      _edited_values: editedValues,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `client-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={handleExport}
      className="px-4 py-2 bg-[#111827] text-white text-sm font-medium rounded-md hover:bg-[#1F2937] transition-colors"
    >
      Export JSON
    </button>
  );
}
