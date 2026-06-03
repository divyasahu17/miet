"use client";
import React, { useState, useEffect } from 'react';
import { getApiUrl } from '@/utils/api';
import { FaSave, FaSpinner, FaEye } from 'react-icons/fa';

export default function VisionTab() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    p1: '',
    p2: '',
    p3: '',
    tags: ''
  });

  useEffect(() => {
    fetchCmsContent();
  }, []);

  const fetchCmsContent = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("admin_jwt");
      const res = await fetch(getApiUrl('api/cms?page_key=about'), {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        const raw = data.raw || [];
        
        const visionFields = raw.filter((item: any) => item.section_key === 'vision');
        
        const newFormData = { ...formData };
        visionFields.forEach((item: any) => {
          if (item.field_key in newFormData) {
            (newFormData as any)[item.field_key] = item.field_value;
          }
        });
        
        setFormData(newFormData);
      }
    } catch (error) {
      console.error('Error fetching CMS vision:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem("admin_jwt");
      
      const promises = Object.entries(formData).map(([key, value]) => {
        return fetch(getApiUrl('api/cms'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            page_key: 'about',
            section_key: 'vision',
            field_key: key,
            field_value: value,
            field_type: key.startsWith('p') ? 'textarea' : 'text'
          })
        });
      });

      await Promise.all(promises);
      alert('Vision section saved successfully!');
    } catch (error) {
      console.error('Error saving vision:', error);
      alert('Error saving vision section');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
            <FaEye /> Vision Section
          </h2>
          <p style={{ margin: '6px 0 0 0', color: '#666', fontSize: '14px' }}>Manage the Vision section of the About Page.</p>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '100px 0' }}>
          <FaSpinner className="spin" size={32} style={{ color: '#667eea', animation: 'spin 1s linear infinite' }} />
        </div>
      ) : (
        <form onSubmit={handleSave} style={{
          background: 'white', padding: '32px', borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid rgba(102, 126, 234, 0.08)',
          display: 'flex', flexDirection: 'column', gap: '20px'
        }}>
          <div>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#374151' }}>Vision Title</label>
            <input name="title" value={formData.title} onChange={handleChange} style={inputStyle} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#374151' }}>Paragraph 1</label>
            <textarea name="p1" value={formData.p1} onChange={handleChange} rows={3} style={textareaStyle} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#374151' }}>Paragraph 2</label>
            <textarea name="p2" value={formData.p2} onChange={handleChange} rows={3} style={textareaStyle} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#374151' }}>Paragraph 3</label>
            <textarea name="p3" value={formData.p3} onChange={handleChange} rows={3} style={textareaStyle} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#374151' }}>Tags (e.g. #Vision #Future)</label>
            <input name="tags" value={formData.tags} onChange={handleChange} style={inputStyle} />
          </div>

          <button type="submit" disabled={saving} style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: '#fff', border: 'none', borderRadius: '12px', padding: '14px 28px',
            fontWeight: 700, fontSize: '16px', cursor: saving ? 'not-allowed' : 'pointer',
            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)', marginTop: '10px', alignSelf: 'flex-start'
          }}>
            {saving ? 'Saving...' : <><FaSave style={{ marginRight: 8 }} /> Save Vision Section</>}
          </button>
        </form>
      )}
    </div>
  );
}

const inputStyle = { width: '100%', padding: '12px 16px', borderRadius: '10px', border: '2px solid rgba(102, 126, 234, 0.2)', fontSize: '15px' };
const textareaStyle = { ...inputStyle, resize: 'vertical' as any, fontFamily: 'monospace' };
