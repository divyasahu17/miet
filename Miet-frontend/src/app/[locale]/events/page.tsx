"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import TopBar from '@/components/TopBar';
import Footer from '@/components/Footer';
import { getApiUrl } from '@/utils/api';
import { FaCalendarAlt, FaMapMarkerAlt, FaLink, FaSpinner, FaRupeeSign, FaRegCalendarPlus } from 'react-icons/fa';

interface PublicEvent {
  id: number;
  name: string;
  description: string;
  delivery_mode: 'online' | 'offline';
  price: number;
  event_start: string;
  event_end: string;
  center_address: string;
  event_meet_link: string;
  event_image: string;
}

export default function EventsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [events, setEvents] = useState<PublicEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'online' | 'offline'>('online');
  const [registering, setRegistering] = useState<number | null>(null);
  const [showRegModal, setShowRegModal] = useState<PublicEvent | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    const eventIdParam = searchParams.get('eventId');
    if (eventIdParam && events.length > 0) {
      const ev = events.find(e => e.id.toString() === eventIdParam);
      if (ev) {
        handleJoin(ev);
      }
    }
  }, [searchParams, events]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await fetch(getApiUrl('api/events/public'));
      if (res.ok) {
        const data = await res.json();
        // Sort by upcoming
        const sorted = data.sort((a: any, b: any) => new Date(a.event_start).getTime() - new Date(b.event_start).getTime());
        setEvents(sorted);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async (event: PublicEvent) => {
    const token = localStorage.getItem("user_jwt");
    if (!token) {
      localStorage.setItem('pending_event_id', event.id.toString());
      router.push(`/en/dashboard`);
      return;
    }

    if (event.price > 0) {
      // Paid event -> go to checkout for this service
      router.push(`/en/checkout?service_id=${event.id}&type=event`);
    } else {
      // Free event -> open registration modal
      setShowRegModal(event);
    }
  };

  const confirmRegistration = async () => {
    if (!showRegModal) return;
    const token = localStorage.getItem("user_jwt");
    setRegistering(showRegModal.id);
    
    try {
      const res = await fetch(getApiUrl('api/events/register'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ event_id: showRegModal.id })
      });
      
      const data = await res.json();
      if (res.ok) {
        alert('Successfully registered! You have been emailed the details.');
        router.push('/en/dashboard?tab=events');
      } else {
        alert(data.error || 'Failed to register.');
      }
    } catch (e) {
      alert('Failed to register.');
    } finally {
      setRegistering(null);
      setShowRegModal(null);
    }
  };

  const generateGoogleCalendarLink = (event: PublicEvent) => {
    const start = new Date(event.event_start).toISOString().replace(/-|:|\.\d\d\d/g, "");
    const end = new Date(event.event_end).toISOString().replace(/-|:|\.\d\d\d/g, "");
    const details = encodeURIComponent(event.description + (event.event_meet_link ? `\n\nJoin Link: ${event.event_meet_link}` : ''));
    const location = encodeURIComponent(event.delivery_mode === 'offline' ? event.center_address : 'Online');
    
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.name)}&dates=${start}/${end}&details=${details}&location=${location}`;
  };

  const onlineEvents = events.filter(e => e.delivery_mode === 'online');
  const offlineEvents = events.filter(e => e.delivery_mode === 'offline');
  const displayEvents = activeTab === 'online' ? onlineEvents : offlineEvents;

  return (
    <>
      <TopBar />
      <main style={{ background: '#f8fafc', minHeight: '100vh', padding: '4rem 2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h1 style={{
              fontFamily: 'Righteous, cursive',
              fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
              color: '#1e1b4b',
              marginBottom: '1rem',
              background: 'linear-gradient(135deg, #1e1b4b 0%, #6366f1 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Discover Events
            </h1>
            <p style={{ color: '#4b5563', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
              Join our exclusive online webinars and offline workshops to elevate your life.
            </p>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '3rem' }}>
            <button
              onClick={() => setActiveTab('online')}
              style={{
                padding: '12px 32px',
                borderRadius: '30px',
                fontSize: '1rem',
                fontWeight: 700,
                cursor: 'pointer',
                border: 'none',
                transition: 'all 0.3s ease',
                background: activeTab === 'online' ? 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)' : '#e2e8f0',
                color: activeTab === 'online' ? '#fff' : '#4b5563',
                boxShadow: activeTab === 'online' ? '0 10px 20px rgba(99, 102, 241, 0.3)' : 'none'
              }}
            >
              Online Events
            </button>
            <button
              onClick={() => setActiveTab('offline')}
              style={{
                padding: '12px 32px',
                borderRadius: '30px',
                fontSize: '1rem',
                fontWeight: 700,
                cursor: 'pointer',
                border: 'none',
                transition: 'all 0.3s ease',
                background: activeTab === 'offline' ? 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)' : '#e2e8f0',
                color: activeTab === 'offline' ? '#fff' : '#4b5563',
                boxShadow: activeTab === 'offline' ? '0 10px 20px rgba(99, 102, 241, 0.3)' : 'none'
              }}
            >
              Offline Events
            </button>
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}>
              <FaSpinner className="spin" size={40} style={{ color: '#6366f1', animation: 'spin 1s linear infinite' }} />
            </div>
          ) : displayEvents.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem', background: '#fff', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
              <h2 style={{ color: '#1e1b4b', marginBottom: '1rem' }}>No {activeTab} events right now</h2>
              <p style={{ color: '#6b7280' }}>Check back later for exciting upcoming events!</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' }}>
              {displayEvents.map((ev) => {
                const isPast = new Date(ev.event_start) < new Date();
                const durationHrs = Math.round((new Date(ev.event_end).getTime() - new Date(ev.event_start).getTime()) / 3600000);
                
                return (
                  <div key={ev.id} style={{
                    background: '#fff',
                    borderRadius: '24px',
                    overflow: 'hidden',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.04)',
                    transition: 'transform 0.3s ease, boxShadow 0.3s ease',
                    position: 'relative'
                  }}>
                    <div style={{ height: '200px', background: '#f1f5f9', position: 'relative' }}>
                      {ev.event_image ? (
                        <img src={ev.event_image} alt={ev.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94a3b8' }}>Event Banner</div>
                      )}
                      
                      {isPast ? (
                        <div style={{ position: 'absolute', top: 16, right: 16, background: '#ef4444', color: '#fff', padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 700 }}>
                          COMPLETED
                        </div>
                      ) : (
                        <div style={{ position: 'absolute', top: 16, right: 16, background: '#10b981', color: '#fff', padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 700 }}>
                          UPCOMING
                        </div>
                      )}
                      
                      <div style={{ position: 'absolute', bottom: 16, left: 16, background: 'rgba(255,255,255,0.95)', padding: '6px 12px', borderRadius: '8px', fontSize: '13px', fontWeight: 700, color: '#1e1b4b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <FaCalendarAlt color="#6366f1" />
                        {ev.event_start ? new Date(ev.event_start).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'TBA'}
                      </div>
                    </div>
                    
                    <div style={{ padding: '24px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <h3 style={{ margin: '0 0 12px 0', fontSize: '1.4rem', color: '#1e1b4b', fontWeight: 800, flex: 1 }}>{ev.name}</h3>
                        {!isPast && (
                          <a href={generateGoogleCalendarLink(ev)} target="_blank" rel="noreferrer" title="Add to Google Calendar" style={{ color: '#6366f1', padding: '4px' }}>
                            <FaRegCalendarPlus size={22} />
                          </a>
                        )}
                      </div>
                      
                      <p style={{ color: '#4b5563', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '20px', minHeight: '68px', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {ev.description}
                      </p>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                        <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>
                          <strong>Duration:</strong> {durationHrs} hour(s)
                        </div>
                        {ev.delivery_mode === 'offline' && ev.center_address && (
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.9rem', color: '#6b7280' }}>
                            <FaMapMarkerAlt color="#f59e0b" size={16} style={{ marginTop: '2px' }} />
                            <span>{ev.center_address}</span>
                          </div>
                        )}
                      </div>
                      
                      <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontSize: '1.25rem', fontWeight: 800, color: ev.price > 0 ? '#10b981' : '#6366f1' }}>
                          {ev.price > 0 ? `₹${ev.price}` : 'FREE'}
                        </div>
                        
                        {!isPast && (
                          <button disabled={registering === ev.id} style={{
                            background: ev.price > 0 ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                            color: '#fff', border: 'none', padding: '10px 24px', borderRadius: '12px',
                            fontWeight: 700, cursor: registering === ev.id ? 'not-allowed' : 'pointer', 
                            boxShadow: ev.price > 0 ? '0 4px 12px rgba(16, 185, 129, 0.3)' : '0 4px 12px rgba(59, 130, 246, 0.3)',
                            display: 'flex', alignItems: 'center', gap: '8px'
                          }} onClick={() => handleJoin(ev)}>
                            {registering === ev.id ? <FaSpinner className="spin" /> : (ev.price > 0 ? 'Pay & Register' : 'Join Event')}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Registration Modal */}
      {showRegModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.6)', zIndex: 3000,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
          backdropFilter: 'blur(4px)'
        }} onClick={e => { if (e.target === e.currentTarget) setShowRegModal(null); }}>
          <div style={{
            background: '#fff', borderRadius: '24px', padding: '40px',
            width: '90vw', maxWidth: '480px',
            boxShadow: '0 24px 60px rgba(0,0,0,0.2)',
            position: 'relative', textAlign: 'center'
          }}>
            <button onClick={() => setShowRegModal(null)} style={{ position: 'absolute', top: 16, right: 16, background: '#f1f5f9', border: 'none', fontSize: 20, color: '#64748b', cursor: 'pointer', width: '32px', height: '32px', borderRadius: '50%' }}>×</button>
            <div style={{ width: '64px', height: '64px', background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', margin: '0 auto 20px' }}>
              <FaCalendarAlt />
            </div>
            <h2 style={{ fontWeight: 800, marginBottom: 12, fontSize: '24px', color: '#1e1b4b' }}>
              Confirm Registration
            </h2>
            <p style={{ color: '#64748b', fontSize: '15px', lineHeight: 1.6, marginBottom: '32px' }}>
              You are about to register for <strong>{showRegModal.name}</strong>. A confirmation email will be sent to your registered email address.
            </p>
            
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setShowRegModal(null)} disabled={registering === showRegModal.id} style={{
                flex: 1, background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '12px',
                padding: '14px', fontWeight: 700, fontSize: '15px', cursor: 'pointer'
              }}>
                Cancel
              </button>
              <button onClick={confirmRegistration} disabled={registering === showRegModal.id} style={{
                flex: 2, background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', color: '#fff', border: 'none', borderRadius: '12px',
                padding: '14px', fontWeight: 700, fontSize: '15px', cursor: registering === showRegModal.id ? 'not-allowed' : 'pointer',
                boxShadow: '0 8px 20px rgba(99, 102, 241, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
              }}>
                {registering === showRegModal.id ? <><FaSpinner className="spin" /> Processing...</> : 'Confirm & Register'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
