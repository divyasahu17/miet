"use client";
import React from 'react';
import Image from 'next/image';
import { FaThLarge, FaList, FaTags, FaUserCircle, FaSignOutAlt, FaChevronLeft, FaChevronRight, FaUserMd, FaChevronDown, FaSearch, FaEdit, FaTrash, FaPlus, FaEye, FaImages, FaCog } from "react-icons/fa";
import Select from "react-select";

export default function ConsultantsTab(props: any) {
  const {
    consultants,
    categories,
    subcategories,
    consultantForm,
    consultantEditId,
    cityFilter,
    setCityFilter,
    statusFilter,
    setStatusFilter,
    fetchConsultants,
    handleToggleApproval,
    handleToggleConsultantStatus,
    handleConsultantProfile,
    handleConsultantEdit,
    showDeleteConsultantModal,
    showHardDeleteConsultantModal,
    DataTable,
    page,
    setPage,
    totalPages,
    setConsultantEditId,
    setConsultantForm,
    setConsultantSlots,
    setShowConsultantModal,
    setShowConsultantProfileModal,
    handleConsultantSubmit,
    handleConsultantFormChange,
    handleConsultantMultiSelect,
    slotDuration,
    setSlotDuration,
    handleQuickAddSlots,
    handleRemoveSlot,
    handleAddSlotWithDuration,
    handleUseMyLocation,
    defaultMapCenter,
    isLoaded,
    handleMapClick,
    handleFileUpload,
    handleConsultantFormCancel,
    getImageUrl,
    showConsultantModal,
    consultantSlots,
    handleDeleteConsultant,
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
              }}>Manage Consultants</h2>
              <button
                onClick={() => {
                  setConsultantEditId(null);
                  setConsultantForm({
                    username: '',
                    password: '',
                    confirmPassword: '',
                    name: '',
                    email: '',
                    phone: '',
                    tagline: '',
                    speciality: '',
                    city: '',
                    address: '',
                    website: '',
                    description: '',
                    aadhar: '',
                    bank_account: '',
                    bank_ifsc: '',
                    status: 'offline',
                    featured: false,
                    category_ids: [],
                    subcategory_ids: [],
                    location_lat: '',
                    location_lng: '',
                    image: undefined,
                    id_proof_url: undefined
                  });
                  setConsultantSlots([]);
                  setShowConsultantModal(true);
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
                <FaPlus size={16} /> Add Consultant
              </button>
            </div>

            <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
              <input
                type="text"
                placeholder="Filter by city"
                value={cityFilter}
                onChange={(e: any) => setCityFilter(e.target.value)}
                style={{ padding: 8, borderRadius: 8, border: '1px solid #ccc' }}
              />
              <select
                value={statusFilter}
                onChange={(e: any) => setStatusFilter(e.target.value)}
                style={{ padding: 8, borderRadius: 8 }}
              >
                <option value="">All Status</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
              </select>
              <button
                onClick={() => fetchConsultants()}
                style={{
                  padding: '8px 16px',
                  borderRadius: 8,
                  background: '#667eea',
                  color: '#fff',
                  border: 'none'
                }}
              >
                Apply
              </button>
            </div>

            <DataTable
              data={consultants}
              columns={[
                {
                  key: 'image',
                  label: 'Image',
                  sortable: false,
                  render: (value: string, row: { name: string }) => (
                    value ? (
                      <Image
                        src={getImageUrl(value)}
                        alt={row.name}
                        width={44}
                        height={44}
                        style={{ borderRadius: 8, objectFit: 'cover', border: '1px solid #e2e8f0' }}
                        unoptimized
                      />
                    ) : (
                      <span style={{ display: 'inline-block', width: 44, height: 44, borderRadius: 8, background: '#e2e8f0' }} />
                    )
                  )
                },
                { key: 'username', label: 'Username', sortable: true },
                { key: 'name', label: 'Name', sortable: true },
                { key: 'email', label: 'Email', sortable: true },
                {
                  key: 'approval_status',
                  label: 'Approval',
                  sortable: true,
                  render: (value: string, row: any) => (
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={value === 'approved'}
                        onChange={() => handleToggleApproval(row)}
                        style={{ width: 32, height: 18 }}
                      />
                      <span style={{
                        color: value === 'approved' ? '#38a169' : '#e53e3e',
                        fontWeight: 600
                      }}>
                        {value === 'approved' ? 'Approved' : 'Pending'}
                      </span>
                    </label>
                  )
                },
                {
                  key: 'status',
                  label: 'Status',
                  sortable: true,
                  render: (value: string, row: any) => (
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={value === 'online'}
                        onChange={() => handleToggleConsultantStatus(row)}
                        style={{ width: 32, height: 18 }}
                      />
                      <span style={{ color: value === 'online' ? '#38a169' : '#e53e3e', fontWeight: 600 }}>
                        {value === 'online' ? 'Online' : 'Offline'}
                      </span>
                    </label>
                  )
                }
              ]}
              onView={(consultant: any) => {
                handleConsultantProfile(consultant.id);
                setShowConsultantProfileModal(true);
              }}
              onEdit={(consultant: any) => {
                handleConsultantEdit(consultant);
                setShowConsultantModal(true);
              }}
              onDelete={(consultant: any) => showDeleteConsultantModal(consultant.id!, consultant.name)}
              onHardDelete={(consultant: any) => showHardDeleteConsultantModal(consultant.id!, consultant.name)}
              searchPlaceholder="Search consultants..."
              title="Consultants"
            />

            <div style={{ marginTop: 20, textAlign: 'center' }}>
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                style={{ padding: '6px 12px', marginRight: 10 }}
              >
                ⬅ Prev
              </button>

              <span style={{ fontWeight: 600 }}>
                Page {page} of {totalPages}
              </span>

              <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                style={{ padding: '6px 12px', marginLeft: 10 }}
              >
                Next ➡
              </button>
            </div>
          </section>

    </>
  );
}
