import { useState } from 'react';
import InputScreen from './components/InputScreen';
import ReportScreen from './components/ReportScreen';

function App() {
  const [analysisData, setAnalysisData] = useState(null);
  const [rawJson, setRawJson] = useState(null);

  const handleAnalysisComplete = (result, raw) => {
    setAnalysisData(result);
    setRawJson(raw);
  };

  const handleBack = () => {
    setAnalysisData(null);
    setRawJson(null);
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6]">
      {/* Flat header — dark color block, no shadow */}
      <header className="bg-[#111827] text-white">
        <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#3B82F6] rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 0-6.23.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
              </svg>
            </div>
            <h1 className="text-xl font-bold tracking-tight">
              Client Intelligence
            </h1>
          </div>
          {analysisData && (
            <button
              onClick={handleBack}
              className="text-sm font-semibold text-white/80 hover:text-white bg-white/10 px-4 py-2 rounded-md transition-all duration-200 hover:scale-105"
            >
              ← New Analysis
            </button>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-10">
        {!analysisData ? (
          <InputScreen onAnalysisComplete={handleAnalysisComplete} />
        ) : (
          <ReportScreen data={analysisData} rawJson={rawJson} />
        )}
      </main>
    </div>
  );
}

export default App;
