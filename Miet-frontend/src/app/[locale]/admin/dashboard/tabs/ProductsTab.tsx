"use client";
import React from 'react';
import Image from 'next/image';
import { FaThLarge, FaList, FaTags, FaUserCircle, FaSignOutAlt, FaChevronLeft, FaChevronRight, FaUserMd, FaChevronDown, FaSearch, FaEdit, FaTrash, FaPlus, FaEye, FaImages, FaCog } from "react-icons/fa";
import Select from "react-select";

type ProductType = 'Course' | 'E-book' | 'App' | 'Gadget';

export default function ProductsTab(props: any) {
  const { DataTable, products, productEditId, productForm, setProductForm, setProductEditId, setShowProductModal, showProductModal, setDeleteProductId, setDeleteProductName, setShowDeleteModal, setSuccessMessage, setShowSuccessPopup, setProducts, getApiUrl } = props;

  const [showConsultantModal, setShowConsultantModal] = React.useState(false);
  const [selectedConsultant, setSelectedConsultant] = React.useState<any>(null);
  const [filterType, setFilterType] = React.useState<string>('');

  const handleViewConsultant = async (consultantId: number) => {
    try {
      const token = localStorage.getItem('admin_jwt');
      const res = await fetch(getApiUrl(`api/consultants/${consultantId}`), {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSelectedConsultant(data);
        setShowConsultantModal(true);
      } else {
        alert('Failed to load consultant details');
      }
    } catch (err) {
      console.error(err);
      alert('Error loading consultant details');
    }
  };

  const handleRejectProduct = async (productId: number) => {
    if (!confirm('Are you sure you want to reject this product?')) return;
    try {
      const token = localStorage.getItem('admin_jwt');
      const res = await fetch(getApiUrl(`api/products/${productId}/reject`), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        alert('Product rejected successfully');
        // Refresh products
        const refreshRes = await fetch(getApiUrl('api/products?all=true'));
        if (refreshRes.ok) {
          const data = await refreshRes.json();
          setProducts(data.products || data);
        }
      } else {
        alert('Failed to reject product');
      }
    } catch (err) {
      console.error('Error rejecting product:', err);
      alert('Error rejecting product');
    }
  };

  const handleApproveProduct = async (productId: number) => {
    if (!confirm('Are you sure you want to approve this product?')) return;
    try {
      const token = localStorage.getItem('admin_jwt');
      const res = await fetch(getApiUrl(`api/products/${productId}/approve`), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        alert('Product approved successfully');
        // Refresh products
        const refreshRes = await fetch(getApiUrl('api/products?all=true'));
        if (refreshRes.ok) {
          const data = await refreshRes.json();
          setProducts(data.products || data);
        }
      } else {
        alert('Failed to approve product');
      }
    } catch (err) {
      console.error('Error approving product:', err);
      alert('Error approving product');
    }
  };

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
                }}>Manage Products</h2>
                <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
                  <select
                    value={filterType}
                    onChange={e => setFilterType(e.target.value)}
                    style={{
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: '1px solid rgba(102, 126, 234, 0.2)',
                      minWidth: '140px',
                      fontSize: '14px',
                      background: '#fff'
                    }}
                  >
                    <option value="">All Products</option>
                    <option value="Course">Course</option>
                    <option value="E-book">E-book</option>
                    <option value="App">App</option>
                    <option value="Gadget">Gadget</option>
                  </select>
                  <button
                    onClick={() => {
                      setProductForm({ type: 'Course', status: 'active', featured: false });
                      setProductEditId(null);
                      setShowProductModal(true);
                    }}
                    style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '14px 24px',
                      fontWeight: 700,
                      fontSize: '16px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    <FaPlus size={16} /> Add Product
                  </button>
                </div>
              </div>

              <DataTable
                data={Array.isArray(products) ? products.filter((p: any) =>
                  !filterType ||
                  p.type?.toLowerCase() === filterType.toLowerCase() ||
                  p.product_type?.toLowerCase() === filterType.toLowerCase()
                ) : []}
                columns={[
                  {
                    key: 'thumbnail',
                    label: 'Thumbnail',
                    sortable: false,
                    render: (value: any, row: any) => {
                      const imgPath = value || row.product_image || row.icon || row.image_url;
                      if (imgPath) {
                        const baseUrl = (process.env.NEXT_PUBLIC_BACKEND_URL || '').replace(/\/$/, '');
                        const fullUrl = imgPath.startsWith('http') ? imgPath : `${baseUrl}${imgPath.startsWith('/') ? imgPath : '/' + imgPath}`;
                        return (
                          <img
                            src={fullUrl}
                            alt="Thumbnail"
                            style={{
                              width: 50,
                              height: 50,
                              objectFit: 'cover',
                              borderRadius: 8,
                              border: '1px solid #e2e8f0'
                            }}
                          />
                        );
                      }
                      return (
                        <div style={{
                          width: 50,
                          height: 50,
                          background: '#f1f5f9',
                          borderRadius: 8,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#94a3b8',
                          fontSize: 12
                        }}>
                          No Image
                        </div>
                      );
                    }
                  },
                  {
                    key: 'type',
                    label: 'Type',
                    sortable: true,
                    render: (value: any, row: any) => row.type || row.product_type || '-'
                  },
                  {
                    key: 'title',
                    label: 'Title/Name',
                    sortable: true,
                    render: (value: any, row: any) => row.title || row.name || '-'
                  },
                  {
                    key: 'description',
                    label: 'Description',
                    sortable: true,
                    render: (value: any, row: any) => (
                      <div style={{
                        maxWidth: 220,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {value || '-'}
                      </div>
                    )
                  },
                  {
                    key: 'consultant_id',
                    label: 'Added By (Consultant ID)',
                    sortable: true,
                    render: (value: any, row: any) => row.consultant_id ? (
                      <button
                        onClick={() => handleViewConsultant(row.consultant_id)}
                        style={{
                          background: 'rgba(102, 126, 234, 0.1)',
                          color: '#667eea',
                          border: 'none',
                          borderRadius: '4px',
                          padding: '4px 8px',
                          fontSize: '13px',
                          cursor: 'pointer',
                          fontWeight: 600,
                          textDecoration: 'underline'
                        }}
                      >
                        Consultant #{row.consultant_id}
                      </button>
                    ) : 'Admin'
                  },
                  {
                    key: 'status',
                    label: 'Status / Approval',
                    sortable: true,
                    render: (value: any, row: any) => (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <span style={{
                          color: value === 'active' ? '#38a169' : '#e53e3e',
                          fontWeight: 600,
                          padding: '4px 8px',
                          borderRadius: '4px',
                          background: value === 'active' ? 'rgba(56, 161, 105, 0.1)' : 'rgba(229, 62, 62, 0.1)',
                          display: 'inline-block',
                          width: 'max-content'
                        }}>
                          {value || '-'}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          {row.approval_status === 'pending' && <span style={{ color: '#d97706', fontSize: '12px', fontWeight: 600 }}>PENDING</span>}
                          {row.approval_status === 'approved' && <span style={{ color: '#059669', fontSize: '12px', fontWeight: 600 }}>APPROVED</span>}
                          {row.approval_status === 'rejected' && <span style={{ color: '#dc2626', fontSize: '12px', fontWeight: 600 }}>REJECTED</span>}
                          
                          {row.approval_status !== 'approved' && (
                            <button
                              onClick={() => handleApproveProduct(row.id)}
                              style={{ background: '#10b981', color: 'white', border: 'none', borderRadius: '4px', padding: '4px 8px', fontSize: '12px', cursor: 'pointer', fontWeight: 600 }}
                            >Approve</button>
                          )}
                          {row.approval_status !== 'rejected' && (
                            <button
                              onClick={() => handleRejectProduct(row.id)}
                              style={{ background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', padding: '4px 8px', fontSize: '12px', cursor: 'pointer', fontWeight: 600 }}
                            >Reject</button>
                          )}
                        </div>
                      </div>
                    )
                  }
                ]}
                onEdit={(product: any) => {
                  setProductForm({
                    ...product,
                    type: product.type || product.product_type as ProductType,
                    thumbnailFile: undefined,
                    pdfFile: undefined,
                    iconFile: undefined,
                    productImageFile: undefined
                  });
                  setProductEditId(product.id ?? null);
                  setShowProductModal(true);
                }}
                onDelete={(product: any) => {
                  setDeleteProductId(product.id ?? null);
                  setDeleteProductName(product.title || product.name || 'this product');
                  setShowDeleteModal(true);
                }}
                searchPlaceholder="Search products..."
                title="Products"
              />
              {/* Product Modal */}
              {showProductModal && (
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
                }} onClick={e => { if (e.target === e.currentTarget) setShowProductModal(false); }}>
                  <div style={{
                    background: '#fff',
                    borderRadius: '20px',
                    padding: 'clamp(20px, 4vw, 40px)',
                    minWidth: '90vw',
                    maxWidth: '1200px',
                    maxHeight: '90vh',
                    boxShadow: '0 20px 60px rgba(102, 126, 234, 0.2)',
                    position: 'relative',
                    overflow: 'auto',
                    width: '100%'
                  }}>
                    <button
                      onClick={() => setShowProductModal(false)}
                      aria-label="Close product modal"
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
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(102, 126, 234, 0.2)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(102, 126, 234, 0.1)'}
                    >
                      ×
                    </button>
                    <h2 style={{
                      color: '#667eea',
                      fontWeight: 700,
                      marginBottom: 32,
                      fontSize: 'clamp(24px, 4vw, 32px)',
                      textAlign: 'center',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}>{productEditId ? 'Edit' : 'Add'} Product</h2>
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        try {
                          const formData = new FormData();
                          // Common fields
                          formData.append('type', productForm.type || 'Course');
                          formData.append('product_type', productForm.type || 'Course'); // Try alternative field name
                          formData.append('status', productForm.status || 'active');
                          formData.append('featured', productForm.featured ? 'true' : 'false');
                          // Dynamic fields by type
                          if (productForm.type === 'Course') {
                            if (!productForm.title?.trim()) {
                              alert('Title is required for Course products');
                              return;
                            }
                            if (!productForm.description?.trim()) {
                              alert('Description is required for Course products');
                              return;
                            }
                            if (!productForm.price?.trim()) {
                              alert('Price is required for Course products');
                              return;
                            }
                            if (!productForm.video_url?.trim()) {
                              alert('Video URL is required for Course products');
                              return;
                            }
                            if (!productForm.thumbnailFile) {
                              alert('Thumbnail is required for Course products');
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
                          const method = productEditId ? 'PUT' : 'POST';
                          const url = productEditId 
                            ? getApiUrl(`api/products/${productEditId}`) 
                            : getApiUrl('api/products');

                          const response = await fetch(url, {
                            method: method,
                            body: formData,
                          });
                          if (!response.ok) {
                            const error = await response.json();

                            alert(error.message || 'Failed to add product');
                            return;
                          }
                          // Show success popup
                          setSuccessMessage(productEditId ? 'Product updated successfully!' : 'Product added successfully!');
                          setShowSuccessPopup(true);
                          // Re-fetch products after successful add
                          const res = await fetch(getApiUrl('api/products'));
                          const data = await res.json();



                          // Extract products array from response
                          const productsArray = data.products || data;

                          setProducts(productsArray);

                          setProductForm({
                            type: 'Course',
                            status: 'active',
                            featured: false,
                            title: '',
                            name: '',
                            description: '',
                            price: '',
                            video_url: '',
                            thumbnail: '',
                            thumbnailFile: undefined,
                            author: '',
                            pdf_file: '',
                            pdfFile: undefined,
                            download_link: '',
                            icon: '',
                            iconFile: undefined,
                            product_image: '',
                            productImageFile: undefined,
                            purchase_link: ''
                          });
                          setProductEditId(null);
                          setShowProductModal(false);
                        } catch (error) {

                          alert('Error: Failed to submit product. Please try again.');
                        }
                      }}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '20px',
                        maxWidth: '100%',
                        width: '100%'
                      }}
                    >
                      <div style={{ gridColumn: '1 / -1' }}>
                        <label style={{
                          fontWeight: 600,
                          color: '#667eea',
                          fontSize: '16px',
                          marginBottom: '8px',
                          display: 'block'
                        }}>Product Type</label>
                        <select
                          value={productForm.type}
                          onChange={e => setProductForm((f: any) => ({ ...f, type: e.target.value as ProductType }))}
                          style={{
                            padding: '14px 16px',
                            borderRadius: '12px',
                            border: '2px solid rgba(102, 126, 234, 0.2)',
                            fontSize: '16px',
                            width: '100%',
                            background: '#fff',
                            transition: 'all 0.2s ease',
                            outline: 'none'
                          }}
                          onFocus={(e) => e.target.style.borderColor = '#667eea'}
                          onBlur={(e) => e.target.style.borderColor = 'rgba(102, 126, 234, 0.2)'}
                          required
                        >
                          <option value="Course">Course</option>
                          <option value="E-book">E-book</option>
                          <option value="App">App</option>
                          <option value="Gadget">Gadget</option>
                        </select>
                      </div>
                      {/* Dynamic fields by type */}
                      {productForm.type === 'Course' && (
                        <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: '32px' }}>
                          {/* Section: Basic Information */}
                          <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1a202c', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                              📝 Basic Information
                            </h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                              <div style={{ gridColumn: '1 / -1' }}>
                                <label style={{ fontWeight: 600, color: '#4a5568', marginBottom: '8px', display: 'block', fontSize: '14px' }}>Course Title *</label>
                                <input
                                  type="text"
                                  name="title"
                                  value={productForm.title || ''}
                                  onChange={e => setProductForm((f: any) => ({ ...f, title: e.target.value }))}
                                  required
                                  style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e0', width: '100%', fontSize: '15px', transition: 'border-color 0.2s', outline: 'none' }}
                                  placeholder="e.g., A Mini Course on Time Management"
                                  onFocus={e => e.target.style.borderColor = '#667eea'}
                                  onBlur={e => e.target.style.borderColor = '#cbd5e0'}
                                />
                              </div>

                              <div style={{ gridColumn: '1 / -1' }}>
                                <label style={{ fontWeight: 600, color: '#4a5568', marginBottom: '8px', display: 'block', fontSize: '14px' }}>Course Subtitle *</label>
                                <input
                                  type="text"
                                  name="subtitle"
                                  value={productForm.subtitle || ''}
                                  onChange={e => setProductForm((f: any) => ({ ...f, subtitle: e.target.value }))}
                                  required
                                  style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e0', width: '100%', fontSize: '15px', transition: 'border-color 0.2s', outline: 'none' }}
                                  placeholder="e.g., 7 steps you can use immediately to become more productive"
                                  onFocus={e => e.target.style.borderColor = '#667eea'}
                                  onBlur={e => e.target.style.borderColor = '#cbd5e0'}
                                />
                              </div>

                              <div style={{ gridColumn: '1 / -1' }}>
                                <label style={{ fontWeight: 600, color: '#4a5568', marginBottom: '8px', display: 'block', fontSize: '14px' }}>Course Description *</label>
                                <textarea
                                  name="description"
                                  value={productForm.description || ''}
                                  onChange={e => setProductForm((f: any) => ({ ...f, description: e.target.value }))}
                                  required
                                  style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e0', width: '100%', minHeight: '120px', fontSize: '15px', resize: 'vertical', lineHeight: '1.5', outline: 'none', transition: 'border-color 0.2s' }}
                                  placeholder="Detailed description of what the course covers..."
                                  onFocus={e => e.target.style.borderColor = '#667eea'}
                                  onBlur={e => e.target.style.borderColor = '#cbd5e0'}
                                />
                              </div>

                              <div>
                                <label style={{ fontWeight: 600, color: '#4a5568', marginBottom: '8px', display: 'block', fontSize: '14px' }}>Language</label>
                                <input
                                  type="text"
                                  name="language"
                                  value={productForm.language || ''}
                                  onChange={e => setProductForm((f: any) => ({ ...f, language: e.target.value }))}
                                  style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e0', width: '100%', fontSize: '15px' }}
                                  placeholder="e.g., English"
                                />
                              </div>

                              <div>
                                <label style={{ fontWeight: 600, color: '#4a5568', marginBottom: '8px', display: 'block', fontSize: '14px' }}>Level</label>
                                <select
                                  name="level"
                                  value={productForm.level || 'Beginner'}
                                  onChange={e => setProductForm((f: any) => ({ ...f, level: e.target.value as 'Beginner' | 'Intermediate' | 'Advanced' }))}
                                  style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e0', width: '100%', fontSize: '15px', background: 'white' }}
                                >
                                  <option value="Beginner">Beginner</option>
                                  <option value="Intermediate">Intermediate</option>
                                  <option value="Advanced">Advanced</option>
                                </select>
                              </div>
                            </div>
                          </div>

                          {/* Section: Pricing & Statistics */}
                          <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1a202c', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                              📊 Pricing & Stats
                            </h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                              <div>
                                <label style={{ fontWeight: 600, color: '#4a5568', marginBottom: '8px', display: 'block', fontSize: '14px' }}>Price</label>
                                <input
                                  type="text"
                                  name="price"
                                  value={productForm.price || ''}
                                  onChange={e => setProductForm((f: any) => ({ ...f, price: e.target.value }))}
                                  style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e0', width: '100%', fontSize: '15px' }}
                                  placeholder="e.g., Free, $49.99"
                                />
                              </div>

                              <div>
                                <label style={{ fontWeight: 600, color: '#4a5568', marginBottom: '8px', display: 'block', fontSize: '14px' }}>Duration</label>
                                <input
                                  type="text"
                                  name="duration"
                                  value={productForm.duration || ''}
                                  onChange={e => setProductForm((f: any) => ({ ...f, duration: e.target.value }))}
                                  style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e0', width: '100%', fontSize: '15px' }}
                                  placeholder="e.g., 37min"
                                />
                              </div>

                              <div>
                                <label style={{ fontWeight: 600, color: '#4a5568', marginBottom: '8px', display: 'block', fontSize: '14px' }}>Total Lectures</label>
                                <input
                                  type="number"
                                  name="total_lectures"
                                  value={productForm.total_lectures || ''}
                                  onChange={e => setProductForm((f: any) => ({ ...f, total_lectures: parseInt(e.target.value) || 0 }))}
                                  style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e0', width: '100%', fontSize: '15px' }}
                                  placeholder="e.g., 11"
                                />
                              </div>

                              <div>
                                <label style={{ fontWeight: 600, color: '#4a5568', marginBottom: '8px', display: 'block', fontSize: '14px' }}>Rating (0-5)</label>
                                <input
                                  type="number"
                                  name="rating"
                                  step="0.1"
                                  min="0"
                                  max="5"
                                  value={productForm.rating || ''}
                                  onChange={e => setProductForm((f: any) => ({ ...f, rating: parseFloat(e.target.value) || 0 }))}
                                  style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e0', width: '100%', fontSize: '15px' }}
                                  placeholder="e.g., 4.4"
                                />
                              </div>

                              <div>
                                <label style={{ fontWeight: 600, color: '#4a5568', marginBottom: '8px', display: 'block', fontSize: '14px' }}>Total Ratings Count</label>
                                <input
                                  type="number"
                                  name="total_ratings"
                                  value={productForm.total_ratings || ''}
                                  onChange={e => setProductForm((f: any) => ({ ...f, total_ratings: parseInt(e.target.value) || 0 }))}
                                  style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e0', width: '100%', fontSize: '15px' }}
                                  placeholder="e.g., 1500"
                                />
                              </div>

                              <div>
                                <label style={{ fontWeight: 600, color: '#4a5568', marginBottom: '8px', display: 'block', fontSize: '14px' }}>Enrolled Students</label>
                                <input
                                  type="number"
                                  name="enrolled_students"
                                  value={productForm.enrolled_students || ''}
                                  onChange={e => setProductForm((f: any) => ({ ...f, enrolled_students: parseInt(e.target.value) || 0 }))}
                                  style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e0', width: '100%', fontSize: '15px' }}
                                  placeholder="e.g., 5000"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Section: Instructor */}
                          <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1a202c', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                              🎓 Instructor Details
                            </h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                              <div>
                                <label style={{ fontWeight: 600, color: '#4a5568', marginBottom: '8px', display: 'block', fontSize: '14px' }}>Instructor Name</label>
                                <input
                                  type="text"
                                  name="instructor_name"
                                  value={productForm.instructor_name || ''}
                                  onChange={e => setProductForm((f: any) => ({ ...f, instructor_name: e.target.value }))}
                                  style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e0', width: '100%', fontSize: '15px' }}
                                  placeholder="e.g., John Doe"
                                />
                              </div>

                              <div>
                                <label style={{ fontWeight: 600, color: '#4a5568', marginBottom: '8px', display: 'block', fontSize: '14px' }}>Instructor Title</label>
                                <input
                                  type="text"
                                  name="instructor_title"
                                  value={productForm.instructor_title || ''}
                                  onChange={e => setProductForm((f: any) => ({ ...f, instructor_title: e.target.value }))}
                                  style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e0', width: '100%', fontSize: '15px' }}
                                  placeholder="e.g., Senior Expert"
                                />
                              </div>

                              <div style={{ gridColumn: '1 / -1' }}>
                                <label style={{ fontWeight: 600, color: '#4a5568', marginBottom: '8px', display: 'block', fontSize: '14px' }}>Instructor Bio</label>
                                <textarea
                                  name="instructor_bio"
                                  value={productForm.instructor_bio || ''}
                                  onChange={e => setProductForm((f: any) => ({ ...f, instructor_bio: e.target.value }))}
                                  style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e0', width: '100%', minHeight: '80px', fontSize: '15px', resize: 'vertical' }}
                                  placeholder="Brief description..."
                                />
                              </div>

                              <div style={{ gridColumn: '1 / -1' }}>
                                <label style={{ fontWeight: 600, color: '#4a5568', marginBottom: '8px', display: 'block', fontSize: '14px' }}>Instructor Image</label>
                                <input
                                  type="file"
                                  name="instructor_image"
                                  accept="image/*"
                                  onChange={e => {
                                    const file = e.target.files?.[0];
                                    if (file) setProductForm((f: any) => ({ ...f, instructor_image: URL.createObjectURL(file), instructorImageFile: file }));
                                  }}
                                  style={{ padding: '10px 0' }}
                                />
                                {productForm.instructor_image && (
                                  <div style={{ marginTop: '10px' }}>
                                    <img src={productForm.instructor_image} alt="Instructor" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: '12px', border: '2px solid #e2e8f0' }} />
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Section: Media */}
                          <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1a202c', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                              🖼️ Media & Assets
                            </h3>
                            <div style={{ display: 'grid', gap: '20px' }}>
                              <div>
                                <label style={{ fontWeight: 600, color: '#4a5568', marginBottom: '8px', display: 'block', fontSize: '14px' }}>Video URL (Preview)</label>
                                <input
                                  type="text"
                                  name="video_url"
                                  value={productForm.video_url || ''}
                                  onChange={e => setProductForm((f: any) => ({ ...f, video_url: e.target.value }))}
                                  style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e0', width: '100%', fontSize: '15px' }}
                                  placeholder="URL to preview video"
                                />
                              </div>

                              <div>
                                <label style={{ fontWeight: 600, color: '#4a5568', marginBottom: '8px', display: 'block', fontSize: '14px' }}>Course Thumbnail</label>
                                <input
                                  type="file"
                                  name="thumbnail"
                                  accept="image/*"
                                  onChange={e => {
                                    const file = e.target.files?.[0];
                                    if (file) setProductForm((f: any) => ({ ...f, thumbnail: URL.createObjectURL(file), thumbnailFile: file }));
                                  }}
                                  style={{ padding: '10px 0' }}
                                />
                                {productForm.thumbnail && (
                                  <div style={{ marginTop: '10px' }}>
                                    <img src={productForm.thumbnail} alt="Thumbnail" style={{ width: 120, height: 80, objectFit: 'cover', borderRadius: '12px', border: '2px solid #e2e8f0' }} />
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Section: Curriculum */}
                          <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1a202c', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                              📚 Curriculum
                            </h3>

                            <div style={{ marginBottom: '24px' }}>
                              <label style={{ fontWeight: 600, color: '#4a5568', marginBottom: '12px', display: 'block', fontSize: '14px' }}>Learning Objectives *</label>
                              <div style={{ border: '1px solid #cbd5e0', borderRadius: '12px', padding: '16px', backgroundColor: 'white' }}>
                                {(productForm.learning_objectives || ['']).map((objective: string, index: number) => (
                                  <div key={index} style={{ display: 'flex', gap: '8px', marginBottom: '10px', alignItems: 'center' }}>
                                    <span style={{ color: '#cbd5e0', fontWeight: 'bold' }}>•</span>
                                    <input
                                      type="text"
                                      value={objective}
                                      onChange={e => {
                                        const newObjectives = [...(productForm.learning_objectives || [''])];
                                        newObjectives[index] = e.target.value;
                                        setProductForm((f: any) => ({ ...f, learning_objectives: newObjectives }));
                                      }}
                                      placeholder="e.g., Master the 7-step time management system"
                                      style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '14px' }}
                                    />
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const newObjectives = (productForm.learning_objectives || ['']).filter((_: string, i: number) => i !== index);
                                        setProductForm((f: any) => ({ ...f, learning_objectives: newObjectives }));
                                      }}
                                      style={{ padding: '8px 12px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600', transition: 'all 0.2s' }}
                                    >
                                      ✕
                                    </button>
                                  </div>
                                ))}
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newObjectives = [...(productForm.learning_objectives || ['']), ''];
                                    setProductForm((f: any) => ({ ...f, learning_objectives: newObjectives }));
                                  }}
                                  style={{ marginTop: '8px', padding: '8px 16px', background: '#ebf8ff', color: '#3182ce', border: '1px dashed #3182ce', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '600', width: '100%' }}
                                >
                                  + Add Objective
                                </button>
                              </div>
                            </div>

                            <div style={{ marginBottom: '24px' }}>
                              <label style={{ fontWeight: 600, color: '#4a5568', marginBottom: '12px', display: 'block', fontSize: '14px' }}>Requirements</label>
                              <div style={{ border: '1px solid #cbd5e0', borderRadius: '12px', padding: '16px', backgroundColor: 'white' }}>
                                {(productForm.requirements || ['']).map((requirement: string, index: number) => (
                                  <div key={index} style={{ display: 'flex', gap: '8px', marginBottom: '10px', alignItems: 'center' }}>
                                    <span style={{ color: '#cbd5e0', fontWeight: 'bold' }}>•</span>
                                    <input
                                      type="text"
                                      value={requirement}
                                      onChange={e => {
                                        const newRequirements = [...(productForm.requirements || [''])];
                                        newRequirements[index] = e.target.value;
                                        setProductForm((f: any) => ({ ...f, requirements: newRequirements }));
                                      }}
                                      placeholder="e.g., A willingness to take action..."
                                      style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '14px' }}
                                    />
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const newRequirements = (productForm.requirements || ['']).filter((_: string, i: number) => i !== index);
                                        setProductForm((f: any) => ({ ...f, requirements: newRequirements }));
                                      }}
                                      style={{ padding: '8px 12px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}
                                    >
                                      ✕
                                    </button>
                                  </div>
                                ))}
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newRequirements = [...(productForm.requirements || ['']), ''];
                                    setProductForm((f: any) => ({ ...f, requirements: newRequirements }));
                                  }}
                                  style={{ marginTop: '8px', padding: '8px 16px', background: '#ebf8ff', color: '#3182ce', border: '1px dashed #3182ce', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '600', width: '100%' }}
                                >
                                  + Add Requirement
                                </button>
                              </div>
                            </div>

                            <div>
                              <label style={{ fontWeight: 600, color: '#4a5568', marginBottom: '12px', display: 'block', fontSize: '14px' }}>Course Content Sections</label>
                              <div style={{ border: '1px solid #cbd5e0', borderRadius: '12px', padding: '16px', backgroundColor: 'white', maxHeight: '400px', overflowY: 'auto' }}>
                                {(productForm.course_content || [{ section: '', lectures: 0, duration: '', items: [''] }]).map((section: any, sectionIndex: number) => (
                                  <div key={sectionIndex} style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px', marginBottom: '16px', backgroundColor: '#f9f9f9' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                                      <input
                                        type="text"
                                        value={section.section}
                                        onChange={e => {
                                          const newContent = [...(productForm.course_content || [])];
                                          newContent[sectionIndex] = { ...section, section: e.target.value };
                                          setProductForm((f: any) => ({ ...f, course_content: newContent }));
                                        }}
                                        placeholder="Section name (e.g., Introduction)"
                                        style={{ padding: '10px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '14px', fontWeight: 600 }}
                                      />
                                      <input
                                        type="number"
                                        value={section.lectures}
                                        onChange={e => {
                                          const newContent = [...(productForm.course_content || [])];
                                          newContent[sectionIndex] = { ...section, lectures: parseInt(e.target.value) || 0 };
                                          setProductForm((f: any) => ({ ...f, course_content: newContent }));
                                        }}
                                        placeholder="Lectures count"
                                        style={{ padding: '10px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '13px' }}
                                      />
                                      <input
                                        type="text"
                                        value={section.duration}
                                        onChange={e => {
                                          const newContent = [...(productForm.course_content || [])];
                                          newContent[sectionIndex] = { ...section, duration: e.target.value };
                                          setProductForm((f: any) => ({ ...f, course_content: newContent }));
                                        }}
                                        placeholder="Duration"
                                        style={{ padding: '10px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '13px' }}
                                      />
                                    </div>

                                    <div style={{ marginBottom: '12px', background: 'white', padding: '12px', borderRadius: '8px', border: '1px solid #f0f0f0' }}>
                                      <label style={{ fontSize: '12px', color: '#718096', marginBottom: '8px', display: 'block', fontWeight: 600, textTransform: 'uppercase' }}>Lectures</label>
                                      {section.items.map((item: string, itemIndex: number) => (
                                        <div key={itemIndex} style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'center' }}>
                                          <span style={{ fontSize: '12px', color: '#cbd5e0' }}>{itemIndex + 1}.</span>
                                          <input
                                            type="text"
                                            value={item}
                                            onChange={e => {
                                              const newContent = [...(productForm.course_content || [])];
                                              const newItems = [...section.items];
                                              newItems[itemIndex] = e.target.value;
                                              newContent[sectionIndex] = { ...section, items: newItems };
                                              setProductForm((f: any) => ({ ...f, course_content: newContent }));
                                            }}
                                            placeholder="Lecture title"
                                            style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #e2e8f0', fontSize: '13px' }}
                                          />
                                          <button
                                            type="button"
                                            onClick={() => {
                                              const newContent = [...(productForm.course_content || [])];
                                              const newItems = section.items.filter((_: any, i: number) => i !== itemIndex);
                                              newContent[sectionIndex] = { ...section, items: newItems };
                                              setProductForm((f: any) => ({ ...f, course_content: newContent }));
                                            }}
                                            style={{ padding: '4px 8px', background: 'none', color: '#e53e3e', border: '1px solid #fed7d7', borderRadius: '4px', cursor: 'pointer', fontSize: '16px', lineHeight: 1 }}
                                            title="Remove lecture"
                                          >
                                            ×
                                          </button>
                                        </div>
                                      ))}
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const newContent = [...(productForm.course_content || [])];
                                          const newItems = [...section.items, ''];
                                          newContent[sectionIndex] = { ...section, items: newItems };
                                          setProductForm((f: any) => ({ ...f, course_content: newContent }));
                                        }}
                                        style={{ marginTop: '4px', padding: '6px 10px', background: '#f7fafc', color: '#4a5568', border: '1px solid #cbd5e0', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}
                                      >
                                        + Add Lecture Item
                                      </button>
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const newContent = (productForm.course_content || []).filter((_: any, i: number) => i !== sectionIndex);
                                          setProductForm((f: any) => ({ ...f, course_content: newContent }));
                                        }}
                                        style={{ padding: '6px 12px', background: '#fff1f2', color: '#be123c', border: '1px solid #fecdd3', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}
                                      >
                                        🗑️ Delete Section
                                      </button>
                                    </div>
                                  </div>
                                ))}
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newContent = [...(productForm.course_content || []), { section: '', lectures: 0, duration: '', items: [''] }];
                                    setProductForm((f: any) => ({ ...f, course_content: newContent }));
                                  }}
                                  style={{ padding: '10px 16px', background: '#ebf8ff', color: '#2c5282', border: '1px dashed #4299e1', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                                >
                                  <span style={{ fontSize: '18px' }}>+</span> Add New Section
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      {productForm.type === 'E-book' && (
                        <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: '32px' }}>
                          <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1a202c', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                              📝 Basic Information
                            </h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                              <div style={{ gridColumn: '1 / -1' }}>
                                <label style={{ fontWeight: 600, color: '#4a5568', marginBottom: '8px', display: 'block', fontSize: '14px' }}>Title</label>
                                <input type="text" value={productForm.title || ''} onChange={e => setProductForm((f: any) => ({ ...f, title: e.target.value }))} required style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e0', width: '100%', fontSize: '15px' }} />
                              </div>
                              <div style={{ gridColumn: '1 / -1' }}>
                                <label style={{ fontWeight: 600, color: '#4a5568', marginBottom: '8px', display: 'block', fontSize: '14px' }}>Description</label>
                                <textarea value={productForm.description || ''} onChange={e => setProductForm((f: any) => ({ ...f, description: e.target.value }))} required style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e0', width: '100%', minHeight: '100px', fontSize: '15px', resize: 'vertical' }} />
                              </div>
                              <div>
                                <label style={{ fontWeight: 600, color: '#4a5568', marginBottom: '8px', display: 'block', fontSize: '14px' }}>Author</label>
                                <input type="text" value={productForm.author || ''} onChange={e => setProductForm((f: any) => ({ ...f, author: e.target.value }))} style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e0', width: '100%', fontSize: '15px' }} />
                              </div>
                            </div>
                          </div>

                          <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1a202c', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                              📂 Files & Assets
                            </h3>
                            <div style={{ display: 'grid', gap: '20px' }}>
                              <div>
                                <label style={{ fontWeight: 600, color: '#4a5568', marginBottom: '8px', display: 'block', fontSize: '14px' }}>PDF File</label>
                                <input type="file" accept="application/pdf" onChange={e => {
                                  const file = e.target.files?.[0];
                                  if (file) setProductForm((f: any) => ({ ...f, pdf_file: file.name, pdfFile: file }));
                                }} style={{ padding: '10px 0' }} />
                                {productForm.pdf_file && <div style={{ color: '#4f46e5', fontWeight: 600, fontSize: '14px', marginTop: '4px' }}>📄 {productForm.pdf_file}</div>}
                              </div>
                              <div>
                                <label style={{ fontWeight: 600, color: '#4a5568', marginBottom: '8px', display: 'block', fontSize: '14px' }}>Thumbnail</label>
                                <input type="file" accept="image/*" onChange={e => {
                                  const file = e.target.files?.[0];
                                  if (file) setProductForm((f: any) => ({ ...f, thumbnail: URL.createObjectURL(file), thumbnailFile: file }));
                                }} style={{ padding: '10px 0' }} />
                                {productForm.thumbnail && <div style={{ marginTop: '10px' }}><img src={productForm.thumbnail} alt="Thumbnail" style={{ width: 100, height: 140, objectFit: 'cover', borderRadius: '8px', border: '2px solid #e2e8f0' }} /></div>}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      {productForm.type === 'App' && (
                        <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: '32px' }}>
                          <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1a202c', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                              📱 App Information
                            </h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                              <div style={{ gridColumn: '1 / -1' }}>
                                <label style={{ fontWeight: 600, color: '#4a5568', marginBottom: '8px', display: 'block', fontSize: '14px' }}>App Name</label>
                                <input type="text" value={productForm.name || ''} onChange={e => setProductForm((f: any) => ({ ...f, name: e.target.value }))} required style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e0', width: '100%', fontSize: '15px' }} />
                              </div>
                              <div style={{ gridColumn: '1 / -1' }}>
                                <label style={{ fontWeight: 600, color: '#4a5568', marginBottom: '8px', display: 'block', fontSize: '14px' }}>Description</label>
                                <textarea value={productForm.description || ''} onChange={e => setProductForm((f: any) => ({ ...f, description: e.target.value }))} required style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e0', width: '100%', minHeight: '100px', fontSize: '15px', resize: 'vertical' }} />
                              </div>
                            </div>
                          </div>

                          <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1a202c', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                              ⬇️ Download & Assets
                            </h3>
                            <div style={{ display: 'grid', gap: '20px' }}>
                              <div>
                                <label style={{ fontWeight: 600, color: '#4a5568', marginBottom: '8px', display: 'block', fontSize: '14px' }}>Download Link</label>
                                <input type="text" value={productForm.download_link || ''} onChange={e => setProductForm((f: any) => ({ ...f, download_link: e.target.value }))} style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e0', width: '100%', fontSize: '15px' }} />
                              </div>
                              <div>
                                <label style={{ fontWeight: 600, color: '#4a5568', marginBottom: '8px', display: 'block', fontSize: '14px' }}>App Icon</label>
                                <input type="file" accept="image/*" onChange={e => {
                                  const file = e.target.files?.[0];
                                  if (file) setProductForm((f: any) => ({ ...f, icon: URL.createObjectURL(file), iconFile: file }));
                                }} style={{ padding: '10px 0' }} />
                                {productForm.icon && <div style={{ marginTop: '10px' }}><img src={productForm.icon} alt="Icon" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: '16px', border: '2px solid #e2e8f0' }} /></div>}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      {productForm.type === 'Gadget' && (
                        <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: '32px' }}>
                          <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1a202c', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                              🎧 Gadget Info
                            </h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                              <div style={{ gridColumn: '1 / -1' }}>
                                <label style={{ fontWeight: 600, color: '#4a5568', marginBottom: '8px', display: 'block', fontSize: '14px' }}>Product Name</label>
                                <input type="text" value={productForm.name || ''} onChange={e => setProductForm((f: any) => ({ ...f, name: e.target.value }))} required style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e0', width: '100%', fontSize: '15px' }} />
                              </div>
                              <div style={{ gridColumn: '1 / -1' }}>
                                <label style={{ fontWeight: 600, color: '#4a5568', marginBottom: '8px', display: 'block', fontSize: '14px' }}>Description</label>
                                <textarea value={productForm.description || ''} onChange={e => setProductForm((f: any) => ({ ...f, description: e.target.value }))} required style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e0', width: '100%', minHeight: '100px', fontSize: '15px', resize: 'vertical' }} />
                              </div>
                              <div>
                                <label style={{ fontWeight: 600, color: '#4a5568', marginBottom: '8px', display: 'block', fontSize: '14px' }}>Price</label>
                                <input type="number" value={productForm.price || ''} onChange={e => setProductForm((f: any) => ({ ...f, price: e.target.value }))} style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e0', width: '100%', fontSize: '15px' }} />
                              </div>
                            </div>
                          </div>

                          <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1a202c', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                              🔗 Links & Images
                            </h3>
                            <div style={{ display: 'grid', gap: '20px' }}>
                              <div>
                                <label style={{ fontWeight: 600, color: '#4a5568', marginBottom: '8px', display: 'block', fontSize: '14px' }}>Purchase Link</label>
                                <input type="text" value={productForm.purchase_link || ''} onChange={e => setProductForm((f: any) => ({ ...f, purchase_link: e.target.value }))} style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e0', width: '100%', fontSize: '15px' }} />
                              </div>
                              <div>
                                <label style={{ fontWeight: 600, color: '#4a5568', marginBottom: '8px', display: 'block', fontSize: '14px' }}>Download Link</label>
                                <input type="text" value={productForm.download_link || ''} onChange={e => setProductForm((f: any) => ({ ...f, download_link: e.target.value }))} style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e0', width: '100%', fontSize: '15px' }} />
                              </div>
                              <div>
                                <label style={{ fontWeight: 600, color: '#4a5568', marginBottom: '8px', display: 'block', fontSize: '14px' }}>Product Image</label>
                                <input type="file" accept="image/*" onChange={e => {
                                  const file = e.target.files?.[0];
                                  if (file) setProductForm((f: any) => ({ ...f, product_image: URL.createObjectURL(file), productImageFile: file }));
                                }} style={{ padding: '10px 0' }} />
                                {productForm.product_image && <div style={{ marginTop: '10px' }}><img src={productForm.product_image} alt="Product" style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: '8px', border: '2px solid #e2e8f0' }} /></div>}
                              </div>
                              <div>
                                <label style={{ fontWeight: 600, color: '#4a5568', marginBottom: '8px', display: 'block', fontSize: '14px' }}>Icon</label>
                                <input type="file" accept="image/*" onChange={e => {
                                  const file = e.target.files?.[0];
                                  if (file) setProductForm((f: any) => ({ ...f, icon: URL.createObjectURL(file), iconFile: file }));
                                }} style={{ padding: '10px 0' }} />
                                {productForm.icon && <div style={{ marginTop: '10px' }}><img src={productForm.icon} alt="Icon" style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: '12px', border: '2px solid #e2e8f0' }} /></div>}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Status and Featured Section */}
                      <div style={{
                        gridColumn: '1 / -1',
                        background: '#fff',
                        padding: '24px',
                        borderRadius: '16px',
                        border: '1px solid #e2e8f0',
                        marginTop: '16px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '20px'
                      }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1a202c', marginBottom: '0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          ⚙️ Settings
                        </h3>
                        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'center' }}>
                          <div style={{ flex: 1, minWidth: '200px' }}>
                            <label style={{
                              fontWeight: 600,
                              color: '#4a5568',
                              fontSize: '14px',
                              marginBottom: '8px',
                              display: 'block'
                            }}>Status</label>
                            <select
                              value={productForm.status}
                              onChange={e => setProductForm((f: any) => ({ ...f, status: e.target.value as 'active' | 'inactive' }))}
                              style={{
                                padding: '12px 16px',
                                borderRadius: '8px',
                                border: '1px solid #cbd5e0',
                                fontSize: '15px',
                                width: '100%',
                                background: '#fff',
                                outline: 'none'
                              }}
                            >
                              <option value="active">Active</option>
                              <option value="inactive">Inactive</option>
                            </select>
                          </div>

                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '12px 16px',
                            background: '#f8fafc',
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0',
                            marginTop: '28px'
                          }}>
                            <input
                              type="checkbox"
                              id="featured"
                              checked={productForm.featured || false}
                              onChange={e => setProductForm((f: any) => ({ ...f, featured: e.target.checked }))}
                              style={{
                                width: '20px',
                                height: '20px',
                                cursor: 'pointer',
                                accentColor: '#667eea'
                              }}
                            />
                            <label
                              htmlFor="featured"
                              style={{
                                fontWeight: 600,
                                color: productForm.featured ? '#22c55e' : '#4a5568',
                                cursor: 'pointer',
                                fontSize: '15px',
                                margin: 0,
                                userSelect: 'none'
                              }}
                            >
                              {productForm.featured ? 'Featured Product' : 'Set as Featured'}
                            </label>
                          </div>
                        </div>
                      </div>
                      <button
                        type="submit"
                        style={{
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '12px',
                          padding: '16px 40px',
                          fontWeight: 700,
                          fontSize: '18px',
                          cursor: 'pointer',
                          marginTop: 24,
                          gridColumn: '1 / -1',
                          justifySelf: 'center',
                          minWidth: '200px',
                          transition: 'all 0.2s ease',
                          boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                      >
                        {productEditId ? 'Update' : 'Add'} Product
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </section>
            
            {showConsultantModal && selectedConsultant && (
              <div style={{
                position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex',
                alignItems: 'center', justifyContent: 'center'
              }}>
                <div style={{
                  background: 'white', borderRadius: '12px', padding: '30px', width: '90%', maxWidth: '500px',
                  maxHeight: '90vh', overflowY: 'auto', position: 'relative'
                }}>
                  <button onClick={() => setShowConsultantModal(false)} style={{
                    position: 'absolute', top: '15px', right: '15px', border: 'none', background: 'none', fontSize: '20px', cursor: 'pointer'
                  }}>×</button>
                  <h3 style={{ marginTop: 0, marginBottom: '20px', color: '#1f2937', borderBottom: '1px solid #e5e7eb', paddingBottom: '10px' }}>Consultant Details</h3>
                  
                  <div style={{ display: 'grid', gap: '15px' }}>
                    <div><strong style={{ color: '#4b5563' }}>Name:</strong> <span style={{ color: '#111827' }}>{selectedConsultant.name}</span></div>
                    <div><strong style={{ color: '#4b5563' }}>Email:</strong> <span style={{ color: '#111827' }}>{selectedConsultant.email}</span></div>
                    <div><strong style={{ color: '#4b5563' }}>Phone:</strong> <span style={{ color: '#111827' }}>{selectedConsultant.phone || '-'}</span></div>
                    <div><strong style={{ color: '#4b5563' }}>Speciality:</strong> <span style={{ color: '#111827' }}>{selectedConsultant.speciality || '-'}</span></div>
                    <div><strong style={{ color: '#4b5563' }}>City:</strong> <span style={{ color: '#111827' }}>{selectedConsultant.city || '-'}</span></div>
                    <div><strong style={{ color: '#4b5563' }}>Price per Slot:</strong> <span style={{ color: '#111827' }}>₹{selectedConsultant.price_per_slot || '-'}</span></div>
                    <div><strong style={{ color: '#4b5563' }}>PAN Number:</strong> <span style={{ color: '#111827' }}>{selectedConsultant.pan_number || '-'}</span></div>
                    <div><strong style={{ color: '#4b5563' }}>GST Number:</strong> <span style={{ color: '#111827' }}>{selectedConsultant.gst_number || '-'}</span></div>
                    <div><strong style={{ color: '#4b5563' }}>Joined:</strong> <span style={{ color: '#111827' }}>{new Date(selectedConsultant.created_at).toLocaleDateString()}</span></div>
                  </div>
                  
                  <div style={{ marginTop: '25px', textAlign: 'right' }}>
                    <button onClick={() => setShowConsultantModal(false)} style={{ background: '#f3f4f6', color: '#374151', padding: '8px 16px', borderRadius: '6px', border: '1px solid #d1d5db', cursor: 'pointer', fontWeight: 'bold' }}>Close</button>
                  </div>
                </div>
              </div>
            )}
          
    </>
  );
}

