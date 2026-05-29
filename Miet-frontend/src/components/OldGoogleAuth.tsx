'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

interface User {
  id: number;
  email: string;
  name?: string;
}

export const GoogleAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("user_token");

    if (token) {
      try {
        const decoded: any = jwtDecode(token);

        setUser({
          id: decoded.id,
          email: decoded.email,
          name: decoded.name
        });
      } catch (err) {
        localStorage.removeItem("user_token");
      }
    }

    setLoading(false);
  }, []);

  const handleGoogleLogin = () => {
    window.location.href = "http://adminpanel.tech/api/auth/google";
  };

  const handleLogout = () => {
    localStorage.removeItem("user_token");
    setUser(null);
    router.push('/');
  };

  if (loading) return null;

  return (
    <div>
      {user ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          
          {/* Profile Section */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              padding: '4px 8px',
              borderRadius: '8px',
              transition: 'all 0.3s ease'
            }}
            onClick={() => router.push('/dashboard')}
          >
            {/* Avatar */}
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: '#667eea',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '14px',
              fontWeight: '600'
            }}>
              {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
            </div>

            {/* Name */}
            <span style={{ fontSize: '14px', fontWeight: '500' }}>
              {user.name || user.email}
            </span>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            style={{
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              padding: '8px 16px',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>

        </div>
      ) : (
        <button
          onClick={handleGoogleLogin}
          style={{
            background: 'linear-gradient(135deg, #4285f4 0%, #34a853 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '12px 24px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 2px 8px rgba(66, 133, 244, 0.3)'
          }}
        >
          Login with Google
        </button>
      )}
    </div>
  );
};

export default GoogleAuth;