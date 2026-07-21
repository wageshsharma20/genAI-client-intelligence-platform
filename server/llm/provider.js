import OpenAI from 'openai';

function detectProvider() {
  if (process.env.LLM_PROVIDER) return process.env.LLM_PROVIDER;
  if (process.env.GROQ_API_KEY) return 'groq';
  if (process.env.OPENAI_API_KEY) return 'openai';
  if (process.env.GEMINI_API_KEY) return 'gemini';
  if (process.env.ANTHROPIC_API_KEY) return 'claude';
  throw new Error('No LLM API key found. Set GROQ_API_KEY, OPENAI_API_KEY, GEMINI_API_KEY, or ANTHROPIC_API_KEY in .env');
}

function getClient(provider) {
  switch (provider) {
    case 'groq':
      return {
        client: new OpenAI({
          apiKey: process.env.GROQ_API_KEY,
          baseURL: 'https://api.groq.com/openai/v1',
        }),
        model: process.env.LLM_MODEL || 'llama-3.3-70b-versatile',
      };
    case 'openai':
      return {
        client: new OpenAI({ apiKey: process.env.OPENAI_API_KEY }),
        model: process.env.LLM_MODEL || 'gpt-4o',
      };
    case 'gemini':
      return {
        client: new OpenAI({
          apiKey: process.env.GEMINI_API_KEY,
          baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
        }),
        model: process.env.LLM_MODEL || 'gemini-2.5-flash',
      };
    case 'claude':
      return {
        client: new OpenAI({
          apiKey: process.env.ANTHROPIC_API_KEY,
          baseURL: 'https://api.anthropic.com/v1/',
        }),
        model: process.env.LLM_MODEL || 'claude-sonnet-4-20250514',
      };
    default:
      throw new Error(`Unknown LLM provider: ${provider}`);
  }
}

export async function callLLM(systemPrompt, userMessage) {
  const provider = detectProvider();
  const { client, model } = getClient(provider);

  console.log(`Calling LLM: provider=${provider}, model=${model}`);

  const response = await client.chat.completions.create({
    model,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage },
    ],
    temperature: 0.2,
    max_tokens: 4096,
  });

  return response.choices[0].message.content;
}
