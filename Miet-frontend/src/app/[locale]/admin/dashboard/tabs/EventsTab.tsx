"use client";
import React, { useState, useEffect } from 'react';
import { getApiUrl } from '@/utils/api';
import { FaPlus, FaEdit, FaTrash, FaSpinner, FaCalendarAlt, FaUpload, FaMapMarkerAlt, FaLink, FaUsers, FaEnvelope } from 'react-icons/fa';

interface EventService {
  id: number;
  name: string;
  description: string;
  delivery_mode: 'online' | 'offline';
  service_type: string; // 'event'
  revenue_type: 'paid' | 'promotional';
  price: number;
  event_start: string;
  event_end: string;
  center_address: string;
  event_meet_link: string;
  event_image: string;
}

export default function EventsTab() {
  const [events, setEvents] = useState<EventService[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  
  // Attendees Modal
  const [showAttendees, setShowAttendees] = useState(false);
  const [attendees, setAttendees] = useState<any[]>([]);
  const [loadingAttendees, setLoadingAttendees] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [reminding, setReminding] = useState(false);

  // Form State
  const [form, setForm] = useState<Partial<EventService>>({
    name: '',
    description: '',
    delivery_mode: 'online',
    revenue_type: 'promotional',
    price: 0,
    event_start: '',
    event_end: '',
    center_address: '',
    event_meet_link: '',
    event_image: ''
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("admin_jwt");
      const res = await fetch(getApiUrl('api/services'), {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        // filter only events
        setEvents(data.filter((s: any) => s.service_type === 'event'));
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem("admin_jwt");
      
      let imageUrl = form.event_image || '';
      
      if (imageFile) {
        const uploadForm = new FormData();
        uploadForm.append('file', imageFile);
        
        const uploadRes = await fetch(getApiUrl('api/upload'), {
          method: 'POST',
          body: uploadForm
        });
        
        if (uploadRes.ok) {
          const data = await uploadRes.json();
          imageUrl = data.url;
        } else {
          alert('Failed to upload image. Using previous image if available.');
        }
      }
      
      const payload = {
        ...form,
        event_image: imageUrl,
        service_type: 'event',
        revenue_type: form.price! > 0 ? 'paid' : 'promotional'
      };

      const url = editId ? getApiUrl(`api/services/${editId}`) : getApiUrl('api/services');
      const method = editId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setShowModal(false);
        fetchEvents();
        alert('Event saved successfully!');
      } else {
        alert('Failed to save event.');
      }
    } catch (error) {
      console.error('Error saving event:', error);
      alert('Error saving event');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    try {
      const token = localStorage.getItem("admin_jwt");
      const res = await fetch(getApiUrl(`api/services/${id}`), {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Error deleting event');
    }
  };

  const openAddModal = () => {
    setEditId(null);
    setImageFile(null);
    setImagePreview('');
    setForm({
      name: '', description: '', delivery_mode: 'online', price: 0,
      event_start: '', event_end: '', center_address: '', event_meet_link: '', event_image: ''
    });
    setShowModal(true);
  };

  const openEditModal = (event: EventService) => {
    setEditId(event.id);
    setForm(event);
    setImageFile(null);
    setImagePreview(event.event_image || '');
    setShowModal(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const viewAttendees = async (eventId: number) => {
    setSelectedEventId(eventId);
    setShowAttendees(true);
    setLoadingAttendees(true);
    try {
      const token = localStorage.getItem("admin_jwt");
      const res = await fetch(getApiUrl(`api/events/${eventId}/attendees`), {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setAttendees(data.attendees || []);
      } else {
        setAttendees([]);
      }
    } catch (err) {
      console.error(err);
      setAttendees([]);
    } finally {
      setLoadingAttendees(false);
    }
  };

  const sendReminder = async () => {
    if (!selectedEventId || !confirm('Send a reminder email to all registered attendees?')) return;
    setReminding(true);
    try {
      const token = localStorage.getItem("admin_jwt");
      const res = await fetch(getApiUrl(`api/events/${selectedEventId}/remind`), {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        alert('Reminders queued successfully!');
      } else {
        alert('Failed to send reminders.');
      }
    } catch (err) {
      console.error(err);
      alert('Error sending reminders.');
    } finally {
      setReminding(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: 'white', padding: '24px 32px', borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid rgba(102, 126, 234, 0.08)'
      }}>
        <div>
          <h2 style={{
            fontSize: '28px', fontWeight: 800, margin: 0,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'flex', alignItems: 'center', gap: '12px'
          }}>
            <FaCalendarAlt style={{ color: '#667eea' }} /> Advanced Events
          </h2>
          <p style={{ margin: '6px 0 0 0', color: '#666', fontSize: '14px' }}>Manage interactive events with payments, attendees, and automated emails.</p>
        </div>
        <button
          onClick={openAddModal}
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: '#fff', border: 'none', borderRadius: '10px',
            padding: '12px 24px', fontWeight: 700, fontSize: '14px',
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.2)'
          }}
        >
          <FaPlus /> Add New Event
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '100px 0' }}>
          <FaSpinner className="spin" size={32} style={{ color: '#667eea', animation: 'spin 1s linear infinite' }} />
        </div>
      ) : events.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', background: 'white', borderRadius: '16px' }}>
          <p style={{ color: '#666', fontSize: '16px' }}>No events found. Create your first event!</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
          {events.map((ev) => (
            <div key={ev.id} style={{
              background: 'white', borderRadius: '16px', overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid rgba(102, 126, 234, 0.08)'
            }}>
              <div style={{ height: '160px', background: '#f3f4f6', position: 'relative' }}>
                {ev.event_image ? (
                  <img src={ev.event_image} alt={ev.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#9ca3af' }}>No Image</div>
                )}
                <div style={{ position: 'absolute', top: 12, right: 12, background: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 700, color: ev.delivery_mode === 'online' ? '#3b82f6' : '#f59e0b', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                  {ev.delivery_mode.toUpperCase()}
                </div>
              </div>
              <div style={{ padding: '20px' }}>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', color: '#1e1b4b' }}>{ev.name}</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: '#4b5563', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FaCalendarAlt style={{ color: '#667eea' }} /> 
                    {ev.event_start ? new Date(ev.event_start).toLocaleString() : 'TBA'}
                  </div>
                  <div style={{ fontWeight: 700, color: ev.price > 0 ? '#10b981' : '#6b7280' }}>
                    {ev.price > 0 ? `₹${ev.price}` : 'FREE EVENT'}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', borderTop: '1px solid #f3f4f6', paddingTop: '16px' }}>
                  <button onClick={() => viewAttendees(ev.id)} style={{ flex: 1, background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontWeight: 600 }}>
                    <FaUsers /> Attendees
                  </button>
                  <button onClick={() => openEditModal(ev)} style={{ flex: 1, background: 'rgba(102, 126, 234, 0.1)', color: '#667eea', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontWeight: 600 }}>
                    <FaEdit />
                  </button>
                  <button onClick={() => handleDelete(ev.id)} style={{ flex: 1, background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontWeight: 600 }}>
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Attendees Modal */}
      {showAttendees && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.5)', zIndex: 3000,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
        }} onClick={e => { if (e.target === e.currentTarget) setShowAttendees(false); }}>
          <div style={{
            background: '#fff', borderRadius: '20px', padding: '36px',
            width: '90vw', maxWidth: '600px', maxHeight: '90vh',
            boxShadow: '0 20px 60px rgba(102, 126, 234, 0.2)',
            position: 'relative', overflow: 'auto'
          }}>
            <button onClick={() => setShowAttendees(false)} style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(102, 126, 234, 0.1)', border: 'none', fontSize: 22, color: '#667eea', cursor: 'pointer', width: '36px', height: '36px', borderRadius: '50%' }}>×</button>
            <h2 style={{ fontWeight: 800, marginBottom: 24, fontSize: '24px', color: '#1e1b4b' }}>
              Event Attendees
            </h2>
            
            <button disabled={reminding || attendees.length === 0} onClick={sendReminder} style={{
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', color: '#fff', border: 'none', borderRadius: '8px',
              padding: '10px 16px', fontWeight: 700, cursor: (reminding || attendees.length === 0) ? 'not-allowed' : 'pointer', marginBottom: '20px',
              display: 'flex', alignItems: 'center', gap: '8px'
            }}>
              {reminding ? <FaSpinner className="spin" /> : <FaEnvelope />} Send Reminder to All
            </button>

            {loadingAttendees ? (
               <FaSpinner className="spin" size={24} style={{ color: '#667eea', animation: 'spin 1s linear infinite' }} />
            ) : attendees.length === 0 ? (
               <p>No attendees have registered for this event yet.</p>
            ) : (
               <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                 {attendees.map(a => (
                   <li key={a.id} style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between' }}>
                     <div>
                       <strong>{a.name || 'User'}</strong><br/>
                       <span style={{ fontSize: '13px', color: '#64748b' }}>{a.email}</span>
                     </div>
                     <div>
                       <span style={{ background: '#d1fae5', color: '#065f46', padding: '4px 8px', borderRadius: '12px', fontSize: '12px' }}>Registered</span>
                     </div>
                   </li>
                 ))}
               </ul>
            )}
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.5)', zIndex: 3000,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
        }} onClick={e => { if (e.target === e.currentTarget) setShowModal(false); }}>
          <div style={{
            background: '#fff', borderRadius: '20px', padding: '36px',
            width: '90vw', maxWidth: '600px', maxHeight: '90vh',
            boxShadow: '0 20px 60px rgba(102, 126, 234, 0.2)',
            position: 'relative', overflow: 'auto'
          }}>
            <button onClick={() => setShowModal(false)} style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(102, 126, 234, 0.1)', border: 'none', fontSize: 22, color: '#667eea', cursor: 'pointer', width: '36px', height: '36px', borderRadius: '50%' }}>×</button>
            <h2 style={{ fontWeight: 800, marginBottom: 24, fontSize: '24px', color: '#1e1b4b' }}>
              {editId ? 'Edit Event' : 'Create Event'}
            </h2>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Banner Image Upload</label>
                {imagePreview && (
                  <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img src={imagePreview} alt="Preview" style={{ width: '120px', height: '60px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #e5e7eb' }} />
                  </div>
                )}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '12px', background: '#f9fafb', border: '2px dashed rgba(102, 126, 234, 0.2)',
                  borderRadius: '10px', padding: '12px', position: 'relative'
                }}>
                  <FaUpload style={{ color: '#667eea' }} />
                  <span style={{ fontSize: '13px', color: '#4b5563', fontWeight: 600 }}>Choose Banner Image</span>
                  <input type="file" accept="image/*" onChange={handleFileChange} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} />
                </div>
              </div>
              
              <div>
                <label style={labelStyle}>Event Title *</label>
                <input required type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} style={inputStyle} />
              </div>

              <div>
                <label style={labelStyle}>Description</label>
                <textarea required rows={4} value={form.description} onChange={e => setForm({...form, description: e.target.value})} style={inputStyle} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>Start Date & Time *</label>
                  <input required type="datetime-local" value={form.event_start} onChange={e => setForm({...form, event_start: e.target.value})} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>End Date & Time *</label>
                  <input required type="datetime-local" value={form.event_end} onChange={e => setForm({...form, event_end: e.target.value})} style={inputStyle} />
                </div>
              </div>
              
              <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '-8px', marginBottom: '8px' }}>
                {form.event_start && form.event_end ? `Duration: ${Math.round((new Date(form.event_end).getTime() - new Date(form.event_start).getTime()) / 60000)} minutes` : 'Select start and end time to calculate duration.'}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>Event Type</label>
                  <select value={form.delivery_mode} onChange={e => setForm({...form, delivery_mode: e.target.value as any})} style={inputStyle}>
                    <option value="online">Online</option>
                    <option value="offline">Offline</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Price (₹) (0 for Free)</label>
                  <input required type="number" min="0" step="0.01" value={form.price} onChange={e => setForm({...form, price: parseFloat(e.target.value) || 0})} style={inputStyle} />
                </div>
              </div>

              {form.delivery_mode === 'online' && (
                <div>
                  <label style={labelStyle}>Join Link (e.g. Google Meet) *</label>
                  <input required type="url" value={form.event_meet_link} onChange={e => setForm({...form, event_meet_link: e.target.value})} style={inputStyle} placeholder="https://meet.google.com/..." />
                </div>
              )}

              {form.delivery_mode === 'offline' && (
                <div>
                  <label style={labelStyle}>Physical Address *</label>
                  <input required type="text" value={form.center_address} onChange={e => setForm({...form, center_address: e.target.value})} style={inputStyle} placeholder="Full physical address..." />
                </div>
              )}

              <button type="submit" disabled={saving} style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff', border: 'none', borderRadius: '12px',
                padding: '14px', fontWeight: 700, fontSize: '16px', cursor: saving ? 'not-allowed' : 'pointer', marginTop: '10px'
              }}>
                {saving ? 'Saving...' : 'Save Event'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const labelStyle = { display: 'block', marginBottom: 6, fontWeight: 600, color: '#374151', fontSize: '13px' };
const inputStyle = { width: '100%', padding: '10px 14px', borderRadius: '10px', border: '2px solid rgba(102, 126, 234, 0.2)', fontSize: '15px' };
