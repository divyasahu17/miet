'use client';

import React from 'react';
import TopBar from '@/components/TopBar';
import Footer from '@/components/Footer';
import { useCmsContent, cmsOrT } from '@/hooks/useCmsContent';

export default function PrivacyPage() {
  const { content: cmsContent } = useCmsContent('privacy');
  
  // Provide sensible defaults just in case CMS is completely empty
  const defaultTitle = "Privacy Policy";
  const defaultBody = "<p>Please update this privacy policy in the Admin Dashboard -> CMS pages.</p>";

  const title = cmsOrT(cmsContent, 'content', 'title', defaultTitle);
  const body = cmsOrT(cmsContent, 'content', 'body', defaultBody);
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
              {title}
            </h1>

            <div 
              className="cms-content"
              style={{ color: '#4b5563', lineHeight: '1.6', fontSize: '1rem' }}
              dangerouslySetInnerHTML={{ __html: body }}
            />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

