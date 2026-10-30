/**
 * api/chat.js — Serverless Function / Backend Endpoint for SPACIO Campus Assistant
 *
 * Runs server-side on Vercel and in the Vite development middleware.
 * Keeps GEMINI_API_KEY completely private and secure (never exposed to client browser).
 */

import { FACILITIES, getCampusSummary } from '../src/data/facilities.js';

// Supported Gemini models with fallbacks for high demand / transient issues
const CANDIDATE_MODELS = [
  process.env.GEMINI_MODEL,
  'gemini-3.5-flash-lite',
  'gemini-3.5-flash',
  'gemini-3.8-flash',
  'gemini-flash-latest',
].filter(Boolean);

/**
 * Builds campus system prompt with live facility data
 */
function buildSystemPrompt() {
  const summary = getCampusSummary();
  const facilityList = FACILITIES.map((f) =>
    `• ${f.name} (ID: ${f.id})
   Category: ${f.category} | Location: ${f.location}
   Status: ${f.status} | Crowd: ${f.crowd} | Occupancy: ${f.occupancy}%
   Capacity: ${f.capacity} | Hours: ${f.hours}
   Amenities: ${f.amenities.join(', ')}
   About: ${f.about}`
  ).join('\n\n');

  return `You are Aria, the friendly AI Campus Assistant for SPACIO — a campus space discovery app.

CAMPUS STATUS:
- Open spaces: ${summary.open}, Busy spaces: ${summary.busy}, Closed spaces: ${summary.closed}
- Total facilities: ${FACILITIES.length}

FACILITY DATABASE:
${facilityList}

RULES:
1. Ground all answers strictly in the facility database above. Never fabricate availability, occupancy percentages, amenities, or hours.
2. For questions about "lowest occupancy" or "least crowded", sort and recommend the facilities with the lowest occupancy numbers (e.g., Auditorium at 15%, Study Room A at 25%, Gym at 32%).
3. For questions about specific spaces (e.g., "Show me the library"), provide accurate details and include that space in the recommendations array.
4. Output MUST be valid JSON with this exact structure:
{
  "message": "Friendly, concise conversational answer (under 120 words)",
  "recommendations": [
    {
      "facilityId": "exact facility id from database (e.g. gym, library, study-room-a, labs, auditorium, study-room-b)",
      "reason": "1-sentence reason tailored to the student"
    }
  ],
  "suggestedFollowUps": ["Follow-up question 1", "Follow-up question 2", "Follow-up question 3"]
}
5. Only include genuinely matching facilities in "recommendations" (0 to 3 items).
6. If the user asks something completely outside of campus spaces or facilities, politely redirect them back to campus spaces.`;
}

/**
 * Normalizes multi-turn history for Gemini API
 */
function buildContents(history = [], userMessage) {
  const contents = [];

  if (Array.isArray(history)) {
    for (const item of history.slice(-10)) {
      if (!item || !item.content || typeof item.content !== 'string') continue;
      const role = item.role === 'assistant' || item.role === 'model' ? 'model' : 'user';
      const text = item.content.trim();
      if (!text) continue;

      if (contents.length > 0 && contents[contents.length - 1].role === role) {
        contents[contents.length - 1].parts[0].text += `\n\n${text}`;
      } else {
        contents.push({ role, parts: [{ text }] });
      }
    }
  }

  // Ensure current user message is appended cleanly
  const currentText = (userMessage || '').trim();
  if (contents.length > 0 && contents[contents.length - 1].role === 'user') {
    contents[contents.length - 1].parts[0].text += `\n\n${currentText}`;
  } else {
    contents.push({ role: 'user', parts: [{ text: currentText }] });
  }

  return contents;
}

/**
 * Attempts calling Gemini generateContent with fallback models
 */
async function callGemini(apiKey, systemPrompt, contents) {
  let lastError = null;

  for (const model of CANDIDATE_MODELS) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    const payload = {
      systemInstruction: {
        parts: [{ text: systemPrompt }],
      },
      contents,
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 800,
        responseMimeType: 'application/json',
      },
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        return { data, model };
      }

      const errorText = await response.text();
      let parsedErr = {};
      try {
        parsedErr = JSON.parse(errorText);
      } catch {
        // ignore
      }

      const status = response.status;
      const apiMessage = parsedErr.error?.message || errorText;

      lastError = { status, message: apiMessage, code: parsedErr.error?.status };

      // If auth failure or invalid key, don't try other models - the key is wrong
      if (status === 400 && apiMessage.toLowerCase().includes('api key')) {
        break;
      }
      if (status === 401 || status === 403) {
        break;
      }

      // If model not found (404) or overloaded (503), continue to next model
      console.warn(`[Gemini] Model ${model} returned ${status}: ${apiMessage}. Trying fallback...`);
    } catch (fetchErr) {
      lastError = { status: 500, message: fetchErr.message || 'Fetch error' };
    }
  }

  throw lastError;
}

