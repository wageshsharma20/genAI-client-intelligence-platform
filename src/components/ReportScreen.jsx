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
    <div className="space-y-8">
      {/* Weekly Summary — Hero Banner */}
      <div className="relative bg-[#111827] rounded-lg p-8 overflow-hidden">
        {/* Decorative geometric shapes */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#3B82F6]/10 rounded-full -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#10B981]/10 rounded-full translate-y-1/2 -translate-x-1/4" />
        <div className="absolute top-1/2 right-1/4 w-20 h-20 bg-white/5 rotate-45" />

        <div className="relative">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/40 mb-2">
                Weekly Intelligence Report
              </p>
              <h2 className="text-2xl font-extrabold text-white tracking-tight">
                Weekly Summary
              </h2>
              {data.period && (
                <p className="text-sm font-semibold text-white/50 mt-1">
                  {data.period.start_date} — {data.period.end_date}
                </p>
              )}
            </div>
            <SourceBadge sourceType={data.weekly_summary?.source_type} />
          </div>

          <div className="bg-white rounded-lg p-5 mt-4">
            <p className="text-sm text-gray-700 leading-relaxed">{data.weekly_summary?.text}</p>
            <EvidenceQuote evidence={data.weekly_summary?.evidence} />
            <ReviewControls
              fieldPath="weekly_summary"
              value={data.weekly_summary?.text}
              status={reviewStatuses['weekly_summary']}
              onReview={handleReview}
            />
          </div>
        </div>
      </div>

      {/* Section label */}
      <div>
        <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 mb-4">
          Health Categories
        </p>
      </div>

      {/* Category Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <CategoryCard
          title="Nutrition" icon="🥗"
          data={data.nutrition_adherence}
          fieldPath="nutrition_adherence"
          reviewStatus={reviewStatuses['nutrition_adherence']}
          onReview={handleReview}
        />
        <CategoryCard
          title="Exercise / Steps" icon="🏃"
          data={data.exercise}
          fieldPath="exercise"
          reviewStatus={reviewStatuses['exercise']}
          onReview={handleReview}
        />
        <CategoryCard
          title="Sleep" icon="😴"
          data={data.sleep}
          fieldPath="sleep"
          reviewStatus={reviewStatuses['sleep']}
          onReview={handleReview}
        />
        <CategoryCard
          title="Water Intake" icon="💧"
          data={data.water_intake}
          fieldPath="water_intake"
          reviewStatus={reviewStatuses['water_intake']}
          onReview={handleReview}
        />
        <CategoryCard
          title="Symptoms / Stress" icon="🩺"
          data={data.symptoms_stress}
          fieldPath="symptoms_stress"
          reviewStatus={reviewStatuses['symptoms_stress']}
          onReview={handleReview}
        />
        <CategoryCard
          title="Engagement" icon="📊"
          data={data.engagement_level}
          fieldPath="engagement_level"
          reviewStatus={reviewStatuses['engagement_level']}
          onReview={handleReview}
        />
      </div>

      {/* Section label */}
      <div>
        <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 mb-4">
          Barriers & Actions
        </p>
      </div>

      {/* Barriers & Pending Actions */}
      <BarriersPanel
        barriers={data.key_barriers}
        pendingActions={data.pending_actions}
        reviewStatuses={reviewStatuses}
        onReview={handleReview}
      />

      {/* Risk Panel */}
      <RiskPanel
        riskFlags={data.risk_flags}
        reviewStatuses={reviewStatuses}
        onReview={handleReview}
      />

      {/* Recommended Next Action */}
      <NextAction
        action={data.recommended_next_action}
        reviewStatus={reviewStatuses['recommended_next_action']}
        onReview={handleReview}
      />

      {/* Review Bar */}
      <ReviewBar reviewStatuses={reviewStatuses} />

      {/* Export + Raw JSON */}
      <div className="flex items-center justify-between pt-2">
        <ExportButton data={data} reviewStatuses={reviewStatuses} editedValues={editedValues} />
        <RawJsonToggle rawJson={rawJson} />
      </div>
    </div>
  );
}
