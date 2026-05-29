"use client";
import React from 'react';
import Image from 'next/image';
import { FaThLarge, FaList, FaTags, FaUserCircle, FaSignOutAlt, FaChevronLeft, FaChevronRight, FaUserMd, FaChevronDown, FaSearch, FaEdit, FaTrash, FaPlus, FaEye, FaImages, FaCog } from "react-icons/fa";
import Select from "react-select";

export default function ServicesTab(props: any) {
  const {
    DataTable,
    services = [],
    consultants = [],
    categories = [],
    subcategories = [],
    serviceForm,
    serviceEditId,
    setServiceEditId,
    setServiceForm,
    setShowServiceModal,
    showServiceModal,
    showServiceProfileModal,
    setShowServiceProfileModal,
    serviceProfile,
    handleServiceProfile,
    handleServiceEdit,
    handleServiceDelete,
    handleServiceSubmit,
    handleServiceFormChange,
    handleEventImageChange,
    generateMeetLink,
    handleSuggestionChange,
    handleRemoveSuggestion,
    handleAddSuggestion,
    getImageUrl
  } = props;

  // Derived options for react-select components
  const consultantOptions = consultants?.map((c: any) => ({
    value: String(c.id),
    label: c.name || c.email || 'Consultant'
  })) || [];

  const categoryOptions = categories?.map((cat: any) => ({
    value: String(cat.id),
    label: cat.name
  })) || [];

  const subcategoryOptions = subcategories
    ?.filter((sub: any) => serviceForm.category_ids?.includes(String(sub.category_id)))
    ?.map((sub: any) => ({
      value: String(sub.id),
      label: sub.name
    })) || [];

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
                }}>Manage Services</h2>
                <button
                  onClick={() => {
                    setServiceForm({
                      name: '',
                      description: '',
                      delivery_mode: 'online',
                      service_type: 'appointment',
                      appointment_type: '',
                      consultant_ids: [],
                      subscription_start: '',
                      subscription_end: '',
                      discount: '',
                      monthly_price: '',
                      yearly_price: '',
                      center: '',
                      center_address: '',
                      event_start: '',
                      event_end: '',
                      event_image: null,
                      event_meet_link: '',
                      test_type: '',
                      test_redirect_url: '',
                      price: '',
                      category_ids: [],
                      subcategory_ids: [],
                      suggestions: [{ title: '', description: '', redirect_url: '' }],
                      event_type: '',
                      revenue_type: '',
                      renewal_date: '',
                      center_lat: '',
                      center_lng: ''
                    });
                    setServiceEditId(null);
                    setShowServiceModal(true);
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
                  <FaPlus size={16} /> Add Service
                </button>
              </div>

              <DataTable
                data={services}
                columns={[
                  { key: 'name', label: 'Name', sortable: true },
                  { key: 'service_type', label: 'Type', sortable: true },
                  { key: 'delivery_mode', label: 'Delivery', sortable: true },
                  {
                    key: 'price',
                    label: 'Price',
                    sortable: true,
                    render: (value: any) => value ? `$${value}` : '-'
                  },
                  {
                    key: 'created_at',
                    label: 'Created',
                    sortable: true,
                    render: (value: any) => value ? value.split('T')[0] : '-'
                  }
                ]}
                onView={(service: any) => {
                  if (service.id !== undefined) {
                    handleServiceProfile(service.id);
                  }
                }}
                onEdit={(service: any) => {
                  handleServiceEdit(service);
                  setShowServiceModal(true);
                }}
                onDelete={(service: any) => {
                  if (service.id !== undefined) {
                    handleServiceDelete(service.id);
                  }
                }}
                searchPlaceholder="Search services..."
                title="Services"
              />

              {/* Service Profile Modal */}
              {showServiceProfileModal && serviceProfile && (
                <div style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  width: '100vw',
                  height: '100vh',
                  background: 'rgba(0,0,0,0.35)',
                  zIndex: 1000,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <div style={{ background: '#fff', borderRadius: 12, padding: 32, minWidth: 400, maxWidth: 600, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 2px 12px #e2e8f0', position: 'relative' }}>
                    <button onClick={() => setShowServiceProfileModal(false)} style={{ position: 'absolute', top: 12, right: 12, background: '#e2e8f0', border: 'none', borderRadius: 6, padding: '4px 12px', fontWeight: 700, cursor: 'pointer' }}>Close</button>
                    <h2 style={{ fontWeight: 700, color: '#22543d', marginBottom: 12 }}>{serviceProfile.name}</h2>
                    <div style={{ marginBottom: 8 }}><b>Type:</b> {serviceProfile.service_type}</div>
                    <div style={{ marginBottom: 8 }}><b>Delivery:</b> {serviceProfile.delivery_mode}</div>
                    <div style={{ marginBottom: 8 }}><b>Description:</b> {serviceProfile.description}</div>
                    <div style={{ marginBottom: 8 }}><b>Price:</b> {serviceProfile.price}</div>
                    <div style={{ marginBottom: 8 }}><b>Revenue Type:</b> {serviceProfile.revenue_type}</div>
                    {serviceProfile.service_type === 'subscription' && (
                      <>
                        <div style={{ marginBottom: 8 }}><b>Subscription Start:</b> {serviceProfile.subscription_start}</div>
                        <div style={{ marginBottom: 8 }}><b>Subscription End:</b> {serviceProfile.subscription_end}</div>
                        <div style={{ marginBottom: 8 }}><b>Discount:</b> {serviceProfile.discount}</div>
                        <div style={{ marginBottom: 8 }}><b>Monthly Price:</b> {serviceProfile.monthly_price}</div>
                        <div style={{ marginBottom: 8 }}><b>Yearly Price:</b> {serviceProfile.yearly_price}</div>
                        <div style={{ marginBottom: 8 }}><b>Center Name:</b> {serviceProfile.center}</div>
                        <div style={{ marginBottom: 8 }}><b>Center Address:</b> {serviceProfile.center_address}</div>
                        <div style={{ marginBottom: 8 }}><b>Center Location:</b> {serviceProfile.center_lat}, {serviceProfile.center_lng}</div>
                      </>
                    )}
                    {serviceProfile.service_type === 'event' && (
                      <>
                        <div style={{ marginBottom: 8 }}><b>Event Type:</b> {serviceProfile.event_type}</div>
                        <div style={{ marginBottom: 8 }}><b>Event Start:</b> {serviceProfile.event_start}</div>
                        <div style={{ marginBottom: 8 }}><b>Event End:</b> {serviceProfile.event_end}</div>
                        <div style={{ marginBottom: 8 }}><b>Event Image:</b> {serviceProfile.event_image && (<img src={serviceProfile.event_image} alt="Event" style={{ maxWidth: 180, maxHeight: 120, display: 'block', marginTop: 6 }} />)}</div>
                        <div style={{ marginBottom: 8 }}><b>Google Meet Link:</b> {serviceProfile.event_meet_link}</div>
                        <div style={{ marginBottom: 8 }}><b>Center Name:</b> {serviceProfile.center}</div>
                        <div style={{ marginBottom: 8 }}><b>Center Address:</b> {serviceProfile.center_address}</div>
                        <div style={{ marginBottom: 8 }}><b>Center Location:</b> {serviceProfile.center_lat}, {serviceProfile.center_lng}</div>
                      </>
                    )}
                    <div style={{ marginBottom: 8 }}><b>Created:</b> {serviceProfile.created_at ? new Date(serviceProfile.created_at).toLocaleString() : ''}</div>
                  </div>
                </div>
              )}








              
              {/* Service Modal */}
              {showServiceModal && (
                <div 
                id="serviceModal"
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  width: '100vw',
                  height: '100vh',
                  background: 'rgba(0,0,0,0.5)',
                  zIndex: 1000,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '20px'
                }} onClick={e => { if (e.target === e.currentTarget) setShowServiceModal(false); }}>
                  <div style={{
                    background: '#fff',
                    borderRadius: '16px',
                    padding: '32px',
                    width: '100%',
                    maxWidth: '90vw',
                    maxHeight: '90vh',
                    overflowY: 'auto',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                    position: 'relative'
                  }}>
                    <button onClick={() => setShowServiceModal(false)} aria-label="Close service modal" style={{
                      position: 'absolute',
                      top: '16px',
                      right: '20px',
                      background: 'none',
                      border: 'none',
                      fontSize: '24px',
                      cursor: 'pointer',
                      color: '#6b7280',
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '50%',
                      transition: 'all 0.2s ease'
                    }} onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>×</button>

                    <h2 style={{
                      fontSize: 'clamp(20px, 3vw, 28px)',
                      fontWeight: 700,
                      color: '#667eea',
                      marginBottom: '32px',
                      textAlign: 'center',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}>{serviceEditId ? 'Edit' : 'Add'} Service</h2>

                    <form onSubmit={handleServiceSubmit} style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '24px'
                    }}>
                      {/* Basic Information */}
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '24px'
                      }}>
                        <div>
                          <label style={{
                            display: 'block',
                            fontWeight: 600,
                            color: '#374151',
                            marginBottom: '8px',
                            fontSize: '14px'
                          }}>Name *</label>
                          <input
                            name="name"
                            type="text"
                            value={serviceForm.name}
                            onChange={handleServiceFormChange}
                            required
                            style={{
                              width: '100%',
                              padding: '12px 16px',
                              borderRadius: '8px',
                              border: '1px solid #d1d5db',
                              fontSize: '14px',
                              transition: 'all 0.2s ease'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#667eea'}
                            onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                          />
                        </div>

                        <div>
                          <label style={{
                            display: 'block',
                            fontWeight: 600,
                            color: '#374151',
                            marginBottom: '8px',
                            fontSize: '14px'
                          }}>Delivery Mode</label>
                          <select
                            name="delivery_mode"
                            value={serviceForm.delivery_mode}
                            onChange={handleServiceFormChange}
                            style={{
                              width: '100%',
                              padding: '12px 16px',
                              borderRadius: '8px',
                              border: '1px solid #d1d5db',
                              fontSize: '14px',
                              transition: 'all 0.2s ease'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#667eea'}
                            onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                          >
                            <option value="online">Online</option>
                            <option value="offline">Offline</option>
                          </select>
                        </div>

                        <div>
                          <label style={{
                            display: 'block',
                            fontWeight: 600,
                            color: '#374151',
                            marginBottom: '8px',
                            fontSize: '14px'
                          }}>Service Type</label>
                          <select
                            name="service_type"
                            value={serviceForm.service_type}
                            onChange={handleServiceFormChange}
                            style={{
                              width: '100%',
                              padding: '12px 16px',
                              borderRadius: '8px',
                              border: '1px solid #d1d5db',
                              fontSize: '14px',
                              transition: 'all 0.2s ease'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#667eea'}
                            onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                          >
                            <option value="appointment">Appointment</option>
                            <option value="subscription">Subscription</option>
                            <option value="event">Event</option>
                            <option value="test">Test</option>
                          </select>
                        </div>

                        <div>
                          <label style={{
                            display: 'block',
                            fontWeight: 600,
                            color: '#374151',
                            marginBottom: '8px',
                            fontSize: '14px'
                          }}>Price</label>
                          <input
                            name="price"
                            type="number"
                            value={serviceForm.price}
                            onChange={handleServiceFormChange}
                            style={{
                              width: '100%',
                              padding: '12px 16px',
                              borderRadius: '8px',
                              border: '1px solid #d1d5db',
                              fontSize: '14px',
                              transition: 'all 0.2s ease'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#667eea'}
                            onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                          />
                        </div>
                      </div>

                      <div>
                        <label style={{
                          display: 'block',
                          fontWeight: 600,
                          color: '#374151',
                          marginBottom: '8px',
                          fontSize: '14px'
                        }}>Description</label>
                        <textarea
                          name="description"
                          value={serviceForm.description}
                          onChange={handleServiceFormChange}
                          rows={4}
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            borderRadius: '8px',
                            border: '1px solid #d1d5db',
                            fontSize: '14px',
                            transition: 'all 0.2s ease',
                            resize: 'vertical'
                          }}
                          onFocus={(e) => e.target.style.borderColor = '#667eea'}
                          onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                        />
                      </div>

                      {/* Service Type Specific Fields */}
                      {serviceForm.service_type === 'appointment' && (
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                          gap: '24px'
                        }}>
                          <div>
                            <label style={{
                              display: 'block',
                              fontWeight: 600,
                              color: '#374151',
                              marginBottom: '8px',
                              fontSize: '14px'
                            }}>Appointment Type</label>
                            <select
                              name="appointment_type"
                              value={serviceForm.appointment_type}
                              onChange={handleServiceFormChange}
                              style={{
                                width: '100%',
                                padding: '12px 16px',
                                borderRadius: '8px',
                                border: '1px solid #d1d5db',
                                fontSize: '14px',
                                transition: 'all 0.2s ease'
                              }}
                              onFocus={(e) => e.target.style.borderColor = '#667eea'}
                              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                            >
                              <option value="">Select</option>
                              <option value="consultation">Consultation</option>
                              <option value="therapy">Therapy</option>
                            </select>
                          </div>

                          <div>
                            <label style={{
                              display: 'block',
                              fontWeight: 600,
                              color: '#374151',
                              marginBottom: '8px',
                              fontSize: '14px'
                            }}>Consultants</label>


                            <Select
                                isMulti
                                options={consultantOptions || []}
                                value={(consultantOptions || []).filter((option: any) => 
                                  serviceForm.consultant_ids?.map(String).includes(String(option.value))
                                )}
                                onChange={(selected: any) =>
                                  setServiceForm((prev: any) => ({
                                    ...prev,
                                    consultant_ids: selected
                                      ? selected.map((s: any) => s.value)
                                      : []
                                  }))
                                }
                              />

                            {/*<Select 
                              name="consultant_ids"
                              className="react-select"
                              classNamePrefix="react-select"
                              isMulti
                              placeholder=""
                              isClearable={false}
                              options={consultants.map((c: any) => ({
                                value: String(c.id),
                                label: `${c.name} (${c.email})`
                              }))}

                              value={consultants
                                .filter((c: any) => serviceForm.consultant_ids.includes(String(c.id))
                                )
                                .map((c: any) => ({
                                  value: String(c.id),
                                  label: `${c.name} (${c.email})`
                                }))
                              }

                              onChange={(selected: any) =>
                                setServiceForm((prev: any) => ({
                                  ...prev,
                                  consultant_ids: selected
                                    ? selected.map((s: any) => s.value)
                                    : []
                                }))
                              }
                            />

                           {/* <select
                              name="consultant_ids"
                              multiple
                              value={serviceForm.consultant_ids?.map(String) || []}
                              onChange={handleServiceFormChange}
                              style={{
                                width: '100%',
                                padding: '12px 16px',
                                borderRadius: '8px',
                                border: '1px solid #d1d5db',
                                fontSize: '14px',
                                transition: 'all 0.2s ease',
                                minHeight: '120px'
                              }}
                              onFocus={(e) => e.target.style.borderColor = '#667eea'}
                              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                            >
                              {consultants.map((c: any) => (
                                <option key={c.id} value={c.id}>{c.name} ({c.email})</option>
                              ))}
                            </select> */}
                          </div>
                        </div>
                      )}

                      {serviceForm.service_type === 'subscription' && (
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                          gap: '24px'
                        }}>
                          <div>
                            <label style={{
                              display: 'block',
                              fontWeight: 600,
                              color: '#374151',
                              marginBottom: '8px',
                              fontSize: '14px'
                            }}>Subscription Start Date</label>
                            <input
                              type="date"
                              name="subscription_start"
                              value={serviceForm.subscription_start || ''}
                              onChange={handleServiceFormChange}
                              style={{
                                width: '100%',
                                padding: '12px 16px',
                                borderRadius: '8px',
                                border: '1px solid #d1d5db',
                                fontSize: '14px',
                                transition: 'all 0.2s ease'
                              }}
                              onFocus={(e) => e.target.style.borderColor = '#667eea'}
                              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                            />
                          </div>

                          <div>
                            <label style={{
                              display: 'block',
                              fontWeight: 600,
                              color: '#374151',
                              marginBottom: '8px',
                              fontSize: '14px'
                            }}>Subscription End Date</label>
                            <input
                              type="date"
                              name="subscription_end"
                              value={serviceForm.subscription_end || ''}
                              onChange={handleServiceFormChange}
                              style={{
                                width: '100%',
                                padding: '12px 16px',
                                borderRadius: '8px',
                                border: '1px solid #d1d5db',
                                fontSize: '14px',
                                transition: 'all 0.2s ease'
                              }}
                              onFocus={(e) => e.target.style.borderColor = '#667eea'}
                              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                            />
                          </div>

                          <div>
                            <label style={{
                              display: 'block',
                              fontWeight: 600,
                              color: '#374151',
                              marginBottom: '8px',
                              fontSize: '14px'
                            }}>Discount (%)</label>
                            <input
                              type="number"
                              name="discount"
                              value={serviceForm.discount || ''}
                              onChange={handleServiceFormChange}
                              min={0}
                              max={100}
                              style={{
                                width: '100%',
                                padding: '12px 16px',
                                borderRadius: '8px',
                                border: '1px solid #d1d5db',
                                fontSize: '14px',
                                transition: 'all 0.2s ease'
                              }}
                              onFocus={(e) => e.target.style.borderColor = '#667eea'}
                              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                            />
                          </div>

                          <div>
                            <label style={{
                              display: 'block',
                              fontWeight: 600,
                              color: '#374151',
                              marginBottom: '8px',
                              fontSize: '14px'
                            }}>Monthly Price</label>
                            <input
                              type="number"
                              name="monthly_price"
                              value={serviceForm.monthly_price || ''}
                              onChange={handleServiceFormChange}
                              min={0}
                              style={{
                                width: '100%',
                                padding: '12px 16px',
                                borderRadius: '8px',
                                border: '1px solid #d1d5db',
                                fontSize: '14px',
                                transition: 'all 0.2s ease'
                              }}
                              onFocus={(e) => e.target.style.borderColor = '#667eea'}
                              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                            />
                          </div>

                          <div>
                            <label style={{
                              display: 'block',
                              fontWeight: 600,
                              color: '#374151',
                              marginBottom: '8px',
                              fontSize: '14px'
                            }}>Yearly Price</label>
                            <input
                              type="number"
                              name="yearly_price"
                              value={serviceForm.yearly_price || ''}
                              onChange={handleServiceFormChange}
                              min={0}
                              style={{
                                width: '100%',
                                padding: '12px 16px',
                                borderRadius: '8px',
                                border: '1px solid #d1d5db',
                                fontSize: '14px',
                                transition: 'all 0.2s ease'
                              }}
                              onFocus={(e) => e.target.style.borderColor = '#667eea'}
                              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                            />
                          </div>

                          <div>
                            <label style={{
                              display: 'block',
                              fontWeight: 600,
                              color: '#374151',
                              marginBottom: '8px',
                              fontSize: '14px'
                            }}>Center Name</label>
                            <input
                              type="text"
                              name="center"
                              value={serviceForm.center || ''}
                              onChange={handleServiceFormChange}
                              style={{
                                width: '100%',
                                padding: '12px 16px',
                                borderRadius: '8px',
                                border: '1px solid #d1d5db',
                                fontSize: '14px',
                                transition: 'all 0.2s ease'
                              }}
                              onFocus={(e) => e.target.style.borderColor = '#667eea'}
                              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                            />
                          </div>

                          <div>
                            <label style={{
                              display: 'block',
                              fontWeight: 600,
                              color: '#374151',
                              marginBottom: '8px',
                              fontSize: '14px'
                            }}>Center Address</label>
                            <input
                              type="text"
                              name="center_address"
                              value={serviceForm.center_address || ''}
                              onChange={handleServiceFormChange}
                              style={{
                                width: '100%',
                                padding: '12px 16px',
                                borderRadius: '8px',
                                border: '1px solid #d1d5db',
                                fontSize: '14px',
                                transition: 'all 0.2s ease'
                              }}
                              onFocus={(e) => e.target.style.borderColor = '#667eea'}
                              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                            />
                          </div>
                        </div>
                      )}

                      {serviceForm.service_type === 'event' && (
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                          gap: '24px'
                        }}>
                          <div>
                            <label style={{
                              display: 'block',
                              fontWeight: 600,
                              color: '#374151',
                              marginBottom: '8px',
                              fontSize: '14px'
                            }}>Event Start Date & Time</label>
                            <input
                              type="datetime-local"
                              name="event_start"
                              value={serviceForm.event_start || ''}
                              onChange={handleServiceFormChange}
                              style={{
                                width: '100%',
                                padding: '12px 16px',
                                borderRadius: '8px',
                                border: '1px solid #d1d5db',
                                fontSize: '14px',
                                transition: 'all 0.2s ease'
                              }}
                              onFocus={(e) => e.target.style.borderColor = '#667eea'}
                              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                            />
                          </div>

                          <div>
                            <label style={{
                              display: 'block',
                              fontWeight: 600,
                              color: '#374151',
                              marginBottom: '8px',
                              fontSize: '14px'
                            }}>Event End Date & Time</label>
                            <input
                              type="datetime-local"
                              name="event_end"
                              value={serviceForm.event_end || ''}
                              onChange={handleServiceFormChange}
                              style={{
                                width: '100%',
                                padding: '12px 16px',
                                borderRadius: '8px',
                                border: '1px solid #d1d5db',
                                fontSize: '14px',
                                transition: 'all 0.2s ease'
                              }}
                              onFocus={(e) => e.target.style.borderColor = '#667eea'}
                              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                            />
                          </div>

                          <div>
                            <label style={{
                              display: 'block',
                              fontWeight: 600,
                              color: '#374151',
                              marginBottom: '8px',
                              fontSize: '14px'
                            }}>Event Image</label>
                            <input
                              type="file"
                              name="event_image"
                              accept="image/*"
                              onChange={handleEventImageChange}
                              style={{
                                width: '100%',
                                padding: '12px 16px',
                                borderRadius: '8px',
                                border: '1px solid #d1d5db',
                                fontSize: '14px',
                                transition: 'all 0.2s ease'
                              }}
                            />
                          </div>

                          <div>
                            <label style={{
                              display: 'block',
                              fontWeight: 600,
                              color: '#374151',
                              marginBottom: '8px',
                              fontSize: '14px'
                            }}>Center Name</label>
                            <input
                              type="text"
                              name="center"
                              value={serviceForm.center || ''}
                              onChange={handleServiceFormChange}
                              style={{
                                width: '100%',
                                padding: '12px 16px',
                                borderRadius: '8px',
                                border: '1px solid #d1d5db',
                                fontSize: '14px',
                                transition: 'all 0.2s ease'
                              }}
                              onFocus={(e) => e.target.style.borderColor = '#667eea'}
                              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                            />
                          </div>

                          <div>
                            <label style={{
                              display: 'block',
                              fontWeight: 600,
                              color: '#374151',
                              marginBottom: '8px',
                              fontSize: '14px'
                            }}>Center Address</label>
                            <input
                              type="text"
                              name="center_address"
                              value={serviceForm.center_address || ''}
                              onChange={handleServiceFormChange}
                              style={{
                                width: '100%',
                                padding: '12px 16px',
                                borderRadius: '8px',
                                border: '1px solid #d1d5db',
                                fontSize: '14px',
                                transition: 'all 0.2s ease'
                              }}
                              onFocus={(e) => e.target.style.borderColor = '#667eea'}
                              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                            />
                          </div>

                          {serviceForm.delivery_mode === 'online' && (
                            <div>
                              <label style={{
                                display: 'block',
                                fontWeight: 600,
                                color: '#374151',
                                marginBottom: '8px',
                                fontSize: '14px'
                              }}>Google Meet Link</label>
                              <input
                                type="text"
                                name="event_meet_link"
                                value={generateMeetLink()}
                                readOnly
                                style={{
                                  width: '100%',
                                  padding: '12px 16px',
                                  borderRadius: '8px',
                                  border: '1px solid #d1d5db',
                                  fontSize: '14px',
                                  background: '#f9fafb',
                                  color: '#6b7280'
                                }}
                              />
                            </div>
                          )}
                        </div>
                      )}

                      {serviceForm.service_type === 'test' && (
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                          gap: '24px'
                        }}>
                          <div>
                            <label style={{
                              display: 'block',
                              fontWeight: 600,
                              color: '#374151',
                              marginBottom: '8px',
                              fontSize: '14px'
                            }}>Test Type</label>
                            <select
                              name="test_type"
                              value={serviceForm.test_type}
                              onChange={handleServiceFormChange}
                              style={{
                                width: '100%',
                                padding: '12px 16px',
                                borderRadius: '8px',
                                border: '1px solid #d1d5db',
                                fontSize: '14px',
                                transition: 'all 0.2s ease'
                              }}
                              onFocus={(e) => e.target.style.borderColor = '#667eea'}
                              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                            >
                              <option value="">Select</option>
                              <option value="online">Online</option>
                              <option value="offline">Offline</option>
                            </select>
                          </div>

                          {serviceForm.test_type === 'online' && (
                            <div>
                              <label style={{
                                display: 'block',
                                fontWeight: 600,
                                color: '#374151',
                                marginBottom: '8px',
                                fontSize: '14px'
                              }}>Test Redirect URL</label>
                              <input
                                name="test_redirect_url"
                                value={serviceForm.test_redirect_url || ''}
                                onChange={handleServiceFormChange}
                                style={{
                                  width: '100%',
                                  padding: '12px 16px',
                                  borderRadius: '8px',
                                  border: '1px solid #d1d5db',
                                  fontSize: '14px',
                                  transition: 'all 0.2s ease'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                              />
                            </div>
                          )}

                          {serviceForm.test_type === 'offline' && (
                            <>
                              <div>
                                <label style={{
                                  display: 'block',
                                  fontWeight: 600,
                                  color: '#374151',
                                  marginBottom: '8px',
                                  fontSize: '14px'
                                }}>Center Name</label>
                                <input
                                  type="text"
                                  name="center"
                                  value={serviceForm.center || ''}
                                  onChange={handleServiceFormChange}
                                  style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    borderRadius: '8px',
                                    border: '1px solid #d1d5db',
                                    fontSize: '14px',
                                    transition: 'all 0.2s ease'
                                  }}
                                  onFocus={(e) => e.target.style.borderColor = '#667eea'}
                                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                                />
                              </div>

                              <div>
                                <label style={{
                                  display: 'block',
                                  fontWeight: 600,
                                  color: '#374151',
                                  marginBottom: '8px',
                                  fontSize: '14px'
                                }}>Center Address</label>
                                <input
                                  type="text"
                                  name="center_address"
                                  value={serviceForm.center_address || ''}
                                  onChange={handleServiceFormChange}
                                  style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    borderRadius: '8px',
                                    border: '1px solid #d1d5db',
                                    fontSize: '14px',
                                    transition: 'all 0.2s ease'
                                  }}
                                  onFocus={(e) => e.target.style.borderColor = '#667eea'}
                                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                                />
                              </div>
                            </>
                          )}
                        </div>
                      )}

                      {/* Categories and Subcategories */}
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '24px'
                      }}>
                        <div>
                          <label style={{
                            display: 'block',
                            fontWeight: 600,
                            color: '#374151',
                            marginBottom: '8px',
                            fontSize: '14px'
                          }}>Categories</label>

                          <Select
                            isMulti
                            options={categoryOptions || []}
                            value={(categoryOptions || []).filter((option: any) => 
                              serviceForm.category_ids?.map(String).includes(String(option.value))
                            )}
                            onChange={(selected: any) =>
                              setServiceForm((prev: any) => ({
                                ...prev,
                                category_ids: selected
                                  ? selected.map((s: any) => s.value)
                                  : [],
                                subcategory_ids: []
                              }))
                            }
                          />

                          {/*<Select
                              name="category_ids"
                              isMulti
                              placeholder={null}

                              options={categories.map((cat: any) => ({
                                value: String(cat.id),
                                label: cat.name
                              }))}
                              onChange={(selected: any) =>
                                setServiceForm((prev: any) => ({
                                  ...prev,
                                  category_ids: selected ? selected.map((s: any) => s.value) : []
                                }))
                              }
                            />

                          {/*<select
                            ref={categoryRef}
                            name="category_ids"
                            multiple
                            // value={serviceForm.category_ids?.map(String) || []}
                            value={serviceForm.category_ids}
                            onChange={handleServiceFormChange}
                            style={{
                              width: '100%',
                              padding: '12px 16px',
                              borderRadius: '8px',
                              border: '1px solid #d1d5db',
                              fontSize: '14px',
                              transition: 'all 0.2s ease',
                              minHeight: '120px'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#667eea'}
                            onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                          >
                            {categories.map((cat: any) => (
                              // <option key={cat.id} value={cat.id}>{cat.name}</option>
                              <option key={cat.id} value={String(cat.id)}>{cat.name}</option>

                            ))}
                          </select> */}



                         
                        </div>

                        <div>
                          <label style={{
                            display: 'block',
                            fontWeight: 600,
                            color: '#374151',
                            marginBottom: '8px',
                            fontSize: '14px'
                          }}>Subcategories</label>

                          <Select
                            isMulti
                            options={subcategoryOptions || []}
                            value={(subcategoryOptions || []).filter((option: any) => 
                              serviceForm.subcategory_ids?.map(String).includes(String(option.value))
                            )}
                            onChange={(selected: any) =>
                              setServiceForm((prev: any) => ({
                                ...prev,
                                subcategory_ids: selected
                                  ? selected.map((s: any) => s.value)
                                  : []
                              }))
                            }
                          />

                          {/*<Select
                            name="subcategory_ids"
                            isMulti
                            placeholder={null}
                            options={subcategories
                              .filter((sub: any) => serviceForm.category_ids.includes(String(sub.category_id))
                              )
                              .map((sub: any) => ({
                                value: String(sub.id),
                                label: sub.name
                              }))
                            }

                            value={subcategories
                              .filter((sub: any) => serviceForm.subcategory_ids.includes(String(sub.id))
                              )
                              .map((sub: any) => ({
                                value: String(sub.id),
                                label: sub.name
                              }))
                            }

                            onChange={(selected: any) =>
                              setServiceForm((prev: any) => ({
                                ...prev,
                                subcategory_ids: selected
                                  ? selected.map((s: any) => s.value)
                                  : []
                              }))
                            }
                          />

                          {/*<select
                            name="subcategory_ids"
                            multiple
                            value={serviceForm.subcategory_ids?.map(String) || []}
                            onChange={handleServiceFormChange}
                            style={{
                              width: '100%',
                              padding: '12px 16px',
                              borderRadius: '8px',
                              border: '1px solid #d1d5db',
                              fontSize: '14px',
                              transition: 'all 0.2s ease',
                              minHeight: '120px'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#667eea'}
                            onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                          >
                            {subcategories
                              .filter((s: any) => Array.isArray(serviceForm.category_ids) ? serviceForm.category_ids.map(Number).includes(Number(s.category_id)) : true)
                              .map((sub: any) => (
                                <option key={sub.id} value={sub.id}>{sub.name}</option>
                              ))}
                          </select> */}
                        </div>
                      </div>

                      {/* Call to Action Suggestions */}
                      <div>
                        <label style={{
                          display: 'block',
                          fontWeight: 600,
                          color: '#374151',
                          marginBottom: '16px',
                          fontSize: '14px'
                        }}>Call to Action Suggestions (max 5)</label>
                        {serviceForm.suggestions.map((s: any, idx: number) => (
                          <div key={idx} style={{
                            background: '#f9fafb',
                            borderRadius: '12px',
                            padding: '20px',
                            marginBottom: '16px',
                            border: '1px solid #e5e7eb'
                          }}>
                            <div style={{
                              display: 'grid',
                              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                              gap: '16px',
                              marginBottom: '16px'
                            }}>
                              <input
                                type="text"
                                placeholder="Title"
                                value={s.title}
                                onChange={e => handleSuggestionChange(idx, 'title', e.target.value)}
                                style={{
                                  width: '100%',
                                  padding: '12px 16px',
                                  borderRadius: '8px',
                                  border: '1px solid #d1d5db',
                                  fontSize: '14px',
                                  transition: 'all 0.2s ease'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                              />
                              <input
                                type="url"
                                placeholder="Redirect URL"
                                value={s.redirect_url}
                                onChange={e => handleSuggestionChange(idx, 'redirect_url', e.target.value)}
                                style={{
                                  width: '100%',
                                  padding: '12px 16px',
                                  borderRadius: '8px',
                                  border: '1px solid #d1d5db',
                                  fontSize: '14px',
                                  transition: 'all 0.2s ease'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                              />
                            </div>
                            <textarea
                              placeholder="Description"
                              value={s.description}
                              onChange={e => handleSuggestionChange(idx, 'description', e.target.value)}
                              rows={3}
                              style={{
                                width: '100%',
                                padding: '12px 16px',
                                borderRadius: '8px',
                                border: '1px solid #d1d5db',
                                fontSize: '14px',
                                transition: 'all 0.2s ease',
                                resize: 'vertical'
                              }}
                              onFocus={(e) => e.target.style.borderColor = '#667eea'}
                              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                            />
                            {serviceForm.suggestions.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveSuggestion(idx)}
                                style={{
                                  background: '#ef4444',
                                  color: '#fff',
                                  border: 'none',
                                  borderRadius: '8px',
                                  padding: '8px 16px',
                                  fontWeight: 600,
                                  fontSize: '14px',
                                  cursor: 'pointer',
                                  marginTop: '12px',
                                  transition: 'all 0.2s ease'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = '#dc2626'}
                                onMouseLeave={(e) => e.currentTarget.style.background = '#ef4444'}
                              >
                                Remove Suggestion
                              </button>
                            )}
                          </div>
                        ))}
                        {serviceForm.suggestions.length < 5 && (
                          <button
                            type="button"
                            onClick={() => handleAddSuggestion()}
                            style={{
                              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                              color: '#fff',
                              border: 'none',
                              borderRadius: '12px',
                              padding: '12px 24px',
                              fontWeight: 600,
                              fontSize: '14px',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                          >
                            + Add Suggestion
                          </button>
                        )}
                      </div>

                    <div style={{
                      display: 'flex',
                      justifyContent: 'center',
                      gap: '16px',
                      marginTop: '32px',
                      paddingTop: '24px',
                      borderTop: '1px solid #e5e7eb'
                    }}>
                      <button
                        type="submit"
                        style={{
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '12px',
                          padding: '16px 32px',
                          fontWeight: 700,
                          fontSize: '16px',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                          minWidth: '140px'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                      >
                        {serviceEditId ? 'Update' : 'Add'} Service
                      </button>
                      {serviceEditId && (
                        <button
                          type="button"
                          onClick={() => {
                            setServiceForm({
                              name: '',
                              description: '',
                              delivery_mode: 'online',
                              service_type: 'appointment',
                              appointment_type: '',
                              subscription_start: '',
                              subscription_end: '',
                              discount: '',
                              monthly_price: '',
                              yearly_price: '',
                              center: '',
                              center_address: '',
                              event_start: '',
                              event_end: '',
                              event_image: null,
                              event_meet_link: '',
                              test_type: '',
                              test_redirect_url: '',
                              price: '',
                              consultant_ids: [],
                              category_ids: [],
                              subcategory_ids: [],
                              suggestions: [{ title: '', description: '', redirect_url: '' }],
                              event_type: '',
                              revenue_type: '',
                              renewal_date: '',
                              center_lat: '',
                              center_lng: ''
                            });
                            setServiceEditId(null);
                            setShowServiceModal(false);
                          }}
                          style={{
                            background: '#6b7280',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '12px',
                            padding: '16px 32px',
                            fontWeight: 600,
                            fontSize: '16px',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            minWidth: '140px'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                          Cancel
                        </button>
                      )}
                      
                    </div>
                    
                    </form>
                  </div>
                </div>
              )}
            </section>
          
    </>
  );
}
