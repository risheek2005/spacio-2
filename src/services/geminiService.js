/**
 * geminiService.js — Frontend client for SPACIO Campus Assistant
 *
 * Communicates with the secure backend endpoint `/api/chat`.
 * The Gemini API key is stored strictly on the server side and is NEVER exposed
 * to the client browser or embedded in client bundles.
 */

const API_ENDPOINT = '/api/chat';

/**
 * Checks whether the backend has a valid Gemini API key configured.
 * @returns {Promise<boolean>}
 */
export async function checkApiStatus() {
  try {
    const res = await fetch(API_ENDPOINT, {
      method: 'GET',
      headers: { credentials: 'omit' },
    });
    if (!res.ok) return false;
    const data = await res.json();
    return Boolean(data.configured);
  } catch {
    return false;
  }
}

/**
 * Sends a chat message and conversation history to the backend endpoint.
 *
 * @param {string} userMessage - The user's input text
 * @param {Array<{role: string, content: string}>} conversationHistory - Past turns
 * @returns {Promise<{message: string, recommendations: Array, suggestedFollowUps: Array}>}
 */
export async function sendMessage(userMessage, conversationHistory = []) {
  let response;

  try {
    response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: userMessage,
        history: conversationHistory,
      }),
    });
  } catch (networkErr) {
    console.error('[Campus Assistant] Network connection error:', networkErr);
    const err = new Error('Unable to connect to the campus assistant server. Please check your connection and try again.');
    err.code = 'NETWORK_ERROR';
    throw err;
  }

  let data;
  try {
    data = await response.json();
  } catch {
    const err = new Error('Invalid response received from the server.');
    err.code = 'PARSE_ERROR';
    throw err;
  }

  if (!response.ok) {
    const err = new Error(data?.message || 'The server encountered an error.');
    err.code = data?.error || `API_ERROR_${response.status}`;
    err.status = response.status;
    throw err;
  }

  return {
    message: data.message || "I'm here to help with campus spaces!",
    recommendations: Array.isArray(data.recommendations) ? data.recommendations : [],
    suggestedFollowUps: Array.isArray(data.suggestedFollowUps) ? data.suggestedFollowUps : [],
  };
}
