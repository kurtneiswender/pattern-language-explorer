export const config = { runtime: 'edge' };

const SYSTEM_PROMPT = `You are an assistant helping architecture students identify relevant patterns from Christopher Alexander's "A Pattern Language."

Given a field observation or description of a space, suggest the 3-5 most relevant patterns.

Return ONLY a JSON array (no markdown, no explanation) with this exact structure:
[
  {
    "patternId": <number 1-253>,
    "patternName": "<Title Case name>",
    "relevanceReason": "<one sentence explaining why this pattern applies>",
    "confidence": "<high|medium|low>"
  }
]

Focus on patterns that directly address the spatial qualities, social dynamics, or construction elements described. Be specific and accurate with pattern IDs and names.`;

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const apiKey = (globalThis as any).process?.env?.ANTHROPIC_API_KEY ||
    (globalThis as any).Deno?.env?.get?.('ANTHROPIC_API_KEY') ||
    (globalThis as any).env?.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'API key not configured' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let body: { observation?: string };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const observation = (body.observation || '').slice(0, 1000);
  if (!observation.trim()) {
    return new Response(JSON.stringify({ error: 'observation is required (max 1000 chars)' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5',
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: 'user',
            content: `Field observation:\n\n${observation}`,
          },
        ],
      }),
    });

    if (!anthropicRes.ok) {
      const errText = await anthropicRes.text();
      console.error('Anthropic API error:', anthropicRes.status, errText);
      return new Response(JSON.stringify({ error: 'Upstream API error' }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const data = await anthropicRes.json() as {
      content: Array<{ type: string; text: string }>;
    };

    const text = data.content?.[0]?.text || '[]';

    // Parse the JSON array from Claude's response
    let matches: unknown[];
    try {
      // Claude might include markdown fences — strip them
      const cleaned = text.replace(/```(?:json)?\n?/g, '').trim();
      matches = JSON.parse(cleaned);
      if (!Array.isArray(matches)) matches = [];
    } catch {
      matches = [];
    }

    return new Response(JSON.stringify({ matches }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Proxy error:', err);
    return new Response(JSON.stringify({ error: 'Internal error' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
