'use client';

import React from 'react';
import TopBar from '@/components/TopBar';
import Footer from '@/components/Footer';

export default function PrivacyPage() {
  return (
    <>
      <TopBar />
      <main style={{
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        minHeight: '100vh',
        padding: '4rem 0',
      }}>
        <div style={{
          maxWidth: '900px',
          margin: '0 auto',
          padding: '0 2rem',
        }}>
          <div style={{
            background: 'white',
            borderRadius: '24px',
            padding: '3rem',
            boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
          }}>
            <h1 style={{
              fontFamily: 'Righteous, cursive',
              fontSize: 'clamp(2rem, 4vw, 2.5rem)',
              fontWeight: '700',
              color: '#1e1b4b',
              marginBottom: '1rem',
            }}>
              Privacy Policy
            </h1>

            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#1e1b4b',
                marginBottom: '1rem',
                paddingBottom: '0.5rem',
                borderBottom: '2px solid #6366f1',
              }}>
                Information We Collect
              </h2>
              <ul style={{
                listStyle: 'none',
                padding: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
              }}>
                <li style={{
                  display: 'flex',
                  gap: '0.75rem',
                  color: '#4b5563',
                  fontSize: '1rem',
                  lineHeight: '1.6',
                }}>
                  <span style={{ color: '#6366f1', fontWeight: '700' }}>•</span>
                  <span>Name, email, phone number</span>
                </li>
                <li style={{
                  display: 'flex',
                  gap: '0.75rem',
                  color: '#4b5563',
                  fontSize: '1rem',
                  lineHeight: '1.6',
                }}>
                  <span style={{ color: '#6366f1', fontWeight: '700' }}>•</span>
                  <span>Payment details (processed securely by Razorpay)</span>
                </li>
                <li style={{
                  display: 'flex',
                  gap: '0.75rem',
                  color: '#4b5563',
                  fontSize: '1rem',
                  lineHeight: '1.6',
                }}>
                  <span style={{ color: '#6366f1', fontWeight: '700' }}>•</span>
                  <span>Device and usage information</span>
                </li>
              </ul>
            </section>

            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#1e1b4b',
                marginBottom: '1rem',
                paddingBottom: '0.5rem',
                borderBottom: '2px solid #6366f1',
              }}>
                How We Use Your Information
              </h2>
              <ul style={{
                listStyle: 'none',
                padding: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
              }}>
                <li style={{
                  display: 'flex',
                  gap: '0.75rem',
                  color: '#4b5563',
                  fontSize: '1rem',
                  lineHeight: '1.6',
                }}>
                  <span style={{ color: '#6366f1', fontWeight: '700' }}>•</span>
                  <span>To process orders and payments</span>
                </li>
                <li style={{
                  display: 'flex',
                  gap: '0.75rem',
                  color: '#4b5563',
                  fontSize: '1rem',
                  lineHeight: '1.6',
                }}>
                  <span style={{ color: '#6366f1', fontWeight: '700' }}>•</span>
                  <span>To send service updates</span>
                </li>
                <li style={{
                  display: 'flex',
                  gap: '0.75rem',
                  color: '#4b5563',
                  fontSize: '1rem',
                  lineHeight: '1.6',
                }}>
                  <span style={{ color: '#6366f1', fontWeight: '700' }}>•</span>
                  <span>To improve our platform</span>
                </li>
              </ul>
            </section>

            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#1e1b4b',
                marginBottom: '1rem',
                paddingBottom: '0.5rem',
                borderBottom: '2px solid #6366f1',
              }}>
                Data Security
              </h2>
              <p style={{
                color: '#4b5563',
                fontSize: '1rem',
                lineHeight: '1.6',
              }}>
                We follow industry-standard encryption and security practices.
              </p>
            </section>

            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#1e1b4b',
                marginBottom: '1rem',
                paddingBottom: '0.5rem',
                borderBottom: '2px solid #6366f1',
              }}>
                Cookies
              </h2>
              <p style={{
                color: '#4b5563',
                fontSize: '1rem',
                lineHeight: '1.6',
              }}>
                We may use cookies to enhance user experience.
              </p>
            </section>

            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#1e1b4b',
                marginBottom: '1rem',
                paddingBottom: '0.5rem',
                borderBottom: '2px solid #6366f1',
              }}>
                Your Rights
              </h2>
              <p style={{
                color: '#4b5563',
                fontSize: '1rem',
                lineHeight: '1.6',
              }}>
                You can request modification or deletion of your data anytime.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

