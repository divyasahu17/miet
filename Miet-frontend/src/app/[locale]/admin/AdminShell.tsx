"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { 
  FaThLarge, FaTags, FaList, FaUserCircle, FaSignOutAlt, 
  FaChevronLeft, FaChevronRight, FaUserMd, FaImages, FaCog, FaChevronDown 
} from "react-icons/fa";
import styles from './dashboard/admin.module.css';
import Footer from "@/components/Footer";

interface AdminShellProps {
  children: React.ReactNode;
  activeKey?: string;
}

export default function AdminShell({ children, activeKey }: AdminShellProps) {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale;
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [ailmentsExpanded, setAilmentsExpanded] = useState(false);

  useEffect(() => {
    if (activeKey === 'categories' || activeKey === 'subcategories') {
      setAilmentsExpanded(true);
    }
  }, [activeKey]);

  const handleLogout = () => {
    localStorage.removeItem("admin_jwt");
    router.push(`/${locale}/admin/login`);
  };

  const menu = [
    { key: 'dashboard', label: 'Dashboard', icon: <FaThLarge size={20} /> },
    {
      key: 'ailments',
      label: 'Ailments',
      icon: <FaTags size={20} />,
      children: [
        { key: 'categories', label: 'Categories', icon: <FaTags size={18} /> },
        { key: 'subcategories', label: 'Subcategories', icon: <FaList size={18} /> },
      ],
    },
    { key: 'consultants', label: 'Consultants', icon: <FaUserMd size={20} /> },
    { key: 'users', label: 'Users', icon: <FaUserCircle size={20} /> },
    { key: 'services', label: 'Services', icon: <FaTags size={20} /> },
    { key: 'products', label: 'Products', icon: <FaList size={20} /> },
    { key: 'orders', label: 'Orders', icon: <FaList size={20} /> },
    { key: 'blogs', label: 'Blogs & Media', icon: <FaList size={20} /> },
    { key: 'webinars', label: 'Webinars', icon: <FaList size={20} /> },
    { key: 'consultations', label: 'Consultations', icon: <FaUserMd size={20} /> },
    { key: 'gallery', label: 'Gallery', icon: <FaImages size={20} /> },
    { key: 'cms', label: 'CMS / Pages', icon: <FaCog size={20} /> },
    { key: 'subscriptions', label: 'Subscriptions', icon: <FaTags size={20} /> },
    { key: 'coupons', label: 'Coupons', icon: <FaTags size={20} /> },
  ];

  const handleMenuClick = (key: string) => {
    router.push(`/${locale}/admin/dashboard?tab=${key}`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#f8fafc' }}>
      {/* Header */}
      <div className={styles.extractedStyle27}>
        <div className={styles.extractedStyle28}>
          <button
            onClick={() => setSidebarOpen(o => !o)}
            className={styles.extractedStyle29}
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <FaChevronLeft /> : <FaChevronRight />}
          </button>
          <span className={styles.extractedStyle30}>MIET Admin Panel</span>
        </div>
        <div className={styles.extractedStyle31}>
          <button
            onClick={() => setShowProfileModal(true)}
            className={styles.extractedStyle32}
          >
            <FaUserCircle size={24} color="#fff" /> Profile
          </button>
          <button
            onClick={handleLogout}
            className={styles.extractedStyle33}
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </div>

      {/* Profile Modal */}
      {showProfileModal && (
        <div className={styles.extractedStyle34} onClick={e => { if (e.target === e.currentTarget) setShowProfileModal(false); }}>
          <div className={styles.extractedStyle35}>
            <button onClick={() => setShowProfileModal(false)} aria-label="Close profile modal" className={styles.extractedStyle36}>×</button>
            <h2 className={styles.extractedStyle37}>Superadmin Profile</h2>
            <div className={styles.extractedStyle38}>Username: admin</div>
            <div className={styles.extractedStyle39}>Role: Superadmin</div>
            <div className={styles.extractedStyle40}>You are logged in as the superadmin.</div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flex: 1 }}>
        {/* Sidebar */}
        <aside style={{
          width: sidebarOpen ? 240 : 70,
          background: 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)',
          color: '#fff',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: sidebarOpen ? 'flex-start' : 'center',
          paddingTop: '32px',
          minHeight: 'calc(100vh - 70px)',
          boxShadow: '4px 0 20px rgba(102, 126, 234, 0.15)',
          position: 'sticky',
          top: '70px',
          zIndex: 10
        }}>
          <div className={styles.extractedStyle42}>
            <div className={styles.extractedStyle43}>
              <Image src="/miet-main.webp" alt="MieT Logo" width={48} height={48} className={styles.extractedStyle44} priority />
            </div>
            {sidebarOpen && <span className={styles.extractedStyle45}>MieT</span>}
          </div>

          <nav className={styles.extractedStyle46} style={{ width: '100%' }}>
            {menu.map((item) => (
              'children' in item && Array.isArray(item.children) ? (
                <div key={item.key} style={{ width: '100%' }}>
                  <button
                    onClick={() => {
                      if (item.key === 'ailments') setAilmentsExpanded(!ailmentsExpanded);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: sidebarOpen ? 16 : 0,
                      width: '100%',
                      background: (item.key === 'ailments' && ailmentsExpanded) || item.children.some((c) => c.key === activeKey) ? 'rgba(255,255,255,0.2)' : 'transparent',
                      color: '#fff',
                      border: 'none',
                      borderRadius: sidebarOpen ? '0 12px 12px 0' : '0',
                      padding: sidebarOpen ? '16px 28px' : '16px 0',
                      fontWeight: 600,
                      fontSize: 16,
                      justifyContent: sidebarOpen ? 'flex-start' : 'center',
                      transition: 'all 0.2s ease',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{
                      background: (item.key === 'ailments' && ailmentsExpanded) || item.children.some((c) => c.key === activeKey) ? 'rgba(102, 126, 234, 0.9)' : 'rgba(102, 126, 234, 0.6)',
                      borderRadius: '8px',
                      padding: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {item.icon}
                    </div>
                    {sidebarOpen && <span style={{ flex: 1, textAlign: 'left' }}>{item.label}</span>}
                    {sidebarOpen && (
                      (item.key === 'ailments' && ailmentsExpanded) || item.children.some((c) => c.key === activeKey)
                        ? <FaChevronDown size={12} />
                        : <FaChevronRight size={12} />
                    )}
                  </button>
                  {sidebarOpen && ailmentsExpanded && item.key === 'ailments' && (
                    <div style={{ background: 'rgba(0,0,0,0.05)', width: '100%' }}>
                      {item.children.map((child) => (
                        <button
                          key={child.key}
                          onClick={() => handleMenuClick(child.key)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 16,
                            width: '100%',
                            background: activeKey === child.key ? 'rgba(255,255,255,0.2)' : 'transparent',
                            color: '#fff',
                            border: 'none',
                            padding: '12px 28px 12px 60px',
                            fontSize: 14,
                            fontWeight: activeKey === child.key ? 700 : 500,
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <span>{child.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <button
                  key={item.key}
                  onClick={() => handleMenuClick(item.key)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: sidebarOpen ? 16 : 0,
                    width: '100%',
                    background: activeKey === item.key ? 'rgba(255,255,255,0.2)' : 'transparent',
                    color: '#fff',
                    border: 'none',
                    borderRadius: sidebarOpen ? '0 12px 12px 0' : '0',
                    padding: sidebarOpen ? '16px 28px' : '16px 0',
                    fontWeight: 600,
                    fontSize: 16,
                    cursor: 'pointer',
                    justifyContent: sidebarOpen ? 'flex-start' : 'center',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{
                    background: activeKey === item.key ? 'rgba(102, 126, 234, 0.9)' : 'rgba(102, 126, 234, 0.6)',
                    borderRadius: '8px',
                    padding: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {item.icon}
                  </div>
                  {sidebarOpen && <span>{item.label}</span>}
                </button>
              )
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main style={{ flex: 1, padding: '32px', background: '#f8fafc', overflowY: 'auto' }}>
          {children}
          <Footer />
        </main>
      </div>
    </div>
  );
}
