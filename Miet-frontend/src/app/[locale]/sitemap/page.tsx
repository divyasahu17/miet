"use client";
import React from 'react';
import Link from 'next/link';
import { FaHome, FaInfoCircle, FaCogs, FaUsers, FaShoppingCart, FaGraduationCap, FaPhone, FaBlog, FaMapMarkerAlt, FaGlobe } from 'react-icons/fa';

export default function SitemapPage() {
  const sitemapData = [
    {
      title: "Main Pages",
      icon: <FaHome />,
      links: [
        { name: "Home", href: "/", description: "Main landing page with featured content" },
        { name: "About Us", href: "/about", description: "Learn about MIET's mission and values" },
        { name: "Contact Us", href: "/contact", description: "Get in touch with our team" }
      ]
    },
    {
      title: "Services",
      icon: <FaCogs />,
      links: [
        { name: "Our Services", href: "/services", description: "Overview of all services offered" },
        { name: "Education Services", href: "/services/education", description: "Special education and learning support" },
        { name: "Inclusion Services", href: "/services/inclusion", description: "Inclusive education programs" },
        { name: "Mental Health Services", href: "/services/mind", description: "Mental health and wellness support" },
        { name: "Technology Services", href: "/services/technology", description: "Tech-enabled learning solutions" }
      ]
    },
    {
      title: "Consultants",
      icon: <FaUsers />,
      links: [
        { name: "Find Consultants", href: "/consultants", description: "Browse our network of specialists" },
        { name: "Consultant Profiles", href: "/consultants", description: "Detailed profiles and expertise areas" }
      ]
    },
    {
      title: "Marketplace",
      icon: <FaShoppingCart />,
      links: [
        { name: "Marketplace Home", href: "/marketplace", description: "Browse all products and resources" },
        { name: "Courses", href: "/marketplace/course", description: "Educational courses and programs" },
        { name: "Books", href: "/marketplace/e-book", description: "Educational books and literature" },
        { name: "Apps & Tools", href: "/marketplace/app", description: "Digital tools and applications" },
        { name: "Gadgets", href: "/marketplace/gadget", description: "Assistive technology devices" }
      ]
    },
    {
      title: "Learning",
      icon: <FaGraduationCap />,
      links: [
        { name: "Courses", href: "/courses", description: "Browse available courses" },
        { name: "Course Details", href: "/courses", description: "Detailed course information" }
      ]
    },
    {
      title: "Resources",
      icon: <FaBlog />,
      links: [
        { name: "Blog & Media", href: "/resources/blog", description: "Latest articles and insights" },
        { name: "Free Resources", href: "/resources/free", description: "Downloadable materials and tools" },
        { name: "Legal Framework", href: "/resources/legal", description: "Legal information and guidelines" }
      ]
    },
    {
      title: "User Account",
      icon: <FaGlobe />,
      links: [
        { name: "Shopping Cart", href: "/cart", description: "View and manage your cart" },
        { name: "Login", href: "#", description: "Access your account" },
        { name: "Sign Up", href: "#", description: "Create a new account" }
      ]
    }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      padding: '2rem 0'
    }}>
      {/* Header */}
      <div style={{
        textAlign: 'center',
        marginBottom: '3rem',
        padding: '0 2rem'
      }}>
        <h1 style={{
          fontFamily: 'Righteous, cursive',
          fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
          fontWeight: '700',
          color: '#1e1b4b',
          marginBottom: '1rem',
          textShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          Site Map
        </h1>
        <p style={{
          fontSize: 'clamp(1.1rem, 2vw, 1.3rem)',
          color: '#4b5563',
          maxWidth: '600px',
          margin: '0 auto',
          lineHeight: '1.6'
        }}>
          Navigate through all the pages and resources available on MIET
        </p>
      </div>

      {/* Sitemap Content */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 2rem'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '2rem'
        }}>
          {sitemapData.map((section, index) => (
            <div
              key={index}
              style={{
                background: 'rgba(255,255,255,0.95)',
                borderRadius: '20px',
                padding: '2rem',
                boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 25px 70px rgba(99, 102, 241, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 20px 60px rgba(0,0,0,0.1)';
              }}
            >
              {/* Section Header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                marginBottom: '1.5rem',
                paddingBottom: '1rem',
                borderBottom: '2px solid rgba(99, 102, 241, 0.1)'
              }}>
                <div style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: '#ffffff',
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)'
                }}>
                  {section.icon}
                </div>
                <h2 style={{
                  fontSize: 'clamp(1.3rem, 1.5vw, 1.4rem)',
                  fontWeight: '700',
                  color: '#1e1b4b',
                  margin: 0
                }}>
                  {section.title}
                </h2>
              </div>

              {/* Section Links */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
              }}>
                {section.links.map((link, linkIndex) => (
                  <div
                    key={linkIndex}
                    style={{
                      padding: '1rem',
                      borderRadius: '12px',
                      background: 'rgba(99, 102, 241, 0.05)',
                      border: '1px solid rgba(99, 102, 241, 0.1)',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(99, 102, 241, 0.1)';
                      e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.2)';
                      e.currentTarget.style.transform = 'translateX(5px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(99, 102, 241, 0.05)';
                      e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.1)';
                      e.currentTarget.style.transform = 'translateX(0)';
                    }}
                  >
                    <Link
                      href={link.href}
                      style={{
                        textDecoration: 'none',
                        color: '#667eea',
                        fontWeight: '600',
                        fontSize: 'clamp(1rem, 1.1vw, 1.05rem)',
                        display: 'block',
                        marginBottom: '0.5rem'
                      }}
                    >
                      {link.name}
                    </Link>
                    <p style={{
                      color: '#6b7280',
                      fontSize: 'clamp(0.9rem, 1vw, 0.95rem)',
                      margin: 0,
                      lineHeight: '1.5'
                    }}>
                      {link.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Navigation */}
        <div style={{
          marginTop: '3rem',
          textAlign: 'center'
        }}>
          <div style={{
            background: 'rgba(255,255,255,0.9)',
            borderRadius: '20px',
            padding: '2rem',
            border: '1px solid rgba(99, 102, 241, 0.1)',
            backdropFilter: 'blur(10px)'
          }}>
            <h3 style={{
              fontSize: 'clamp(1.5rem, 2vw, 1.8rem)',
              fontWeight: '700',
              color: '#1e1b4b',
              marginBottom: '1rem'
            }}>
              Quick Navigation
            </h3>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1rem',
              justifyContent: 'center'
            }}>
              {[
                { name: 'Home', href: '/', icon: <FaHome /> },
                { name: 'About', href: '/about', icon: <FaInfoCircle /> },
                { name: 'Services', href: '/services', icon: <FaCogs /> },
                { name: 'Consultants', href: '/consultants', icon: <FaUsers /> },
                { name: 'Marketplace', href: '/marketplace', icon: <FaShoppingCart /> },
                { name: 'Courses', href: '/courses', icon: <FaGraduationCap /> },
                { name: 'Contact', href: '/contact', icon: <FaPhone /> }
              ].map((quickLink, index) => (
                <Link
                  key={index}
                  href={quickLink.href}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: '#ffffff',
                    textDecoration: 'none',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '12px',
                    fontWeight: '600',
                    fontSize: 'clamp(0.9rem, 1vw, 1rem)',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(99, 102, 241, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(99, 102, 241, 0.3)';
                  }}
                >
                  {quickLink.icon}
                  {quickLink.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
