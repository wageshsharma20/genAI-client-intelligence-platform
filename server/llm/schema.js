export const jsonSchema = {
  client_id: "string",
  coach_id: "string",
  period: { start_date: "YYYY-MM-DD", end_date: "YYYY-MM-DD" },
  generated_at: "ISO-8601 timestamp",
  weekly_summary: {
    text: "string, <=80 words",
    source_type: "confirmed_fact | client_reported | ai_inference",
    evidence: [{ quote: "string", speaker: "client | coach" }]
  },
  nutrition_adherence: {
    status: "on_track | partial | off_track | missing",
    details: "string",
    source_type: "confirmed_fact | client_reported | ai_inference | missing",
    evidence: [{ quote: "string", speaker: "client | coach" }]
  },
  exercise: {
    steps_avg: "number | null",
    workouts_completed: "number | null",
    details: "string",
    source_type: "confirmed_fact | client_reported | ai_inference | missing",
    evidence: [{ quote: "string", speaker: "client | coach" }]
  },
  sleep: {
    avg_hours: "number | null",
    quality: "string | null",
    source_type: "confirmed_fact | client_reported | ai_inference | missing",
    evidence: [{ quote: "string", speaker: "client | coach" }]
  },
  water_intake: {
    avg_liters: "number | null",
    source_type: "confirmed_fact | client_reported | ai_inference | missing",
    evidence: [{ quote: "string", speaker: "client | coach" }]
  },
  symptoms_stress: {
    reported_symptoms: ["string"],
    stress_level: "low | medium | high | missing",
    source_type: "confirmed_fact | client_reported | ai_inference | missing",
    evidence: [{ quote: "string", speaker: "client | coach" }]
  },
  engagement_level: {
    level: "high | medium | low",
    rationale: "string",
    source_type: "ai_inference",
    confidence: 0.0,
    evidence: [{ quote: "string", speaker: "client | coach" }]
  },
  key_barriers: [{
    barrier: "string",
    source_type: "confirmed_fact | client_reported | ai_inference",
    evidence: [{ quote: "string", speaker: "client | coach" }]
  }],
  pending_actions: [{
    action: "string",
    owner: "client | coach",
    due: "string | null",
    source_type: "confirmed_fact | client_reported | ai_inference",
    evidence: [{ quote: "string", speaker: "client | coach" }]
  }],
  risk_flags: [{
    flag: "string",
    severity: "low | medium | high",
    source_type: "confirmed_fact | client_reported | ai_inference",
    evidence: [{ quote: "string", speaker: "client | coach" }]
  }],
  recommended_next_action: {
    action: "string",
    rationale: "string",
    linked_to: ["reference to key_barriers/risk_flags/pending_actions entry"],
    source_type: "ai_inference",
    confidence: 0.0
  },
  review: {
    status: "pending | approved | edited | rejected",
    reviewer: "string | null",
    edited_fields: ["string"],
    reviewer_notes: "string | null",
    reviewed_at: "ISO-8601 | null"
  }
};

const VALID_SOURCE_TYPES = ['confirmed_fact', 'client_reported', 'ai_inference', 'missing'];

export function validateResponse(data) {
  const errors = [];

  if (!data || typeof data !== 'object') {
    return { valid: false, errors: ['Response is not a valid JSON object'] };
  }

  // Check required top-level fields
  const requiredFields = [
    'weekly_summary', 'nutrition_adherence', 'exercise', 'sleep',
    'water_intake', 'symptoms_stress', 'engagement_level',
    'key_barriers', 'pending_actions', 'risk_flags', 'recommended_next_action'
  ];

  for (const field of requiredFields) {
    if (!data[field]) {
      errors.push(`Missing required field: ${field}`);
    }
  }

  // Validate source_type on category fields
  const categoryFields = [
    'weekly_summary', 'nutrition_adherence', 'exercise', 'sleep',
    'water_intake', 'symptoms_stress', 'engagement_level'
  ];

  for (const field of categoryFields) {
    if (data[field]) {
      if (data[field].source_type && !VALID_SOURCE_TYPES.includes(data[field].source_type)) {
        errors.push(`Invalid source_type in ${field}: ${data[field].source_type}`);
      }
      // Validate evidence exists for non-missing fields
      if (data[field].source_type !== 'missing' && data[field].evidence) {
        if (!Array.isArray(data[field].evidence)) {
          errors.push(`Evidence in ${field} must be an array`);
        }
      }
    }
  }

  // Validate engagement_level has confidence
  if (data.engagement_level && data.engagement_level.source_type === 'ai_inference') {
    if (typeof data.engagement_level.confidence !== 'number') {
      errors.push('engagement_level with ai_inference must have a numeric confidence score');
    }
  }

  // Validate arrays
  const arrayFields = ['key_barriers', 'pending_actions', 'risk_flags'];
  for (const field of arrayFields) {
    if (data[field] && !Array.isArray(data[field])) {
      errors.push(`${field} must be an array`);
    }
  }

  // Validate recommended_next_action
  if (data.recommended_next_action) {
    if (!data.recommended_next_action.action) {
      errors.push('recommended_next_action must have an action field');
    }
    if (data.recommended_next_action.source_type === 'ai_inference' &&
        typeof data.recommended_next_action.confidence !== 'number') {
      errors.push('recommended_next_action with ai_inference must have a numeric confidence score');
    }
  }

  return { valid: errors.length === 0, errors };
}
