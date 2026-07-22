import { useState } from 'react';
import SourceBadge from './SourceBadge';
import EvidenceQuote from './EvidenceQuote';
import CategoryCard from './CategoryCard';
import RiskPanel from './RiskPanel';
import BarriersPanel from './BarriersPanel';
import NextAction from './NextAction';
import ReviewBar from './ReviewBar';
import ReviewControls from './ReviewControls';
import RawJsonToggle from './RawJsonToggle';
import ExportButton from './ExportButton';

export default function ReportScreen({ data, rawJson }) {
  const allFields = [
    'weekly_summary',
    'nutrition_adherence', 'exercise', 'sleep', 'water_intake',
    'symptoms_stress', 'engagement_level',
    'recommended_next_action',
    ...(data.key_barriers || []).map((_, i) => `key_barriers[${i}]`),
    ...(data.pending_actions || []).map((_, i) => `pending_actions[${i}]`),
    ...(data.risk_flags || []).map((_, i) => `risk_flags[${i}]`),
  ];

  const [reviewStatuses, setReviewStatuses] = useState(
    Object.fromEntries(allFields.map(f => [f, 'pending']))
  );
  const [editedValues, setEditedValues] = useState({});

  const handleReview = (fieldPath, status, editedValue) => {
    setReviewStatuses(prev => ({ ...prev, [fieldPath]: status }));
    if (editedValue !== null && editedValue !== undefined) {
      setEditedValues(prev => ({ ...prev, [fieldPath]: editedValue }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-lg font-semibold text-[#111827]">Intelligence report</h1>
          {data.period && (
            <p className="text-xs text-[#9CA3AF] mt-0.5">
              {data.period.start_date} — {data.period.end_date}
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <RawJsonToggle rawJson={rawJson} />
          <ExportButton data={data} reviewStatuses={reviewStatuses} editedValues={editedValues} />
        </div>
      </div>

      {/* Weekly Summary */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg p-4">
        <div className="flex items-start justify-between mb-2">
          <h2 className="text-sm font-semibold text-[#111827]">Weekly summary</h2>
          <SourceBadge sourceType={data.weekly_summary?.source_type} />
        </div>
        <p className="text-sm text-[#374151] leading-relaxed">{data.weekly_summary?.text}</p>
        <EvidenceQuote evidence={data.weekly_summary?.evidence} />
        <ReviewControls
          fieldPath="weekly_summary"
          value={data.weekly_summary?.text}
          status={reviewStatuses['weekly_summary']}
          onReview={handleReview}
        />
      </div>

      {/* Section: Categories */}
      <div>
        <h2 className="text-xs font-medium text-[#9CA3AF] uppercase tracking-wider mb-3">Health categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <CategoryCard title="Nutrition" data={data.nutrition_adherence} fieldPath="nutrition_adherence" reviewStatus={reviewStatuses['nutrition_adherence']} onReview={handleReview} />
          <CategoryCard title="Exercise / Steps" data={data.exercise} fieldPath="exercise" reviewStatus={reviewStatuses['exercise']} onReview={handleReview} />
          <CategoryCard title="Sleep" data={data.sleep} fieldPath="sleep" reviewStatus={reviewStatuses['sleep']} onReview={handleReview} />
          <CategoryCard title="Water intake" data={data.water_intake} fieldPath="water_intake" reviewStatus={reviewStatuses['water_intake']} onReview={handleReview} />
          <CategoryCard title="Symptoms / Stress" data={data.symptoms_stress} fieldPath="symptoms_stress" reviewStatus={reviewStatuses['symptoms_stress']} onReview={handleReview} />
          <CategoryCard title="Engagement" data={data.engagement_level} fieldPath="engagement_level" reviewStatus={reviewStatuses['engagement_level']} onReview={handleReview} />
        </div>
      </div>

      {/* Section: Barriers & Actions */}
      <div>
        <h2 className="text-xs font-medium text-[#9CA3AF] uppercase tracking-wider mb-3">Barriers & actions</h2>
        <BarriersPanel barriers={data.key_barriers} pendingActions={data.pending_actions} reviewStatuses={reviewStatuses} onReview={handleReview} />
      </div>

      {/* Risk */}
      <RiskPanel riskFlags={data.risk_flags} reviewStatuses={reviewStatuses} onReview={handleReview} />

      {/* Next Action */}
      <NextAction action={data.recommended_next_action} reviewStatus={reviewStatuses['recommended_next_action']} onReview={handleReview} />

      {/* Review Bar */}
      <ReviewBar reviewStatuses={reviewStatuses} />
    </div>
  );
}
