"use client";
import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useCmsContent, getCmsValue, cmsOrT } from '@/hooks/useCmsContent';
import { getApiUrl } from '@/utils/api';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa';

export default function AboutSection() {
  const t = useTranslations('AboutSection');

  const { content: cmsContent } = useCmsContent('about');
  
  const text = (sectionKey: string, fieldKey: string, fallback: string) => cmsOrT(cmsContent, sectionKey, fieldKey, fallback);
  const html = (sectionKey: string, fieldKey: string, fallback: string) => {
    const v = getCmsValue(cmsContent, sectionKey, fieldKey);
    return (v != null && v !== '') ? v : fallback;
  };

  const [activeTab, setActiveTab] = useState(0);
  const [teamData, setTeamData] = useState<any[]>([]);
  const [programmeData, setProgrammeData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    async function fetchData() {
      try {
        const [teamRes, programmeRes] = await Promise.all([
          fetch(getApiUrl('api/team')),
          fetch(getApiUrl('api/programmes'))
        ]);
        if (teamRes.ok) {
          const data = await teamRes.json();
          setTeamData(data.team || data);
        }
        if (programmeRes.ok) {
          const data = await programmeRes.json();
          setProgrammeData(data.programmes || data);
        }
      } catch (err) {
        console.error('Error fetching about data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
    
    // Set up polling to refresh data every 30 seconds for real-time CMS updates
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const tabs = [
    {
      label: text('tabs', 'overview', t('tabs.overview')),
      content: (
        <div
          style={{
            maxWidth: 'min(1200px, 96vw)',
            margin: '0 auto',
            color: '#22543d',
            fontSize: 18,
            lineHeight: 1.7,
            display: 'flex',
            flexDirection: 'row',
            gap: 40,
            flexWrap: 'wrap',
            alignItems: 'flex-start',
          }}
        >
          <div style={{ flex: 1, minWidth: 280 }}>
            <h3 style={{
              color: '#667eea',
              fontWeight: '700',
              fontSize: 'clamp(1.5rem, 2vw, 1.8rem)',
              marginBottom: '1rem',
              lineHeight: '1.3'
            }}>
              {text('overview', 'title', t('overview.title'))}
            </h3>
            <p dangerouslySetInnerHTML={{ __html: html('overview', 'description1', t.raw('overview.description1')) }} />
            <h3 style={{ color: '#5a67d8', fontWeight: 700, marginTop: 32 }}>
              {text('overview', 'communityTitle', t('overview.communityTitle'))}
            </h3>
            <p>
              {text('overview', 'communityDescription', t('overview.communityDescription'))}
            </p>
            <h3 style={{ color: '#5a67d8', fontWeight: 700, marginTop: 32 }}>{text('overview', 'aboutTitle', t('overview.aboutTitle'))}</h3>
            <p dangerouslySetInnerHTML={{ __html: html('overview', 'aboutIntro', t.raw('overview.aboutIntro')) }} />
            <p>
              {text('overview', 'aboutDesc1', t('overview.aboutDesc1'))}
            </p>
            <p>
              {text('overview', 'aboutDesc2', t('overview.aboutDesc2'))}
            </p>
            <p>{text('overview', 'joinUs', t('overview.joinUs'))}</p>
            <div style={{ color: '#5a67d8', fontWeight: 600, marginTop: 18 }}>
              {text('overview', 'tags', t('overview.tags'))}
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 280, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
            <img
              src="/intro.webp"
              alt="MieT Hero"
              style={{ width: '100%', maxWidth: 420, borderRadius: 16, margin: '0 auto', display: 'block', boxShadow: '0 4px 24px #5a67d822' }}
            />
            <iframe
              width="100%"
              height="260"
              src="https://www.youtube.com/embed/hQFG_yXbmIM"
              title="MieT Introduction"
              style={{ borderRadius: 12, boxShadow: '0 2px 12px #5a67d822', minWidth: 220 }}
              allowFullScreen
            ></iframe>
          </div>
        </div>
      ),
    },
    {
      label: text('tabs', 'vision', t('tabs.vision')),
      content: (
        <div style={{ maxWidth: 900, margin: '0 auto', color: '#22543d', fontSize: 18, lineHeight: 1.7 }}>
          <h3 style={{ color: '#5a67d8', fontWeight: 700 }}>{text('vision', 'title', t('vision.title'))}</h3>
          <p>{text('vision', 'p1', t('vision.p1'))}</p>
          <p>{text('vision', 'p2', t('vision.p2'))}</p>
          <p>{text('vision', 'p3', t('vision.p3'))}</p>
          <div style={{ color: '#5a67d8', fontWeight: 600, marginTop: 18 }}>{text('vision', 'tags', t('vision.tags'))}</div>
        </div>
      ),
    },
    {
      label: text('tabs', 'founder', t('tabs.founder')),
      content: (
        <div style={{ maxWidth: 900, margin: '0 auto', color: '#22543d', fontSize: 18, lineHeight: 1.7, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h3 style={{ color: '#5a67d8', fontWeight: 700 }}>{text('founder', 'title', t('founder.title'))}</h3>
          <img src="/founder.webp" alt="Dr. Jyoti Bajaj" style={{ width: 180, height: 180, borderRadius: '50%', objectFit: 'cover', border: '4px solid #5a67d8', margin: '18px 0', boxShadow: '0 2px 12px #5a67d822' }} />
          <p dangerouslySetInnerHTML={{ __html: html('founder', 'p1', t.raw('founder.p1')) }} />
          <p>{text('founder', 'p2', t('founder.p2'))}</p>
          <p>{text('founder', 'p3', t('founder.p3'))}</p>
          <a href="mailto:info@miet.life" style={{ color: '#5a67d8', fontWeight: 600, textDecoration: 'underline', marginTop: 12, display: 'inline-block' }}>{text('founder', 'writeToUs', t('founder.writeToUs'))}</a>
        </div>
      ),
    },
    {
      label: text('tabs', 'team', t('tabs.team')),
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
          <h2 style={{
            textAlign: 'center',
            fontSize: '2.5rem',
            fontWeight: 800,
            color: '#1e293b',
            marginBottom: '1rem',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>Meet Our Team</h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 480px), 1fr))',
            gap: 30,
            padding: '20px 0'
          }}>
            {isLoading ? (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', color: '#5a67d8', fontWeight: 600 }}>Loading team data...</div>
            ) : teamData.length > 0 ? teamData.map((member: any, index: number) => (
              <div
                key={index}
                style={{
                  background: 'rgba(255,255,255,0.8)',
                  borderRadius: '24px',
                  padding: '30px',
                  display: 'flex',
                  flexDirection: 'row',
                  gap: 24,
                  alignItems: 'center',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
                  border: '1px solid rgba(102, 126, 234, 0.1)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 15px 35px rgba(102, 126, 234, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.05)';
                }}
              >
                <div style={{ flexShrink: 0 }}>
                  <img
                    src={member.image_url ? (process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000') + member.image_url : (member.image || "/team.webp")}
                    alt={member.name || member.title}
                    style={{
                      width: 120,
                      height: 120,
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '4px solid #fff',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                    }}
                  />
                </div>
                <div>
                  <h3 style={{ color: '#1e293b', fontWeight: 700, fontSize: '1.4rem', margin: '0 0 4px 0' }}>{member.name || member.title}</h3>
                  <div style={{ color: '#667eea', fontWeight: 600, fontSize: '0.95rem', marginBottom: 12 }}>{member.designation || member.role}</div>
                  <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: 1.6, margin: 0, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {member.bio || member.description}
                  </p>
                  
                  {/* Social Media Links */}
                  <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                    {member.linkedin && (
                      <a href={member.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: '#0077b5', fontSize: '1.2rem', transition: 'transform 0.2s' }} onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.2)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
                        <FaLinkedin />
                      </a>
                    )}
                    {member.instagram && (
                      <a href={member.instagram} target="_blank" rel="noopener noreferrer" style={{ color: '#e1306c', fontSize: '1.2rem', transition: 'transform 0.2s' }} onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.2)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
                        <FaInstagram />
                      </a>
                    )}
                    {member.facebook && (
                      <a href={member.facebook} target="_blank" rel="noopener noreferrer" style={{ color: '#1877f2', fontSize: '1.2rem', transition: 'transform 0.2s' }} onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.2)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
                        <FaFacebook />
                      </a>
                    )}
                    {member.twitter && (
                      <a href={member.twitter} target="_blank" rel="noopener noreferrer" style={{ color: '#1da1f2', fontSize: '1.2rem', transition: 'transform 0.2s' }} onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.2)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
                        <FaTwitter />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )) : (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', color: '#64748b' }}>No team members found.</div>
            )}
          </div>
        </div>
      ),
    },
    {
      label: text('tabs', 'programmes', t('tabs.programmes')),
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 60 }}>
          {programmeData.length > 0 ? programmeData.map((prog: any, index: number) => (
            <div
              key={index}
              style={{
                maxWidth: 'min(1200px, 96vw)',
                margin: '0 auto',
                color: '#22543d',
                fontSize: 18,
                lineHeight: 1.7,
                display: 'flex',
                flexDirection: index % 2 === 0 ? 'row' : 'row-reverse',
                gap: 40,
                flexWrap: 'wrap',
                alignItems: 'flex-start',
                padding: '20px 0'
              }}
            >
              <div style={{ flex: 1, minWidth: 280, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <img
                  src={
                    prog.image_url ? (process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000') + prog.image_url :
                      (prog.image || "/programmes.webp")
                  }
                  alt={prog.title}
                  style={{ width: '100%', maxWidth: 480, borderRadius: 16, boxShadow: '0 2px 12px #5a67d822' }}
                />
              </div>
              <div style={{ flex: 1, minWidth: 280, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <h3 style={{ color: '#5a67d8', fontWeight: 700, fontSize: '1.8rem', marginBottom: '1.5rem' }}>{prog.title}</h3>
                {prog.description && <p style={{ marginBottom: 20 }}>{prog.description}</p>}
                {prog.p1_title && <h4 style={{ color: '#22543d', fontWeight: 700, marginTop: 18 }}>{prog.p1_title}</h4>}
                {prog.p1_description && <p dangerouslySetInnerHTML={{ __html: prog.p1_description }} />}
                {prog.p2_title && <h4 style={{ color: '#22543d', fontWeight: 700, marginTop: 18 }}>{prog.p2_title}</h4>}
                {prog.p2_description && <p dangerouslySetInnerHTML={{ __html: prog.p2_description }} />}
              </div>
            </div>
          )) : (
            <div style={{ textAlign: 'center', padding: '40px' }}>Loading programmes...</div>
          )}
        </div>
      ),
    },
  ];

  return (
    <section
      className="about-section"
      style={{
        padding: '0 2rem',
        textAlign: 'center'
      }}
      aria-label="About us"
    >
      {/* Tab Navigation */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '1rem',
          marginBottom: '3rem',
          flexWrap: 'wrap',
          padding: '0 1rem'
        }}
      >
        {tabs.map((tab, idx) => (
          <button
            key={tab.label}
            onClick={() => setActiveTab(idx)}
            style={{
              background: activeTab === idx ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'rgba(255,255,255,0.9)',
              color: activeTab === idx ? '#ffffff' : '#1e1b4b',
              border: activeTab === idx ? 'none' : '2px solid rgba(99, 102, 241, 0.2)',
              borderRadius: '15px',
              padding: '1rem 2rem',
              fontWeight: '700',
              fontSize: 'clamp(0.9rem, 1.1vw, 1.1rem)',
              cursor: 'pointer',
              boxShadow: activeTab === idx ? '0 8px 25px rgba(99, 102, 241, 0.3)' : '0 4px 15px rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease',
              outline: 'none',
              backdropFilter: 'blur(10px)',
              minWidth: '120px'
            }}
            onMouseEnter={(e) => {
              if (activeTab !== idx) {
                e.currentTarget.style.background = 'rgba(99, 102, 241, 0.1)';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(99, 102, 241, 0.2)';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== idx) {
                e.currentTarget.style.background = 'rgba(255,255,255,0.9)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
              }
            }}
            aria-selected={activeTab === idx}
            aria-controls={`about-tabpanel-${idx}`}
            id={`about-tab-${idx}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div
        id={`about-tabpanel-${activeTab}`}
        role="tabpanel"
        aria-labelledby={`about-tab-${activeTab}`}
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          textAlign: 'left',
          background: 'rgba(255,255,255,0.95)',
          borderRadius: '24px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
          padding: '3rem',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.2)',
          transition: 'all 0.3s ease'
        }}
      >
        {tabs[activeTab].content}
      </div>
    </section>
  );
}
