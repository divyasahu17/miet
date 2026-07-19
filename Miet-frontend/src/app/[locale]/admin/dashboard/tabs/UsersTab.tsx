"use client";
import React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { FaPlus } from "react-icons/fa";

export default function UsersTab(props: any) {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale;

  const {
    DataTable,
    users = [],
    handleToggleUserStatus,
    handleUserDelete
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
          }}>Manage Users</h2>
          <button
            onClick={() => {
              router.push(`/${locale}/admin/users/add`);
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
            <FaPlus size={16} /> Add User
          </button>
        </div>

        <DataTable
          data={users.filter((u: any) => u.role === 'users' || u.role === 'user')}
          columns={[
            { key: 'username', label: 'Username', sortable: true },
            { key: 'role', label: 'Role', sortable: true },
            {
              key: 'status',
              label: 'Status',
              sortable: true,
              render: (value: string, row: any) => (
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={value !== 'inactive'}
                    onChange={() => handleToggleUserStatus(row)}
                    style={{ width: 32, height: 18 }}
                  />
                  <span style={{ color: value !== 'inactive' ? '#38a169' : '#e53e3e', fontWeight: 600 }}>
                    {value !== 'inactive' ? 'Active' : 'Inactive'}
                  </span>
                </label>
              )
            },
            {
              key: 'created_at',
              label: 'Created',
              sortable: true,
              render: (value: string) => value ? new Date(value).toLocaleString() : ''
            }
          ]}
          onEdit={(user: any) => {
            router.push(`/${locale}/admin/users/edit/${user.id}`);
          }}
          onDelete={(user: any) => handleUserDelete(user.id)}
          searchPlaceholder="Search users..."
          title="Users"
        />
      </section>
    </>
  );
}
