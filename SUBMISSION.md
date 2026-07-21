# GenAI Client Intelligence Platform — Submission Document

## 📌 Prototype Link
**GitHub:** https://github.com/wageshsharma20/genAI-client-intelligence-platform

---

## 1. Prompt / Workflow Used to Analyse the Conversation

### Workflow Architecture

```
Transcript (text) → Express Backend → LLM (Groq/Llama-3.3-70B) → JSON Schema Validation → Retry if Invalid → Frontend Dashboard
```

**Step-by-step flow:**
1. Coach pastes/uploads the client-coach conversation transcript
2. Frontend sends transcript via `POST /api/analyze` to the Express backend
3. Backend constructs a **system prompt** (analyst persona + 7 strict rules) and a **user message** (JSON schema template + transcript)
4. LLM (Groq's Llama-3.3-70B) generates structured JSON output
5. Backend validates the response against our schema — if invalid, it **retries once** with error feedback appended to the prompt
6. Validated JSON is returned to the frontend, which renders each finding with its source-type badge and evidence quotes
7. Coach reviews each finding (Approve / Edit / Reject), then exports the final reviewed JSON

### The System Prompt

```
You are a Client Intelligence Analyst supporting a health/wellness coach.
You will be given one week's conversation transcript between a coach and
a client. Extract structured client intelligence for the coach to review.

Follow these rules exactly:

1. GROUNDING: Every finding must be traceable to the transcript. For each
   finding, include one short verbatim evidence quote (max 25 words), the
   speaker (client/coach), and, if available, a message reference.

2. SOURCE-TYPE TAGGING: Classify every finding as exactly one of:
   - "confirmed_fact": objectively stated or verifiable in the transcript
   - "client_reported": a subjective, self-reported claim by the client
   - "ai_inference": reasonably inferred from tone, patterns, or indirect
     statements. Must include a "confidence" score between 0.0 and 1.0.
   - "missing": not discussed anywhere in the transcript.

3. NO FABRICATION: Never invent specific numbers, dates, or facts that
   are not present. If not mentioned, mark the field "missing."

4. RISK SENSITIVITY: If the client mentions anything resembling a risk
   signal (self-harm, disordered eating, chest pain, severe distress),
   always add it to risk_flags. Bias toward flagging over omitting.

5. RECOMMENDATION GROUNDING: recommended_next_action must be directly
   traceable to at least one specific barrier, risk flag, or pending action.

6. OUTPUT FORMAT: Respond with ONLY valid JSON matching the given schema.

7. LENGTH: weekly_summary.text must be under 80 words, neutral third person.
```

### Why These Prompt Rules Matter

| Rule | Purpose |
|------|---------|
| Grounding | Prevents the LLM from making claims without evidence |
| Source-type tagging | Makes the trust level of each finding explicit to the coach |
| No fabrication | Directly combats hallucination — "missing" is always preferred over a guess |
| Risk sensitivity | Safety-first bias — false positives are acceptable, false negatives are not |
| Recommendation grounding | Ensures the AI's suggestion connects to specific evidence, not generic advice |
| JSON-only output | Makes the output machine-parsable and schema-validatable |

---

## 2. Structured Output / JSON Schema

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

### Schema Design Rationale

- **Every field has `source_type` + `evidence`**: This is the core of the grounding system — no finding exists without attribution.
- **`missing` as a first-class value**: Instead of null or empty strings, "missing" is an explicit state that communicates "this wasn't discussed" rather than "I couldn't find it."
- **`confidence` on AI inferences**: Quantifies the model's certainty so the coach can prioritize review.
- **`review` object**: Built-in audit trail for human-in-the-loop workflow — the exported JSON captures both the AI output and the coach's review decisions.
- **`linked_to` in recommended_next_action**: Forces the recommendation to reference specific barriers/risks, preventing generic advice.

---

## 3. Three Hallucination / Failure Scenarios

### Scenario 1: Fabricated Numerical Data
**What happens:** The client says "I've been walking regularly" without mentioning specific step counts. The LLM invents a plausible number like "steps_avg: 8000" to fill the field.

**Why it's dangerous:** The coach makes decisions based on a number that doesn't exist — they might skip asking about exercise because the data looks adequate.

**How our system mitigates it:**
- Prompt Rule 3 ("No Fabrication") explicitly says: mark "missing" rather than estimating
- The `source_type` tag would expose this — if the LLM tags it as "confirmed_fact" but the evidence quote doesn't mention a number, the coach can spot the mismatch
- Schema validation ensures `steps_avg` can be `null` — we designed the schema to accept absence

**Remaining gap:** The LLM might still hallucinate AND correctly tag it as "client_reported" — the evidence quote is the final safety net the coach can verify.

---

### Scenario 2: Missed Risk Signal
**What happens:** The client says something like "I sometimes wonder if it's even worth trying anymore." The LLM interprets this as general frustration about diet adherence and doesn't flag it as a risk signal (potential self-harm / hopelessness).

**Why it's dangerous:** A genuine mental health risk gets missed because the LLM normalized a concerning statement.

**How our system mitigates it:**
- Prompt Rule 4 ("Risk Sensitivity") explicitly says: bias toward flagging, even if ambiguous. The coach makes the final call.
- The UI renders risk flags in a visually prominent red panel — it's designed to be impossible to overlook.
- Human review (Approve/Edit/Reject) gives the coach the ability to ADD flags the LLM missed.

**Remaining gap:** If the LLM completely omits a subtle signal, the coach would need to read the raw transcript to catch it. A future improvement would be a secondary "risk scan" pass with a more sensitive prompt.

---

### Scenario 3: Incorrect Source-Type Classification
**What happens:** The client says "My doctor told me my blood pressure is 130/85." The LLM tags this as "confirmed_fact" because a doctor said it. But the model can't actually verify whether the client is accurately reporting what the doctor said — it's still a self-reported claim.

**Why it's dangerous:** The coach might treat secondhand medical claims as verified clinical data, potentially making decisions without confirming with the actual medical provider.

**How our system mitigates it:**
- The evidence quote ("My doctor told me...") makes the secondhand nature visible
- The coach can use the "Edit" button to reclassify from "confirmed_fact" to "client_reported"
- The exported JSON preserves both the original AI classification and the coach's correction

**Remaining gap:** Source-type classification is inherently subjective in edge cases. A future improvement would be a classification guide with examples for borderline cases, and possibly a "flag for review" auto-trigger when medical claims are detected.

---

## 4. Video Script / Talking Points (3-5 min)

Use these talking points to record your walkthrough:

### Opening (30 sec)
- "I built a GenAI Client Intelligence Platform that helps health coaches extract structured, evidence-grounded insights from client conversations."
- "The key design principle: every AI finding must be traceable to the transcript, and the coach always has the final say."

### Demo — Input (30 sec)
- Show the input screen
- Click "Load Sample" to load the 8-day transcript
- Click "Analyze" — show the loading state
- "The transcript is sent to Groq's Llama-3.3-70B model with a carefully designed system prompt."

### Demo — Report (1.5 min)
- Walk through the weekly summary — point out the source badge and evidence toggle
- Show 2-3 category cards (nutrition, sleep, water) — highlight the stat numbers and evidence quotes
- Open the Risk Panel — explain severity badges
- Show Key Barriers and Pending Actions
- Show Recommended Next Action — point out the `linked_to` references

### Source-Type System (45 sec)
- Point to the colored badges: green = confirmed, blue = client-reported, purple = AI inference, gray = missing
- "This is the core of the system — every finding tells you HOW the AI knows this, so you can calibrate your trust accordingly."
- "Missing is a first-class value. Rather than hallucinating a sleep average, the system says 'this wasn't discussed.'"

### Human Review (45 sec)
- Click Approve on a finding — show the green state
- Click Edit on a finding — show the inline edit → Save
- Click Reject on one — show the red state
- Point to the Review Progress bar — "This tracks how much of the report you've reviewed"
- Click Export — show the downloaded JSON file
- "The export preserves both the AI's original output AND your review decisions — full audit trail."

### Closing (30 sec)
- "Three hallucination controls: grounded evidence quotes, source-type classification, and human review."
- "Built with React, Express, and Groq — the LLM provider is swappable to OpenAI, Gemini, or Claude."
- "For next steps, I'd add multi-week trend tracking, and a secondary risk-scan pass for safety."

---

## 5. Short Note

### What I Built
A working prototype of a GenAI Client Intelligence Platform for health/wellness coaches. It ingests a client-coach conversation transcript, uses an LLM (Groq/Llama-3.3-70B) to extract structured intelligence across 11 health categories, and presents it in a reviewable dashboard with source-type tagging (confirmed fact / client-reported / AI inference / missing), evidence grounding, and human-in-the-loop review (Approve / Edit / Reject per finding).

**Tech stack:** React + Vite + Tailwind CSS (frontend), Express.js (backend), Groq via OpenAI-compatible SDK (LLM).

### Key Assumptions
1. **One transcript = one week**: The system is designed for weekly analysis. Multi-week trend tracking would require a persistence layer.
2. **Unstructured text input**: Transcripts are plain text with "Day X" / "Client:" / "Coach:" markers. No structured chat format (like JSON messages) is expected.
3. **Coach is the reviewer**: The human-in-the-loop workflow assumes a single reviewer (the coach). Multi-reviewer workflows and role-based access are out of scope.
4. **LLM can follow schema**: We rely on the LLM to produce valid JSON. The retry mechanism handles occasional formatting issues, but deeply malformed output would fail.
5. **No persistence**: All data lives in the browser session. Refresh = start over. This is a prototype constraint.

### What Could Go Wrong
1. **Hallucinated numbers**: The LLM might invent plausible step counts or sleep hours when the transcript is ambiguous. Our "missing" as default + evidence quotes mitigate but don't eliminate this.
2. **Missed subtle risk signals**: Indirect expressions of distress (sarcasm, cultural euphemisms) may not trigger the risk detection. The prompt biases toward over-flagging, but can't catch what it doesn't recognize.
3. **Incorrect source-type classification**: The boundary between "confirmed fact" and "client-reported" is sometimes fuzzy (e.g., client quoting a doctor). The edit capability lets the coach correct these.
4. **Token limits**: Very long transcripts (>30k words) could exceed the LLM's context window, causing truncation and incomplete analysis.
5. **LLM provider outage**: If Groq's API is down, the analysis fails. The provider-swap architecture mitigates this (switch to OpenAI/Gemini in .env).

### What I Would Improve Next
1. **Multi-week trend tracking**: Persist reports and show week-over-week trends (e.g., sleep improving, adherence declining) with a line chart.
2. **Dual-pass risk scanning**: A second, more sensitive LLM pass specifically for safety/risk signals with a lower threshold.
3. **Confidence calibration**: Compare AI confidence scores to coach approval rates over time and auto-adjust.
4. **Structured transcript parsing**: Detect and parse message timestamps, media attachments, and voice note transcriptions for richer evidence linking.
5. **Coach annotation layer**: Let coaches add their own notes, goals, and follow-up questions directly on the report — turning it from a read-only summary into a working document.
6. **Batch processing**: Analyze multiple clients' transcripts in one go and surface a dashboard of all clients ranked by risk/attention level.
