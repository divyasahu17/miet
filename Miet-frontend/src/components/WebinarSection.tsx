'use client';

import React, { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { FaClock, FaUserGraduate } from 'react-icons/fa';
import Image from 'next/image';
import { getApiUrl } from '@/utils/api';

interface Webinar {
  id: number;
  title: string;
  description: string;
  start_time: string;
  is_free: boolean;
  price: number;
  image?: string;
  organizer_name?: string;
}

export default function WebinarSection() {
  const [webinars, setWebinars] = useState<Webinar[]>([]);
  const [loading, setLoading] = useState(true);
  const locale = useLocale();

  useEffect(() => {
    const fetchWebinars = async () => {
      try {
        const res = await fetch(getApiUrl('api/webinars/public'));
        if (res.ok) {
          const data = await res.json();
          // Only show upcoming webinars
          const upcoming = (data.webinars || []).filter((w: Webinar) => new Date(w.start_time) > new Date());
          setWebinars(upcoming.slice(0, 3)); // Show top 3
        }
      } catch (error) {
        console.error('Error fetching webinars:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchWebinars();
  }, []);

  if (!loading && webinars.length === 0) return null;

  return (
    <section style={{ padding: '60px 20px', background: '#fff' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: '800', color: '#1a365d', marginBottom: '10px' }}>Live Webinars</h2>
          <p style={{ color: '#4a5568', fontSize: '18px' }}>Join our expert-led sessions and stay ahead.</p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>Loading...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
            {webinars.map(webinar => (
              <div 
                key={webinar.id}
                style={{
                  background: 'white',
                  borderRadius: '16px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
                  overflow: 'hidden',
                  transition: 'transform 0.3s ease',
                  border: '1px solid #edf2f7',
                  cursor: 'pointer'
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-10px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                onClick={() => window.location.href = `/${locale}/webinars/${webinar.id}/registration`}
              >
                <div style={{ position: 'relative', height: '180px' }}>
                  <Image 
                    src={webinar.image || "/brain-miet.png"} 
                    alt={webinar.title}
                    width={400}
                    height={180}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{
                    position: 'absolute', top: '15px', right: '15px',
                    background: webinar.is_free ? '#388e3c' : '#f57c00',
                    color: 'white', padding: '4px 12px', borderRadius: '20px',
                    fontSize: '12px', fontWeight: '700'
                  }}>
                    {webinar.is_free ? 'FREE' : `₹${webinar.price}`}
                  </div>
                </div>

                <div style={{ padding: '24px' }}>
                  <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#2d3748', marginBottom: '12px' }}>{webinar.title}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#718096', fontSize: '14px', marginBottom: '16px' }}>
                    <FaClock />
                    {new Date(webinar.start_time).toLocaleString()}
                  </div>
                  <p style={{ color: '#4a5568', fontSize: '14px', marginBottom: '20px', lineHeight: '1.6', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {webinar.description}
                  </p>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f7fafc', paddingTop: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FaUserGraduate style={{ color: '#4a5568' }} />
                      </div>
                      <span style={{ fontSize: '14px', color: '#4a5568', fontWeight: '600' }}>Host</span>
                    </div>
                    <button style={{
                      background: 'none', border: 'none', color: '#667eea', fontWeight: '700', fontSize: '14px', cursor: 'pointer'
                    }}>Register →</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <button 
             onClick={() => window.location.href = `/${locale}/events`}
             style={{
               background: 'transparent',
               border: '2px solid #667eea',
               color: '#667eea',
               padding: '12px 30px',
               borderRadius: '8px',
               fontWeight: '700',
               cursor: 'pointer',
               transition: 'all 0.2s'
             }}
             onMouseEnter={e => { e.currentTarget.style.background = '#667eea'; e.currentTarget.style.color = 'white'; }}
             onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#667eea'; }}
          >
            View All Events
          </button>
        </div>
      </div>
    </section>
  );
}
