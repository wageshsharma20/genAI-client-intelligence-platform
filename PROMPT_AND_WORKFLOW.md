# Prompt & Workflow Document

## Workflow Architecture

```text
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

## The System Prompt

```text
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

## Why These Prompt Rules Matter

| Rule | Purpose |
|------|---------|
| Grounding | Prevents the LLM from making claims without evidence |
| Source-type tagging | Makes the trust level of each finding explicit to the coach |
| No fabrication | Directly combats hallucination — "missing" is always preferred over a guess |
| Risk sensitivity | Safety-first bias — false positives are acceptable, false negatives are not |
| Recommendation grounding | Ensures the AI's suggestion connects to specific evidence, not generic advice |
| JSON-only output | Makes the output machine-parsable and schema-validatable |