/**
 * Parses the raw AI response JSON
 */
function cleanAndParseResponse(data) {
  const candidate = data?.candidates?.[0];
  const rawText = candidate?.content?.parts?.[0]?.text || '';

  if (!rawText) {
    return {
      message: "I'm here to help you navigate campus spaces! What would you like to explore?",
      recommendations: [],
      suggestedFollowUps: ['Which spaces are open right now?', 'Show me quiet study spots'],
    };
  }

  try {
    let clean = rawText.trim();
    if (clean.startsWith('```')) {
      clean = clean.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
    }
    const parsed = JSON.parse(clean);
    return {
      message: parsed.message || 'Here are the details for your request.',
      recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations : [],
      suggestedFollowUps: Array.isArray(parsed.suggestedFollowUps) ? parsed.suggestedFollowUps : [],
    };
  } catch (err) {
    console.error('[Gemini] JSON parsing fallback:', err);
    return {
      message: rawText.replace(/[\{\}"]/g, '').slice(0, 250),
      recommendations: [],
      suggestedFollowUps: ['Which spaces are open right now?', 'Show me quiet study spots'],
    };
  }
}

/**
 * Universal request handler (supports both Vercel Serverless and Node http / Vite middleware)
 */
export default async function handler(req, res) {
  // CORS & Security Headers
  const sendJson = (status, payload) => {
    if (res.status && typeof res.status === 'function') {
      return res.status(status).json(payload);
    }
    res.writeHead(status, {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    res.end(JSON.stringify(payload));
  };

  if (req.method === 'OPTIONS') {
    if (res.status && typeof res.status === 'function') {
      return res.status(200).end();
    }
    res.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    return res.end();
  }

  const apiKey = (process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || '').trim();
  const isKeyConfigured = Boolean(apiKey) && apiKey !== 'your_gemini_api_key_here';

  // GET: Health / Status check
  if (req.method === 'GET') {
    return sendJson(200, {
      status: 'ok',
      configured: isKeyConfigured,
      models: CANDIDATE_MODELS,
    });
  }

  if (req.method !== 'POST') {
    return sendJson(405, { error: 'METHOD_NOT_ALLOWED', message: 'Method not allowed' });
  }

  if (!isKeyConfigured) {
    return sendJson(503, {
      error: 'MISSING_API_KEY',
      message: 'Gemini API key is not configured on the server. Please add GEMINI_API_KEY to your environment variables.',
    });
  }

  // Parse body if not already parsed
  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      return sendJson(400, { error: 'INVALID_JSON', message: 'Invalid JSON request body' });
    }
  } else if (!body && typeof req.on === 'function') {
    // If stream
    try {
      body = await new Promise((resolve, reject) => {
        let raw = '';
        req.on('data', (chunk) => { raw += chunk; });
        req.on('end', () => {
          try {
            resolve(raw ? JSON.parse(raw) : {});
          } catch (e) {
            reject(e);
          }
        });
        req.on('error', reject);
      });
    } catch {
      return sendJson(400, { error: 'INVALID_JSON', message: 'Invalid JSON payload' });
    }
  }

  const userMessage = body?.message;
  const history = body?.history || [];

  if (!userMessage || typeof userMessage !== 'string' || !userMessage.trim()) {
    return sendJson(400, {
      error: 'EMPTY_MESSAGE',
      message: 'A non-empty message string is required.',
    });
  }

  try {
    const systemPrompt = buildSystemPrompt();
    const contents = buildContents(history, userMessage);
    const { data } = await callGemini(apiKey, systemPrompt, contents);

    const parsed = cleanAndParseResponse(data);
    return sendJson(200, parsed);
  } catch (err) {
    console.error('[api/chat] Error handling request:', err);

    const status = err.status || 500;
    const msg = err.message || '';

    if (status === 401 || status === 403 || msg.toLowerCase().includes('api key') || msg.toLowerCase().includes('unauthorized')) {
      return sendJson(401, {
        error: 'INVALID_API_KEY',
        message: 'The configured Gemini API key is invalid or unauthorized. Please verify the key in your settings.',
      });
    }

    if (status === 429 || msg.toLowerCase().includes('quota') || msg.toLowerCase().includes('rate limit')) {
      return sendJson(429, {
        error: 'RATE_LIMIT',
        message: 'The AI service is temporarily rate-limited or out of quota. Please wait a moment and try again.',
      });
    }

    if (status === 503 || msg.toLowerCase().includes('high demand') || msg.toLowerCase().includes('unavailable')) {
      return sendJson(503, {
        error: 'OVERLOADED',
        message: 'The AI model is currently experiencing high demand. Please try again in a few moments.',
      });
    }

    return sendJson(status, {
      error: 'API_ERROR',
      message: 'An error occurred while contacting the AI campus assistant. Please try again.',
      details: process.env.NODE_ENV === 'development' ? msg : undefined,
    });
  }
}
