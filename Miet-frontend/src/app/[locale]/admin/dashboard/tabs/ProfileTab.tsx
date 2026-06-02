"use client";
import React, { useState, useEffect } from 'react';
import { FaUserShield, FaKey, FaUser } from 'react-icons/fa';
import { getApiUrl } from '@/utils/api';

export default function ProfileTab(props: any) {
  const { addNotification } = props;
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Extract current admin username from JWT token
    const token = localStorage.getItem('admin_jwt');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload && payload.username) {
          setUsername(payload.username);
        }
      } catch (err) {
        console.error('Failed to parse admin token for username:', err);
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      addNotification?.({
        type: 'error',
        title: 'Validation Error',
        message: 'Username cannot be empty'
      });
      return;
    }

    if (password && password !== confirmPassword) {
      addNotification?.({
        type: 'error',
        title: 'Validation Error',
        message: 'Passwords do not match'
      });
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('admin_jwt');
      const response = await fetch(getApiUrl('api/admin/profile'), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          username: username.trim(),
          password: password ? password : undefined
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Save new token to localstorage
        if (data.token) {
          localStorage.setItem('admin_jwt', data.token);
        }
        
        setPassword('');
        confirmPassword !== '' && setConfirmPassword('');

        addNotification?.({
          type: 'success',
          title: 'Success',
          message: 'Admin profile updated successfully!'
        });
      } else {
        addNotification?.({
          type: 'error',
          title: 'Update Failed',
          message: data.message || 'Failed to update profile'
        });
      }
    } catch (err) {
      console.error('Error updating admin profile:', err);
      addNotification?.({
        type: 'error',
        title: 'Error',
        message: 'A network error occurred'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section style={{ maxWidth: '600px', margin: '0 auto', padding: '10px' }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.05)',
        padding: '32px',
        border: '1px solid #e2e8f0'
      }}>
        <h2 style={{
          fontSize: '24px',
          fontWeight: 700,
          color: '#1e293b',
          marginBottom: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <FaUserShield style={{ color: '#667eea' }} />
          Admin Profile Settings
        </h2>
        <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '28px' }}>
          Update your admin portal credentials. Changing these values will update your login credentials.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Username */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '14px', fontWeight: 600, color: '#334155', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FaUser style={{ color: '#94a3b8' }} /> Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Admin Username"
              required
              style={{
                padding: '12px 16px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                outline: 'none',
                fontSize: '14px',
                color: '#334155',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
            />
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #f1f5f9', margin: '10px 0' }} />

          {/* New Password */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '14px', fontWeight: 600, color: '#334155', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FaKey style={{ color: '#94a3b8' }} /> New Password (leave blank to keep current)
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              style={{
                padding: '12px 16px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                outline: 'none',
                fontSize: '14px',
                color: '#334155',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
            />
          </div>

          {/* Confirm Password */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '14px', fontWeight: 600, color: '#334155', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FaKey style={{ color: '#94a3b8' }} /> Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              style={{
                padding: '12px 16px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                outline: 'none',
                fontSize: '14px',
                color: '#334155',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: '10px',
              padding: '14px',
              borderRadius: '8px',
              border: 'none',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              fontSize: '15px',
              fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 10px rgba(102, 126, 234, 0.3)',
              transition: 'transform 0.2s'
            }}
            onMouseEnter={(e) => !loading && (e.currentTarget.style.transform = 'translateY(-1px)')}
            onMouseLeave={(e) => !loading && (e.currentTarget.style.transform = 'translateY(0)')}
          >
            {loading ? 'Updating Settings...' : 'Save Settings'}
          </button>
        </form>
      </div>
    </section>
  );
}
