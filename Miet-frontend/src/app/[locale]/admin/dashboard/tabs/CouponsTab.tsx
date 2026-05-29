"use client";
import React from 'react';
import { FaPlus } from 'react-icons/fa';

export default function CouponsTab(props: any) {
  const { coupons, handleCouponDelete, setCouponEditId, setCouponForm, setShowCouponModal, DataTable } = props;

  return (
    <div className="space-y-8">
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: '16px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#667eea', margin: 0, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            Discount Coupons
          </h2>

          <button
            onClick={() => {
              setCouponForm({
                code: '',
                description: '',
                discount_type: 'percentage',
                discount_value: '',
                minimum_amount: null,
                usage_limit: null,
                starts_at: '',
                expires_at: '',
                is_active: true
              });
              setCouponEditId(null);
              setShowCouponModal(true);
            }}
            style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff', border: 'none', borderRadius: '12px', padding: '14px 24px', fontWeight: 700, fontSize: '16px', cursor: 'pointer', transition: 'all 0.2s ease', boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)', display: 'flex', alignItems: 'center', gap: '8px' }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
          >
            <FaPlus size={16} /> Add Coupon
          </button>
        </div>

        <DataTable 
          data={Array.isArray(coupons) ? coupons : []}
          columns={[
            { 
              key: 'code', 
              label: 'Code', 
              sortable: true,
              render: (v: string, row: any) => (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontWeight: 600 }}>{v}</span>
                  <span style={{ fontSize: '12px', color: '#6b7280' }}>{row.description}</span>
                </div>
              )
            },
            { key: 'discount_type', label: 'Type', sortable: true, render: (v: string) => <span style={{ textTransform: 'capitalize' }}>{v}</span> },
            { 
              key: 'discount_value', 
              label: 'Discount', 
              sortable: true, 
              render: (v: string, row: any) => row.discount_type === 'percentage' ? `${v}%` : `₹${v}` 
            },
            { 
              key: 'limits', 
              label: 'Limits', 
              sortable: false,
              render: (_: any, c: any) => (
                <div style={{ fontSize: '14px', display: 'flex', flexDirection: 'column' }}>
                  <span>Min Amount: {c.minimum_amount ? `₹${c.minimum_amount}` : 'None'}</span>
                  <span>Usage: {c.usage_limit ? c.usage_limit : 'Unlimited'}</span>
                </div>
              )
            },
            { 
              key: 'dates', 
              label: 'Expiry', 
              sortable: false,
              render: (_: any, c: any) => (
                <div style={{ display: 'flex', flexDirection: 'column', fontSize: '14px' }}>
                  <span>Starts: {c.starts_at ? new Date(c.starts_at).toLocaleDateString() : '-'}</span>
                  <span>Expires: {c.expires_at ? new Date(c.expires_at).toLocaleDateString() : 'Never'}</span>
                </div>
              )
            },
            { key: 'is_active', label: 'Status', sortable: true, render: (v: boolean) => (
                <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, color: v ? '#047857' : '#be123c', backgroundColor: v ? '#d1fae5' : '#ffe4e6' }}>
                  {v ? 'Active' : 'Inactive'}
                </span>
              ) 
            }
          ]}
          onEdit={(c: any) => {
            setCouponForm(c);
            setCouponEditId(c.id);
            setShowCouponModal(true);
          }}
          onDelete={(c: any) => handleCouponDelete(c.id)}
          searchPlaceholder="Search coupons..."
        />
      </section>
    </div>
  );
}
