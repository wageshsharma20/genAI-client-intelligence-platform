import SourceBadge from './SourceBadge';
import EvidenceQuote from './EvidenceQuote';
import ReviewControls from './ReviewControls';

const CARD_TINTS = {
  nutrition_adherence: 'bg-green-50',
  exercise: 'bg-blue-50',
  sleep: 'bg-indigo-50',
  water_intake: 'bg-cyan-50',
  symptoms_stress: 'bg-amber-50',
  engagement_level: 'bg-purple-50',
};

const STATUS_STYLES = {
  on_track: 'bg-[#10B981] text-white',
  partial: 'bg-[#F59E0B] text-white',
  off_track: 'bg-[#EF4444] text-white',
  missing: 'bg-[#E5E7EB] text-gray-500',
};

export default function CategoryCard({ title, icon, data, fieldPath, reviewStatus, onReview }) {
  if (!data) return null;

  const isMissing = data.source_type === 'missing';
  const tint = CARD_TINTS[fieldPath] || 'bg-white';

  return (
    <div className={`group rounded-lg p-6 transition-all duration-200 hover:scale-[1.02] cursor-default ${
      isMissing ? 'bg-[#F3F4F6] opacity-60' : tint
    }`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-xl transition-transform duration-200 group-hover:scale-110">
            {icon}
          </div>
          <h3 className="font-bold text-[#111827] text-sm tracking-tight">{title}</h3>
        </div>
        <SourceBadge sourceType={data.source_type} confidence={data.confidence} />
      </div>

      {isMissing ? (
        <p className="text-sm font-medium text-gray-400 italic">Not discussed in the transcript</p>
      ) : (
        <>
          {data.status && (
            <div className="mb-2">
              <span className={`text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-md ${
                STATUS_STYLES[data.status] || STATUS_STYLES.missing
              }`}>
                {data.status?.replace('_', ' ')}
              </span>
            </div>
          )}

          {data.details && <p className="text-sm text-gray-700 mt-2 leading-relaxed">{data.details}</p>}

          {data.level && (
            <p className="text-sm text-gray-700 mt-1">
              Level: <span className="font-bold capitalize">{data.level}</span>
            </p>
          )}
          {data.rationale && <p className="text-sm text-gray-600 mt-1 leading-relaxed">{data.rationale}</p>}

          {data.avg_hours != null && (
            <div className="mt-2">
              <span className="text-3xl font-extrabold text-[#111827] tracking-tight">{data.avg_hours}</span>
              <span className="text-sm font-medium text-gray-500 ml-1">hrs avg</span>
            </div>
          )}
          {data.quality && <p className="text-sm text-gray-700">Quality: <span className="font-semibold">{data.quality}</span></p>}
          {data.avg_liters != null && (
            <div className="mt-2">
              <span className="text-3xl font-extrabold text-[#111827] tracking-tight">{data.avg_liters}</span>
              <span className="text-sm font-medium text-gray-500 ml-1">L/day</span>
            </div>
          )}
          {data.steps_avg != null && (
            <div className="mt-2">
              <span className="text-3xl font-extrabold text-[#3B82F6] tracking-tight">{data.steps_avg?.toLocaleString()}</span>
              <span className="text-sm font-medium text-gray-500 ml-1">steps avg</span>
            </div>
          )}
          {data.workouts_completed != null && (
            <div className="mt-1">
              <span className="text-2xl font-extrabold text-[#10B981] tracking-tight">{data.workouts_completed}</span>
              <span className="text-sm font-medium text-gray-500 ml-1">workouts</span>
            </div>
          )}

          {data.reported_symptoms && data.reported_symptoms.length > 0 && (
            <div className="mt-3">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Symptoms</p>
              <div className="flex flex-wrap gap-1.5">
                {data.reported_symptoms.map((s, i) => (
                  <span key={i} className="text-xs font-semibold bg-[#F59E0B]/15 text-[#92400E] px-2.5 py-1 rounded-md">{s}</span>
                ))}
              </div>
            </div>
          )}
          {data.stress_level && data.stress_level !== 'missing' && (
            <p className="text-sm text-gray-700 mt-2">
              Stress: <span className="font-bold capitalize">{data.stress_level}</span>
            </p>
          )}

          <EvidenceQuote evidence={data.evidence} />
        </>
      )}

      <ReviewControls
        fieldPath={fieldPath}
        value={data.details || data.rationale || data.quality || ''}
        status={reviewStatus}
        onReview={onReview}
      />
    </div>
  );
}
