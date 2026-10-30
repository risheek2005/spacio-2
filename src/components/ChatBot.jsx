import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MessageCircle, X, Send, RotateCcw,
  MapPin, Map, Heart, ChevronRight,
  Sparkles, AlertCircle, Loader2,
} from 'lucide-react';
import { useChatbot } from '../hooks/useChatbot';
import { useApp } from '../context/AppContext';
import './ChatBot.css';

// ─── Individual recommendation card shown inside an AI message ────────────
function RecommendationCard({ facility, reason, onClose }) {
  const { isSaved, toggleSaved } = useApp();
  const saved = isSaved(facility.id);
  const occ = facility.occupancy;
  const occTone = occ >= 75 ? 'high' : occ >= 40 ? 'moderate' : 'low';

  const statusClass =
    facility.status === 'Open' ? 'status-open' :
    facility.status === 'Busy' ? 'status-busy' : 'status-closed';

  return (
    <div className="cb-rec-card">
      <div className="cb-rec-img-wrap">
        <img
          src={facility.image}
          alt={facility.name}
          className="cb-rec-img"
          loading="lazy"
          onError={(e) => { e.target.src = '/campus_hero.jpg'; }}
        />
        <span className={`cb-rec-badge status-badge ${statusClass}`}>
          <span className="status-dot" />
          {facility.status}
        </span>
        <button
          type="button"
          className={`cb-rec-heart${saved ? ' saved' : ''}`}
          onClick={() => toggleSaved(facility.id)}
          aria-label={saved ? `Remove ${facility.name} from saved` : `Save ${facility.name}`}
        >
          <Heart size={13} fill={saved ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="cb-rec-body">
        <div className="cb-rec-top">
          <span className="cb-rec-name">{facility.name}</span>
          <span className="cb-rec-occ">{occ}%</span>
        </div>

        <div className="cb-rec-location">
          <MapPin size={10} />
          <span>{facility.location}</span>
        </div>

        {/* Occupancy bar */}
        <div className="occ-bar-track cb-rec-bar" style={{ marginTop: 6, height: 3 }}>
          <div
            className={`occ-bar-fill occ-${occTone}`}
            style={{ width: `${occ}%` }}
            role="progressbar"
            aria-valuenow={occ}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>

        {reason && <p className="cb-rec-reason">{reason}</p>}

        <div className="cb-rec-actions">
          <Link
            to={`/facility/${facility.id}`}
            className="cb-rec-btn cb-rec-btn-primary"
            onClick={onClose}
          >
            View Details <ChevronRight size={12} />
          </Link>
          <Link
            to={`/map?highlight=${facility.id}`}
            className="cb-rec-btn cb-rec-btn-ghost"
            onClick={onClose}
          >
            <Map size={12} /> Map
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Single chat message bubble ────────────────────────────────────────────
function ChatMessage({ message, onClose }) {
  const isUser = message.role === 'user';

  return (
    <div className={`cb-msg-row${isUser ? ' cb-msg-row-user' : ''}`}>
      {!isUser && (
        <div className="cb-avatar" aria-hidden="true">
          <Sparkles size={14} />
        </div>
      )}

      <div className={`cb-msg-bubble${isUser ? ' cb-msg-bubble-user' : ''}${message.isError ? ' cb-msg-bubble-error' : ''}`}>
        {message.isError && (
          <AlertCircle size={14} className="cb-error-icon" />
        )}
        <p className="cb-msg-text">{message.content}</p>

        {/* Facility recommendation cards */}
        {!isUser && message.recommendations?.length > 0 && (
          <div className="cb-recs">
            {message.recommendations.map(({ facility, reason }) => (
              <RecommendationCard
                key={facility.id}
                facility={facility}
                reason={reason}
                onClose={onClose}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Typing / loading indicator ────────────────────────────────────────────
function TypingIndicator() {
  return (
    <div className="cb-msg-row">
      <div className="cb-avatar" aria-hidden="true">
        <Sparkles size={14} />
      </div>
      <div className="cb-msg-bubble cb-typing">
        <span className="cb-typing-dot" />
        <span className="cb-typing-dot" />
        <span className="cb-typing-dot" />
      </div>
    </div>
  );
}

// ─── Main ChatBot component ────────────────────────────────────────────────
export default function ChatBot() {
  const [isOpen, setIsOpen]       = useState(false);
  const [inputVal, setInputVal]   = useState('');
  const messagesEndRef             = useRef(null);
  const inputRef                   = useRef(null);

  const {
    messages,
    isLoading,
    isApiConfigured,
    sendUserMessage,
    clearChat,
  } = useChatbot();

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, isOpen]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const val = inputVal.trim();
    if (!val || isLoading) return;
    setInputVal('');
    sendUserMessage(val);
  };

  const handleSuggestedPrompt = (prompt) => {
    if (isLoading) return;
    setInputVal('');
    sendUserMessage(prompt);
  };

  const handleClose = () => setIsOpen(false);

  // Grab the last assistant message's follow-ups for the prompt chips
  const lastAssistant = [...messages].reverse().find((m) => m.role === 'assistant');
  const followUps = lastAssistant?.suggestedFollowUps || [];

  return (
    <>
      {/* ── Floating trigger button ── */}
      <button
        type="button"
        id="chatbot-trigger"
        className={`cb-fab${isOpen ? ' cb-fab-open' : ''}`}
        onClick={() => setIsOpen((o) => !o)}
        aria-label={isOpen ? 'Close campus assistant' : 'Open campus assistant'}
        aria-expanded={isOpen}
        aria-controls="chatbot-panel"
      >
        {isOpen ? <X size={22} /> : <MessageCircle size={22} />}
        {!isOpen && <span className="cb-fab-pulse" aria-hidden="true" />}
      </button>

      {/* ── Chat panel ── */}
      {isOpen && (
        <div
          id="chatbot-panel"
          className="cb-panel"
          role="dialog"
          aria-label="SPACIO Campus Assistant"
          aria-modal="false"
        >
          {/* Header */}
          <div className="cb-header">
            <div className="cb-header-left">
              <div className="cb-header-avatar" aria-hidden="true">
                <Sparkles size={16} />
              </div>
              <div>
                <p className="cb-header-name">Aria</p>
                <p className="cb-header-sub">Campus Assistant</p>
              </div>
            </div>
            <div className="cb-header-actions">
              {!isApiConfigured && (
                <span className="cb-no-key-badge" title="Add GEMINI_API_KEY to .env">
                  Demo mode
                </span>
              )}
              <button
                type="button"
                className="cb-icon-btn"
                onClick={clearChat}
                aria-label="Clear conversation"
                title="Clear conversation"
              >
                <RotateCcw size={15} />
              </button>
              <button
                type="button"
                className="cb-icon-btn"
                onClick={handleClose}
                aria-label="Close assistant"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* API key warning banner */}
          {!isApiConfigured && (
            <div className="cb-api-warning">
              <AlertCircle size={14} />
              <span>
                Add <code>GEMINI_API_KEY</code> to your <code>.env</code> file to enable AI responses.
              </span>
            </div>
          )}

          {/* Messages */}
          <div className="cb-messages" role="log" aria-live="polite" aria-label="Chat messages">
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} onClose={handleClose} />
            ))}
            {isLoading && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested follow-up chips */}
          {!isLoading && followUps.length > 0 && (
            <div className="cb-suggestions" role="list" aria-label="Suggested questions">
              {followUps.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  className="cb-suggestion-chip"
                  onClick={() => handleSuggestedPrompt(prompt)}
                  role="listitem"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <form className="cb-input-row" onSubmit={handleSubmit} noValidate>
            <input
              ref={inputRef}
              id="chatbot-input"
              type="text"
              className="cb-input"
              placeholder="Ask about spaces, availability…"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              disabled={isLoading}
              aria-label="Message Campus Assistant"
              maxLength={500}
              autoComplete="off"
              autoCorrect="off"
              spellCheck="false"
            />
            <button
              type="submit"
              className="cb-send-btn"
              disabled={!inputVal.trim() || isLoading}
              aria-label="Send message"
            >
              {isLoading
                ? <Loader2 size={18} className="cb-spin" />
                : <Send size={18} />
              }
            </button>
          </form>
        </div>
      )}
    </>
  );
}
