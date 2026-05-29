'use client';

import React from 'react';
import TopBar from '@/components/TopBar';
import Footer from '@/components/Footer';

export default function TermsPage() {
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
              Terms & Conditions
            </h1>
            <p style={{
              fontSize: '1.1rem',
              color: '#4b5563',
              marginBottom: '2rem',
              lineHeight: '1.6',
            }}>
              Welcome to MIET Life. By accessing our website, you agree to our terms.
            </p>

            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#1e1b4b',
                marginBottom: '1rem',
                paddingBottom: '0.5rem',
                borderBottom: '2px solid #6366f1',
              }}>
                User Responsibilities
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
                  <span>Provide accurate information during signup or transactions.</span>
                </li>
                <li style={{
                  display: 'flex',
                  gap: '0.75rem',
                  color: '#4b5563',
                  fontSize: '1rem',
                  lineHeight: '1.6',
                }}>
                  <span style={{ color: '#6366f1', fontWeight: '700' }}>•</span>
                  <span>Misuse of services may result in account suspension.</span>
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
                Payments
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
                  <span>All transactions are securely processed via Razorpay.</span>
                </li>
                <li style={{
                  display: 'flex',
                  gap: '0.75rem',
                  color: '#4b5563',
                  fontSize: '1rem',
                  lineHeight: '1.6',
                }}>
                  <span style={{ color: '#6366f1', fontWeight: '700' }}>•</span>
                  <span>Users are responsible for valid payment information.</span>
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
                Liability
              </h2>
              <p style={{
                color: '#4b5563',
                fontSize: '1rem',
                lineHeight: '1.6',
              }}>
                MIET Life is not liable for any direct or indirect losses.
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
                Governing Law
              </h2>
              <p style={{
                color: '#4b5563',
                fontSize: '1rem',
                lineHeight: '1.6',
              }}>
                These terms are governed by the laws of India.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

