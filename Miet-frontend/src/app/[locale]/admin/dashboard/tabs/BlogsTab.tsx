"use client";
import React from 'react';
import Image from 'next/image';
import { FaThLarge, FaList, FaTags, FaUserCircle, FaSignOutAlt, FaChevronLeft, FaChevronRight, FaUserMd, FaChevronDown, FaSearch, FaEdit, FaTrash, FaPlus, FaEye, FaImages, FaCog } from "react-icons/fa";
import Select from "react-select";
import { getBlogCoverPhotoUrl } from '@/utils/blog';

export default function BlogsTab(props: any) {
  const {
    DataTable,
    blogs,
    blogEditId,
    blogForm,
    coverPhotoFile,
    coverPhotoPreview,
    handleBlogSubmit,
    handleCoverPhotoChange,
    handleMediaImageChange,
    handleMediaVideoChange,
    mediaImageFiles,
    mediaVideoFiles,
    resetBlogForm,
    setBlogEditId,
    setBlogForm,
    setDeleteBlogId,
    setDeleteBlogName,
    setShowBlogModal,
    setShowDeleteModal,
    showBlogModal,
  } = props;

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
                }}>Manage Blogs</h2>
                <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
                  <select
                    value={blogForm.category}
                    onChange={e => setBlogForm((f: any) => ({ ...f, category: e.target.value as 'Therapy' | 'Mental Health' | 'Education' | 'Support' | 'Technology' }))}
                    style={{
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: '1px solid rgba(102, 126, 234, 0.2)',
                      minWidth: '140px',
                      fontSize: '14px',
                      background: '#fff'
                    }}
                  >
                    <option value="Therapy">Therapy</option>
                    <option value="Mental Health">Mental Health</option>
                    <option value="Education">Education</option>
                    <option value="Support">Support</option>
                    <option value="Technology">Technology</option>
                  </select>
                  <button
                    onClick={() => {
                      resetBlogForm?.();
                      setBlogEditId(null);
                      setShowBlogModal(true);
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
                    <FaPlus size={16} /> Add Blog
                  </button>
                </div>
              </div>

              <DataTable
                data={blogs}
                columns={[
                  {
                    key: 'thumbnail',
                    label: 'Thumbnail',
                    sortable: false,
                    render: (_value: string, blog: any) => {
                      const coverUrl = getBlogCoverPhotoUrl(blog);

                      return coverUrl ? (
                        <img
                          src={coverUrl}
                          alt="Cover photo"
                          style={{
                            width: 50,
                            height: 50,
                            objectFit: 'cover',
                            borderRadius: 8,
                            border: '1px solid #e2e8f0'
                          }}
                        />
                      ) : (
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
                  { key: 'category', label: 'Category', sortable: true },
                  { key: 'title', label: 'Title', sortable: true },
                  { key: 'author', label: 'Author', sortable: true },
                  { key: 'status', label: 'Status', sortable: true },
                  {
                    key: 'created_at',
                    label: 'Created',
                    sortable: true,
                    render: (value: string) => value ? value.split('T')[0] : '-'
                  }
                ]}
                onView={(blog: any) => {
                  // Handle blog view if needed
                }}
                onEdit={(blog: any) => {
                  setBlogForm(blog);
                  setBlogEditId(blog.id ?? null);
                  setShowBlogModal(true);
                }}
                onDelete={(blog: any) => {
                  setDeleteBlogId(blog.id ?? null);
                  setDeleteBlogName(blog.title || 'this blog');
                  setShowDeleteModal(true);
                }}
                searchPlaceholder="Search blogs..."
                title="Blogs"
              />
              {/* Blog Modal */}
              {showBlogModal && (
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
                }} onClick={e => { if (e.target === e.currentTarget) setShowBlogModal(false); }}>
                  <div style={{
                    background: '#fff',
                    borderRadius: '20px',
                    padding: '40px',
                    minWidth: '90vw',
                    maxWidth: '800px',
                    maxHeight: '90vh',
                    boxShadow: '0 20px 60px rgba(102, 126, 234, 0.2)',
                    position: 'relative',
                    overflow: 'auto'
                  }}>
                    <button
                      onClick={() => setShowBlogModal(false)}
                      aria-label="Close blog modal"
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
                    }}>{blogEditId ? 'Edit' : 'Add'} Blog</h2>
                    <form
                      onSubmit={handleBlogSubmit}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: 24,
                        maxWidth: '100%'
                      }}
                    >
                      <div style={{ gridColumn: '1 / -1' }}>
                        <label style={{
                          fontWeight: 600,
                          color: '#667eea',
                          fontSize: '16px',
                          marginBottom: '8px',
                          display: 'block'
                        }}>Category</label>
                        <select
                          value={blogForm.category}
                          onChange={e => setBlogForm((f: any) => ({ ...f, category: e.target.value as 'Therapy' | 'Mental Health' | 'Education' | 'Support' | 'Technology' }))}
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
                          <option value="Therapy">Therapy</option>
                          <option value="Mental Health">Mental Health</option>
                          <option value="Education">Education</option>
                          <option value="Support">Support</option>
                          <option value="Technology">Technology</option>
                        </select>
                      </div>
                      <div>
                        <label style={{
                          fontWeight: 600,
                          color: '#667eea',
                          fontSize: '16px',
                          marginBottom: '8px',
                          display: 'block'
                        }}>Title</label>
                        <input
                          type="text"
                          value={blogForm.title || ''}
                          onChange={e => setBlogForm((f: any) => ({ ...f, title: e.target.value }))}
                          required
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
                        />
                      </div>
                      <div style={{ gridColumn: '1 / -1' }}>
                        <label style={{
                          fontWeight: 600,
                          color: '#667eea',
                          fontSize: '16px',
                          marginBottom: '8px',
                          display: 'block'
                        }}>Description</label>
                        <textarea
                          value={blogForm.description || ''}
                          onChange={e => setBlogForm((f: any) => ({ ...f, description: e.target.value }))}
                          required
                          style={{
                            padding: '14px 16px',
                            borderRadius: '12px',
                            border: '2px solid rgba(102, 126, 234, 0.2)',
                            fontSize: '16px',
                            width: '100%',
                            background: '#fff',
                            transition: 'all 0.2s ease',
                            outline: 'none',
                            minHeight: 80,
                            resize: 'vertical'
                          }}
                          onFocus={(e) => e.target.style.borderColor = '#667eea'}
                          onBlur={(e) => e.target.style.borderColor = 'rgba(102, 126, 234, 0.2)'}
                        />
                      </div>
                      <div>
                        <label style={{
                          fontWeight: 600,
                          color: '#667eea',
                          fontSize: '16px',
                          marginBottom: '8px',
                          display: 'block'
                        }}>Author</label>
                        <input
                          type="text"
                          value={blogForm.author || ''}
                          onChange={e => setBlogForm((f: any) => ({ ...f, author: e.target.value }))}
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
                        />
                      </div>
                      <div>
                        <label style={{
                          fontWeight: 600,
                          color: '#667eea',
                          fontSize: '16px',
                          marginBottom: '8px',
                          display: 'block'
                        }}>Post Type</label>
                        <select
                          value={blogForm.post_type || 'blog'}
                          onChange={e => setBlogForm((f: any) => ({ ...f, post_type: e.target.value as 'blog' | 'vlog' }))}
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
                        >
                          <option value="blog">Blog</option>
                          <option value="vlog">Vlog</option>
                        </select>
                      </div>
                      <div>
                        <label style={{
                          fontWeight: 600,
                          color: '#667eea',
                          fontSize: '16px',
                          marginBottom: '8px',
                          display: 'block'
                        }}>Cover Photo URL</label>
                        <input
                          type="text"
                          value={blogForm.cover_photo || blogForm.thumbnail || ''}
                          onChange={e => setBlogForm((f: any) => ({ ...f, cover_photo: e.target.value, thumbnail: e.target.value }))}
                          placeholder="Enter cover photo URL"
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
                        />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleCoverPhotoChange}
                          style={{ marginTop: 12, display: 'block' }}
                        />
                        {coverPhotoPreview ? (
                          <img
                            src={coverPhotoPreview}
                            alt="Cover preview"
                            style={{
                              width: 120,
                              height: 80,
                              objectFit: 'cover',
                              borderRadius: '12px',
                              marginTop: 8,
                              border: '2px solid rgba(102, 126, 234, 0.2)'
                            }}
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        ) : null}
                      </div>
                      <div style={{ gridColumn: '1 / -1' }}>
                        <label style={{
                          fontWeight: 600,
                          color: '#667eea',
                          fontSize: '16px',
                          marginBottom: '8px',
                          display: 'block'
                        }}>Inline Images</label>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleMediaImageChange}
                          style={{ display: 'block' }}
                        />
                        {mediaImageFiles?.length ? (
                          <div style={{ marginTop: 8, color: '#475569', fontSize: 14 }}>
                            {mediaImageFiles.length} image file(s) selected
                          </div>
                        ) : null}
                      </div>
                      <div style={{ gridColumn: '1 / -1' }}>
                        <label style={{
                          fontWeight: 600,
                          color: '#667eea',
                          fontSize: '16px',
                          marginBottom: '8px',
                          display: 'block'
                        }}>Inline Videos</label>
                        <input
                          type="file"
                          accept="video/*"
                          multiple
                          onChange={handleMediaVideoChange}
                          style={{ display: 'block' }}
                        />
                        {mediaVideoFiles?.length ? (
                          <div style={{ marginTop: 8, color: '#475569', fontSize: 14 }}>
                            {mediaVideoFiles.length} video file(s) selected
                          </div>
                        ) : null}
                      </div>
                      <div style={{ gridColumn: '1 / -1' }}>
                        <label style={{
                          fontWeight: 600,
                          color: '#667eea',
                          fontSize: '16px',
                          marginBottom: '8px',
                          display: 'block'
                        }}>Video URL</label>
                        <input
                          type="text"
                          value={blogForm.video_url || ''}
                          onChange={e => setBlogForm((f: any) => ({ ...f, video_url: e.target.value }))}
                          placeholder="Optional external video URL for vlog posts"
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
                        />
                      </div>
                      <div>
                        <label style={{
                          fontWeight: 600,
                          color: '#667eea',
                          fontSize: '16px',
                          marginBottom: '8px',
                          display: 'block'
                        }}>Status</label>
                        <select
                          value={blogForm.status}
                          onChange={e => setBlogForm((f: any) => ({ ...f, status: e.target.value as 'active' | 'inactive' | 'published' | 'draft' | 'pending' | 'archived' | 'live' | 'scheduled' | 'private' | 'public' | 'review' | 'approved' | 'rejected' | 'trash' | 'deleted' }))}
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
                          onBlur={(e) => e.target.style.borderColor = 'rgba(102, 234, 0.2)'}
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                          <option value="published">Published</option>
                          <option value="draft">Draft</option>
                          <option value="pending">Pending</option>
                          <option value="archived">Archived</option>
                          <option value="live">Live</option>
                          <option value="scheduled">Scheduled</option>
                          <option value="private">Private</option>
                          <option value="public">Public</option>
                          <option value="review">Review</option>
                          <option value="approved">Approved</option>
                          <option value="rejected">Rejected</option>
                          <option value="trash">Trash</option>
                          <option value="deleted">Deleted</option>
                        </select>
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
                        {blogEditId ? 'Update' : 'Add'} Blog
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </section>
          
    </>
  );
}
