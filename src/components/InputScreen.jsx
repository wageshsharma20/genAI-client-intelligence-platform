import { useState } from 'react';

export default function InputScreen({ onAnalysisComplete }) {
  const [transcript, setTranscript] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => setTranscript(event.target.result);
    reader.readAsText(file);
  };

  const loadSample = async () => {
    try {
      const res = await fetch('/fixtures/sample_conversation.txt');
      const text = await res.text();
      setTranscript(text);
    } catch {
      setError('Could not load sample conversation.');
    }
  };

  const handleAnalyze = async () => {
    if (!transcript.trim()) {
      setError('Please paste or upload a conversation transcript.');
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Analysis failed');
      }

      onAnalysisComplete(data.result, data.raw);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Decorative background shapes */}
      <div className="relative">
        <div className="absolute -top-20 -right-32 w-64 h-64 bg-[#3B82F6]/5 rounded-full" />
        <div className="absolute -bottom-16 -left-24 w-48 h-48 bg-[#10B981]/5 rounded-full" />

        <div className="relative bg-white rounded-lg p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-[#111827] tracking-tight">
              Analyze Conversation
            </h2>
            <p className="text-sm font-medium text-gray-500 mt-1 tracking-wide">
              Paste a client-coach conversation transcript or upload a .txt file.
            </p>
          </div>

          <textarea
            id="transcript-input"
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="Paste conversation transcript here..."
            className="w-full h-64 p-5 bg-[#F3F4F6] rounded-lg text-sm font-normal text-[#111827] resize-y border-0 focus:bg-white focus:border-2 focus:border-[#3B82F6] focus:outline-none transition-all duration-200 placeholder:text-gray-400"
            disabled={loading}
          />

          <div className="flex items-center gap-3 mt-6">
            <button
              id="analyze-btn"
              onClick={handleAnalyze}
              disabled={loading || !transcript.trim()}
              className="h-14 px-8 bg-[#3B82F6] text-white font-semibold rounded-md hover:bg-[#2563EB] hover:scale-105 disabled:bg-gray-200 disabled:text-gray-400 disabled:hover:scale-100 transition-all duration-200 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Analyzing...
                </span>
              ) : 'Analyze'}
            </button>

            <label className="h-14 px-6 flex items-center border-2 border-[#E5E7EB] text-[#111827] font-medium rounded-md hover:bg-[#F3F4F6] hover:scale-105 cursor-pointer transition-all duration-200 text-sm focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
              Upload .txt
              <input
                type="file"
                accept=".txt"
                onChange={handleFileUpload}
                className="hidden"
                disabled={loading}
              />
            </label>

            <button
              onClick={loadSample}
              disabled={loading}
              className="h-14 px-6 text-sm text-[#3B82F6] font-semibold hover:scale-105 disabled:text-gray-300 disabled:hover:scale-100 transition-all duration-200"
            >
              Load Sample
            </button>
          </div>

          {error && (
            <div className="mt-5 p-4 bg-red-50 rounded-lg text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          {loading && (
            <div className="mt-5 p-4 bg-[#3B82F6]/10 rounded-lg text-sm font-medium text-[#3B82F6]">
              Analyzing transcript with LLM... This may take 10-30 seconds.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
