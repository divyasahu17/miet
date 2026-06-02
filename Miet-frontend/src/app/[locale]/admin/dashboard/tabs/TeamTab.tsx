"use client";
import React, { useState, useEffect } from 'react';
import { getApiUrl } from '@/utils/api';
import { 
  FaUserPlus, FaEdit, FaTrash, FaUserCircle, FaSpinner, FaUpload,
  FaFacebook, FaTwitter, FaLinkedin, FaInstagram 
} from 'react-icons/fa';

interface TeamMember {
  id: number;
  name: string;
  designation: string;
  bio: string;
  image_url: string;
  facebook?: string;
  twitter?: string;
  linkedin?: string;
  instagram?: string;
}

export default function TeamTab() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [designation, setDesignation] = useState('');
  const [bio, setBio] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [facebook, setFacebook] = useState('');
  const [twitter, setTwitter] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [instagram, setInstagram] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    setLoading(true);
    try {
      const response = await fetch(getApiUrl('api/team'));
      if (response.ok) {
        const data = await response.json();
        setTeamMembers(data.team || data || []);
      }
    } catch (error) {
      console.error('Error fetching team members:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (member: TeamMember) => {
    setEditId(member.id);
    setName(member.name || '');
    setDesignation(member.designation || '');
    setBio(member.bio || '');
    setImageUrlInput(member.image_url || '');
    setImagePreview(member.image_url ? (process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000') + member.image_url : '');
    setImageFile(null);
    setFacebook(member.facebook || '');
    setTwitter(member.twitter || '');
    setLinkedin(member.linkedin || '');
    setInstagram(member.instagram || '');
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this team member?')) return;
    try {
      const token = localStorage.getItem('admin_jwt');
      const response = await fetch(getApiUrl(`api/team/${id}`), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        setTeamMembers(prev => prev.filter(m => m.id !== id));
      } else {
        alert('Failed to delete team member');
      }
    } catch (error) {
      console.error('Error deleting team member:', error);
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
    if (!name.trim()) return alert('Name is required');

    setSaving(true);
    try {
      const token = localStorage.getItem('admin_jwt');
      const formData = new FormData();
      formData.append('name', name);
      formData.append('designation', designation);
      formData.append('bio', bio);
      formData.append('facebook', facebook);
      formData.append('twitter', twitter);
      formData.append('linkedin', linkedin);
      formData.append('instagram', instagram);
      
      if (imageFile) {
        formData.append('image', imageFile);
      } else if (imageUrlInput) {
        formData.append('image_url', imageUrlInput);
      }

      const url = editId ? getApiUrl(`api/team/${editId}`) : getApiUrl('api/team');
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
        fetchTeam();
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to save team member');
      }
    } catch (error) {
      console.error('Error saving team member:', error);
      alert('Error saving team member');
    } finally {
      setSaving(false);
    }
  };

  const openAddModal = () => {
    setEditId(null);
    setName('');
    setDesignation('');
    setBio('');
    setImageFile(null);
    setImageUrlInput('');
    setImagePreview('');
    setFacebook('');
    setTwitter('');
    setLinkedin('');
    setInstagram('');
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
            👥 Dynamic Team Management
          </h2>
          <p style={{ margin: '6px 0 0 0', color: '#666', fontSize: '14px' }}>
            Add, update, or remove members representing your professional mental health and workshop team.
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
          <FaUserPlus /> Add Team Member
        </button>
      </div>

      {/* Grid of Team Cards */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '100px 0' }}>
          <FaSpinner className="spin" size={32} style={{ color: '#667eea', animation: 'spin 1s linear infinite' }} />
        </div>
      ) : teamMembers.length === 0 ? (
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '60px',
          textAlign: 'center',
          boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
          border: '1px solid rgba(102, 126, 234, 0.08)'
        }}>
          <FaUserCircle size={64} style={{ color: '#e5e7eb', marginBottom: '16px' }} />
          <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', color: '#374151' }}>No Team Members</h3>
          <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>
            Add dynamic team members to display them on the About section of the website.
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '24px'
        }}>
          {teamMembers.map((member) => (
            <div
              key={member.id}
              style={{
                background: 'white',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                border: '1px solid rgba(102, 126, 234, 0.06)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                position: 'relative'
              }}
            >
              {/* Image Preview Container */}
              <div style={{
                width: '96px',
                height: '96px',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '3px solid rgba(102, 126, 234, 0.1)',
                marginBottom: '16px',
                background: '#f3f4f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {member.image_url ? (
                  <img
                    src={(process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000') + member.image_url}
                    alt={member.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => {
                      e.currentTarget.src = '';
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <FaUserCircle size={48} style={{ color: '#cbd5e1' }} />
                )}
              </div>

              <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: 700, color: '#1e1b4b' }}>
                {member.name}
              </h3>
              <span style={{
                fontSize: '12px',
                fontWeight: 600,
                color: '#667eea',
                background: 'rgba(102, 126, 234, 0.08)',
                padding: '4px 12px',
                borderRadius: '20px',
                marginBottom: '12px'
              }}>
                {member.designation || 'Team Member'}
              </span>

              <p style={{
                margin: 0,
                fontSize: '13px',
                color: '#6b7280',
                lineHeight: '1.5',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                minHeight: '58px'
              }}>
                {member.bio || 'No bio description provided.'}
              </p>

              {/* Social Media Links icons on Card */}
              <div style={{ display: 'flex', gap: '12px', marginTop: '12px', justifyContent: 'center' }}>
                {member.linkedin && (
                  <a href={member.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: '#0077b5', fontSize: '18px' }} title="LinkedIn">
                    <FaLinkedin />
                  </a>
                )}
                {member.instagram && (
                  <a href={member.instagram} target="_blank" rel="noopener noreferrer" style={{ color: '#e1306c', fontSize: '18px' }} title="Instagram">
                    <FaInstagram />
                  </a>
                )}
                {member.facebook && (
                  <a href={member.facebook} target="_blank" rel="noopener noreferrer" style={{ color: '#1877f2', fontSize: '18px' }} title="Facebook">
                    <FaFacebook />
                  </a>
                )}
                {member.twitter && (
                  <a href={member.twitter} target="_blank" rel="noopener noreferrer" style={{ color: '#1da1f2', fontSize: '18px' }} title="Twitter">
                    <FaTwitter />
                  </a>
                )}
              </div>

              {/* Action Buttons */}
              <div style={{
                display: 'flex',
                gap: '10px',
                marginTop: '20px',
                width: '100%',
                borderTop: '1px solid #f3f4f6',
                paddingTop: '16px'
              }}>
                <button
                  onClick={() => handleEdit(member)}
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
                  onClick={() => handleDelete(member.id)}
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
            width: '90vw', maxWidth: '500px', maxHeight: '90vh',
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
            }}>{editId ? 'Edit' : 'Add'} Team Member</h2>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#374151', fontSize: '14px' }}>Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. John Doe"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '2px solid rgba(102, 126, 234, 0.2)', fontSize: '15px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#374151', fontSize: '14px' }}>Designation / Role *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Speech Therapist"
                  value={designation}
                  onChange={e => setDesignation(e.target.value)}
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '2px solid rgba(102, 126, 234, 0.2)', fontSize: '15px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#374151', fontSize: '14px' }}>Bio / Description</label>
                <textarea
                  placeholder="Short description of experience and specialities..."
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  rows={3}
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '2px solid rgba(102, 126, 234, 0.2)', fontSize: '15px', resize: 'vertical' }}
                />
              </div>

              {/* Social Media Links fields */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, color: '#374151', fontSize: '13px' }}>LinkedIn URL</label>
                  <input
                    type="url"
                    placeholder="https://linkedin.com/..."
                    value={linkedin}
                    onChange={e => setLinkedin(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, color: '#374151', fontSize: '13px' }}>Instagram URL</label>
                  <input
                    type="url"
                    placeholder="https://instagram.com/..."
                    value={instagram}
                    onChange={e => setInstagram(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, color: '#374151', fontSize: '13px' }}>Facebook URL</label>
                  <input
                    type="url"
                    placeholder="https://facebook.com/..."
                    value={facebook}
                    onChange={e => setFacebook(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, color: '#374151', fontSize: '13px' }}>Twitter URL</label>
                  <input
                    type="url"
                    placeholder="https://twitter.com/..."
                    value={twitter}
                    onChange={e => setTwitter(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#374151', fontSize: '14px' }}>Profile Image Upload</label>
                
                {/* Preview block */}
                {imagePreview && (
                  <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img src={imagePreview} alt="Preview" style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: '1px solid #e5e7eb' }} />
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
                {saving ? 'Saving...' : (editId ? 'Update Member' : 'Save Member')}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
