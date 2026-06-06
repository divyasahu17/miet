"use client";
import React, { useState, useEffect } from 'react';
import { getApiUrl } from '@/utils/api';
import { FaCalendarAlt, FaMapMarkerAlt, FaVideo, FaSpinner } from 'react-icons/fa';

export default function MyEvents() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("user_jwt");
      const res = await fetch(getApiUrl('api/user/events'), {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setEvents(data.events || []);
      }
    } catch (error) {
      console.error('Error fetching user events:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateGoogleCalendarLink = (event: any) => {
    const start = new Date(event.event_start).toISOString().replace(/-|:|\.\d\d\d/g, "");
    const end = new Date(event.event_end).toISOString().replace(/-|:|\.\d\d\d/g, "");
    const details = encodeURIComponent(event.description + (event.event_meet_link ? `\n\nJoin Link: ${event.event_meet_link}` : ''));
    const location = encodeURIComponent(event.delivery_mode === 'offline' ? event.center_address : 'Online');
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.name)}&dates=${start}/${end}&details=${details}&location=${location}`;
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
        <FaSpinner className="spin" size={30} style={{ color: '#6366f1', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  return (
    <div style={{
      background: 'white',
      borderRadius: '16px',
      padding: '32px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
    }}>
      <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#333', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <FaCalendarAlt style={{ color: '#6366f1' }} /> My Events
      </h2>

      {events.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', background: '#f8fafc', borderRadius: '12px' }}>
          <p style={{ color: '#64748b', fontSize: '16px' }}>You haven't registered for any events yet.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {events.map((ev, idx) => (
            <div key={idx} style={{
              border: '1px solid #e2e8f0', borderRadius: '16px', overflow: 'hidden', position: 'relative'
            }}>
              <div style={{ height: '140px', background: '#f1f5f9' }}>
                {ev.event_image && (
                  <img src={ev.event_image} alt={ev.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                )}
              </div>
              <div style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b', margin: 0 }}>{ev.name}</h3>
                  <span style={{ background: '#d1fae5', color: '#065f46', padding: '4px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold' }}>
                    REGISTERED
                  </span>
                </div>
                
                <div style={{ fontSize: '14px', color: '#475569', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FaCalendarAlt color="#6366f1" /> {new Date(ev.event_start).toLocaleString()}
                </div>
                
                <div style={{ fontSize: '14px', color: '#475569', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {ev.delivery_mode === 'online' ? (
                    <><FaVideo color="#3b82f6" /> Online Event</>
                  ) : (
                    <><FaMapMarkerAlt color="#f59e0b" /> {ev.center_address}</>
                  )}
                </div>
                
                <div style={{ display: 'flex', gap: '10px' }}>
                  {ev.delivery_mode === 'online' && ev.event_meet_link && (
                    <a href={ev.event_meet_link} target="_blank" rel="noreferrer" style={{
                      flex: 1, textAlign: 'center', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6',
                      padding: '8px', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold', textDecoration: 'none'
                    }}>
                      Join Link
                    </a>
                  )}
                  <a href={generateGoogleCalendarLink(ev)} target="_blank" rel="noreferrer" style={{
                    flex: 1, textAlign: 'center', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981',
                    padding: '8px', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold', textDecoration: 'none'
                  }}>
                    Add to Calendar
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
