"use client";
import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { FaChevronLeft, FaPlus } from 'react-icons/fa';
import { getApiUrl } from "@/utils/api";
import AdminShell from '../../AdminShell';

export default function AddUserPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const [loading, setLoading] = useState(false);
  const [userForm, setUserForm] = useState({ username: '', password: '', role: 'consultant' });

  const handleUserFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUserForm(prev => ({ ...prev, [name]: value }));
  };

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("admin_jwt");
    try {
      const res = await fetch(getApiUrl('api/users'), {
        method: 'POST',
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(userForm),
      });
      if (res.ok) {
        router.push(`/${locale}/admin/dashboard?tab=users`);
      } else {
        const errorData = await res.json();
        alert(errorData.error || 'Failed to add user');
      }
    } catch (error) {
      console.error('Error adding user:', error);
      alert('An error occurred while adding the user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminShell activeKey="users">
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ 
          background: '#fff',
          borderRadius: '20px',
          boxShadow: '0 10px 30px rgba(102, 126, 234, 0.1)',
          padding: '40px',
          border: '1px solid rgba(102, 126, 234, 0.1)'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '16px', 
            marginBottom: '32px' 
          }}>
            <button 
              onClick={() => router.back()}
              style={{
                background: 'rgba(102, 126, 234, 0.1)',
                color: '#667eea',
                border: 'none',
                borderRadius: '12px',
                padding: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <FaChevronLeft size={20} />
            </button>
            <h1 style={{ 
              fontSize: '28px', 
              fontWeight: 800, 
              color: '#1e293b',
              margin: 0,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>Add New User</h1>
          </div>

          <form onSubmit={handleUserSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#475569' }}>Username</label>
              <input
                type="text"
                name="username"
                value={userForm.username}
                onChange={handleUserFormChange}
                placeholder="Enter username"
                required
                style={{ padding: '16px 20px', borderRadius: '12px', border: '2px solid rgba(102, 126, 234, 0.1)', width: '100%' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#475569' }}>Password</label>
              <input
                type="password"
                name="password"
                value={userForm.password}
                onChange={handleUserFormChange}
                placeholder="Enter password"
                required
                style={{ padding: '16px 20px', borderRadius: '12px', border: '2px solid rgba(102, 126, 234, 0.1)', width: '100%' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#475569' }}>Role</label>
              <select
                name="role"
                value={userForm.role}
                onChange={handleUserFormChange}
                style={{ padding: '16px 20px', borderRadius: '12px', border: '2px solid rgba(102, 126, 234, 0.1)', width: '100%', background: '#fff' }}
              >
                <option value="consultant">Consultant</option>
                <option value="superadmin">Superadmin</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: '12px',
                padding: '18px',
                fontWeight: 700,
                fontSize: '18px',
                cursor: 'pointer',
                boxShadow: '0 8px 20px rgba(102, 126, 234, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px'
              }}
            >
              {loading ? 'Adding User...' : <><FaPlus /> Add User</>}
            </button>
          </form>
        </div>
      </div>
    </AdminShell>
  );
}
