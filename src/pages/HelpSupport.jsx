import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Search, Mail, MessageSquare, Phone,
  ChevronDown, ChevronUp, HelpCircle, ExternalLink
} from 'lucide-react';
import BottomNavigation from '../components/BottomNavigation';
import './HelpSupport.css';

/**
 * Screen 12 — Help & Support
 * Back button, search FAQ input, quick contact channels,
 * interactive accordion FAQs, and campus support details.
 */
const FAQS = [
  {
    q: 'How is real-time occupancy calculated?',
    a: 'Occupancy is estimated using anonymized Wi-Fi device density sensors, campus beacon signals, and library entry turnstiles. Values update automatically every 2 to 5 minutes to give you an accurate snapshot before you walk over.'
  },
  {
    q: 'How do I report inaccurate crowd levels or noise?',
    a: 'On any Space Details page, scroll to the Community Feedback section and tap "Share Update". You can report whether the space is quieter or busier than indicated, which helps update data for fellow students.'
  },
  {
    q: 'Can I reserve a private study room directly?',
    a: 'SPACIO displays live availability and seat counts. Tap the "Reserve Room" link on the space card to link directly into your university LibCal student booking portal with single sign-on.'
  },
  {
    q: 'What are the rules for Study Room A vs Study Room B?',
    a: 'Study Room A is designated as a Silent Zone 24/7 (headphones required, no voice calls). Study Room B allows group discussions, collaborative study, and light conversation.'
  },
  {
    q: 'Why does a space show "Closed" when doors are unlocked?',
    a: 'Scheduled operational hours may differ from physical building access. Cleaning crew or staff shifts may require the space to be marked Closed even if physical doors remain unlocked.'
  },
  {
    q: 'How do I save a space to my favorites?',
    a: 'Tap the heart icon on any space card or in the top-right corner of the Space Details page. Your saved spaces will be instantly accessible from the "Saved" tab in the bottom bar.'
  }
];

export default function HelpSupport() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [openIdx, setOpenIdx] = useState(0);

  const filteredFaqs = FAQS.filter(
    (item) =>
      item.q.toLowerCase().includes(search.toLowerCase()) ||
      item.a.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page page-with-nav">
      <div className="help-page">
        {/* Top bar with back */}
        <div className="help-topbar">
          <button
            type="button"
            className="help-back-btn"
            onClick={() => navigate(-1)}
            aria-label="Go back"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="help-title">Help & Support</h1>
          <div style={{ width: 40 }} />
        </div>

        {/* Search help */}
        <div className="help-search-wrap">
          <Search size={18} className="help-search-icon" aria-hidden="true" />
          <input
            type="text"
            className="help-search-input"
            placeholder="Search FAQs, issues, policies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Contact options cards */}
        <section className="help-contacts">
          <div className="contact-card">
            <div className="contact-icon contact-icon-mail">
              <Mail size={18} />
            </div>
            <div className="contact-info">
              <span className="contact-name">Campus Facilities</span>
              <span className="contact-desc">facilities@campus.edu</span>
              <span className="contact-sub">&lt; 24h response</span>
            </div>
          </div>

          <div className="contact-card">
            <div className="contact-icon contact-icon-chat">
              <MessageSquare size={18} />
            </div>
            <div className="contact-info">
              <span className="contact-name">Live Student Chat</span>
              <span className="contact-desc">Mon - Fri: 8am - 6pm</span>
              <span className="contact-sub">Average wait 2 mins</span>
            </div>
          </div>

          <div className="contact-card">
            <div className="contact-icon contact-icon-phone">
              <Phone size={18} />
            </div>
            <div className="contact-info">
              <span className="contact-name">Helpline Desk</span>
              <span className="contact-desc">(555) 019-2834</span>
              <span className="contact-sub">Building 3, Room 102</span>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="help-faq-section">
          <h2 className="help-section-heading">Frequently Asked Questions</h2>

          <div className="faq-list">
            {filteredFaqs.length === 0 ? (
              <p className="faq-empty">No answers matched "{search}". Contact facilities directly above.</p>
            ) : (
              filteredFaqs.map((item, idx) => {
                const isOpen = openIdx === idx;
                return (
                  <div key={item.q} className={`faq-item${isOpen ? ' is-open' : ''}`}>
                    <button
                      type="button"
                      className="faq-question-btn"
                      onClick={() => setOpenIdx(isOpen ? -1 : idx)}
                      aria-expanded={isOpen}
                    >
                      <span>{item.q}</span>
                      {isOpen ? (
                        <ChevronUp size={18} className="faq-chevron" />
                      ) : (
                        <ChevronDown size={18} className="faq-chevron" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="faq-answer">
                        <p>{item.a}</p>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* Support callout card */}
        <div className="support-banner">
          <HelpCircle size={22} className="support-banner-icon" />
          <div className="support-banner-text">
            <h4>Need immediate on-campus assistance?</h4>
            <p>Visit the Information Desk located in the Main Student Union lobby.</p>
          </div>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
}
