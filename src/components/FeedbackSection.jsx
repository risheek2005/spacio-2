import { useState } from 'react';
import { Star, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import './FeedbackSection.css';

/**
 * US06 — Facility Feedback
 *
 * Lets authenticated users rate (1-5 stars) and comment on a facility.
 * Feedback is persisted to localStorage via AppContext, matching the
 * project's existing persistence strategy (no backend).
 *
 * Design choices:
 *  - Placed as a section on FacilityDetails, keeping the Status →
 *    Details → Amenities → Feedback visual hierarchy.
 *  - Uses the same .details-section card styling so it looks native.
 *  - Star buttons have generous 44px touch targets (Fitts's Law).
 *  - Submitted feedback displays below the form so the user gets
 *    immediate confirmation and can see all prior reviews.
 */
export default function FeedbackSection({ facilityId, facilityName }) {
  const { submitFeedback, getFeedbackForFacility } = useApp();

  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [comment, setComment] = useState('');
  const [status, setStatus] = useState(null); // 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState('');

  const feedbackList = getFeedbackForFacility(facilityId);

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus(null);
    setErrorMsg('');

    if (rating === 0) {
      setStatus('error');
      setErrorMsg('Please select a star rating.');
      return;
    }

    if (comment.trim().length === 0) {
      setStatus('error');
      setErrorMsg('Please write a short comment.');
      return;
    }

    if (comment.trim().length > 500) {
      setStatus('error');
      setErrorMsg('Comment must be 500 characters or fewer.');
      return;
    }

    try {
      submitFeedback({ facilityId, rating, comment: comment.trim() });
      setStatus('success');
      setRating(0);
      setComment('');
    } catch {
      setStatus('error');
      setErrorMsg('Something went wrong. Please try again.');
    }
  };

  const formatDate = (ts) => {
    const d = new Date(ts);
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <section className="details-section feedback-section" aria-labelledby="feedback-heading">
      <h2 id="feedback-heading" className="details-section-title">
        Feedback
      </h2>

      <form className="feedback-form" onSubmit={handleSubmit} noValidate>
        <fieldset className="feedback-stars-fieldset">
          <legend className="visually-hidden">Rate {facilityName}</legend>
          <div className="feedback-stars" role="radiogroup" aria-label="Rating">
            {[1, 2, 3, 4, 5].map((value) => {
              const filled = value <= (hoveredStar || rating);
              return (
                <button
                  key={value}
                  type="button"
                  className={'feedback-star' + (filled ? ' feedback-star-filled' : '')}
                  onClick={() => setRating(value)}
                  onMouseEnter={() => setHoveredStar(value)}
                  onMouseLeave={() => setHoveredStar(0)}
                  aria-label={`${value} star${value !== 1 ? 's' : ''}`}
                  role="radio"
                  aria-checked={rating === value}
                >
                  <Star
                    size={22}
                    fill={filled ? 'currentColor' : 'none'}
                    aria-hidden="true"
                  />
                </button>
              );
            })}
            {rating > 0 && (
              <span className="feedback-rating-label">{rating} / 5</span>
            )}
          </div>
        </fieldset>

        <div className="feedback-field">
          <label htmlFor="feedback-comment">Your feedback</label>
          <textarea
            id="feedback-comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={`What did you think of ${facilityName}?`}
            rows={3}
            maxLength={500}
            aria-describedby={status === 'error' ? 'feedback-error' : undefined}
          />
          <span className="feedback-char-count">{comment.length}/500</span>
        </div>

        {status === 'error' && (
          <p id="feedback-error" className="feedback-message feedback-error" role="alert">
            <AlertCircle size={15} aria-hidden="true" />
            {errorMsg}
          </p>
        )}

        {status === 'success' && (
          <p className="feedback-message feedback-success" role="status">
            <CheckCircle size={15} aria-hidden="true" />
            Thank you! Your feedback has been submitted.
          </p>
        )}

        <button type="submit" className="btn btn-primary btn-md feedback-submit">
          <Send size={16} aria-hidden="true" />
          <span>Submit Feedback</span>
        </button>
      </form>

      {feedbackList.length > 0 && (
        <div className="feedback-list" aria-label="Previous feedback">
          <p className="feedback-list-heading">
            {feedbackList.length} review{feedbackList.length !== 1 ? 's' : ''}
          </p>
          {feedbackList
            .slice()
            .sort((a, b) => b.timestamp - a.timestamp)
            .map((fb, i) => (
              <article key={fb.timestamp + '-' + i} className="feedback-entry">
                <div className="feedback-entry-header">
                  <span className="feedback-entry-stars" aria-label={`${fb.rating} out of 5 stars`}>
                    {[1, 2, 3, 4, 5].map((v) => (
                      <Star
                        key={v}
                        size={14}
                        fill={v <= fb.rating ? 'currentColor' : 'none'}
                        aria-hidden="true"
                      />
                    ))}
                  </span>
                  <span className="feedback-entry-meta">
                    {fb.userName} · {formatDate(fb.timestamp)}
                  </span>
                </div>
                <p className="feedback-entry-comment">{fb.comment}</p>
              </article>
            ))}
        </div>
      )}
    </section>
  );
}
