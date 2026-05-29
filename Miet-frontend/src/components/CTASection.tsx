import React, { useState } from 'react';
import { Calendar, dateFnsLocalizer, SlotInfo } from 'react-big-calendar';
import { format } from 'date-fns/format';
import { parse } from 'date-fns/parse';
import { startOfWeek } from 'date-fns/startOfWeek';
import { getDay } from 'date-fns/getDay';
import { enUS } from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';

// If TS error for react-big-calendar, add a module declaration
// declare module 'react-big-calendar';

const locales = {
  'en-US': enUS,
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

const TABS = [
  'Book Consultation',
  'Take Self Assessment Test',
  'Post a Query',
  'Schedule a Video Call',
];

const SERVICES = ['Speech Therapy', 'Special Education', 'Counselling', 'Occupational Therapy', 'Assessment', 'Other'];
const SOLUTIONS = ['Online', 'At Home', 'At Center', 'Hybrid'];

const ASSESSMENT_QUESTIONS = [
  { q: 'Does your child have difficulty focusing on tasks?', a: ['Never', 'Sometimes', 'Often', 'Always'] },
  { q: 'Does your child struggle with reading or writing?', a: ['Never', 'Sometimes', 'Often', 'Always'] },
  { q: 'Does your child have trouble communicating needs?', a: ['Never', 'Sometimes', 'Often', 'Always'] },
  { q: 'Does your child avoid social interaction?', a: ['Never', 'Sometimes', 'Often', 'Always'] },
  { q: 'Does your child show repetitive behaviors?', a: ['Never', 'Sometimes', 'Often', 'Always'] },
];

export default function CTASection() {
  const [activeTab, setActiveTab] = useState(0);
  // Booking Consultation
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [bookingTime, setBookingTime] = useState('');
  const [bookingName, setBookingName] = useState('');
  const [bookingEmail, setBookingEmail] = useState('');
  const [bookingPhone, setBookingPhone] = useState('');
  const [bookingNotes, setBookingNotes] = useState('');
  // Assessment
  const [answers, setAnswers] = useState(Array(ASSESSMENT_QUESTIONS.length).fill(''));
  const [assessmentScore, setAssessmentScore] = useState<number|null>(null);
  // Post a Query
  const [queryName, setQueryName] = useState('');
  const [queryEmail, setQueryEmail] = useState('');
  const [queryPhone, setQueryPhone] = useState('');
  const [queryService, setQueryService] = useState('Speech Therapy');
  const [querySolution, setQuerySolution] = useState('Online');
  const [queryMessage, setQueryMessage] = useState('');
  // Video Call
  const [videoDate, setVideoDate] = useState('');
  const [videoTime, setVideoTime] = useState('');
  const [meetLink, setMeetLink] = useState('');
  // Self Assessment Test
  const [showAssessmentModal, setShowAssessmentModal] = useState(false);

  // Assessment scoring
  const handleAssessmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const score = answers.reduce((sum, ans) => sum + ['Never', 'Sometimes', 'Often', 'Always'].indexOf(ans), 0);
    setAssessmentScore(score);
  };

  // Video call booking - redirect to consultation booking
  const handleGenerateMeet = (e: React.FormEvent) => {
    e.preventDefault();
    // Redirect to consultation booking page
    window.location.href = '/services/consultations';
  };

  // Time slots for booking
  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
  ];

  return (
    <section className="cta-section" style={{ background: 'var(--card)', padding: '2.5rem 0', textAlign: 'center' }} aria-label="Call to action">
      <h2 style={{ fontFamily: 'Righteous, cursive', color: 'var(--text-accent-alt)', fontSize: 28, fontWeight: 700, marginBottom: 24 }}>Ready to Take the Next Step?</h2>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 32, flexWrap: 'wrap' }}>
        {TABS.map((tab, idx) => (
          <button
            key={tab}
            onClick={() => setActiveTab(idx)}
            style={{
              background: activeTab === idx ? 'var(--accent)' : 'var(--card)',
              color: activeTab === idx ? 'var(--text-on-accent)' : 'var(--text-accent-alt)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              padding: '0.7rem 1.7rem',
              fontWeight: 700,
              fontSize: 18,
              cursor: 'pointer',
              boxShadow: activeTab === idx ? '0 2px 12px var(--shadow)' : 'none',
              transition: 'all 0.2s',
              outline: 'none',
            }}
            aria-controls={`cta-tabpanel-${idx}`}
            id={`cta-tab-${idx}`}
          >
            {tab}
          </button>
        ))}
      </div>
      <div id={`cta-tabpanel-${activeTab}`} role="tabpanel" aria-labelledby={`cta-tab-${activeTab}`} style={{ animation: 'fadeIn 0.5s', maxWidth: 1100, margin: '0 auto', textAlign: 'left', background: 'var(--card)', borderRadius: 16, boxShadow: '0 2px 12px var(--shadow)', padding: 32 }}>
        {/* Book Consultation */}
        {activeTab === 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32 }}>
            <div style={{ flex: 1.2, minWidth: 340, padding: 8 }}>
              <div style={{ fontWeight: 700, color: 'var(--text-accent-alt)', fontSize: 20, marginBottom: 12 }}>Select a Date</div>
              <div style={{ fontSize: 13 }}>
                <Calendar
                  localizer={localizer}
                  events={[]}
                  startAccessor="start"
                  endAccessor="end"
                  style={{ height: 340, background: 'var(--card)', borderRadius: 12, border: '1px solid var(--border)', marginBottom: 18, color: 'var(--text-secondary)', fontWeight: 500, padding: 8, fontSize: 13, minWidth: 220, maxWidth: '100%' }}
                  onSelectSlot={(slotInfo: SlotInfo) => setSelectedDate(slotInfo.start)}
                  selectable
                  views={['month', 'week', 'day']}
                  date={selectedDate || new Date()}
                  onNavigate={(date: Date) => setSelectedDate(date)}
                />
              </div>
            </div>
            <div style={{ flex: 1, minWidth: 260, display: 'flex', flexDirection: 'column', gap: 18 }}>
              {selectedDate && (
                <>
                  <div style={{ fontWeight: 700, color: 'var(--text-accent-alt)', fontSize: 18 }}>Select a Time</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 10 }}>
                    {timeSlots.map(t => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setBookingTime(t)}
                        style={{
                          background: bookingTime === t ? 'var(--accent)' : 'var(--card)',
                          color: bookingTime === t ? 'var(--text-on-accent)' : 'var(--text-accent-alt)',
                          border: '1px solid var(--border)',
                          borderRadius: 6,
                          padding: '0.5rem 1.1rem',
                          fontWeight: 600,
                          fontSize: 15,
                          cursor: 'pointer',
                          marginBottom: 2,
                        }}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </>
              )}
              {selectedDate && bookingTime && (
                <form onSubmit={e => { e.preventDefault(); alert('Booking submitted! (not really)'); }} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, alignItems: 'center' }}>
                  <label style={{ fontWeight: 600, color: 'var(--text-accent-alt)', gridColumn: '1/3' }}>
                    Name
                    <input type="text" value={bookingName} onChange={e => setBookingName(e.target.value)} required style={{ width: '100%', padding: '8px', borderRadius: 6, border: '1px solid var(--border)', marginTop: 4 }} />
                  </label>
                  <label style={{ fontWeight: 600, color: 'var(--text-accent-alt)' }}>
                    Email
                    <input type="email" value={bookingEmail} onChange={e => setBookingEmail(e.target.value)} required style={{ width: '100%', padding: '8px', borderRadius: 6, border: '1px solid var(--border)', marginTop: 4 }} />
                  </label>
                  <label style={{ fontWeight: 600, color: 'var(--text-accent-alt)' }}>
                    Phone
                    <input type="tel" value={bookingPhone} onChange={e => setBookingPhone(e.target.value)} required style={{ width: '100%', padding: '8px', borderRadius: 6, border: '1px solid var(--border)', marginTop: 4 }} />
                  </label>
                  <label style={{ fontWeight: 600, color: 'var(--text-accent-alt)', gridColumn: '1/3' }}>
                    Notes
                    <textarea value={bookingNotes} onChange={e => setBookingNotes(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: 6, border: '1px solid var(--border)', marginTop: 4, minHeight: 48 }} />
                  </label>
                  <button type="submit" style={{ background: 'var(--accent)', color: 'var(--text-on-accent)', border: 'none', borderRadius: 8, padding: '0.9rem 1.5rem', fontWeight: 700, fontSize: 17, cursor: 'pointer', marginTop: 8, gridColumn: '1/3' }}>Book Now</button>
                </form>
              )}
            </div>
          </div>
        )}
        {/* Self Assessment Test */}
        {activeTab === 1 && (
          <div style={{ maxWidth: 520, margin: '0 auto' }}>
            <div style={{ marginBottom: 18, color: 'var(--text-accent-alt)', fontWeight: 600, fontSize: 17 }}>
              <div>Instructions:</div>
              <ul style={{ margin: '8px 0 0 18px', fontSize: 15, color: 'var(--text-secondary)', fontWeight: 400 }}>
                <li>This is a short, objective-type self-assessment for your child.</li>
                <li>Answer each question honestly based on your child&apos;s recent behavior.</li>
                <li>Your responses are confidential and not stored.</li>
                <li>Click <b>Start Assessment</b> to begin.</li>
              </ul>
            </div>
            <button onClick={() => setShowAssessmentModal(true)} style={{ background: 'var(--accent)', color: 'var(--text-on-accent)', border: 'none', borderRadius: 8, padding: '0.8rem 1.7rem', fontWeight: 700, fontSize: 17, cursor: 'pointer', marginBottom: 8 }}>Start Assessment</button>
            {assessmentScore !== null && (
              <div style={{ marginTop: 12, color: 'var(--text-accent-alt)', fontWeight: 700, fontSize: 18 }}>
                Your Score: {assessmentScore} / 15<br />
                {assessmentScore < 5 ? 'Low risk' : assessmentScore < 10 ? 'Moderate risk' : 'High risk'}
              </div>
            )}
            {/* Modal for assessment */}
            {showAssessmentModal && (
              <div role="dialog" aria-modal="true" tabIndex={-1} style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(34,37,77,0.32)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={e => { if (e.target === e.currentTarget) setShowAssessmentModal(false); }}>
                <div style={{ background: 'var(--card)', borderRadius: 14, padding: 32, minWidth: 320, maxWidth: 420, boxShadow: '0 4px 32px rgba(90,103,216,0.13)', position: 'relative' }}>
                  <button onClick={() => setShowAssessmentModal(false)} aria-label="Close assessment modal" style={{ position: 'absolute', top: 12, right: 12, background: 'none', border: 'none', fontSize: 22, color: 'var(--accent)', cursor: 'pointer' }}>{'×'}</button>
                  <form onSubmit={handleAssessmentSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                    {ASSESSMENT_QUESTIONS.map((q, i) => (
                      <div key={i} style={{ textAlign: 'left' }}>
                        <div style={{ fontWeight: 600, color: 'var(--text-accent-alt)', marginBottom: 4 }}>{i + 1}. {q.q}</div>
                        <div style={{ display: 'flex', gap: 16 }}>
                          {q.a.map(opt => (
                            <label key={opt} style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>
                              <input
                                type="radio"
                                name={`q${i}`}
                                value={opt}
                                checked={answers[i] === opt}
                                onChange={() => setAnswers(ans => ans.map((a, idx) => idx === i ? opt : a))}
                                required
                              />{' '}{opt}
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                    <button type="submit" style={{ background: 'var(--accent)', color: 'var(--text-on-accent)', border: 'none', borderRadius: 8, padding: '0.9rem 1.5rem', fontWeight: 700, fontSize: 17, cursor: 'pointer', marginTop: 8 }}>Submit</button>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}
        {/* Post a Query */}
        {activeTab === 2 && (
          <form onSubmit={e => { e.preventDefault(); alert('Query submitted! (not really)'); }} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, alignItems: 'center', maxWidth: 600, margin: '0 auto' }}>
            <label style={{ fontWeight: 600, color: 'var(--text-accent-alt)', gridColumn: '1/3' }}>
              Name
              <input type="text" value={queryName} onChange={e => setQueryName(e.target.value)} required style={{ width: '100%', padding: '8px', borderRadius: 6, border: '1px solid var(--border)', marginTop: 4 }} />
            </label>
            <label style={{ fontWeight: 600, color: 'var(--text-accent-alt)' }}>
              Email
              <input type="email" value={queryEmail} onChange={e => setQueryEmail(e.target.value)} required style={{ width: '100%', padding: '8px', borderRadius: 6, border: '1px solid var(--border)', marginTop: 4 }} />
            </label>
            <label style={{ fontWeight: 600, color: 'var(--text-accent-alt)' }}>
              Phone
              <input type="tel" value={queryPhone} onChange={e => setQueryPhone(e.target.value)} required style={{ width: '100%', padding: '8px', borderRadius: 6, border: '1px solid var(--border)', marginTop: 4 }} />
            </label>
            <label style={{ fontWeight: 600, color: 'var(--text-accent-alt)' }}>
              Service
              <select value={queryService} onChange={e => setQueryService(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: 6, border: '1px solid var(--border)', marginTop: 4 }}>
                {SERVICES.map(s => <option key={s}>{s}</option>)}
              </select>
            </label>
            <label style={{ fontWeight: 600, color: 'var(--text-accent-alt)' }}>
              Solution
              <select value={querySolution} onChange={e => setQuerySolution(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: 6, border: '1px solid var(--border)', marginTop: 4 }}>
                {SOLUTIONS.map(s => <option key={s}>{s}</option>)}
              </select>
            </label>
            <label style={{ fontWeight: 600, color: 'var(--text-accent-alt)', gridColumn: '1/3' }}>
              Message
              <textarea value={queryMessage} onChange={e => setQueryMessage(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: 6, border: '1px solid var(--border)', marginTop: 4, minHeight: 48 }} required />
            </label>
            <button type="submit" style={{ background: 'var(--accent)', color: 'var(--text-on-accent)', border: 'none', borderRadius: 8, padding: '0.9rem 1.5rem', fontWeight: 700, fontSize: 17, cursor: 'pointer', marginTop: 8, gridColumn: '1/3' }}>Submit</button>
          </form>
        )}
        {/* Schedule a Video Call */}
        {activeTab === 3 && (
          <form onSubmit={handleGenerateMeet} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, alignItems: 'center', maxWidth: 520, margin: '0 auto' }}>
            <label style={{ fontWeight: 600, color: 'var(--text-accent-alt)' }}>
              Date
              <input type="date" value={videoDate} onChange={e => setVideoDate(e.target.value)} required style={{ width: '100%', padding: '8px', borderRadius: 6, border: '1px solid var(--border)', marginTop: 4 }} />
            </label>
            <label style={{ fontWeight: 600, color: 'var(--text-accent-alt)' }}>
              Time
              <input type="time" value={videoTime} onChange={e => setVideoTime(e.target.value)} required style={{ width: '100%', padding: '8px', borderRadius: 6, border: '1px solid var(--border)', marginTop: 4 }} />
            </label>
            <button type="submit" style={{ background: 'var(--accent)', color: 'var(--text-on-accent)', border: 'none', borderRadius: 8, padding: '0.9rem 1.5rem', fontWeight: 700, fontSize: 17, cursor: 'pointer', marginTop: 8, gridColumn: '1/3' }}>Book Consultation</button>
            <div style={{ marginTop: 12, color: 'var(--text-accent-alt)', fontWeight: 500, fontSize: 14, gridColumn: '1/3', textAlign: 'center' }}>
              You'll be redirected to our consultation booking page where you can schedule a meeting with our experts and receive a Google Meet link.
            </div>
          </form>
        )}
      </div>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        /* Calendar color overrides */
        .rbc-calendar, .rbc-month-view, .rbc-header, .rbc-date-cell, .rbc-day-bg, .rbc-today, .rbc-off-range-bg, .rbc-selected-cell, .rbc-event, .rbc-toolbar, .rbc-row-content, .rbc-row, .rbc-month-row, .rbc-time-view, .rbc-time-header, .rbc-time-content, .rbc-timeslot-group {
          color: var(--text-secondary) !important;
          font-size: 13px !important;
        }
        .rbc-header {
          background: var(--accent) !important;
          color: var(--text-on-accent) !important;
          font-weight: 700;
          font-size: 1.05rem !important;
          padding: 6px 0 !important;
        }
        .rbc-today {
          background: var(--card) !important;
        }
        .rbc-selected-cell, .rbc-active {
          background: var(--accent) !important;
          color: var(--text-on-accent) !important;
        }
        .rbc-date-cell.rbc-now, .rbc-date-cell.rbc-current {
          background: var(--text-accent-alt) !important;
          color: var(--text-on-accent) !important;
        }
        .rbc-off-range {
          color: var(--text-secondary) !important;
        }
        .rbc-toolbar button {
          background: var(--accent) !important;
          color: var(--text-on-accent) !important;
          border-radius: 6px;
          border: none;
          font-weight: 600;
          margin: 0 2px;
          padding: 6px 14px;
          font-size: 13px !important;
        }
        .rbc-toolbar button.rbc-active {
          background: var(--text-accent-alt) !important;
        }
        .rbc-event {
          background: var(--text-accent-alt) !important;
          color: var(--text-on-accent) !important;
        }
        /* Responsive calendar */
        @media (max-width: 900px) {
          .cta-section > div[role="tabpanel"] {
            max-width: 98vw !important;
            padding: 10px !important;
          }
          .rbc-calendar {
            font-size: 11px !important;
          }
        }
        @media (max-width: 600px) {
          .cta-section > div[role="tabpanel"] {
            max-width: 100vw !important;
            padding: 2px !important;
          }
          .rbc-calendar {
            font-size: 10px !important;
          }
        }
      `,
        }}
      />
    </section>
  );
}
