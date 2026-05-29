"use client";
import React from 'react';
import Image from 'next/image';
import { FaThLarge, FaList, FaTags, FaUserCircle, FaSignOutAlt, FaChevronLeft, FaChevronRight, FaUserMd, FaChevronDown, FaSearch, FaEdit, FaTrash, FaPlus, FaEye, FaImages, FaCog } from "react-icons/fa";
import Select from "react-select";

export default function GalleryTab(props: any) {
  const {
    galleryImages = [],
    getImageUrl,
    setShowGalleryModal,
    setGalleryFiles,
    setGalleryTitle,
    setGalleryDescription,
    setGalleryPreview,
    galleryEditId,
    setGalleryEditId,
    galleryEditForm,
    setGalleryEditForm,
    handleGalleryUpdate,
    handleGalleryDelete,
    showGalleryModal,
    handleGalleryUpload,
    galleryTitle,
    galleryDescription,
    galleryFiles = [],
    galleryPreview = [],
    loading
  } = props;

  const getGalleryImageUrl = (img: any) => {
    if (typeof getImageUrl !== 'function') return '';
    return getImageUrl(img?.image_path || img?.image || img);
  };

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
                }}>Gallery Management</h2>
                <button
                  onClick={() => { setShowGalleryModal(true); setGalleryFiles([]); setGalleryTitle(''); setGalleryDescription(''); setGalleryPreview([]); }}
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '12px 24px',
                    fontWeight: 700,
                    fontSize: '15px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <FaPlus /> Upload Images
                </button>
              </div>

              {/* Gallery Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                gap: 20
              }}>
                {galleryImages.map((img: any) => (
                  <div key={img.id} style={{
                    background: '#fff',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    border: '1px solid rgba(102, 126, 234, 0.1)',
                    transition: 'all 0.3s ease'
                  }}>
                    <div style={{ position: 'relative', height: '180px', overflow: 'hidden' }}>
                      <img
                        src={getGalleryImageUrl(img)}
                        alt={img.title || 'Gallery image'}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => { (e.target as HTMLImageElement).src = '/intro.webp'; }}
                      />
                      <div style={{
                        position: 'absolute', top: 8, right: 8,
                        background: img.status === 'active' ? '#10b981' : '#ef4444',
                        color: '#fff', padding: '4px 10px', borderRadius: '8px',
                        fontSize: '12px', fontWeight: 600, textTransform: 'uppercase'
                      }}>
                        {img.status}
                      </div>
                    </div>
                    <div style={{ padding: '16px' }}>
                      {galleryEditId === img.id ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          <input
                            value={galleryEditForm.title || ''}
                            onChange={(e: any) => setGalleryEditForm((f: any) => ({ ...f, title: e.target.value }))}
                            placeholder="Title"
                            style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px' }}
                          />
                          <input
                            value={galleryEditForm.description || ''}
                            onChange={(e: any) => setGalleryEditForm((f: any) => ({ ...f, description: e.target.value }))}
                            placeholder="Description"
                            style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px' }}
                          />
                          <input
                            type="number"
                            value={galleryEditForm.display_order || 0}
                            onChange={(e: any) => setGalleryEditForm((f: any) => ({ ...f, display_order: parseInt(e.target.value) }))}
                            placeholder="Display Order"
                            style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px' }}
                          />
                          <select
                            value={galleryEditForm.status || 'active'}
                            onChange={(e: any) => setGalleryEditForm((f: any) => ({ ...f, status: e.target.value as 'active' | 'inactive' }))}
                            style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px' }}
                          >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                          </select>
                          <div style={{ display: 'flex', gap: 8 }}>
                            <button
                              onClick={() => handleGalleryUpdate(img.id!)}
                              style={{
                                flex: 1, background: '#10b981', color: '#fff', border: 'none',
                                borderRadius: '8px', padding: '8px', fontWeight: 600, cursor: 'pointer'
                              }}
                            >Save</button>
                            <button
                              onClick={() => { setGalleryEditId(null); setGalleryEditForm({}); }}
                              style={{
                                flex: 1, background: '#6b7280', color: '#fff', border: 'none',
                                borderRadius: '8px', padding: '8px', fontWeight: 600, cursor: 'pointer'
                              }}
                            >Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <h4 style={{ fontWeight: 700, color: '#1e1b4b', marginBottom: 4, fontSize: '15px' }}>
                            {img.title || 'Untitled'}
                          </h4>
                          <p style={{ color: '#6b7280', fontSize: '13px', marginBottom: 8, lineHeight: 1.4 }}>
                            {img.description || 'No description'}
                          </p>
                          <p style={{ color: '#9ca3af', fontSize: '12px', marginBottom: 12 }}>
                            Order: {img.display_order}
                          </p>
                          <div style={{ display: 'flex', gap: 8 }}>
                            <button
                              onClick={() => {
                                setGalleryEditId(img.id!);
                                setGalleryEditForm({ title: img.title, description: img.description, display_order: img.display_order, status: img.status });
                              }}
                              style={{
                                flex: 1, background: 'rgba(102, 126, 234, 0.1)', color: '#667eea',
                                border: 'none', borderRadius: '8px', padding: '8px', fontWeight: 600,
                                cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center',
                                justifyContent: 'center', gap: 4
                              }}
                            >
                              <FaEdit /> Edit
                            </button>
                            <button
                              onClick={() => handleGalleryDelete(img.id!)}
                              style={{
                                flex: 1, background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444',
                                border: 'none', borderRadius: '8px', padding: '8px', fontWeight: 600,
                                cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center',
                                justifyContent: 'center', gap: 4
                              }}
                            >
                              <FaTrash /> Delete
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {galleryImages.length === 0 && (
                <div style={{
                  textAlign: 'center', padding: '60px 20px', color: '#6b7280'
                }}>
                  <FaImages size={48} style={{ marginBottom: 16, opacity: 0.3 }} />
                  <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: 8 }}>No gallery images yet</h3>
                  <p>Upload images to create your homepage gallery slider.</p>
                </div>
              )}

              {/* Gallery Upload Modal */}
              {showGalleryModal && (
                <div style={{
                  position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                  background: 'rgba(0,0,0,0.5)', zIndex: 3000,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
                }} onClick={e => { if (e.target === e.currentTarget) setShowGalleryModal(false); }}>
                  <div style={{
                    background: '#fff', borderRadius: '20px', padding: '40px',
                    width: '90vw', maxWidth: '600px', maxHeight: '90vh',
                    boxShadow: '0 20px 60px rgba(102, 126, 234, 0.2)',
                    position: 'relative', overflow: 'auto'
                  }}>
                    <button
                      onClick={() => setShowGalleryModal(false)}
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
                    }}>Upload Gallery Images</h2>
                    <form onSubmit={handleGalleryUpload} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#333' }}>Title (optional)</label>
                        <input
                          value={galleryTitle}
                          onChange={e => setGalleryTitle(e.target.value)}
                          placeholder="Image title"
                          style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '2px solid rgba(102, 126, 234, 0.2)', fontSize: '15px' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#333' }}>Description (optional)</label>
                        <textarea
                          value={galleryDescription}
                          onChange={e => setGalleryDescription(e.target.value)}
                          placeholder="Image description"
                          rows={3}
                          style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '2px solid rgba(102, 126, 234, 0.2)', fontSize: '15px', resize: 'vertical' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#333' }}>Select Images *</label>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={(e: any) => {
                            const files = Array.from(e.target.files || []);
                            setGalleryFiles(files);
                            const previews = files.map((f: any) => URL.createObjectURL(f));
                            setGalleryPreview(previews);
                          }}
                          style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '2px solid rgba(102, 126, 234, 0.2)', fontSize: '15px' }}
                        />
                        {galleryPreview.length > 0 && (
                          <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
                            {galleryPreview.map((p: string, i: number) => (
                              <img key={i} src={p} alt={`Preview ${i + 1}`}
                                style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 10, border: '2px solid rgba(102, 126, 234, 0.2)' }}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                      <button
                        type="submit"
                        disabled={loading || galleryFiles.length === 0}
                        style={{
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          color: '#fff', border: 'none', borderRadius: '12px',
                          padding: '14px 28px', fontWeight: 700, fontSize: '16px',
                          cursor: loading ? 'not-allowed' : 'pointer',
                          boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
                        }}
                      >
                        {loading ? 'Uploading...' : `Upload ${galleryFiles.length} Image${galleryFiles.length !== 1 ? 's' : ''}`}
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </section>
          
    </>
  );
}
