import type { VercelRequest, VercelResponse } from '@vercel/node';
import Anthropic from '@anthropic-ai/sdk';

const SYSTEM_PROMPT = `You decode what people actually mean. The user pastes a message that says one thing and means another: passive-aggressive, over-polite, vague, or loaded. Read it and return the truth underneath, plainly and with dry wit. Never cruel. Never therapy-speak. If a context is given (boss, client, group chat, mum), let it sharpen the read.

Return only JSON, no preamble, in exactly this shape:
{
  "translation": "one or two sentences, deadpan, what they actually mean",
  "subtext_level": 0 to 100 integer, 0 is genuinely fine, 100 is open warfare,
  "subtext_label": "a short funny label for that level",
  "tells": ["the specific words or moves that gave it away, max three"],
  "replies": {
    "diplomatic": "keeps the peace, still honest",
    "straight": "says the real thing, warmly and clearly",
    "unhinged": "the reply they will never send, funny, cathartic, still a bit true"
  }
}
Keep every field tight. UK English. No em dashes, use commas or full stops instead. No emoji unless the original used them.`;

interface DecodeResult {
  translation: string;
  subtext_level: number;
  subtext_label: string;
  tells: string[];
  replies: {
    diplomatic: string;
    straight: string;
    unhinged: string;
  };
}

// Strips code fences in case the model wraps the JSON despite instructions.
function extractJson(text: string): string {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  return fenced ? fenced[1].trim() : text.trim();
}

function isDecodeResult(value: unknown): value is DecodeResult {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.translation === 'string' &&
    typeof v.subtext_level === 'number' &&
    typeof v.subtext_label === 'string' &&
    Array.isArray(v.tells) &&
    typeof v.replies === 'object' &&
    v.replies !== null &&
    typeof (v.replies as Record<string, unknown>).diplomatic === 'string' &&
    typeof (v.replies as Record<string, unknown>).straight === 'string' &&
    typeof (v.replies as Record<string, unknown>).unhinged === 'string'
  );
}

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

async function callClaude(message: string, context?: string): Promise<DecodeResult> {
  const userContent = context
    ? `Context: from my ${context}\n\nMessage: ${message}`
    : `Message: ${message}`;

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userContent }],
  });

  const block = response.content[0];
  if (block.type !== 'text') {
    throw new Error('Expected a text response from Claude');
  }

  const parsed = JSON.parse(extractJson(block.text));
  if (!isDecodeResult(parsed)) {
    throw new Error('Decoded JSON did not match the expected shape');
  }
  return parsed;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Use POST' });
    return;
  }

  const { message, context } = req.body ?? {};
  if (typeof message !== 'string' || message.trim().length === 0) {
    res.status(400).json({ error: 'Paste a message to decode' });
    return;
  }
  // A message being decoded is a chat message, not an essay. Capping length
  // bounds the cost of any single call against the paid Anthropic API.
  if (message.length > 4000) {
    res.status(400).json({ error: 'That message is too long to decode. Try trimming it.' });
    return;
  }

  try {
    const result = await callClaude(message, context);
    res.status(200).json(result);
  } catch (firstError) {
    // One retry on a malformed response before giving up.
    try {
      const result = await callClaude(message, context);
      res.status(200).json(result);
    } catch (secondError) {
      console.error('Decode failed twice', firstError, secondError);
      res.status(502).json({ error: "Couldn't decode that one. Try again in a moment." });
    }
  }
}
