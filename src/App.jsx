import { useState } from 'react';
import InputScreen from './components/InputScreen';
import ReportScreen from './components/ReportScreen';

export default function App() {
  const [report, setReport] = useState(null);
  const [rawJson, setRawJson] = useState(null);

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Top bar */}
      <header className="bg-white border-b border-[#E5E7EB] sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-[#2563EB] rounded-md flex items-center justify-center">
              <span className="text-white text-xs font-semibold">CI</span>
            </div>
            <span className="text-sm font-semibold text-[#111827]">Client Intelligence</span>
          </div>
          {report && (
            <button
              onClick={() => { setReport(null); setRawJson(null); }}
              className="text-xs font-medium text-[#6B7280] hover:text-[#111827] transition-colors"
            >
              ← New analysis
            </button>
          )}
        </div>
      </header>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-6 py-8">
        {!report ? (
          <InputScreen onResult={(data, raw) => { setReport(data); setRawJson(raw); }} />
        ) : (
          <ReportScreen data={report} rawJson={rawJson} />
        )}
      </main>
    </div>
  );
}
