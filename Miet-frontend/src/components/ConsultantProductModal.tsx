"use client";
import React, { useState } from 'react';

type ProductType = 'Course' | 'E-book' | 'App' | 'Gadget';

interface ConsultantProductModalProps {
  productForm: any;
  setProductForm: React.Dispatch<React.SetStateAction<any>>;
  consultantId?: number;
  onClose: () => void;
}

export default function ConsultantProductModal({
  productForm,
  setProductForm,
  consultantId,
  onClose
}: ConsultantProductModalProps) {
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const formData = new FormData();
      
      // Common fields
      formData.append('type', productForm.type || 'Course');
      formData.append('product_type', productForm.type || 'Course');
      formData.append('status', productForm.status || 'active');
      formData.append('featured', productForm.featured ? 'true' : 'false');
      if (consultantId) {
        formData.append('consultant_id', String(consultantId));
      }
      
      // Type specific fields
      if (productForm.type === 'Course') {
        if (!productForm.title?.trim() || !productForm.description?.trim() || !productForm.price?.trim() || !productForm.video_url?.trim() || !productForm.thumbnailFile) {
          alert('Missing required fields for Course');
          setSubmitting(false);
          return;
        }

        formData.append('title', productForm.title.trim());
        formData.append('subtitle', productForm.subtitle || '');
        formData.append('description', productForm.description.trim());
        formData.append('language', productForm.language || '');
        formData.append('level', productForm.level || 'Beginner');
        formData.append('price', productForm.price.trim());
        formData.append('duration', productForm.duration || '');
        formData.append('total_lectures', String(productForm.total_lectures || 0));
        formData.append('rating', String(productForm.rating || 0));
        formData.append('instructor_name', productForm.instructor_name || '');
        formData.append('instructor_title', productForm.instructor_title || '');
        formData.append('instructor_bio', productForm.instructor_bio || '');
        formData.append('video_url', productForm.video_url.trim());
        formData.append('thumbnail', productForm.thumbnailFile);
        if (productForm.instructorImageFile) {
          formData.append('instructor_image', productForm.instructorImageFile);
        }
        formData.append('learningObjectives', JSON.stringify(productForm.learning_objectives || []));
        formData.append('requirements', JSON.stringify(productForm.requirements || []));
        formData.append('curriculum', JSON.stringify(productForm.course_content || []));
      } else if (productForm.type === 'E-book') {
        formData.append('title', productForm.title || '');
        formData.append('description', productForm.description || '');
        formData.append('author', productForm.author || '');
        if (productForm.pdfFile) formData.append('pdf_file', productForm.pdfFile);
        if (productForm.thumbnailFile) formData.append('thumbnail', productForm.thumbnailFile);
      } else if (productForm.type === 'App') {
        formData.append('name', productForm.name || '');
        formData.append('description', productForm.description || '');
        formData.append('download_link', productForm.download_link || '');
        if (productForm.iconFile) formData.append('icon', productForm.iconFile);
      } else if (productForm.type === 'Gadget') {
        formData.append('name', productForm.name || '');
        formData.append('description', productForm.description || '');
        formData.append('price', productForm.price || '');
        if (productForm.productImageFile) formData.append('product_image', productForm.productImageFile);
        formData.append('purchase_link', productForm.purchase_link || '');
        formData.append('download_link', productForm.download_link || '');
        if (productForm.iconFile) formData.append('icon', productForm.iconFile);
      }

      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
      const token = localStorage.getItem('consultant_jwt');

      const url = productForm.id
        ? `${backendUrl}/api/products/${productForm.id}`
        : `${backendUrl}/api/products`;
        
      const response = await fetch(url, {
        method: productForm.id ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.message || 'Failed to add product');
        setSubmitting(false);
        return;
      }

      alert('Product submitted successfully pending admin approval!');
      onClose();
    } catch (error) {
      console.error(error);
      alert('Error: Failed to submit product. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: 'rgba(34,37,77,0.5)', zIndex: 3000, display: 'flex',
      alignItems: 'center', justifyContent: 'center', padding: '20px'
    }} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{
        background: '#fff', borderRadius: '20px', padding: 'clamp(20px, 4vw, 30px)',
        minWidth: '90vw', maxWidth: '1000px', maxHeight: '90vh', overflowY: 'auto', position: 'relative'
      }}>
        <button onClick={onClose} style={{
          position: 'absolute', top: 20, right: 20, background: 'rgba(102, 126, 234, 0.1)',
          border: 'none', fontSize: 24, color: '#667eea', cursor: 'pointer',
          width: '40px', height: '40px', borderRadius: '50%', display: 'flex',
          alignItems: 'center', justifyContent: 'center'
        }}>×</button>

        <h2 style={{
          fontSize: '24px', fontWeight: 700, marginBottom: 20, textAlign: 'center',
          color: '#667eea'
        }}>{productForm.id ? 'Edit' : 'Add New'} {productForm.type}</h2>

        <form onSubmit={handleSubmit} style={{
          display: 'grid', gap: '20px'
        }}>
          <div>
            <label style={{ fontWeight: 600, color: '#4a5568', fontSize: '14px', marginBottom: '8px', display: 'block' }}>Product Type</label>
            <select
              value={productForm.type}
              onChange={e => setProductForm((f: any) => ({ ...f, type: e.target.value as ProductType }))}
              style={{
                padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e0',
                fontSize: '15px', width: '100%', background: '#f8fafc', outline: 'none'
              }}
              required
            >
              <option value="Course">Video Course</option>
              <option value="E-book">E-book</option>
              <option value="App">App/Software</option>
              <option value="Gadget">Gadget</option>
            </select>
          </div>

          {/* Type specific layouts: Minimal unified version derived from Admin Dashboard */}
          
          {(productForm.type === 'Course' || productForm.type === 'E-book') && (
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ fontWeight: 600, display: 'block', marginBottom: '8px' }}>Title *</label>
                  <input type="text" value={productForm.title || ''} onChange={e => setProductForm((f: any) => ({...f, title: e.target.value}))} required style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e0', borderRadius: '8px' }} />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ fontWeight: 600, display: 'block', marginBottom: '8px' }}>Description *</label>
                  <textarea value={productForm.description || ''} onChange={e => setProductForm((f: any) => ({...f, description: e.target.value}))} required rows={4} style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e0', borderRadius: '8px' }} />
                </div>
             </div>
          )}

          {(productForm.type === 'App' || productForm.type === 'Gadget') && (
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ fontWeight: 600, display: 'block', marginBottom: '8px' }}>Name *</label>
                  <input type="text" value={productForm.name || ''} onChange={e => setProductForm((f: any) => ({...f, name: e.target.value}))} required style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e0', borderRadius: '8px' }} />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ fontWeight: 600, display: 'block', marginBottom: '8px' }}>Description *</label>
                  <textarea value={productForm.description || ''} onChange={e => setProductForm((f: any) => ({...f, description: e.target.value}))} required rows={4} style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e0', borderRadius: '8px' }} />
                </div>
             </div>
          )}

          {/* Pricing & Media Contexts */}
          {productForm.type === 'Course' && (
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                <div>
                  <label style={{ fontWeight: 600, display: 'block' }}>Price *</label>
                  <input type="text" value={productForm.price || ''} onChange={e => setProductForm((f: any) => ({...f, price: e.target.value}))} required style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e0', borderRadius: '8px' }} />
                </div>
                <div>
                  <label style={{ fontWeight: 600, display: 'block' }}>Video URL *</label>
                  <input type="text" value={productForm.video_url || ''} onChange={e => setProductForm((f: any) => ({...f, video_url: e.target.value}))} required style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e0', borderRadius: '8px' }} />
                </div>
                <div>
                  <label style={{ fontWeight: 600, display: 'block' }}>Thumbnail (Image) *</label>
                  <input type="file" accept="image/*" onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) setProductForm((f: any) => ({ ...f, thumbnailFile: file }));
                  }} required style={{ width: '100%', padding: '12px 0' }} />
                </div>
             </div>
          )}

          {productForm.type === 'E-book' && (
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                <div>
                  <label style={{ fontWeight: 600, display: 'block' }}>Author</label>
                  <input type="text" value={productForm.author || ''} onChange={e => setProductForm((f: any) => ({...f, author: e.target.value}))} style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e0', borderRadius: '8px' }} />
                </div>
                <div>
                  <label style={{ fontWeight: 600, display: 'block' }}>PDF File</label>
                  <input type="file" accept="application/pdf" onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) setProductForm((f: any) => ({ ...f, pdfFile: file }));
                  }} style={{ width: '100%', padding: '12px 0' }} />
                </div>
                <div>
                  <label style={{ fontWeight: 600, display: 'block' }}>Cover Thumbnail</label>
                  <input type="file" accept="image/*" onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) setProductForm((f: any) => ({ ...f, thumbnailFile: file }));
                  }} style={{ width: '100%', padding: '12px 0' }} />
                </div>
             </div>
          )}

          {productForm.type === 'App' && (
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                <div>
                  <label style={{ fontWeight: 600, display: 'block' }}>Download Link</label>
                  <input type="text" value={productForm.download_link || ''} onChange={e => setProductForm((f: any) => ({...f, download_link: e.target.value}))} style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e0', borderRadius: '8px' }} />
                </div>
                <div>
                  <label style={{ fontWeight: 600, display: 'block' }}>App Icon</label>
                  <input type="file" accept="image/*" onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) setProductForm((f: any) => ({ ...f, iconFile: file }));
                  }} style={{ width: '100%', padding: '12px 0' }} />
                </div>
             </div>
          )}

          {productForm.type === 'Gadget' && (
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                <div>
                  <label style={{ fontWeight: 600, display: 'block' }}>Price</label>
                  <input type="number" value={productForm.price || ''} onChange={e => setProductForm((f: any) => ({...f, price: e.target.value}))} style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e0', borderRadius: '8px' }} />
                </div>
                <div>
                  <label style={{ fontWeight: 600, display: 'block' }}>Purchase/Affiliate Link</label>
                  <input type="text" value={productForm.purchase_link || ''} onChange={e => setProductForm((f: any) => ({...f, purchase_link: e.target.value}))} style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e0', borderRadius: '8px' }} />
                </div>
                <div>
                  <label style={{ fontWeight: 600, display: 'block' }}>Product Image</label>
                  <input type="file" accept="image/*" onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) setProductForm((f: any) => ({ ...f, productImageFile: file }));
                  }} style={{ width: '100%', padding: '12px 0' }} />
                </div>
             </div>
          )}

          <button type="submit" disabled={submitting} style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff',
            border: 'none', borderRadius: '12px', padding: '16px 24px', fontWeight: 700,
            fontSize: '16px', cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.7 : 1,
            marginTop: 20
          }}>
            {submitting ? 'Submitting...' : 'Submit Product for Approval'}
          </button>
        </form>
      </div>
    </div>
  );
}
