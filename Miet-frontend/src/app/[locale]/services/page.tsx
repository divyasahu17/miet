"use client";
import React, { useState, useEffect } from "react";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { useCmsContent, cmsOrT } from '@/hooks/useCmsContent';

const SECTION = 'ServicesPage';

export default function ServicesPage() {
  const t = useTranslations('ServicesPage');
  const locale = useLocale();


  // const { content: cmsContent } = useCmsContent('services');
  // const text = (cmsKey: string, fallback: string) => cmsOrT(cmsContent, SECTION, cmsKey, fallback);
const text = (_cmsKey: string, fallback: string) => fallback;


  const [loading, setLoading] = useState(true);
  const [serviceCards, setServiceCards] = useState<any[]>([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch((process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000') + '/api/cms-services');
        if (res.ok) {
          const data = await res.json();
          const formattedCards = (data.services || []).map((card: any) => {
            let features = [];
            try { features = JSON.parse(card.points || '[]'); } catch {}
            return {
              key: card.id.toString(),
              title: card.title,
              description: card.description,
              features: features,
              cta: card.button_name,
              ctaLink: card.hyper_link,
              color: card.button_color || '#5a67d8',
              isSubscriptions: card.title.toLowerCase().includes('subscription'),
              isTests: card.title.toLowerCase().includes('test'),
              isEvents: card.title.toLowerCase().includes('event')
            };
          });
          setServiceCards(formattedCards);
        }
      } catch (error) {
        console.error('Error fetching dynamic services:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);



  return (
    <>
      <TopBar />
      <main style={{
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        minHeight: '100vh',
        padding: '4rem 0',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background decorative elements */}
        <div style={{
          position: 'absolute',
          top: '-20%',
          left: '-20%',
          width: '40%',
          height: '40%',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.05) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: 'float 8s ease-in-out infinite'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-15%',
          right: '-15%',
          width: '30%',
          height: '30%',
          background: 'radial-gradient(circle, rgba(118, 75, 162, 0.05) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: 'float 6s ease-in-out infinite reverse'
        }} />

        <section style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 2rem',
          position: 'relative',
          zIndex: 2
        }}>
          {/* Page Header */}
          <div style={{
            textAlign: 'center',
            marginBottom: '4rem'
          }}>
            <h1 style={{
              fontFamily: 'Righteous, cursive',
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: '700',
              color: '#1e1b4b',
              marginBottom: '1rem',
              textShadow: '0 2px 10px rgba(0,0,0,0.1)',
              letterSpacing: '1px'
            }}>
              {text('title', t('title'))}
            </h1>
            <p style={{
              fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
              color: '#4b5563',
              maxWidth: '800px',
              margin: '0 auto',
              lineHeight: '1.6',
              fontWeight: '400'
            }}>
              {text('subtitle', t('subtitle'))}
            </p>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '2rem',
            marginBottom: '3rem'
          }}>
            {serviceCards.map(card => (
              <div
                key={card.key}
                style={{
                  background: 'rgba(255,255,255,0.95)',
                  borderRadius: '24px',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
                  padding: '2.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderTop: `6px solid ${card.color}`,
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 30px 80px rgba(99, 102, 241, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 20px 60px rgba(0,0,0,0.1)';
                }}
              >
                <h2 style={{
                  fontSize: 'clamp(1.5rem, 2vw, 1.8rem)',
                  color: card.color,
                  fontWeight: '800',
                  marginBottom: '1rem',
                  fontFamily: 'Righteous, cursive'
                }}>
                  {card.title}
                </h2>
                <p style={{
                  color: '#4b5563',
                  fontSize: 'clamp(1rem, 1.2vw, 1.1rem)',
                  marginBottom: '1.5rem',
                  lineHeight: '1.6',
                  fontWeight: '500'
                }}>
                  {card.description}
                </p>
                <ul style={{
                  color: '#1e1b4b',
                  fontSize: 'clamp(0.9rem, 1.1vw, 1rem)',
                  marginBottom: '2rem',
                  paddingLeft: '1.5rem',
                  lineHeight: '1.6'
                }}>
                  {card.features.map((f: string, i: number) => (
                    <li key={i} style={{ marginBottom: '0.75rem', fontWeight: '500' }}>{f}</li>
                  ))}
                </ul>
                {card.isSubscriptions ? (
                  <Link
                    href={`/${locale}/services/subscriptions`}
                    style={{
                      marginTop: 'auto',
                      background: `linear-gradient(135deg, ${card.color} 0%, #764ba2 100%)`,
                      color: '#fff',
                      borderRadius: '16px',
                      padding: '1rem 2rem',
                      fontWeight: '700',
                      fontSize: 'clamp(1rem, 1.2vw, 1.1rem)',
                      textDecoration: 'none',
                      boxShadow: '0 8px 25px rgba(99, 102, 241, 0.3)',
                      transition: 'all 0.3s ease',
                      display: 'inline-block',
                      border: 'none',
                      cursor: 'pointer',
                      width: '100%',
                      textAlign: 'center'
                    }}
                  >
                    {card.cta}
                  </Link>
                ) : card.isEvents ? (
                  <a
                    href="/events"
                    style={{
                      marginTop: 'auto',
                      background: `linear-gradient(135deg, ${card.color} 0%, #764ba2 100%)`,
                      color: '#fff',
                      borderRadius: '16px',
                      padding: '1rem 2rem',
                      fontWeight: '700',
                      fontSize: 'clamp(1rem, 1.2vw, 1.1rem)',
                      textDecoration: 'none',
                      boxShadow: '0 8px 25px rgba(99, 102, 241, 0.3)',
                      transition: 'all 0.3s ease',
                      display: 'block',
                      textAlign: 'center'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 12px 35px rgba(99, 102, 241, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 8px 25px rgba(99, 102, 241, 0.3)';
                    }}
                  >
                    {card.cta}
                  </a>
                ) : card.isTests ? (
                  <Link
                    href="/#test-section"
                    style={{
                      marginTop: 'auto',
                      background: `linear-gradient(135deg, ${card.color} 0%, #764ba2 100%)`,
                      color: '#fff',
                      borderRadius: '16px',
                      padding: '1rem 2rem',
                      fontWeight: '700',
                      fontSize: 'clamp(1rem, 1.2vw, 1.1rem)',
                      textDecoration: 'none',
                      boxShadow: '0 8px 25px rgba(99, 102, 241, 0.3)',
                      transition: 'all 0.3s ease',
                      display: 'block',
                      textAlign: 'center'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 12px 35px rgba(99, 102, 241, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 8px 25px rgba(99, 102, 241, 0.3)';
                    }}
                  >
                    {card.cta}
                  </Link>
                ) : (
                  <a
                    href={card.ctaLink}
                    style={{
                      marginTop: 'auto',
                      background: `linear-gradient(135deg, ${card.color} 0%, #764ba2 100%)`,
                      color: '#fff',
                      borderRadius: '16px',
                      padding: '1rem 2rem',
                      fontWeight: '700',
                      fontSize: 'clamp(1rem, 1.2vw, 1.1rem)',
                      textDecoration: 'none',
                      boxShadow: '0 8px 25px rgba(99, 102, 241, 0.3)',
                      transition: 'all 0.3s ease',
                      display: 'block',
                      textAlign: 'center'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 12px 35px rgba(99, 102, 241, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 8px 25px rgba(99, 102, 241, 0.3)';
                    }}
                  >
                    {card.cta}
                  </a>
                )}
              </div>
            ))}
          </div>
          <div style={{
            color: '#1e1b4b',
            fontSize: 'clamp(1.1rem, 1.3vw, 1.2rem)',
            marginTop: '3rem',
            textAlign: 'center',
            fontWeight: '600',
            background: 'rgba(255,255,255,0.8)',
            padding: '2rem',
            borderRadius: '20px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.2)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
          }}>
            {text('question', t('question'))} <a
              href="/contact"
              style={{
                color: '#667eea',
                textDecoration: 'underline',
                fontWeight: '700',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#764ba2';
                e.currentTarget.style.textShadow = '0 2px 10px rgba(99, 102, 241, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#667eea';
                e.currentTarget.style.textShadow = 'none';
              }}
            >{text('contactLink', t('contactLink'))}</a> {text('contactText', t('contactText'))}
          </div>
        </section>

        {/* CSS Animation */}
        <style dangerouslySetInnerHTML={{
          __html: `
            @keyframes float {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-20px); }
            }
          `
        }} />

      </main>
      <Footer />
    </>
  );
}
