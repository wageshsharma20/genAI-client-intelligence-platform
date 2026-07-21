import { Router } from 'express';
import { callLLM } from '../llm/provider.js';
import { buildPrompt } from '../llm/prompt.js';
import { validateResponse } from '../llm/schema.js';

const router = Router();

function cleanJsonResponse(raw) {
  let cleaned = raw.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.slice(7);
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.slice(3);
  }
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.slice(0, -3);
  }
  return cleaned.trim();
}

router.post('/analyze', async (req, res) => {
  try {
    const { transcript } = req.body;

    if (!transcript || transcript.trim().length === 0) {
      return res.status(400).json({ error: 'Transcript is required and cannot be empty.' });
    }

    if (transcript.length > 500000) {
      return res.status(400).json({ error: 'Transcript is too long. Please limit to 500,000 characters.' });
    }

    const { systemPrompt, userMessage } = buildPrompt(transcript);

    // First attempt
    let rawResponse = await callLLM(systemPrompt, userMessage);
    let parsed;
    let validation;

    try {
      parsed = JSON.parse(cleanJsonResponse(rawResponse));
      validation = validateResponse(parsed);
    } catch (e) {
      validation = { valid: false, errors: [`JSON parse error: ${e.message}`] };
    }

    // Retry once if invalid
    if (!validation.valid) {
      console.log('First attempt invalid, retrying...', validation.errors);
      const retryMessage = `${userMessage}\n\nYour previous response was invalid. Errors: ${validation.errors.join('; ')}. Please fix and return ONLY valid JSON.`;

      rawResponse = await callLLM(systemPrompt, retryMessage);

      try {
        parsed = JSON.parse(cleanJsonResponse(rawResponse));
        validation = validateResponse(parsed);
      } catch (e) {
        return res.status(500).json({
          error: `Failed to get valid JSON from LLM after 2 attempts. Last error: ${e.message}`,
          raw: rawResponse,
        });
      }

      if (!validation.valid) {
        return res.status(500).json({
          error: `LLM response failed schema validation after 2 attempts: ${validation.errors.join('; ')}`,
          raw: rawResponse,
        });
      }
    }

    // Add generated timestamp if missing
    if (!parsed.generated_at) {
      parsed.generated_at = new Date().toISOString();
    }

    // Initialize review field if missing
    if (!parsed.review) {
      parsed.review = {
        status: 'pending',
        reviewer: null,
        edited_fields: [],
        reviewer_notes: null,
        reviewed_at: null,
      };
    }

    res.json({ result: parsed, raw: rawResponse });
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ error: `Analysis failed: ${error.message}` });
  }
});

export default router;
