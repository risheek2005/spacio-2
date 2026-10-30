/**
 * useChatbot.js — custom hook managing the Campus Assistant conversation state
 *
 * Responsibilities:
 *  - Maintain message array: [{id, role, content, recommendations, suggestedFollowUps, timestamp, isError}]
 *  - Track loading, configured, and error states
 *  - Keep clean multi-turn context (last N turns)
 *  - Expose sendUserMessage(), clearChat()
 */

import { useCallback, useEffect, useState } from 'react';
import { sendMessage, checkApiStatus } from '../services/geminiService';
import { getFacilityById } from '../data/facilities';

const MAX_HISTORY_TURNS = 6; // keep last 6 exchanges for context

let msgCounter = 0;
const newId = () => `msg-${Date.now()}-${++msgCounter}`;

// Initial welcome message (instant, no API call needed)
const createWelcomeMessage = () => ({
  id: newId(),
  role: 'assistant',
  content: "Hi! I'm Aria 🌿, your SPACIO Campus Assistant. I can help you find quiet study spots, check gym availability, explore facilities, and more. What can I help you with today?",
  recommendations: [],
  suggestedFollowUps: [
    'Which spaces are open right now?',
    'Show me the library',
    'Which spaces have the lowest occupancy?',
    'Where can I work out?',
  ],
  timestamp: Date.now(),
});

export function useChatbot() {
  const [messages, setMessages] = useState([createWelcomeMessage()]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isApiConfigured, setIsApiConfigured] = useState(true);

  // Check backend configuration on mount
  useEffect(() => {
    let isMounted = true;
    checkApiStatus()
      .then((configured) => {
        if (isMounted) setIsApiConfigured(configured);
      })
      .catch(() => {
        if (isMounted) setIsApiConfigured(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // Send a user message
  const sendUserMessage = useCallback(async (text) => {
    const trimmed = (text || '').trim();
    if (!trimmed || isLoading) return;

    setError(null);

    // 1. Build clean history from current messages before adding the new message
    const history = messages
      .filter((m) => !m.isError && m.role !== 'system')
      .slice(-MAX_HISTORY_TURNS * 2)
      .map((m) => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.content,
      }));

    // 2. Append user message to UI
    const userMsg = {
      id: newId(),
      role: 'user',
      content: trimmed,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // 3. Call backend endpoint
      const response = await sendMessage(trimmed, history);

      // 4. Resolve recommendation facility IDs to rich SPACIO facility objects
      const resolvedRecs = (response.recommendations || [])
        .map(({ facilityId, reason }) => {
          const facility = getFacilityById(facilityId);
          return facility ? { facility, reason } : null;
        })
        .filter(Boolean);

      // 5. Append AI assistant message
      const aiMsg = {
        id: newId(),
        role: 'assistant',
        content: response.message,
        recommendations: resolvedRecs,
        suggestedFollowUps: response.suggestedFollowUps || [],
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsApiConfigured(true);
    } catch (err) {
      console.error('[useChatbot] Chat error:', err);
      const code = err.code || 'API_ERROR';
      setError(code);

      if (code === 'MISSING_API_KEY') {
        setIsApiConfigured(false);
      }

      let content = err.message || 'Sorry, I couldn\'t process your request right now.';
      if (code === 'MISSING_API_KEY') {
        content = 'The Campus Assistant is not configured yet. Please ensure GEMINI_API_KEY is set in your environment variables.';
      } else if (code === 'INVALID_API_KEY') {
        content = 'The configured Gemini API key is invalid or unauthorized. Please verify your GEMINI_API_KEY in .env.';
      } else if (code === 'RATE_LIMIT') {
        content = 'The AI service is temporarily rate-limited or out of quota. Please wait a moment and try again.';
      } else if (code === 'OVERLOADED') {
        content = 'The campus assistant service is currently experiencing high demand. Please try again in a few moments.';
      } else if (code === 'NETWORK_ERROR') {
        content = 'Unable to connect to the campus assistant server. Please check your internet connection.';
      }

      const errMsg = {
        id: newId(),
        role: 'assistant',
        content,
        recommendations: [],
        suggestedFollowUps: [
          'Which spaces are open right now?',
          'Show me the library',
          'Which spaces have the lowest occupancy?',
        ],
        isError: true,
        errorCode: code,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading]);

  // Clear conversation
  const clearChat = useCallback(() => {
    setMessages([createWelcomeMessage()]);
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    isApiConfigured,
    sendUserMessage,
    clearChat,
  };
}
