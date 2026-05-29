"use client";
import React, { useState, useEffect } from "react";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import { getApiUrl } from "@/utils/api";
import { useLocale } from "next-intl";

interface Webinar {
  id: number;
  title: string;
  description: string;
  start_time: string;
  location?: string;
  image?: string;
  is_free: boolean;
  price: number;
  status: string;
}

export default function EventsPage() {
  const [webinars, setWebinars] = useState<Webinar[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWebinar, setSelectedWebinar] = useState<Webinar | null>(null);
  const locale = useLocale();

  useEffect(() => {
    fetchWebinars();
  }, []);

  const fetchWebinars = async () => {
    try {
      const res = await fetch(getApiUrl("api/webinars/public"));
      if (res.ok) {
        const data = await res.json();
        setWebinars(data.webinars || []);
      }
    } catch (error) {
      console.error("Error fetching webinars:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <TopBar />
      <main style={{ background: '#f7fafc', minHeight: '80vh', padding: '2.5rem 0' }}>
        <section style={{ maxWidth: 1000, margin: '0 auto', background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px #e2e8f0', padding: 36 }}>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: '#22543d', marginBottom: 18, textAlign: 'center' }}>Upcoming Webinars & Events</h1>
          
          {loading ? (
            <p style={{ textAlign: 'center' }}>Loading webinars...</p>
          ) : webinars.length === 0 ? (
            <p style={{ textAlign: 'center' }}>No upcoming events at the moment.</p>
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32, justifyContent: 'center' }}>
              {webinars.map(webinar => (
                <div 
                  key={webinar.id} 
                  style={{ 
                    flex: '1 1 280px', minWidth: 280, maxWidth: 340, 
                    background: '#f7fafc', borderRadius: 14, 
                    boxShadow: '0 2px 8px #e2e8f0', padding: 20, 
                    cursor: 'pointer', display: 'flex', 
                    flexDirection: 'column', alignItems: 'center', 
                    transition: 'transform 0.2s' 
                  }} 
                  onClick={() => setSelectedWebinar(webinar)}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <img src={webinar.image || "/brain-miet.png"} alt={webinar.title} style={{ width: '100%', maxWidth: 220, height: 120, objectFit: 'cover', borderRadius: 10, marginBottom: 14, background: '#fff' }} />
                  <div style={{ fontWeight: 700, color: '#22543d', fontSize: 20, marginBottom: 6, textAlign: 'center' }}>{webinar.title}</div>
                  <div style={{ color: '#5a67d8', fontSize: 15, marginBottom: 8 }}>{new Date(webinar.start_time).toLocaleString()}</div>
                  <div style={{ color: '#444', fontSize: 14, marginBottom: 12, textAlign: 'center', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{webinar.description}</div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{ 
                      padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '700',
                      background: webinar.is_free ? '#e8f5e8' : '#fff3e0',
                      color: webinar.is_free ? '#388e3c' : '#f57c00',
                      border: `1px solid ${webinar.is_free ? '#388e3c' : '#f57c00'}`
                    }}>
                      {webinar.is_free ? 'FREE' : `₹${webinar.price}`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Webinar Details Modal */}
        {selectedWebinar && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(34,37,77,0.45)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={e => { if (e.target === e.currentTarget) setSelectedWebinar(null); }}>
            <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 4px 32px #5a67d855', padding: '2.5rem 2rem 2rem 2rem', minWidth: 320, maxWidth: 450, position: 'relative', outline: 'none' }}>
              <button aria-label="Close modal" onClick={() => setSelectedWebinar(null)} style={{ position: 'absolute', top: 18, right: 18, background: 'none', border: 'none', fontSize: 26, color: '#5a67d8', cursor: 'pointer' }}>×</button>
              <img src={selectedWebinar.image || "/brain-miet.png"} alt={selectedWebinar.title} style={{ width: '100%', maxWidth: 260, height: 140, objectFit: 'cover', borderRadius: 10, marginBottom: 16, background: '#fff', margin: '0 auto 16px', display: 'block' }} />
              <h2 style={{ color: '#22543d', fontWeight: 800, fontSize: 24, marginBottom: 8 }}>{selectedWebinar.title}</h2>
              <div style={{ color: '#5a67d8', fontSize: 16, marginBottom: 8 }}>{new Date(selectedWebinar.start_time).toLocaleString()}</div>
              <div style={{ color: '#444', fontSize: 16, marginBottom: 12 }}>{selectedWebinar.description}</div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
                <span style={{ fontSize: '20px', fontWeight: '800', color: '#22543d' }}>
                  {selectedWebinar.is_free ? 'Free' : `₹${selectedWebinar.price}`}
                </span>
                <button
                  onClick={() => window.location.href = `/${locale}/webinars/${selectedWebinar.id}/registration`}
                  style={{ background: '#5a67d8', color: '#fff', borderRadius: 8, padding: '12px 24px', fontWeight: 700, fontSize: 16, border: 'none', cursor: 'pointer' }}
                >
                  Register Now
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
