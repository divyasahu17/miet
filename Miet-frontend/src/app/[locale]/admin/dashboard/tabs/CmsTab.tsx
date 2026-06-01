"use client";
import React from 'react';
import Image from 'next/image';
import { FaThLarge, FaList, FaTags, FaUserCircle, FaSignOutAlt, FaChevronLeft, FaChevronRight, FaUserMd, FaChevronDown, FaSearch, FaEdit, FaTrash, FaPlus, FaEye, FaImages, FaCog } from "react-icons/fa";
import Select from "react-select";

export default function CmsTab(props: any) {
  const {
    cmsContent = [],
    cmsPageFilter,
    setCmsPageFilter,
    handleCmsPreload,
    loading,
    setCmsForm,
    setCmsEditId,
    setShowCmsModal,
    handleCmsDelete,
    showCmsModal,
    cmsEditId,
    handleCmsSave,
    cmsForm
  } = props;

  return (
    <>

            <section>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 32,
                flexWrap: 'wrap',
                gap: 16
              }}>
                <h2 style={{
                  fontSize: 'clamp(24px, 4vw, 32px)',
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>CMS - Page Content</h2>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                  <select
                    value={cmsPageFilter}
                    onChange={e => setCmsPageFilter(e.target.value)}
                    style={{
                      padding: '10px 16px', borderRadius: '10px',
                      border: '2px solid rgba(102, 126, 234, 0.2)',
                      fontSize: '14px', fontWeight: 600, color: '#333'
                    }}
                  >
                    <option value="all">All Pages</option>
                    <option value="home">Home</option>
                    <option value="about">About</option>
                    <option value="contact">Contact</option>
                    <option value="services">Services</option>
                    <option value="courses">Courses</option>
                    <option value="consultants">Consultants</option>
                    <option value="marketplace">Marketplace</option>
                    <option value="events">Events</option>
                    <option value="privacy">Privacy</option>
                    <option value="terms">Terms</option>
                  </select>
                  <button
                    onClick={handleCmsPreload}
                    disabled={loading}
                    style={{
                      background: 'rgba(16, 185, 129, 0.9)',
                      color: '#fff', border: 'none', borderRadius: '12px',
                      padding: '12px 20px', fontWeight: 700, fontSize: '14px',
                      cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 8,
                      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => !loading && (e.currentTarget.style.transform = 'translateY(-2px)')}
                    onMouseLeave={(e) => !loading && (e.currentTarget.style.transform = 'translateY(0)')}
                  >
                    Preload current site content
                  </button>
                  <button
                    onClick={() => {
                      setCmsForm({ page_key: 'home', section_key: '', field_key: '', field_value: '', field_type: 'text' });
                      setCmsEditId(null);
                      setShowCmsModal(true);
                    }}
                    style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: '#fff', border: 'none', borderRadius: '12px',
                      padding: '12px 24px', fontWeight: 700, fontSize: '15px',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
                      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    <FaPlus /> Add Content
                  </button>
                </div>
              </div>

              {/* CMS Content Table */}
              <div style={{
                background: '#fff', borderRadius: '16px', overflow: 'hidden',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)', border: '1px solid rgba(102, 126, 234, 0.1)'
              }}>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.08) 100%)' }}>
                        <th style={{ padding: '14px 16px', textAlign: 'left', fontWeight: 700, color: '#1e1b4b', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Page</th>
                        <th style={{ padding: '14px 16px', textAlign: 'left', fontWeight: 700, color: '#1e1b4b', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Section</th>
                        <th style={{ padding: '14px 16px', textAlign: 'left', fontWeight: 700, color: '#1e1b4b', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Field</th>
                        <th style={{ padding: '14px 16px', textAlign: 'left', fontWeight: 700, color: '#1e1b4b', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Value</th>
                        <th style={{ padding: '14px 16px', textAlign: 'left', fontWeight: 700, color: '#1e1b4b', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Type</th>
                        <th style={{ padding: '14px 16px', textAlign: 'center', fontWeight: 700, color: '#1e1b4b', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cmsContent
                        .filter((item: any) => !cmsPageFilter || cmsPageFilter === 'all' || item.page_key === cmsPageFilter)
                        .map((item: any, idx: number) => (
                        <tr key={item.id || idx} style={{
                          borderBottom: '1px solid rgba(102, 126, 234, 0.08)',
                          transition: 'background 0.2s'
                        }}
                          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(102, 126, 234, 0.03)'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                          <td style={{ padding: '12px 16px', fontSize: '14px', fontWeight: 600, color: '#667eea' }}>{item.page_key}</td>
                          <td style={{ padding: '12px 16px', fontSize: '14px', color: '#333' }}>{item.section_key}</td>
                          <td style={{ padding: '12px 16px', fontSize: '14px', color: '#333' }}>{item.field_key}</td>
                          <td style={{ padding: '12px 16px', fontSize: '14px', color: '#555', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {item.field_value ? (item.field_value.length > 60 ? item.field_value.substring(0, 60) + '...' : item.field_value) : '-'}
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            <span style={{
                              background: 'rgba(102, 126, 234, 0.1)', color: '#667eea',
                              padding: '4px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: 600
                            }}>{item.field_type}</span>
                          </td>
                          <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                            <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                              <button
                                onClick={() => {
                                  setCmsForm({
                                    page_key: item.page_key,
                                    section_key: item.section_key,
                                    field_key: item.field_key,
                                    field_value: item.field_value,
                                    field_type: item.field_type
                                  });
                                  setCmsEditId(item.id || null);
                                  setShowCmsModal(true);
                                }}
                                style={{
                                  background: 'rgba(102, 126, 234, 0.1)', color: '#667eea',
                                  border: 'none', borderRadius: '8px', padding: '6px 12px',
                                  fontWeight: 600, cursor: 'pointer', fontSize: '13px'
                                }}
                              >
                                <FaEdit />
                              </button>
                              <button
                                onClick={() => handleCmsDelete(item.id!)}
                                style={{
                                  background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444',
                                  border: 'none', borderRadius: '8px', padding: '6px 12px',
                                  fontWeight: 600, cursor: 'pointer', fontSize: '13px'
                                }}
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {cmsContent.filter((item: any) => !cmsPageFilter || cmsPageFilter === 'all' || item.page_key === cmsPageFilter).length === 0 && (
                  <div style={{ textAlign: 'center', padding: '40px 20px', color: '#6b7280' }}>
                    <FaCog size={36} style={{ marginBottom: 12, opacity: 0.3 }} />
                    <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: 8 }}>No CMS content yet</h3>
                    <p style={{ fontSize: '14px' }}>Add content entries to manage text and media across your site pages.</p>
                  </div>
                )}
              </div>

              {/* CMS Edit/Add Modal */}
              {showCmsModal && (
                <div style={{
                  position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                  background: 'rgba(0,0,0,0.5)', zIndex: 3000,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
                }} onClick={e => { if (e.target === e.currentTarget) setShowCmsModal(false); }}>
                  <div style={{
                    background: '#fff', borderRadius: '20px', padding: '40px',
                    width: '90vw', maxWidth: '600px', maxHeight: '90vh',
                    boxShadow: '0 20px 60px rgba(102, 126, 234, 0.2)',
                    position: 'relative', overflow: 'auto'
                  }}>
                    <button
                      onClick={() => setShowCmsModal(false)}
                      style={{
                        position: 'absolute', top: 16, right: 16,
                        background: 'rgba(102, 126, 234, 0.1)', border: 'none',
                        fontSize: 22, color: '#667eea', cursor: 'pointer',
                        width: '36px', height: '36px', borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}
                    >×</button>
                    <h2 style={{
                      fontWeight: 700, marginBottom: 24, fontSize: '24px',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
                    }}>{cmsEditId ? 'Edit' : 'Add'} CMS Content</h2>
                    <form onSubmit={handleCmsSave} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#333' }}>Page *</label>
                        <select
                          value={cmsForm.page_key}
                          onChange={e => setCmsForm((f: any) => ({ ...f, page_key: e.target.value }))}
                          style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '2px solid rgba(102, 126, 234, 0.2)', fontSize: '15px' }}
                        >
                          <option value="home">Home</option>
                          <option value="about">About</option>
                          <option value="contact">Contact</option>
                          <option value="services">Services</option>
                          <option value="courses">Courses</option>
                          <option value="consultants">Consultants</option>
                          <option value="marketplace">Marketplace</option>
                          <option value="events">Events</option>
                          <option value="privacy">Privacy Policy</option>
                          <option value="terms">Terms & Conditions</option>
                        </select>
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#333' }}>Section Key *</label>
                        <input
                          value={cmsForm.section_key}
                          onChange={e => setCmsForm((f: any) => ({ ...f, section_key: e.target.value }))}
                          placeholder="e.g. hero, about, features"
                          required
                          style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '2px solid rgba(102, 126, 234, 0.2)', fontSize: '15px' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#333' }}>Field Key *</label>
                        <input
                          value={cmsForm.field_key}
                          onChange={e => setCmsForm((f: any) => ({ ...f, field_key: e.target.value }))}
                          placeholder="e.g. title, subtitle, description"
                          required
                          style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '2px solid rgba(102, 126, 234, 0.2)', fontSize: '15px' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#333' }}>Field Type</label>
                        <select
                          value={cmsForm.field_type}
                          onChange={e => setCmsForm((f: any) => ({ ...f, field_type: e.target.value as any }))}
                          style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '2px solid rgba(102, 126, 234, 0.2)', fontSize: '15px' }}
                        >
                          <option value="text">Text</option>
                          <option value="textarea">Text Area</option>
                          <option value="html">HTML</option>
                          <option value="image">Image URL</option>
                          <option value="number">Number</option>
                          <option value="json">JSON</option>
                        </select>
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#333' }}>Value</label>
                        {cmsForm.field_type === 'textarea' || cmsForm.field_type === 'html' || cmsForm.field_type === 'json' ? (
                          <textarea
                            value={cmsForm.field_value}
                            onChange={e => setCmsForm((f: any) => ({ ...f, field_value: e.target.value }))}
                            placeholder="Enter content..."
                            rows={6}
                            style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '2px solid rgba(102, 126, 234, 0.2)', fontSize: '15px', resize: 'vertical', fontFamily: cmsForm.field_type === 'json' ? 'monospace' : 'inherit' }}
                          />
                        ) : (
                          <input
                            value={cmsForm.field_value}
                            onChange={e => setCmsForm((f: any) => ({ ...f, field_value: e.target.value }))}
                            placeholder="Enter value..."
                            type={cmsForm.field_type === 'number' ? 'number' : 'text'}
                            style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '2px solid rgba(102, 126, 234, 0.2)', fontSize: '15px' }}
                          />
                        )}
                      </div>
                      <button
                        type="submit"
                        disabled={loading}
                        style={{
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          color: '#fff', border: 'none', borderRadius: '12px',
                          padding: '14px 28px', fontWeight: 700, fontSize: '16px',
                          cursor: loading ? 'not-allowed' : 'pointer',
                          boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
                        }}
                      >
                        {loading ? 'Saving...' : (cmsEditId ? 'Update Content' : 'Save Content')}
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </section>
          
    </>
  );
}
