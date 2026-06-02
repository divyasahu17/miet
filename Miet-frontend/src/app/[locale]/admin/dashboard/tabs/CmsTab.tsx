"use client";
import React, { useState } from 'react';
import { 
  FaEdit, FaTrash, FaPlus, FaCog, FaHome, FaInfoCircle, FaPhone, 
  FaBriefcase, FaGraduationCap, FaUsers, FaShoppingBag, FaCalendarAlt, 
  FaShieldAlt, FaFileContract, FaGlobe, FaEye, FaImages, FaCode, FaParagraph 
} from "react-icons/fa";

import TeamTab from './TeamTab';

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

  const [searchTerm, setSearchTerm] = useState('');

  // Default to 'home' if page filter is 'all' to show a specific page's builder view
  const activePage = cmsPageFilter === 'all' ? 'home' : cmsPageFilter;

  // Pages definition with icons and labels
  const pagesList = [
    { key: 'home', label: 'Home Page', icon: <FaHome /> },
    { key: 'about', label: 'About Page', icon: <FaInfoCircle /> },
    { key: 'contact', label: 'Contact Page', icon: <FaPhone /> },
    { key: 'services', label: 'Services Page', icon: <FaBriefcase /> },
    { key: 'courses', label: 'Courses Page', icon: <FaGraduationCap /> },
    { key: 'consultants', label: 'Consultants Page', icon: <FaUsers /> },
    { key: 'marketplace', label: 'Marketplace', icon: <FaShoppingBag /> },
    { key: 'events', label: 'Events Page', icon: <FaCalendarAlt /> },
    { key: 'privacy', label: 'Privacy Policy', icon: <FaShieldAlt /> },
    { key: 'terms', label: 'Terms & Conditions', icon: <FaFileContract /> },
    { key: 'team_members', label: 'Team Members', icon: <FaUsers /> }
  ];

  // Filter content based on active page and search term
  const filteredContent = cmsContent.filter((item: any) => {
    const matchesPage = item.page_key === activePage;
    const matchesSearch = searchTerm 
      ? (item.section_key?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         item.field_key?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         item.field_value?.toLowerCase().includes(searchTerm.toLowerCase()))
      : true;
    return matchesPage && matchesSearch;
  });

  // Group fields by section key
  const groupedSections: { [key: string]: any[] } = {};
  filteredContent.forEach((item: any) => {
    const sec = item.section_key || 'General / Global';
    if (!groupedSections[sec]) {
      groupedSections[sec] = [];
    }
    groupedSections[sec].push(item);
  });

  const getFieldTypeIcon = (type: string) => {
    switch (type) {
      case 'image': return <FaImages style={{ color: '#10b981' }} />;
      case 'html': return <FaCode style={{ color: '#3b82f6' }} />;
      case 'textarea': return <FaParagraph style={{ color: '#f59e0b' }} />;
      default: return <FaParagraph style={{ color: '#6b7280' }} />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Tab Header & Quick Info */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'white',
        padding: '24px 32px',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
        border: '1px solid rgba(102, 126, 234, 0.08)',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div>
          <h2 style={{
            fontSize: '28px',
            fontWeight: 800,
            margin: 0,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <FaGlobe /> Website CMS Builder
          </h2>
          <p style={{ margin: '6px 0 0 0', color: '#666', fontSize: '14px' }}>
            Manage the content, text, images, and HTML values dynamically for each page of your site.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button
            onClick={handleCmsPreload}
            disabled={loading}
            style={{
              background: 'rgba(16, 185, 129, 0.1)',
              color: '#10b981', border: '1px solid rgba(105, 185, 129, 0.3)', borderRadius: '10px',
              padding: '10px 18px', fontWeight: 700, fontSize: '13px',
              cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
              transition: 'all 0.2s ease'
            }}
          >
            Preload Current Content
          </button>
          <button
            onClick={() => {
              setCmsForm({ page_key: activePage, section_key: '', field_key: '', field_value: '', field_type: 'text' });
              setCmsEditId(null);
              setShowCmsModal(true);
            }}
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: '#fff', border: 'none', borderRadius: '10px',
              padding: '10px 20px', fontWeight: 700, fontSize: '13px',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.2)',
              transition: 'all 0.2s ease'
            }}
          >
            <FaPlus /> Add CMS Entry
          </button>
        </div>
      </div>

      {/* Main CMS Workspace */}
      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '24px', alignItems: 'start' }}>
        
        {/* Navigation Sidebar of Pages */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '16px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
          border: '1px solid rgba(102, 126, 234, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px'
        }}>
          <h4 style={{ margin: '8px 0 12px 12px', color: '#1e1b4b', fontWeight: 800, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.6 }}>Pages list</h4>
          {pagesList.map((pg) => {
            const isSelected = activePage === pg.key;
            return (
              <button
                key={pg.key}
                onClick={() => setCmsPageFilter(pg.key)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  border: 'none',
                  background: isSelected ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)' : 'transparent',
                  color: isSelected ? '#667eea' : '#4b5563',
                  fontWeight: isSelected ? 700 : 500,
                  fontSize: '14px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <span style={{ fontSize: '16px', display: 'flex', alignItems: 'center' }}>{pg.icon}</span>
                {pg.label}
              </button>
            );
          })}
        </div>

        {/* Content Builder Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
          {activePage === 'team_members' ? (
            <TeamTab />
          ) : (
            <>
              {/* Search bar inside selected page */}
              <div style={{
                background: 'white',
                borderRadius: '12px',
                padding: '12px 20px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
                border: '1px solid rgba(102, 126, 234, 0.06)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <span style={{ color: '#9ca3af' }}>Search current page:</span>
                <input 
                  type="text"
                  placeholder="Filter by section or field..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    flex: 1,
                    border: 'none',
                    outline: 'none',
                    fontSize: '14px',
                    color: '#374151'
                  }}
                />
              </div>

              {/* Section Cards */}
              {Object.keys(groupedSections).length === 0 ? (
                <div style={{
                  background: 'white',
                  borderRadius: '16px',
                  padding: '60px',
                  textAlign: 'center',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                  border: '1px solid rgba(102, 126, 234, 0.08)'
                }}>
                  <FaCog size={48} style={{ color: '#d1d5db', marginBottom: '16px', animation: 'spin 4s linear infinite' }} />
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 700, color: '#374151' }}>No Entries Found</h3>
                  <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>
                    There are no content entries matching the criteria. Click "Add CMS Entry" to add one!
                  </p>
                </div>
              ) : (
                Object.entries(groupedSections).map(([sectionKey, fields]) => (
                  <div 
                    key={sectionKey}
                    style={{
                      background: 'white',
                      borderRadius: '16px',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                      border: '1px solid rgba(102, 126, 234, 0.08)',
                      overflow: 'hidden'
                    }}
                  >
                    {/* Section Header */}
                    <div style={{
                      background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.04) 0%, rgba(118, 75, 162, 0.04) 100%)',
                      padding: '16px 24px',
                      borderBottom: '1px solid rgba(102, 126, 234, 0.08)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <h3 style={{
                        margin: 0,
                        fontSize: '16px',
                        fontWeight: 700,
                        color: '#1e1b4b',
                        textTransform: 'capitalize'
                      }}>
                        📂 Section: {sectionKey.replace(/[-_]/g, ' ')}
                      </h3>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: '#667eea', background: 'rgba(102, 126, 234, 0.1)', padding: '2px 8px', borderRadius: '12px' }}>
                        {fields.length} {fields.length === 1 ? 'field' : 'fields'}
                      </span>
                    </div>

                    {/* Fields inside Section */}
                    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      {fields.map((field: any, index: number) => (
                        <div 
                          key={field.id || index}
                          style={{
                            paddingBottom: index < fields.length - 1 ? '20px' : '0',
                            borderBottom: index < fields.length - 1 ? '1px solid rgba(0, 0, 0, 0.04)' : 'none',
                            display: 'grid',
                            gridTemplateColumns: '220px 1fr 100px',
                            gap: '16px',
                            alignItems: 'start'
                          }}
                        >
                          {/* Labeled key & Type */}
                          <div>
                            <div style={{ fontWeight: 700, color: '#374151', fontSize: '14px', wordBreak: 'break-all' }}>
                              {field.field_key.replace(/[-_]/g, ' ')}
                            </div>
                            <div style={{ color: '#9ca3af', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                              {getFieldTypeIcon(field.field_type)}
                              <span style={{ textTransform: 'uppercase' }}>{field.field_type}</span>
                            </div>
                          </div>

                          {/* Display Value preview */}
                          <div style={{ fontSize: '14px', color: '#4b5563', overflow: 'hidden' }}>
                            {field.field_type === 'image' || field.field_value?.match(/\.(jpeg|jpg|gif|png|webp)/) ? (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <img 
                                  src={field.field_value} 
                                  alt={field.field_key} 
                                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                  style={{ maxHeight: '120px', maxWidth: '240px', borderRadius: '8px', border: '1px solid #e5e7eb', objectFit: 'cover' }}
                                />
                                <code style={{ fontSize: '11px', color: '#667eea', wordBreak: 'break-all' }}>{field.field_value}</code>
                              </div>
                            ) : field.field_type === 'html' ? (
                              <div style={{ background: '#f9fafb', padding: '10px 16px', borderRadius: '8px', border: '1px solid #f3f4f6', fontFamily: 'monospace', fontSize: '12px', maxHeight: '100px', overflowY: 'auto' }}>
                                {field.field_value}
                              </div>
                            ) : (
                              <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.5', maxHeight: '120px', overflowY: 'auto' }}>
                                {field.field_value || <span style={{ fontStyle: 'italic', color: '#cbd5e1' }}>Empty</span>}
                              </div>
                            )}
                          </div>

                          {/* Actions */}
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                            <button
                              onClick={() => {
                                setCmsForm({
                                  page_key: field.page_key,
                                  section_key: field.section_key,
                                  field_key: field.field_key,
                                  field_value: field.field_value,
                                  field_type: field.field_type
                                });
                                setCmsEditId(field.id || null);
                                setShowCmsModal(true);
                              }}
                              style={{
                                background: 'rgba(102, 126, 234, 0.08)',
                                color: '#667eea',
                                border: 'none',
                                borderRadius: '8px',
                                width: '36px',
                                height: '36px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                              }}
                              title="Edit Field"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => handleCmsDelete(field.id!)}
                              style={{
                                background: 'rgba(239, 68, 68, 0.08)',
                                color: '#ef4444',
                                border: 'none',
                                borderRadius: '8px',
                                width: '36px',
                                height: '36px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                              }}
                              title="Delete Field"
                            >
                              <FaTrash />
                            </button>
                          </div>

                        </div>
                      ))}
                    </div>

                    {/* Quick field add */}
                    <div style={{
                      padding: '12px 24px',
                      background: '#fcfcfd',
                      borderTop: '1px solid rgba(0, 0, 0, 0.02)',
                      display: 'flex',
                      justifyContent: 'flex-end'
                    }}>
                      <button
                        onClick={() => {
                          setCmsForm({ page_key: activePage, section_key: sectionKey, field_key: '', field_value: '', field_type: 'text' });
                          setCmsEditId(null);
                          setShowCmsModal(true);
                        }}
                        style={{
                          background: 'transparent',
                          color: '#667eea',
                          border: 'none',
                          fontSize: '12px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <FaPlus /> Add field to section
                      </button>
                    </div>

                  </div>
                ))
              )}
            </>
          )}
        </div>

      </div>

      {/* Reusable Add/Edit Modal (Managed by Dashboard Component) */}
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
              fontWeight: 800, marginBottom: 24, fontSize: '24px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
            }}>{cmsEditId ? 'Edit' : 'Add'} CMS Entry</h2>
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
                {loading ? 'Saving...' : (cmsEditId ? 'Update Entry' : 'Save Entry')}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
