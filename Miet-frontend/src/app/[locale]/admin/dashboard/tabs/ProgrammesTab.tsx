"use client";
import React, { useState, useEffect } from 'react';
import { getApiUrl } from '@/utils/api';
import { 
  FaPlus, FaEdit, FaTrash, FaBookOpen, FaSpinner, FaUpload
} from 'react-icons/fa';

interface Programme {
  id: number;
  title: string;
  description?: string;
  image_url?: string;
  p1_title?: string;
  p1_description?: string;
  p2_title?: string;
  p2_description?: string;
}

export default function ProgrammesTab() {
  const [programmes, setProgrammes] = useState<Programme[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [p1Title, setP1Title] = useState('');
  const [p1Description, setP1Description] = useState('');
  const [p2Title, setP2Title] = useState('');
  const [p2Description, setP2Description] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProgrammes();
  }, []);

  const fetchProgrammes = async () => {
    setLoading(true);
    try {
      const response = await fetch(getApiUrl('api/programmes'));
      if (response.ok) {
        const data = await response.json();
        setProgrammes(data.programmes || data || []);
      }
    } catch (error) {
      console.error('Error fetching programmes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (programme: Programme) => {
    setEditId(programme.id);
    setTitle(programme.title || '');
    setDescription(programme.description || '');
    setP1Title(programme.p1_title || '');
    setP1Description(programme.p1_description || '');
    setP2Title(programme.p2_title || '');
    setP2Description(programme.p2_description || '');
    setImageUrlInput(programme.image_url || '');
    setImagePreview(programme.image_url ? (process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000') + programme.image_url : '');
    setImageFile(null);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this programme?')) return;
    try {
      const token = localStorage.getItem('admin_jwt');
      const response = await fetch(getApiUrl(`api/programmes/${id}`), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        setProgrammes(prev => prev.filter(p => p.id !== id));
      } else {
        alert('Failed to delete programme');
      }
    } catch (error) {
      console.error('Error deleting programme:', error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return alert('Title is required');

    setSaving(true);
    try {
      const token = localStorage.getItem('admin_jwt');
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('p1_title', p1Title);
      formData.append('p1_description', p1Description);
      formData.append('p2_title', p2Title);
      formData.append('p2_description', p2Description);
      
      if (imageFile) {
        formData.append('image', imageFile);
      } else if (imageUrlInput) {
        formData.append('image_url', imageUrlInput);
      }

      const url = editId ? getApiUrl(`api/programmes/${editId}`) : getApiUrl('api/programmes');
      const method = editId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        setShowModal(false);
        fetchProgrammes();
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to save programme');
      }
    } catch (error) {
      console.error('Error saving programme:', error);
      alert('Error saving programme');
    } finally {
      setSaving(false);
    }
  };

  const openAddModal = () => {
    setEditId(null);
    setTitle('');
    setDescription('');
    setP1Title('');
    setP1Description('');
    setP2Title('');
    setP2Description('');
    setImageFile(null);
    setImageUrlInput('');
    setImagePreview('');
    setShowModal(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header card */}
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
        gap: '16px'
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
            🎓 Dynamic Programmes Management
          </h2>
          <p style={{ margin: '6px 0 0 0', color: '#666', fontSize: '14px' }}>
            Add, update, or remove programmes displayed on the About page.
          </p>
        </div>
        <button
          onClick={openAddModal}
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: '#fff', border: 'none', borderRadius: '10px',
            padding: '12px 24px', fontWeight: 700, fontSize: '14px',
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.2)',
            transition: 'all 0.2s ease'
          }}
        >
          <FaPlus /> Add Programme
        </button>
      </div>

      {/* Grid of Programmes Cards */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '100px 0' }}>
          <FaSpinner className="spin" size={32} style={{ color: '#667eea', animation: 'spin 1s linear infinite' }} />
        </div>
      ) : programmes.length === 0 ? (
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '60px',
          textAlign: 'center',
          boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
          border: '1px solid rgba(102, 126, 234, 0.08)'
        }}>
          <FaBookOpen size={64} style={{ color: '#e5e7eb', marginBottom: '16px' }} />
          <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', color: '#374151' }}>No Programmes</h3>
          <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>
            Add dynamic programmes to display them on the About section of the website.
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '24px'
        }}>
          {programmes.map((prog) => (
            <div
              key={prog.id}
              style={{
                background: 'white',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                border: '1px solid rgba(102, 126, 234, 0.06)',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative'
              }}
            >
              {/* Image Preview Container */}
              <div style={{
                width: '100%',
                height: '160px',
                borderRadius: '12px',
                overflow: 'hidden',
                border: '1px solid rgba(102, 126, 234, 0.1)',
                marginBottom: '16px',
                background: '#f3f4f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {prog.image_url ? (
                  <img
                    src={(process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000') + prog.image_url}
                    alt={prog.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => {
                      e.currentTarget.src = '';
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <FaBookOpen size={48} style={{ color: '#cbd5e1' }} />
                )}
              </div>

              <h3 style={{ margin: '0 0 8px 0', fontSize: '20px', fontWeight: 700, color: '#1e1b4b' }}>
                {prog.title}
              </h3>

              <p style={{
                margin: '0 0 16px 0',
                fontSize: '14px',
                color: '#6b7280',
                lineHeight: '1.5',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                flex: 1
              }}>
                {prog.description || 'No description provided.'}
              </p>

              {/* Action Buttons */}
              <div style={{
                display: 'flex',
                gap: '10px',
                marginTop: 'auto',
                width: '100%',
                borderTop: '1px solid #f3f4f6',
                paddingTop: '16px'
              }}>
                <button
                  onClick={() => handleEdit(prog)}
                  style={{
                    flex: 1,
                    background: 'rgba(102, 126, 234, 0.08)',
                    color: '#667eea',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <FaEdit /> Edit
                </button>
                <button
                  onClick={() => handleDelete(prog.id)}
                  style={{
                    flex: 1,
                    background: 'rgba(239, 68, 68, 0.08)',
                    color: '#ef4444',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <FaTrash /> Delete
                </button>
              </div>

            </div>
          ))}
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
            <button
              onClick={() => setShowModal(false)}
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
            }}>{editId ? 'Edit' : 'Add'} Programme</h2>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#374151', fontSize: '14px' }}>Programme Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Health Education Programme"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '2px solid rgba(102, 126, 234, 0.2)', fontSize: '15px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#374151', fontSize: '14px' }}>Main Description</label>
                <textarea
                  placeholder="Enter a brief overview of this programme..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  rows={4}
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '2px solid rgba(102, 126, 234, 0.2)', fontSize: '15px', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#374151', fontSize: '14px' }}>Sub-Section 1 Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Core Features"
                    value={p1Title}
                    onChange={e => setP1Title(e.target.value)}
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '2px solid rgba(102, 126, 234, 0.2)', fontSize: '15px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#374151', fontSize: '14px' }}>Sub-Section 2 Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Expected Outcomes"
                    value={p2Title}
                    onChange={e => setP2Title(e.target.value)}
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '2px solid rgba(102, 126, 234, 0.2)', fontSize: '15px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#374151', fontSize: '14px' }}>Sub-Section 1 Content (HTML allowed)</label>
                <textarea
                  placeholder="<p>Details here...</p>"
                  value={p1Description}
                  onChange={e => setP1Description(e.target.value)}
                  rows={3}
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '2px solid rgba(102, 126, 234, 0.2)', fontSize: '15px', resize: 'vertical', fontFamily: 'monospace' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#374151', fontSize: '14px' }}>Sub-Section 2 Content (HTML allowed)</label>
                <textarea
                  placeholder="<p>Details here...</p>"
                  value={p2Description}
                  onChange={e => setP2Description(e.target.value)}
                  rows={3}
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '2px solid rgba(102, 126, 234, 0.2)', fontSize: '15px', resize: 'vertical', fontFamily: 'monospace' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#374151', fontSize: '14px' }}>Programme Image</label>
                
                {imagePreview && (
                  <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img src={imagePreview} alt="Preview" style={{ width: '100px', height: '60px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #e5e7eb' }} />
                    <span style={{ fontSize: '12px', color: '#6b7280' }}>Selected Image Preview</span>
                  </div>
                )}

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  background: '#f9fafb',
                  border: '2px dashed rgba(102, 126, 234, 0.2)',
                  borderRadius: '10px',
                  padding: '12px',
                  position: 'relative'
                }}>
                  <FaUpload style={{ color: '#667eea' }} />
                  <span style={{ fontSize: '13px', color: '#4b5563', fontWeight: 600 }}>Choose File</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: '#fff', border: 'none', borderRadius: '12px',
                  padding: '14px 28px', fontWeight: 700, fontSize: '16px',
                  cursor: saving ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                  marginTop: '10px'
                }}
              >
                {saving ? 'Saving...' : (editId ? 'Update Programme' : 'Save Programme')}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
