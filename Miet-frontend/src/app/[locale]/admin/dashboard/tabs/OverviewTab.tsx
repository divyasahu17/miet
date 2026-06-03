"use client";
import React, { useState, useEffect } from 'react';
import { getApiUrl } from '@/utils/api';
import { FaSave, FaSpinner, FaInfoCircle, FaUpload } from 'react-icons/fa';

export default function OverviewTab() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description1: '',
    communityTitle: '',
    communityDescription: '',
    aboutTitle: '',
    aboutIntro: '',
    aboutDesc1: '',
    aboutDesc2: '',
    joinUs: '',
    tags: '',
    youtubeUrl: '',
    image: '',
    video: ''
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);

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
        
        const overviewFields = raw.filter((item: any) => item.section_key === 'overview');
        
        const newFormData = { ...formData };
        overviewFields.forEach((item: any) => {
          if (item.field_key in newFormData) {
            (newFormData as any)[item.field_key] = item.field_value;
          }
        });
        
        setFormData(newFormData);
      }
    } catch (error) {
      console.error('Error fetching CMS overview:', error);
    } finally {
      setLoading(false);
    }
  };

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const token = localStorage.getItem('admin_jwt');
    const res = await fetch(getApiUrl('api/upload'), {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData
    });
    if (!res.ok) throw new Error('File upload failed');
    const data = await res.json();
    return data.url;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem("admin_jwt");
      let currentFormData = { ...formData };

      if (imageFile) {
        currentFormData.image = await uploadFile(imageFile);
      }
      if (videoFile) {
        currentFormData.video = await uploadFile(videoFile);
      }
      
      const promises = Object.entries(currentFormData).map(([key, value]) => {
        return fetch(getApiUrl('api/cms'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            page_key: 'about',
            section_key: 'overview',
            field_key: key,
            field_value: value,
            field_type: key.toLowerCase().includes('description') || key.toLowerCase().includes('intro') ? 'textarea' : 'text'
          })
        });
      });

      await Promise.all(promises);
      setFormData(currentFormData);
      alert('Overview saved successfully!');
    } catch (error) {
      console.error('Error saving overview:', error);
      alert('Error saving overview');
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
            <FaInfoCircle /> Overview Section
          </h2>
          <p style={{ margin: '6px 0 0 0', color: '#666', fontSize: '14px' }}>Manage the introductory Overview section of the About Page.</p>
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
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#374151' }}>Overview Title</label>
            <input name="title" value={formData.title} onChange={handleChange} style={inputStyle} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#374151' }}>Overview Description 1 (HTML)</label>
            <textarea name="description1" value={formData.description1} onChange={handleChange} rows={4} style={textareaStyle} />
          </div>

          <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ margin: 0, color: '#1e293b', fontSize: '16px' }}>Media Assets</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#374151', fontSize: '14px' }}>Side Image (Overrides default)</label>
                {(formData.image || imageFile) && (
                  <div style={{ marginBottom: 8, fontSize: '12px', color: '#667eea' }}>Image selected/uploaded.</div>
                )}
                <div style={uploadBoxStyle}>
                  <FaUpload style={{ color: '#667eea' }} />
                  <span style={{ fontSize: '13px', color: '#4b5563', fontWeight: 600 }}>Choose Image</span>
                  <input type="file" accept="image/*" onChange={(e) => e.target.files && setImageFile(e.target.files[0])} style={fileInputStyle} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#374151', fontSize: '14px' }}>Side Video (Overrides YouTube)</label>
                {(formData.video || videoFile) && (
                  <div style={{ marginBottom: 8, fontSize: '12px', color: '#667eea' }}>Video selected/uploaded.</div>
                )}
                <div style={uploadBoxStyle}>
                  <FaUpload style={{ color: '#667eea' }} />
                  <span style={{ fontSize: '13px', color: '#4b5563', fontWeight: 600 }}>Choose Video</span>
                  <input type="file" accept="video/*" onChange={(e) => e.target.files && setVideoFile(e.target.files[0])} style={fileInputStyle} />
                </div>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#374151' }}>YouTube URL (Optional Embedded Video)</label>
              <input name="youtubeUrl" placeholder="https://www.youtube.com/embed/..." value={formData.youtubeUrl} onChange={handleChange} style={inputStyle} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#374151' }}>Community Title</label>
              <input name="communityTitle" value={formData.communityTitle} onChange={handleChange} style={inputStyle} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#374151' }}>About Title</label>
              <input name="aboutTitle" value={formData.aboutTitle} onChange={handleChange} style={inputStyle} />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#374151' }}>Community Description</label>
            <textarea name="communityDescription" value={formData.communityDescription} onChange={handleChange} rows={3} style={textareaStyle} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#374151' }}>About Intro (HTML)</label>
            <textarea name="aboutIntro" value={formData.aboutIntro} onChange={handleChange} rows={3} style={textareaStyle} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#374151' }}>About Desc 1</label>
              <textarea name="aboutDesc1" value={formData.aboutDesc1} onChange={handleChange} rows={3} style={textareaStyle} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#374151' }}>About Desc 2</label>
              <textarea name="aboutDesc2" value={formData.aboutDesc2} onChange={handleChange} rows={3} style={textareaStyle} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#374151' }}>Join Us Text</label>
              <input name="joinUs" value={formData.joinUs} onChange={handleChange} style={inputStyle} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#374151' }}>Tags (e.g. #Education #Community)</label>
              <input name="tags" value={formData.tags} onChange={handleChange} style={inputStyle} />
            </div>
          </div>

          <button type="submit" disabled={saving} style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: '#fff', border: 'none', borderRadius: '12px', padding: '14px 28px',
            fontWeight: 700, fontSize: '16px', cursor: saving ? 'not-allowed' : 'pointer',
            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)', marginTop: '10px', alignSelf: 'flex-start'
          }}>
            {saving ? 'Saving...' : <><FaSave style={{ marginRight: 8 }} /> Save Overview</>}
          </button>
        </form>
      )}
    </div>
  );
}

const inputStyle = { width: '100%', padding: '12px 16px', borderRadius: '10px', border: '2px solid rgba(102, 126, 234, 0.2)', fontSize: '15px' };
const textareaStyle = { ...inputStyle, resize: 'vertical' as any, fontFamily: 'monospace' };
const uploadBoxStyle = { display: 'flex', alignItems: 'center', gap: '12px', background: '#f9fafb', border: '2px dashed rgba(102, 126, 234, 0.2)', borderRadius: '10px', padding: '12px', position: 'relative' as any };
const fileInputStyle = { position: 'absolute' as any, top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' };
