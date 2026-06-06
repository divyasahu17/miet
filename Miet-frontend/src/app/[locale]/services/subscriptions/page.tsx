"use client";
import React, { useState, useEffect } from "react";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import { useTranslations } from "next-intl";

export default function SubscriptionsPage() {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'user' | 'consultant'>('user');

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await fetch((process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000') + '/api/admin/subscriptions');
        if (res.ok) {
          const data = await res.json();
          setPlans(data.data || data || []);
        }
      } catch (err) {
        console.error("Error fetching plans:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const userPlans = plans.filter(p => p.target_audience === 'user' && (p.is_active === 1 || p.is_active === true));
  const consultantPlans = plans.filter(p => p.target_audience === 'consultant' && (p.is_active === 1 || p.is_active === true));

  const plansToShow = activeTab === 'user' ? userPlans : consultantPlans;

  return (
    <>
      <TopBar />
      <main style={{
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        minHeight: '100vh',
        padding: '4rem 0',
        position: 'relative'
      }}>
        <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h1 style={{ fontFamily: 'Righteous, cursive', fontSize: '3rem', color: '#1e1b4b', marginBottom: '1rem' }}>
              Choose Your Perfect Plan
            </h1>
            <p style={{ fontSize: '1.2rem', color: '#4b5563' }}>Unlock premium features designed specifically for your needs.</p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '3rem' }}>
            <div style={{ background: '#fff', borderRadius: '12px', padding: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', display: 'inline-flex', gap: '8px' }}>
              <button
                onClick={() => setActiveTab('user')}
                style={{
                  background: activeTab === 'user' ? '#667eea' : 'transparent',
                  color: activeTab === 'user' ? '#fff' : '#475569',
                  border: 'none', padding: '12px 24px', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.3s ease'
                }}
              >
                User Plan
              </button>
              <button
                onClick={() => setActiveTab('consultant')}
                style={{
                  background: activeTab === 'consultant' ? '#667eea' : 'transparent',
                  color: activeTab === 'consultant' ? '#fff' : '#475569',
                  border: 'none', padding: '12px 24px', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.3s ease'
                }}
              >
                Consultant Plan
              </button>
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', fontSize: '1.2rem', color: '#666' }}>Loading plans...</div>
          ) : plansToShow.length === 0 ? (
            <div style={{ textAlign: 'center', fontSize: '1.2rem', color: '#666' }}>No active plans available for this category right now.</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
              {plansToShow.map((plan, index) => {
                let features = [];
                try { features = JSON.parse(plan.features_json || '[]'); } catch {}
                
                return (
                  <div key={plan.id} style={{
                    background: '#fff', borderRadius: '24px', padding: '2.5rem', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column',
                    transform: index === 1 ? 'scale(1.05)' : 'scale(1)',
                    border: index === 1 ? '2px solid #667eea' : '1px solid #e2e8f0',
                    position: 'relative'
                  }}>
                    {index === 1 && (
                      <div style={{ position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)', background: '#667eea', color: '#fff', padding: '4px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        Most Popular
                      </div>
                    )}
                    <h3 style={{ fontSize: '1.5rem', color: '#1e293b', fontWeight: 'bold', marginBottom: '0.5rem', textAlign: 'center' }}>{plan.plan_name}</h3>
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                      <span style={{ fontSize: '3rem', fontWeight: '900', color: '#1e1b4b' }}>₹{plan.base_price}</span>
                      <span style={{ fontSize: '1rem', color: '#64748b' }}>/ {plan.billing_cycle === 'yearly' ? 'yr' : 'mo'}</span>
                    </div>
                    
                    <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', flex: 1 }}>
                      {Object.entries(features).map(([k, v], i) => (
                        <li key={i} style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem', color: '#475569' }}>
                          <span style={{ color: '#10b981', marginRight: '12px', fontSize: '1.2rem' }}>✓</span>
                          <strong>{k}:</strong> {String(v)}
                        </li>
                      ))}
                    </ul>

                    <button 
                      onClick={() => alert(`Redirecting to Checkout for ${plan.name}`)}
                      style={{
                        background: index === 1 ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#f1f5f9',
                        color: index === 1 ? '#fff' : '#1e293b',
                        border: 'none', borderRadius: '12px', padding: '1rem', width: '100%', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.3s ease'
                      }}
                    >
                      Choose Plan
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
