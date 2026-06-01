"use client";
import React from 'react';
import { FaChevronLeft, FaPlus } from "react-icons/fa";
import { getBlogCoverPhotoUrl, getBlogSlug } from '@/utils/blog';
import { useParams } from 'next/navigation';

export default function BlogsTab(props: any) {
  const params = useParams();
  const locale = params?.locale || 'en';

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
    handleToggleBlogStatus,
  } = props;

  const [editorLoaded, setEditorLoaded] = React.useState(false);
  const editorRef = React.useRef<any>(null);
  const editorTextAreaRef = React.useRef<HTMLTextAreaElement>(null);

  // Load CKEditor CDN script
  React.useEffect(() => {
    if (typeof window === 'undefined') return;

    if ((window as any).ClassicEditor) {
      setEditorLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdn.ckeditor.com/ckeditor5/41.1.0/classic/ckeditor.js';
    script.async = true;
    script.onload = () => {
      setEditorLoaded(true);
    };
    document.body.appendChild(script);
  }, []);

  // Initialize CKEditor
  React.useEffect(() => {
    if (!editorLoaded || !editorTextAreaRef.current || !showBlogModal) return;
    
    // Destroy previous instance if exists
    if (editorRef.current) {
      editorRef.current.destroy().then(() => {
        editorRef.current = null;
        initEditor();
      });
    } else {
      initEditor();
    }

    function initEditor() {
      if (!editorTextAreaRef.current) return;

      class Base64UploadAdapter {
        loader: any;
        constructor(loader: any) {
          this.loader = loader;
        }
        upload() {
          return this.loader.file
            .then((file: any) => new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => {
                resolve({ default: reader.result });
              };
              reader.onerror = (error) => {
                reject(error);
              };
              reader.readAsDataURL(file);
            }));
        }
        abort() {}
      }

      function Base64UploadAdapterPlugin(editor: any) {
        editor.plugins.get('FileRepository').createUploadAdapter = (loader: any) => {
          return new Base64UploadAdapter(loader);
        };
      }

      (window as any).ClassicEditor
        .create(editorTextAreaRef.current, {
          extraPlugins: [Base64UploadAdapterPlugin],
          toolbar: [
            'heading', '|',
            'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote', '|',
            'imageUpload', 'mediaEmbed', 'insertTable', 'undo', 'redo'
          ]
        })
        .then((editor: any) => {
          editorRef.current = editor;
          editor.setData(blogForm.description || '');
          
          editor.model.document.on('change:data', () => {
            const data = editor.getData();
            setBlogForm((f: any) => ({ ...f, description: data }));
          });
        })
        .catch((error: any) => {
          console.error('CKEditor initialization error:', error);
        });
    }

    return () => {
      if (editorRef.current) {
        editorRef.current.destroy().then(() => {
          editorRef.current = null;
        });
      }
    };
  }, [editorLoaded, showBlogModal, blogEditId]);

  if (showBlogModal) {
    return (
      <section style={{
        background: '#fff',
        borderRadius: '20px',
        padding: '40px',
        boxShadow: '0 10px 30px rgba(102, 126, 234, 0.08)',
        position: 'relative'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '32px'
        }}>
          <button
            onClick={() => setShowBlogModal(false)}
            style={{
              background: 'rgba(102, 126, 234, 0.1)',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '10px',
              color: '#667eea',
              fontWeight: 700,
              fontSize: '15px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(102, 126, 234, 0.18)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(102, 126, 234, 0.1)'}
          >
            <FaChevronLeft size={14} /> Back to List
          </button>
          <h2 style={{
            color: '#667eea',
            fontWeight: 700,
            fontSize: 'clamp(22px, 3.5vw, 28px)',
            margin: 0,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>{blogEditId ? 'Edit' : 'Create New'} Blog</h2>
        </div>

        <form
          onSubmit={handleBlogSubmit}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 28,
            maxWidth: '900px',
            margin: '0 auto'
          }}
        >
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{
              fontWeight: 600,
              color: '#667eea',
              fontSize: '15px',
              marginBottom: '10px',
              display: 'block'
            }}>Category</label>
            <select
              value={blogForm.category}
              onChange={e => setBlogForm((f: any) => ({ ...f, category: e.target.value as 'Therapy' | 'Mental Health' | 'Education' | 'Support' | 'Technology' }))}
              style={{
                padding: '14px 18px',
                borderRadius: '12px',
                border: '2px solid rgba(102, 126, 234, 0.15)',
                fontSize: '16px',
                width: '100%',
                background: '#fff',
                transition: 'all 0.2s ease',
                outline: 'none',
                color: '#334155'
              }}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(102, 126, 234, 0.15)'}
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
              fontSize: '15px',
              marginBottom: '10px',
              display: 'block'
            }}>Title</label>
            <input
              type="text"
              value={blogForm.title || ''}
              onChange={e => setBlogForm((f: any) => ({ ...f, title: e.target.value }))}
              required
              style={{
                padding: '14px 18px',
                borderRadius: '12px',
                border: '2px solid rgba(102, 126, 234, 0.15)',
                fontSize: '16px',
                width: '100%',
                background: '#fff',
                transition: 'all 0.2s ease',
                outline: 'none',
                color: '#334155'
              }}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(102, 126, 234, 0.15)'}
            />
          </div>

          <div>
            <label style={{
              fontWeight: 600,
              color: '#667eea',
              fontSize: '15px',
              marginBottom: '10px',
              display: 'block'
            }}>Author</label>
            <input
              type="text"
              value={blogForm.author || ''}
              onChange={e => setBlogForm((f: any) => ({ ...f, author: e.target.value }))}
              style={{
                padding: '14px 18px',
                borderRadius: '12px',
                border: '2px solid rgba(102, 126, 234, 0.15)',
                fontSize: '16px',
                width: '100%',
                background: '#fff',
                transition: 'all 0.2s ease',
                outline: 'none',
                color: '#334155'
              }}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(102, 126, 234, 0.15)'}
            />
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{
              fontWeight: 600,
              color: '#667eea',
              fontSize: '15px',
              marginBottom: '10px',
              display: 'block'
            }}>Description (CKEditor)</label>
            <div style={{ color: '#334155' }}>
              <textarea
                ref={editorTextAreaRef}
                style={{ display: 'none' }}
                defaultValue={blogForm.description || ''}
              />
              {!editorLoaded && (
                <div style={{ padding: '20px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', color: '#64748b' }}>
                  Loading CKEditor...
                </div>
              )}
            </div>
          </div>

          <div>
            <label style={{
              fontWeight: 600,
              color: '#667eea',
              fontSize: '15px',
              marginBottom: '10px',
              display: 'block'
            }}>Post Type</label>
            <select
              value={blogForm.post_type || 'blog'}
              onChange={e => setBlogForm((f: any) => ({ ...f, post_type: e.target.value as 'blog' | 'vlog' }))}
              style={{
                padding: '14px 18px',
                borderRadius: '12px',
                border: '2px solid rgba(102, 126, 234, 0.15)',
                fontSize: '16px',
                width: '100%',
                background: '#fff',
                transition: 'all 0.2s ease',
                outline: 'none',
                color: '#334155'
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
              fontSize: '15px',
              marginBottom: '10px',
              display: 'block'
            }}>Status</label>
            <select
              value={blogForm.status}
              onChange={e => setBlogForm((f: any) => ({ ...f, status: e.target.value as any }))}
              style={{
                padding: '14px 18px',
                borderRadius: '12px',
                border: '2px solid rgba(102, 126, 234, 0.15)',
                fontSize: '16px',
                width: '100%',
                background: '#fff',
                transition: 'all 0.2s ease',
                outline: 'none',
                color: '#334155'
              }}
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

          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{
              fontWeight: 600,
              color: '#667eea',
              fontSize: '15px',
              marginBottom: '10px',
              display: 'block'
            }}>Cover Photo Upload</label>
            <div style={{
              border: '2px dashed rgba(102, 126, 234, 0.25)',
              borderRadius: '16px',
              padding: '24px',
              textAlign: 'center',
              background: '#fafafa',
              marginBottom: '16px'
            }}>
              <input
                type="file"
                accept="image/*"
                onChange={handleCoverPhotoChange}
                style={{ display: 'block', margin: '0 auto' }}
              />
              <p style={{ margin: '12px 0 0', fontSize: '13px', color: '#64748b' }}>
                Upload a cover photo (max 5MB)
              </p>
            </div>

            <label style={{
              fontWeight: 600,
              color: '#667eea',
              fontSize: '15px',
              marginBottom: '10px',
              display: 'block'
            }}>Or Enter Cover Photo URL</label>
            <input
              type="text"
              value={blogForm.cover_photo || blogForm.thumbnail || ''}
              onChange={e => setBlogForm((f: any) => ({ ...f, cover_photo: e.target.value, thumbnail: e.target.value }))}
              placeholder="Enter cover photo URL (optional if uploading file)"
              style={{
                padding: '14px 18px',
                borderRadius: '12px',
                border: '2px solid rgba(102, 126, 234, 0.15)',
                fontSize: '16px',
                width: '100%',
                background: '#fff',
                transition: 'all 0.2s ease',
                outline: 'none',
                color: '#334155'
              }}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(102, 126, 234, 0.15)'}
            />

            {coverPhotoPreview ? (
              <div style={{ marginTop: '16px' }}>
                <span style={{ fontSize: '13px', color: '#64748b', display: 'block', marginBottom: '8px' }}>Cover Photo Preview:</span>
                <img
                  src={coverPhotoPreview}
                  alt="Cover preview"
                  style={{
                    width: '180px',
                    height: '110px',
                    objectFit: 'cover',
                    borderRadius: '12px',
                    border: '2px solid rgba(102, 126, 234, 0.15)'
                  }}
                  onError={(e) => {
                    e.currentTarget.src = '/intro.webp';
                  }}
                />
              </div>
            ) : null}
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{
              fontWeight: 600,
              color: '#667eea',
              fontSize: '15px',
              marginBottom: '10px',
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
              fontSize: '15px',
              marginBottom: '10px',
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
              fontSize: '15px',
              marginBottom: '10px',
              display: 'block'
            }}>Video URL (for Vlog posts)</label>
            <input
              type="text"
              value={blogForm.video_url || ''}
              onChange={e => setBlogForm((f: any) => ({ ...f, video_url: e.target.value }))}
              placeholder="Optional external video URL for vlog posts"
              style={{
                padding: '14px 18px',
                borderRadius: '12px',
                border: '2px solid rgba(102, 126, 234, 0.15)',
                fontSize: '16px',
                width: '100%',
                background: '#fff',
                transition: 'all 0.2s ease',
                outline: 'none',
                color: '#334155'
              }}
            />
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
              minWidth: '240px',
              transition: 'all 0.2s ease',
              boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            {blogEditId ? 'Update' : 'Publish'} Blog
          </button>
        </form>
      </section>
    );
  }

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
            {
              key: 'status',
              label: 'Status',
              sortable: true,
              render: (value: string, row: any) => {
                const isActive = value === 'active' || value === 'published' || value === 'live';
                return (
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={() => handleToggleBlogStatus(row)}
                      style={{ width: 32, height: 18, cursor: 'pointer' }}
                    />
                    <span style={{ color: isActive ? '#38a169' : '#e53e3e', fontWeight: 600, textTransform: 'capitalize' }}>
                      {value}
                    </span>
                  </label>
                );
              }
            },
            {
              key: 'created_at',
              label: 'Created',
              sortable: true,
              render: (value: string) => value ? value.split('T')[0] : '-'
            }
          ]}
          onView={(blog: any) => {
            window.open(`/${locale}/resources/blog/${getBlogSlug(blog)}`, '_blank');
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
      </section>
    </>
  );
}
