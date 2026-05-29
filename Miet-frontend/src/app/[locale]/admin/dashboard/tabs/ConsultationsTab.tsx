"use client";
import React from 'react';
import Image from 'next/image';
import { FaThLarge, FaList, FaTags, FaUserCircle, FaSignOutAlt, FaChevronLeft, FaChevronRight, FaUserMd, FaChevronDown, FaSearch, FaEdit, FaTrash, FaPlus, FaEye, FaImages, FaCog } from "react-icons/fa";
import Select from "react-select";

export default function ConsultationsTab(props: any) {
  const { DataTable, consultations, consultants, showConsultationModal, setShowConsultationModal, consultationForm, setConsultationForm, consultationEditId, setConsultationEditId, handleConsultationSubmit, handleConsultationEdit, handleConsultationDelete, googleOAuthSetup, handleGoogleOAuthSetup } = props;

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
                }}>Manage Consultations</h2>


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
                      setConsultationForm({
                        consultant_id: 0,
                        title: '',
                        description: '',
                        start_time: '',
                        end_time: '',
                        duration_minutes: 60,
                        meeting_type: 'consultation',
                        price: 0,
                        attendee_emails: [],
                        notes: '',
                        status: 'scheduled',
                        payment_status: 'pending'
                      });
                      setConsultationEditId(null);
                      setShowConsultationModal(true);
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
                    Schedule Consultation
                  </button>
                </div>
              </div>

              


              <DataTable
                data={consultations}
                columns={[
                  { key: 'title', label: 'Title', sortable: true },
                  {
                    key: 'consultant_id', label: 'Consultant', sortable: true, render: (value: number) => {
                      const consultant = consultants?.find((c: any) => c.id === value);
                      return consultant ? consultant.name : 'Unknown';
                    }
                  },
                  {
                    key: 'user_info', label: 'Client Information', sortable: false, render: (value: any, row: any) => {
                      // Show user information - either from account or external user
                      if (row.user_name && row.user_email) {
                        // External user
                        return (
                          <div style={{ fontSize: '12px', lineHeight: '1.4' }}>
                            <div style={{ fontWeight: '600', color: '#333' }}>{row.user_name}</div>
                            <div style={{ color: '#666' }}>{row.user_email}</div>
                            {row.user_phone && <div style={{ color: '#666' }}>{row.user_phone}</div>}
                          </div>
                        );
                      } else if (row.first_name && row.last_name) {
                        // Registered user
                        return (
                          <div style={{ fontSize: '12px', lineHeight: '1.4' }}>
                            <div style={{ fontWeight: '600', color: '#333' }}>{row.first_name} {row.last_name}</div>
                            <div style={{ color: '#666' }}>{row.user_account_email}</div>
                          </div>
                        );
                      } else {
                        return <span style={{ color: '#999' }}>No information</span>;
                      }
                    }
                  },
                  { key: 'start_time', label: 'Start Time', sortable: true, render: (value: string) => new Date(value).toLocaleString() },
                  { key: 'duration_minutes', label: 'Duration (min)', sortable: true },
                  { key: 'price', label: 'Price', sortable: true, render: (value: number | string) => `₹${value}` },
                  {
                    key: 'status', label: 'Status', sortable: true, render: (value: string) => (
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: '600',
                        background: value === 'scheduled' ? '#e3f2fd' : value === 'confirmed' ? '#e8f5e8' : value === 'completed' ? '#f3e5f5' : '#ffebee',
                        color: value === 'scheduled' ? '#1976d2' : value === 'confirmed' ? '#388e3c' : value === 'completed' ? '#7b1fa2' : '#d32f2f'
                      }}>
                        {value}
                      </span>
                    )
                  },
                  {
                    key: 'payment_status', label: 'Payment', sortable: true, render: (value: string) => (
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: '600',
                        background: value === 'paid' ? '#e8f5e8' : value === 'pending' ? '#fff3e0' : '#ffebee',
                        color: value === 'paid' ? '#388e3c' : value === 'pending' ? '#f57c00' : '#d32f2f'
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

                      // Create Google Calendar URL with actual event data
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
                onEdit={handleConsultationEdit}
                onDelete={handleConsultationDelete}
              />

              {/* Consultation Modal */}
              {showConsultationModal && (
                <div style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  width: '100vw',
                  height: '100vh',
                  background: 'rgba(34,37,77,0.32)',
                  zIndex: 3000,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '20px'
                }} onClick={e => { if (e.target === e.currentTarget) setShowConsultationModal(false); }}>
                  <div style={{
                    background: '#fff',
                    borderRadius: '20px',
                    padding: '40px',
                    minWidth: '90vw',
                    maxWidth: '800px',
                    maxHeight: '90vh',
                    boxShadow: '0 20px 60px rgba(102, 126, 234, 0.2)',
                    position: 'relative',
                    overflow: 'auto'
                  }}>
                    <button
                      onClick={() => setShowConsultationModal(false)}
                      aria-label="Close consultation modal"
                      style={{
                        position: 'absolute',
                        top: 20,
                        right: 20,
                        background: 'rgba(102, 126, 234, 0.1)',
                        border: 'none',
                        fontSize: 24,
                        color: '#667eea',
                        cursor: 'pointer',
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      ×
                    </button>
                    <h2 style={{
                      fontSize: 'clamp(24px, 4vw, 32px)',
                      fontWeight: 700,
                      color: '#667eea',
                      marginBottom: 32,
                      textAlign: 'center'
                    }}>
                      {consultationEditId ? 'Edit Consultation' : 'Schedule New Consultation'}
                    </h2>
                    <form onSubmit={handleConsultationSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
                        <div>
                          <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#333' }}>Consultant *</label>
                          <select
                            value={consultationForm.consultant_id}
                            onChange={e => setConsultationForm((f: any) => ({ ...f, consultant_id: parseInt(e.target.value) }))}
                            required
                            style={{
                              width: '100%',
                              padding: '12px 16px',
                              borderRadius: '8px',
                              border: '2px solid rgba(102, 126, 234, 0.2)',
                              fontSize: '16px'
                            }}
                          >
                            <option value={0}>Select Consultant</option>
                            {consultants?.map((consultant: any) => (
                              <option key={consultant.id} value={consultant.id}>
                                {consultant.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#333' }}>Title *</label>
                          <input
                            type="text"
                            value={consultationForm.title}
                            onChange={e => setConsultationForm((f: any) => ({ ...f, title: e.target.value }))}
                            required
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
                          <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#333' }}>Start Date & Time *</label>
                          <input
                            type="datetime-local"
                            value={consultationForm.start_time}
                            onChange={e => {
                              const startTime = new Date(e.target.value);
                              const endTime = new Date(consultationForm.end_time);
                              const duration = endTime && endTime > startTime ? Math.round((endTime.getTime() - startTime.getTime()) / 60000) : 60;
                              setConsultationForm((f: any) => ({
                                ...f,
                                start_time: e.target.value,
                                duration_minutes: duration
                              }));
                            }}
                            required
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
                          <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#333' }}>End Date & Time *</label>
                          <input
                            type="datetime-local"
                            value={consultationForm.end_time}
                            onChange={e => {
                              const startTime = new Date(consultationForm.start_time);
                              const endTime = new Date(e.target.value);
                              const duration = startTime && endTime > startTime ? Math.round((endTime.getTime() - startTime.getTime()) / 60000) : 60;
                              setConsultationForm((f: any) => ({
                                ...f,
                                end_time: e.target.value,
                                duration_minutes: duration
                              }));
                            }}
                            required
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
                          <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#333' }}>Duration (minutes)</label>
                          <input
                            type="number"
                            value={consultationForm.duration_minutes}
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
                          <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#333' }}>Price (₹)</label>
                          <input
                            type="number"
                            value={consultationForm.price}
                            onChange={e => setConsultationForm((f: any) => ({ ...f, price: parseFloat(e.target.value) }))}
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
                        <div>
                          <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#333' }}>Status</label>
                          <select
                            value={consultationForm.status}
                            onChange={e => setConsultationForm((f: any) => ({ ...f, status: e.target.value as any }))}
                            style={{
                              width: '100%',
                              padding: '12px 16px',
                              borderRadius: '8px',
                              border: '2px solid rgba(102, 126, 234, 0.2)',
                              fontSize: '16px'
                            }}
                          >
                            <option value="scheduled">Scheduled</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="cancelled">Cancelled</option>
                            <option value="completed">Completed</option>
                            <option value="no_show">No Show</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#333' }}>Description</label>
                        <textarea
                          value={consultationForm.description}
                          onChange={e => setConsultationForm((f: any) => ({ ...f, description: e.target.value }))}
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
                          value={consultationForm.attendee_emails?.join(', ') || ''}
                          onChange={e => setConsultationForm((f: any) => ({
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
                        <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#333' }}>Notes</label>
                        <textarea
                          value={consultationForm.notes}
                          onChange={e => setConsultationForm((f: any) => ({ ...f, notes: e.target.value }))}
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
                        {consultationEditId ? 'Update' : 'Schedule'} Consultation
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </section>
          
    </>
  );
}
