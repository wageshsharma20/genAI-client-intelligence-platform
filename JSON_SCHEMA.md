# JSON / Structured Output Schema

## Schema Structure

```json
{
  "client_id": "string",
  "coach_id": "string",
  "period": {
    "start_date": "YYYY-MM-DD",
    "end_date": "YYYY-MM-DD"
  },
  "generated_at": "ISO-8601 timestamp",

  "weekly_summary": {
    "text": "string (≤80 words)",
    "source_type": "confirmed_fact | client_reported | ai_inference",
    "evidence": [{ "quote": "string", "speaker": "client | coach" }]
  },

  "nutrition_adherence": {
    "status": "on_track | partial | off_track | missing",
    "details": "string",
    "source_type": "confirmed_fact | client_reported | ai_inference | missing",
    "evidence": [{ "quote": "string", "speaker": "client | coach" }]
  },

  "exercise": {
    "steps_avg": "number | null",
    "workouts_completed": "number | null",
    "details": "string",
    "source_type": "...",
    "evidence": [...]
  },

  "sleep": {
    "avg_hours": "number | null",
    "quality": "string | null",
    "source_type": "...",
    "evidence": [...]
  },

  "water_intake": {
    "avg_liters": "number | null",
    "source_type": "...",
    "evidence": [...]
  },

  "symptoms_stress": {
    "reported_symptoms": ["string"],
    "stress_level": "low | medium | high | missing",
    "source_type": "...",
    "evidence": [...]
  },

  "engagement_level": {
    "level": "high | medium | low",
    "rationale": "string",
    "source_type": "ai_inference",
    "confidence": 0.0,
    "evidence": [...]
  },

  "key_barriers": [{
    "barrier": "string",
    "source_type": "...",
    "evidence": [...]
  }],

  "pending_actions": [{
    "action": "string",
    "owner": "client | coach",
    "due": "string | null",
    "source_type": "...",
    "evidence": [...]
  }],

  "risk_flags": [{
    "flag": "string",
    "severity": "low | medium | high",
    "source_type": "...",
    "evidence": [...]
  }],

  "recommended_next_action": {
    "action": "string",
    "rationale": "string",
    "linked_to": ["reference to barrier/risk/action"],
    "source_type": "ai_inference",
    "confidence": 0.0
  },

  "review": {
    "status": "pending | approved | edited | rejected",
    "reviewer": "string | null",
    "edited_fields": ["string"],
    "reviewer_notes": "string | null",
    "reviewed_at": "ISO-8601 | null"
  }
}
```

## Schema Design Rationale

- **Every field has `source_type` + `evidence`**: This is the core of the grounding system — no finding exists without attribution.
- **`missing` as a first-class value**: Instead of null or empty strings, "missing" is an explicit state that communicates "this wasn't discussed" rather than "I couldn't find it."
- **`confidence` on AI inferences**: Quantifies the model's certainty so the coach can prioritize review.
- **`review` object**: Built-in audit trail for human-in-the-loop workflow — the exported JSON captures both the AI output and the coach's review decisions.
- **`linked_to` in recommended_next_action**: Forces the recommendation to reference specific barriers/risks, preventing generic advice.
