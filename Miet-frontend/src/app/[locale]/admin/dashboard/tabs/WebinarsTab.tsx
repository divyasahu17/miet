"use client";
import React from 'react';
import Image from 'next/image';
import { FaThLarge, FaList, FaTags, FaUserCircle, FaSignOutAlt, FaChevronLeft, FaChevronRight, FaUserMd, FaChevronDown, FaSearch, FaEdit, FaTrash, FaPlus, FaEye, FaImages, FaCog } from "react-icons/fa";
import Select from "react-select";

export default function WebinarsTab(props: any) {
  const { DataTable, webinars, googleOAuthSetup, handleGoogleOAuthSetup, handleWebinarDelete, handleWebinarEdit, handleWebinarSubmit, setShowWebinarModal, setWebinarEditId, setWebinarForm, showWebinarModal, webinarEditId, webinarForm } = props;

  if (showWebinarModal) {
    return (
      <section style={{
        background: '#fff',
        borderRadius: '20px',
        padding: '40px',
        boxShadow: '0 20px 60px rgba(102, 126, 234, 0.05)',
        position: 'relative'
      }}>
        {/* Header & Back Button */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          marginBottom: 32,
          borderBottom: '1px solid #f0f4f8',
          paddingBottom: '20px',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => setShowWebinarModal(false)}
            style={{
              background: 'rgba(102, 126, 234, 0.1)',
              border: 'none',
              borderRadius: '8px',
              padding: '10px 18px',
              fontSize: '14px',
              fontWeight: '600',
              color: '#667eea',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(102, 126, 234, 0.2)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(102, 126, 234, 0.1)'}
          >
            <FaChevronLeft size={12} />
            Back to Webinars
          </button>
          <h2 style={{
            fontSize: 'clamp(22px, 3.5vw, 28px)',
            fontWeight: 700,
            color: '#667eea',
            margin: 0,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            {webinarEditId ? 'Edit Webinar Details' : 'Schedule New Webinar'}
          </h2>
        </div>

        <form onSubmit={handleWebinarSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
            <div>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#333' }}>Title *</label>
              <input
                type="text"
                value={webinarForm.title}
                onChange={e => setWebinarForm((f: any) => ({ ...f, title: e.target.value }))}
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '2px solid rgba(102, 126, 234, 0.2)',
                  fontSize: '16px',
                  transition: 'all 0.3s ease'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#333' }}>Meet URL</label>
              <input
                type="url"
                value={webinarForm.google_meet_link || ''}
                onChange={e => setWebinarForm((f: any) => ({ ...f, google_meet_link: e.target.value }))}
                placeholder="https://meet.google.com/..."
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '2px solid rgba(102, 126, 234, 0.2)',
                  fontSize: '16px',
                  transition: 'all 0.3s ease'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#333' }}>Start Date & Time *</label>
              <input
                type="datetime-local"
                value={webinarForm.start_time}
                onChange={e => {
                  const startTime = new Date(e.target.value);
                  const endTime = new Date(webinarForm.end_time);
                  const duration = endTime && endTime > startTime ? Math.round((endTime.getTime() - startTime.getTime()) / 60000) : 60;
                  setWebinarForm((f: any) => ({
                    ...f,
                    start_time: e.target.value,
                    duration_minutes: duration
                  }));
                }}
                onClick={(e) => {
                  try {
                    e.currentTarget.showPicker();
                  } catch (err) {}
                }}
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '2px solid rgba(102, 126, 234, 0.2)',
                  fontSize: '16px',
                  cursor: 'pointer'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#333' }}>End Date & Time *</label>
              <input
                type="datetime-local"
                value={webinarForm.end_time}
                onChange={e => {
                  const startTime = new Date(webinarForm.start_time);
                  const endTime = new Date(e.target.value);
                  const duration = startTime && endTime > startTime ? Math.round((endTime.getTime() - startTime.getTime()) / 60000) : 60;
                  setWebinarForm((f: any) => ({
                    ...f,
                    end_time: e.target.value,
                    duration_minutes: duration
                  }));
                }}
                onClick={(e) => {
                  try {
                    e.currentTarget.showPicker();
                  } catch (err) {}
                }}
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '2px solid rgba(102, 126, 234, 0.2)',
                  fontSize: '16px',
                  cursor: 'pointer'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#333' }}>Duration (minutes)</label>
              <input
                type="number"
                value={webinarForm.duration_minutes}
                readOnly
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '2px solid rgba(102, 126, 234, 0.2)',
                  fontSize: '16px',
                  backgroundColor: '#f8f9fa',
                  color: '#6c757d'
                }}
              />
              <small style={{ color: '#6c757d', fontSize: '12px' }}>Automatically calculated from start and end times</small>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#333' }}>Max Attendees</label>
              <input
                type="number"
                value={webinarForm.max_attendees}
                onChange={e => setWebinarForm((f: any) => ({ ...f, max_attendees: parseInt(e.target.value) }))}
                min="1"
                max="1000"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '2px solid rgba(102, 126, 234, 0.2)',
                  fontSize: '16px'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#333' }}>Price (₹)</label>
              <input
                type="number"
                value={webinarForm.price}
                onChange={e => setWebinarForm((f: any) => ({ ...f, price: parseFloat(e.target.value) }))}
                min="0"
                step="0.01"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '2px solid rgba(102, 126, 234, 0.2)',
                  fontSize: '16px'
                }}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <input
                type="checkbox"
                id="is_free"
                checked={webinarForm.is_free}
                onChange={e => setWebinarForm((f: any) => ({ ...f, is_free: e.target.checked }))}
                style={{ width: 20, height: 20 }}
              />
              <label htmlFor="is_free" style={{ fontWeight: 600, color: '#333' }}>Free Webinar</label>
            </div>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#333' }}>Description</label>
            <textarea
              value={webinarForm.description}
              onChange={e => setWebinarForm((f: any) => ({ ...f, description: e.target.value }))}
              rows={4}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '8px',
                border: '2px solid rgba(102, 126, 234, 0.2)',
                fontSize: '16px',
                resize: 'vertical'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#333' }}>Attendee Emails (comma-separated)</label>
            <input
              type="text"
              value={webinarForm.attendee_emails?.join(', ') || ''}
              onChange={e => setWebinarForm((f: any) => ({
                ...f,
                attendee_emails: e.target.value.split(',').map((email: any) => email.trim()).filter((email: any) => email)
              }))}
              placeholder="email1@example.com, email2@example.com"
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '8px',
                border: '2px solid rgba(102, 126, 234, 0.2)',
                fontSize: '16px'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#333' }}>Meeting Notes</label>
            <textarea
              value={webinarForm.meeting_notes}
              onChange={e => setWebinarForm((f: any) => ({ ...f, meeting_notes: e.target.value }))}
              rows={3}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '8px',
                border: '2px solid rgba(102, 126, 234, 0.2)',
                fontSize: '16px',
                resize: 'vertical'
              }}
            />
          </div>
          <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
            <button
              type="submit"
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: '12px',
                padding: '16px 32px',
                fontSize: '18px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)'
              }}
            >
              {webinarEditId ? 'Update' : 'Schedule'} Webinar
            </button>
            <button
              type="button"
              onClick={() => setShowWebinarModal(false)}
              style={{
                background: '#f8f9fa',
                color: '#495057',
                border: '2px solid #e9ecef',
                borderRadius: '12px',
                padding: '16px 32px',
                fontSize: '18px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </section>
    );
  }

  return (
    <>
      <section>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 24,
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <h2 style={{
            fontSize: 'clamp(20px, 3vw, 28px)',
            fontWeight: 700,
            color: '#667eea',
            margin: 0,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>Manage Webinars</h2>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
            {!googleOAuthSetup && (
              <button
                onClick={handleGoogleOAuthSetup}
                style={{
                  background: 'linear-gradient(135deg, #4285f4 0%, #34a853 100%)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 20px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.3s ease'
                }}
              >
                🔗 Setup Google OAuth
              </button>
            )}
            <button
              onClick={() => {
                setWebinarForm({
                  title: '',
                  description: '',
                  start_time: '',
                  end_time: '',
                  duration_minutes: 60,
                  max_attendees: 100,
                  price: 0,
                  is_free: true,
                  attendee_emails: [],
                  meeting_notes: '',
                  status: 'scheduled',
                  google_meet_link: ''
                });
                setWebinarEditId(null);
                setShowWebinarModal(true);
              }}
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 20px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.3s ease'
              }}
            >
              <FaPlus size={16} />
              Schedule Webinar
            </button>
          </div>
        </div>

        <DataTable
          data={webinars}
          columns={[
            { key: 'title', label: 'Title', sortable: true },
            { key: 'organizer_email', label: 'Organizer', sortable: true },
            { key: 'start_time', label: 'Start Time', sortable: true, render: (value: string) => new Date(value).toLocaleString() },
            { key: 'duration_minutes', label: 'Duration (min)', sortable: true },
            { key: 'max_attendees', label: 'Max Attendees', sortable: true },
            { key: 'price', label: 'Price', sortable: true, render: (value: number | string, row: { is_free?: boolean }) => row.is_free ? 'Free' : `₹${value}` },
            {
              key: 'status', label: 'Status', sortable: true, render: (value: string) => (
                <span style={{
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: '600',
                  background: value === 'scheduled' ? '#e3f2fd' : value === 'live' ? '#e8f5e8' : '#ffebee',
                  color: value === 'scheduled' ? '#1976d2' : value === 'live' ? '#388e3c' : '#d32f2f'
                }}>
                  {value}
                </span>
              )
            },
            {
              key: 'google_meet_link', label: 'Meet Link', render: (value: string) => value ? (
                <a href={value} target="_blank" rel="noopener noreferrer" style={{
                  color: '#667eea',
                  textDecoration: 'none',
                  fontWeight: '600',
                  fontSize: '12px',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  backgroundColor: '#e3f2fd',
                  border: '1px solid #667eea',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease'
                }}>
                  🎥 Join Meeting
                </a>
              ) : 'Not available'
            },
            {
              key: 'google_calendar_event_id', label: 'Calendar Event', render: (value: string, row: any) => {
                if (!value) return 'Not added';

                const startDate = new Date(row.start_time);
                const endDate = new Date(row.end_time);
                const startStr = startDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
                const endStr = endDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

                const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(row.title)}&dates=${startStr}/${endStr}&details=${encodeURIComponent(row.description || '')}&location=Online&sf=true&output=xml`;

                return (
                  <a href={calendarUrl} target="_blank" rel="noopener noreferrer" style={{
                    color: '#4caf50',
                    textDecoration: 'none',
                    fontWeight: '600',
                    fontSize: '12px',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    backgroundColor: '#e8f5e8',
                    border: '1px solid #4caf50',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s ease'
                  }}>
                    📅 View in Calendar
                  </a>
                );
              }
            }
          ]}
          onEdit={handleWebinarEdit}
          onDelete={handleWebinarDelete}
        />
      </section>
    </>
  );
}
