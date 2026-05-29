"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { FaChevronLeft, FaSave } from 'react-icons/fa';
import { getApiUrl } from "@/utils/api";
import AdminShell from '../../../AdminShell';

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const userId = params.id as string;
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [userForm, setUserForm] = useState({ username: '', role: 'consultant' });

  useEffect(() => {
    fetchUserDetails();
  }, [userId]);

  const fetchUserDetails = async () => {
    const token = localStorage.getItem("admin_jwt");
    try {
      const res = await fetch(getApiUrl(`api/users/${userId}`), {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUserForm({ username: data.username, role: data.role });
      } else {
        alert('User not found');
        router.push(`/${locale}/admin/dashboard?tab=users`);
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
    } finally {
      setFetching(false);
    }
  };

  const handleUserFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUserForm(prev => ({ ...prev, [name]: value }));
  };

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("admin_jwt");
    try {
      const res = await fetch(getApiUrl(`api/users/${userId}`), {
        method: 'PUT',
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ role: userForm.role }),
      });
      if (res.ok) {
        router.push(`/${locale}/admin/dashboard?tab=users`);
      } else {
        const errorData = await res.json();
        alert(errorData.error || 'Failed to update user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      alert('An error occurred while updating the user');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <AdminShell activeKey="users">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>Loading...</div>
      </AdminShell>
    );
  }

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
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
            <button onClick={() => router.back()} style={{ background: 'rgba(102, 126, 234, 0.1)', color: '#667eea', border: 'none', borderRadius: '12px', padding: '12px', cursor: 'pointer' }}>
              <FaChevronLeft size={20} />
            </button>
            <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#1e293b', margin: 0 }}>Edit User</h1>
          </div>

          <form onSubmit={handleUserSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#475569' }}>Username (Read-only)</label>
              <input type="text" value={userForm.username} readOnly style={{ padding: '16px 20px', borderRadius: '12px', border: '2px solid rgba(102, 126, 234, 0.05)', width: '100%', background: '#f8fafc', color: '#64748b' }} />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#475569' }}>Role</label>
              <select name="role" value={userForm.role} onChange={handleUserFormChange} style={{ padding: '16px 20px', borderRadius: '12px', border: '2px solid rgba(102, 126, 234, 0.1)', width: '100%', background: '#fff' }}>
                <option value="consultant">Consultant</option>
                <option value="superadmin">Superadmin</option>
              </select>
            </div>

            <button type="submit" disabled={loading} style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff', border: 'none', borderRadius: '12px', padding: '18px', fontWeight: 700, fontSize: '18px', cursor: 'pointer' }}>
              {loading ? 'Saving...' : <><FaSave /> Save Changes</>}
            </button>
          </form>
        </div>
      </div>
    </AdminShell>
  );
}
