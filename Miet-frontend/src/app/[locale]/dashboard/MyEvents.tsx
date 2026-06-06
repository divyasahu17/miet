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
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ padding: '16px', color: '#475569', fontWeight: 600, fontSize: '14px' }}>Event Details</th>
                <th style={{ padding: '16px', color: '#475569', fontWeight: 600, fontSize: '14px' }}>Date & Time</th>
                <th style={{ padding: '16px', color: '#475569', fontWeight: 600, fontSize: '14px' }}>Location / Type</th>
                <th style={{ padding: '16px', color: '#475569', fontWeight: 600, fontSize: '14px' }}>Status</th>
                <th style={{ padding: '16px', color: '#475569', fontWeight: 600, fontSize: '14px', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((ev, idx) => {
                const isPast = new Date(ev.event_start) < new Date();
                
                return (
                  <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0', transition: 'background 0.2s', background: idx % 2 === 0 ? '#fff' : '#f8fafc' }}>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ width: '60px', height: '40px', borderRadius: '8px', overflow: 'hidden', background: '#e2e8f0', flexShrink: 0 }}>
                          {ev.event_image ? (
                            <img src={ev.event_image} alt={ev.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}><FaCalendarAlt color="#94a3b8" /></div>
                          )}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '15px' }}>{ev.name}</div>
                          <div style={{ color: '#64748b', fontSize: '13px', marginTop: '4px' }}>
                            {Math.round((new Date(ev.event_end).getTime() - new Date(ev.event_start).getTime()) / 3600000)} hour(s)
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '16px', color: '#475569', fontSize: '14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <FaCalendarAlt color="#6366f1" />
                        {new Date(ev.event_start).toLocaleString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td style={{ padding: '16px', color: '#475569', fontSize: '14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {ev.delivery_mode === 'online' ? (
                          <><FaVideo color="#3b82f6" /> Online</>
                        ) : (
                          <><FaMapMarkerAlt color="#f59e0b" /> {ev.center_address}</>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      {isPast ? (
                        <span style={{ background: '#fef2f2', color: '#ef4444', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 700 }}>COMPLETED</span>
                      ) : (
                        <span style={{ background: '#d1fae5', color: '#059669', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 700 }}>UPCOMING</span>
                      )}
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexDirection: 'column' }}>
                        {!isPast && ev.delivery_mode === 'online' && ev.event_meet_link && (
                          <a href={ev.event_meet_link} target="_blank" rel="noreferrer" style={{
                            background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6',
                            padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 700, textDecoration: 'none'
                          }}>
                            Join Online
                          </a>
                        )}
                        {!isPast && (
                          <a href={generateGoogleCalendarLink(ev)} target="_blank" rel="noreferrer" style={{
                            background: 'rgba(16, 185, 129, 0.1)', color: '#10b981',
                            padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 700, textDecoration: 'none'
                          }}>
                            Add to Calendar
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
