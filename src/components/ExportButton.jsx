export default function ExportButton({ data, reviewStatuses, editedValues }) {
  const handleExport = () => {
    const exportData = {
      ...data,
      review: {
        status: Object.values(reviewStatuses).every(s => s === 'approved') ? 'approved' : 'edited',
        reviewer: 'coach',
        edited_fields: Object.entries(reviewStatuses)
          .filter(([, status]) => status === 'edited')
          .map(([field]) => field),
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
    a.download = `client-intelligence-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={handleExport}
      className="h-14 px-8 bg-[#111827] text-white font-bold tracking-tight rounded-md hover:bg-[#1F2937] hover:scale-105 transition-all duration-200 focus:ring-2 focus:ring-offset-2 focus:ring-[#111827]"
    >
      Export Reviewed JSON
    </button>
  );
}
