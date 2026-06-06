"use client";
import React, { useState, useEffect } from 'react';
import { getApiUrl } from '@/utils/api';
import { 
  FaPlus, FaEdit, FaTrash, FaBriefcase, FaSpinner, FaTimes, FaCircle
} from 'react-icons/fa';

interface ServiceCard {
  id: number;
  title: string;
  description: string;
  points: string;
  button_name: string;
  button_color: string;
  hyper_link: string;
  status: string;
}

export default function ServicesCmsTab() {
  const [cards, setCards] = useState<ServiceCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [points, setPoints] = useState<string[]>(['']);
  const [buttonName, setButtonName] = useState('');
  const [buttonColor, setButtonColor] = useState('#5a67d8');
  const [hyperLink, setHyperLink] = useState('');
  const [status, setStatus] = useState('active');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('admin_jwt');
      const response = await fetch(getApiUrl('api/cms-services/all'), {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setCards(data.services || []);
      }
    } catch (error) {
      console.error('Error fetching CMS services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (card: ServiceCard) => {
    setEditId(card.id);
    setTitle(card.title || '');
    setDescription(card.description || '');
    
    try {
      const parsedPoints = JSON.parse(card.points || '[]');
      setPoints(Array.isArray(parsedPoints) && parsedPoints.length > 0 ? parsedPoints : ['']);
    } catch {
      setPoints(['']);
    }

    setButtonName(card.button_name || '');
    setButtonColor(card.button_color || '#5a67d8');
    setHyperLink(card.hyper_link || '');
    setStatus(card.status || 'active');
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this service card?')) return;
    try {
      const token = localStorage.getItem('admin_jwt');
      const response = await fetch(getApiUrl(`api/cms-services/${id}`), {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        setCards(prev => prev.filter(c => c.id !== id));
      } else {
        alert('Failed to delete service card');
      }
    } catch (error) {
      console.error('Error deleting service card:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return alert('Title is required');

    setSaving(true);
    try {
      const token = localStorage.getItem('admin_jwt');
      const validPoints = points.filter(p => p.trim() !== '');
      
      const payload = {
        title,
        description,
        points: JSON.stringify(validPoints),
        button_name: buttonName,
        button_color: buttonColor,
        hyper_link: hyperLink,
        status
      };

      const url = editId ? getApiUrl(`api/cms-services/${editId}`) : getApiUrl('api/cms-services');
      const method = editId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setShowModal(false);
        fetchCards();
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to save service card');
      }
    } catch (error) {
      console.error('Error saving service card:', error);
      alert('Error saving service card');
    } finally {
      setSaving(false);
    }
  };

  const openAddModal = () => {
    setEditId(null);
    setTitle('');
    setDescription('');
    setPoints(['']);
    setButtonName('');
    setButtonColor('#5a67d8');
    setHyperLink('');
    setStatus('active');
    setShowModal(true);
  };

  const handlePointChange = (index: number, value: string) => {
    const newPoints = [...points];
    newPoints[index] = value;
    setPoints(newPoints);
  };

  const addPointField = () => setPoints([...points, '']);
  
  const removePointField = (index: number) => {
    if (points.length > 1) {
      setPoints(points.filter((_, i) => i !== index));
    } else {
      setPoints(['']);
    }
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
            💼 Dynamic Services Cards
          </h2>
          <p style={{ margin: '6px 0 0 0', color: '#666', fontSize: '14px' }}>
            Manage the service cards displayed on the public Services page.
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
          <FaPlus /> Add Service Card
        </button>
      </div>

      {/* Grid of Cards */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '100px 0' }}>
          <FaSpinner className="spin" size={32} style={{ color: '#667eea', animation: 'spin 1s linear infinite' }} />
        </div>
      ) : cards.length === 0 ? (
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '60px',
          textAlign: 'center',
          boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
          border: '1px solid rgba(102, 126, 234, 0.08)'
        }}>
          <FaBriefcase size={64} style={{ color: '#e5e7eb', marginBottom: '16px' }} />
          <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', color: '#374151' }}>No Service Cards</h3>
          <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>
            Add dynamic service cards to display them on the Services section.
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '24px'
        }}>
          {cards.map((card) => {
            let parsedPoints = [];
            try { parsedPoints = JSON.parse(card.points || '[]'); } catch {}

            return (
              <div
                key={card.id}
                style={{
                  background: 'white',
                  borderRadius: '16px',
                  padding: '24px',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
                  border: '1px solid #f3f4f6',
                  borderTop: `6px solid ${card.button_color || '#e2e8f0'}`,
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '20px', color: card.button_color || '#1f2937', fontWeight: 800 }}>
                    {card.title}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <FaCircle color={card.status === 'active' ? '#10b981' : '#ef4444'} size={10} />
                    <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase' }}>{card.status}</span>
                  </div>
                </div>

                <p style={{ margin: '0 0 16px 0', color: '#6b7280', fontSize: '14px', lineHeight: 1.5 }}>
                  {card.description}
                </p>

                <div style={{ flex: 1 }}>
                  <ul style={{ margin: '0 0 16px 0', paddingLeft: '20px', color: '#374151', fontSize: '13px', lineHeight: 1.6 }}>
                    {parsedPoints.slice(0, 3).map((p: string, i: number) => (
                      <li key={i}>{p}</li>
                    ))}
                    {parsedPoints.length > 3 && (
                      <li style={{ color: '#9ca3af', listStyle: 'none', marginLeft: '-15px' }}>+ {parsedPoints.length - 3} more...</li>
                    )}
                  </ul>
                </div>

                <div style={{
                  padding: '12px', background: '#f8fafc', borderRadius: '8px', 
                  fontSize: '13px', color: '#4b5563', marginBottom: '16px', display: 'flex', justifyContent: 'space-between'
                }}>
                  <strong>Button:</strong> 
                  <span style={{ color: card.button_color, fontWeight: 700 }}>{card.button_name || 'N/A'}</span>
                </div>

                <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid #f3f4f6', paddingTop: '16px' }}>
                  <button
                    onClick={() => handleEdit(card)}
                    style={{
                      flex: 1, background: '#f3f4f6', color: '#4b5563',
                      border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                      fontWeight: 600, transition: 'all 0.2s'
                    }}
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(card.id)}
                    style={{
                      flex: 1, background: '#fef2f2', color: '#ef4444',
                      border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                      fontWeight: 600, transition: 'all 0.2s'
                    }}
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(17, 24, 39, 0.7)', backdropFilter: 'blur(4px)',
          display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            background: 'white', width: '100%', maxWidth: '600px', borderRadius: '24px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', overflow: 'hidden',
            display: 'flex', flexDirection: 'column', maxHeight: '90vh'
          }}>
            <div style={{ padding: '24px 32px', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#111827' }}>
                {editId ? 'Edit Service Card' : 'Add New Service Card'}
              </h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', fontSize: '20px' }}>
                <FaTimes />
              </button>
            </div>

            <div style={{ padding: '32px', overflowY: 'auto' }}>
              <form id="service-form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600, color: '#374151' }}>Title</label>
                  <input
                    type="text" value={title} onChange={e => setTitle(e.target.value)} required
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid #d1d5db', fontSize: '15px' }}
                    placeholder="e.g. Consultations"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600, color: '#374151' }}>Description</label>
                  <textarea
                    value={description} onChange={e => setDescription(e.target.value)} rows={3} required
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid #d1d5db', fontSize: '15px', resize: 'vertical' }}
                    placeholder="Short description of the service..."
                  />
                </div>

                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <label style={{ display: 'block', marginBottom: '12px', fontSize: '14px', fontWeight: 600, color: '#374151' }}>Bullet Points</label>
                  {points.map((point, index) => (
                    <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                      <input
                        type="text" value={point} onChange={e => handlePointChange(index, e.target.value)}
                        style={{ flex: 1, padding: '10px 14px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px' }}
                        placeholder={`Point ${index + 1}`}
                      />
                      <button
                        type="button" onClick={() => removePointField(index)}
                        style={{ background: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca', borderRadius: '8px', width: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                      >
                        <FaTimes />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button" onClick={addPointField}
                    style={{ background: '#e0e7ff', color: '#4f46e5', border: 'none', borderRadius: '8px', padding: '8px 16px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}
                  >
                    <FaPlus size={10} /> Add Point
                  </button>
                </div>

                <div style={{ display: 'flex', gap: '20px' }}>
                  <div style={{ flex: 2 }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600, color: '#374151' }}>Button Name</label>
                    <input
                      type="text" value={buttonName} onChange={e => setButtonName(e.target.value)} required
                      style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid #d1d5db', fontSize: '15px' }}
                      placeholder="e.g. Book Now"
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600, color: '#374151' }}>Theme Color</label>
                    <input
                      type="color" value={buttonColor} onChange={e => setButtonColor(e.target.value)}
                      style={{ width: '100%', height: '46px', padding: '2px', borderRadius: '10px', border: '1px solid #d1d5db', cursor: 'pointer' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600, color: '#374151' }}>Hyper Link (Destination URL)</label>
                  <input
                    type="text" value={hyperLink} onChange={e => setHyperLink(e.target.value)} required
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid #d1d5db', fontSize: '15px' }}
                    placeholder="e.g. /services/consultations or https://..."
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600, color: '#374151' }}>Status</label>
                  <select
                    value={status} onChange={e => setStatus(e.target.value)}
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid #d1d5db', fontSize: '15px', backgroundColor: 'white' }}
                  >
                    <option value="active">Active (Visible)</option>
                    <option value="inactive">Inactive (Hidden)</option>
                  </select>
                </div>

              </form>
            </div>

            <div style={{ padding: '24px 32px', background: '#f9fafb', borderTop: '1px solid #f3f4f6', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button
                type="button" onClick={() => setShowModal(false)} disabled={saving}
                style={{ padding: '12px 24px', borderRadius: '10px', border: '1px solid #d1d5db', background: 'white', color: '#374151', fontWeight: 600, cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                type="submit" form="service-form" disabled={saving}
                style={{ padding: '12px 32px', borderRadius: '10px', border: 'none', background: '#4f46e5', color: 'white', fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                {saving ? <><FaSpinner className="spin" style={{ animation: 'spin 1s linear infinite' }} /> Saving...</> : 'Save Service Card'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
