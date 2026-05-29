"use client";
import React from 'react';
import { FaPlus } from 'react-icons/fa';

export default function SubscriptionsTab(props: any) {
  const { 
    plans, overrides,
    handlePlanDelete, handleOverrideDelete,
    setShowPlanModal, setShowOverrideModal,
    setPlanEditId, setOverrideEditId,
    setPlanForm, setOverrideForm,
    DataTable
  } = props;

  return (
    <div className="space-y-8">
      {/* Plans Section */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: '16px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#667eea', margin: 0, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            Subscription Plans
          </h2>
          <button
            onClick={() => {
              setPlanForm({
                plan_key: '', plan_name: '', billing_cycle: 'monthly',
                base_price: '', currency: 'INR', description: '', is_active: true
              });
              setPlanEditId(null);
              setShowPlanModal(true);
            }}
            style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff', border: 'none', borderRadius: '12px', padding: '14px 24px', fontWeight: 700, fontSize: '16px', cursor: 'pointer', transition: 'all 0.2s ease', boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)', display: 'flex', alignItems: 'center', gap: '8px' }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
          >
            <FaPlus size={16} /> Add Plan
          </button>
        </div>

        <DataTable 
          data={Array.isArray(plans) ? plans : []}
          columns={[
            { key: 'plan_key', label: 'Key', sortable: true },
            { key: 'plan_name', label: 'Name', sortable: true },
            { key: 'billing_cycle', label: 'Cycle', sortable: true, render: (v: string) => <span style={{ textTransform: 'capitalize' }}>{v}</span> },
            { key: 'base_price', label: 'Price', sortable: true, render: (v: string, row: any) => `${row.currency} ${v}` },
            { key: 'is_active', label: 'Status', sortable: true, render: (v: boolean) => (
                <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, color: v ? '#047857' : '#be123c', backgroundColor: v ? '#d1fae5' : '#ffe4e6' }}>
                  {v ? 'Active' : 'Inactive'}
                </span>
              ) 
            }
          ]}
          onEdit={(plan: any) => {
            setPlanForm(plan);
            setPlanEditId(plan.id);
            setShowPlanModal(true);
          }}
          onDelete={(plan: any) => handlePlanDelete(plan.id)}
          searchPlaceholder="Search plans..."
        />
      </section>

      {/* Price Overrides Section */}
      <section style={{ marginTop: '48px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: '16px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#667eea', margin: 0, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            Price Overrides
          </h2>
          <button
            onClick={() => {
              setOverrideForm({
                plan_key: '', country_code: 'IN', billing_cycle: 'monthly', override_price: '', currency: 'INR', reason: '', starts_at: '', ends_at: '', is_active: true
              });
              setOverrideEditId(null);
              setShowOverrideModal(true);
            }}
            style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff', border: 'none', borderRadius: '12px', padding: '14px 24px', fontWeight: 700, fontSize: '16px', cursor: 'pointer', transition: 'all 0.2s ease', boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)', display: 'flex', alignItems: 'center', gap: '8px' }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
          >
            <FaPlus size={16} /> Add Override
          </button>
        </div>

        <DataTable 
          data={Array.isArray(overrides) ? overrides : []}
          columns={[
            { key: 'plan_key', label: 'Plan Key', sortable: true, render: (v: string, row: any) => row.plan?.plan_key || v },
            { key: 'country_code', label: 'Country', sortable: true },
            { key: 'billing_cycle', label: 'Cycle', sortable: true, render: (v: string) => <span style={{ textTransform: 'capitalize' }}>{v}</span> },
            { key: 'override_price', label: 'Override Price', sortable: true, render: (v: string, row: any) => `${row.currency || ''} ${v}` },
            { key: 'is_active', label: 'Status', sortable: true, render: (v: boolean) => (
                <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, color: v ? '#047857' : '#be123c', backgroundColor: v ? '#d1fae5' : '#ffe4e6' }}>
                  {v ? 'Active' : 'Inactive'}
                </span>
              ) 
            }
          ]}
          onEdit={(override: any) => {
            setOverrideForm({
              ...override,
              plan_key: override.plan?.plan_key || override.plan_key
            });
            setOverrideEditId(override.id);
            setShowOverrideModal(true);
          }}
          onDelete={(override: any) => handleOverrideDelete(override.id)}
          searchPlaceholder="Search overrides..."
        />
      </section>
    </div>
  );
}
