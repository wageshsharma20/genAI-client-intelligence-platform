import { useState } from 'react';

export default function InputScreen({ onResult }) {
  const [transcript, setTranscript] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadSample = async () => {
    try {
      const res = await fetch('/fixtures/sample_conversation.txt');
      const text = await res.text();
      setTranscript(text);
      setError(null);
    } catch {
      setError('Could not load sample.');
    }
  };

  const analyze = async () => {
    if (!transcript.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Analysis failed');
      onResult(json.analysis || json, json.raw || JSON.stringify(json.analysis || json));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-[#111827]">Analyze conversation</h1>
        <p className="text-sm text-[#6B7280] mt-1">
          Paste a client-coach conversation to extract structured health intelligence.
        </p>
      </div>

      <div className="bg-white border border-[#E5E7EB] rounded-lg">
        <div className="p-4 border-b border-[#E5E7EB] flex items-center justify-between">
          <span className="text-xs font-medium text-[#6B7280]">Transcript</span>
          <button
            onClick={loadSample}
            className="text-xs font-medium text-[#2563EB] hover:text-[#1D4ED8] transition-colors"
          >
            Load sample
          </button>
        </div>
        <textarea
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          placeholder="Paste the conversation transcript here..."
          className="w-full h-72 p-4 text-sm text-[#111827] placeholder-[#9CA3AF] resize-none focus:outline-none bg-transparent"
        />
      </div>

      {error && (
        <div className="mt-3 px-3 py-2 bg-[#FEF2F2] border border-[#FECACA] rounded-md">
          <p className="text-xs text-[#DC2626]">{error}</p>
        </div>
      )}

      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs text-[#9CA3AF]">
          {transcript.length > 0 ? `${transcript.split(/\s+/).length} words` : 'No content'}
        </span>
        <button
          onClick={analyze}
          disabled={loading || !transcript.trim()}
          className="px-4 py-2 bg-[#2563EB] text-white text-sm font-medium rounded-md hover:bg-[#1D4ED8] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Analyzing…' : 'Analyze'}
        </button>
      </div>
    </div>
  );
}
