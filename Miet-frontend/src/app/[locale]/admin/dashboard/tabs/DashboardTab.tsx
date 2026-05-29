"use client";
import React from 'react';
import Image from 'next/image';
import { FaThLarge, FaList, FaTags, FaUserCircle, FaSignOutAlt, FaChevronLeft, FaChevronRight, FaUserMd, FaChevronDown, FaSearch, FaEdit, FaTrash, FaPlus, FaEye, FaImages, FaCog, FaChartArea, FaUserFriends, FaShoppingCart } from "react-icons/fa";
import Select from "react-select";

export default function DashboardTab(props: any) {
  const {
    categories = [],
    subcategories = [],
    consultants = [],
    services = [],
    products = []
  } = props;

  return (
    <>

            <div style={{ marginBottom: 40 }}>
              <h2 style={{
                fontSize: 'clamp(24px, 4vw, 32px)',
                fontWeight: 700,
                color: '#667eea',
                marginBottom: 24,
                textAlign: 'center',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>Dashboard Overview</h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: 24,
                marginBottom: 32
              }}>
                {/* Ailments Overview Card */}
                <div style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: 20,
                  boxShadow: '0 8px 32px rgba(102, 126, 234, 0.2)',
                  padding: 32,
                  color: '#fff',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: -20,
                    right: -20,
                    width: 80,
                    height: 80,
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: '50%'
                  }} />
                  <div style={{ fontSize: 18, color: 'rgba(255,255,255,0.9)', fontWeight: 600, marginBottom: 12 }}>Ailments</div>
                  <div style={{ fontSize: 'clamp(28px, 5vw, 40px)', fontWeight: 800, color: '#fff', marginBottom: 8 }}>{categories.length + subcategories.length}</div>
                  <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)' }}>
                    {categories.length} Categories • {subcategories.length} Subcategories
                  </div>
                </div>

                {/* Consultants Card */}
                <div style={{
                  background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                  borderRadius: 20,
                  boxShadow: '0 8px 32px rgba(118, 75, 162, 0.2)',
                  padding: 32,
                  color: '#fff',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: -20,
                    right: -20,
                    width: 80,
                    height: 80,
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: '50%'
                  }} />
                  <div style={{ fontSize: 18, color: 'rgba(255,255,255,0.9)', fontWeight: 600, marginBottom: 12 }}>Consultants</div>
                  <div style={{ fontSize: 'clamp(28px, 5vw, 40px)', fontWeight: 800, color: '#fff', marginBottom: 8 }}>{consultants.length}</div>
                  <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)' }}>
                    {consultants.filter((c: any) => c.status === 'online').length} Online • {consultants.filter((c: any) => c.status === 'offline').length} Offline
                  </div>
                </div>

                {/* Services Card */}
                <div style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: 20,
                  boxShadow: '0 8px 32px rgba(102, 126, 234, 0.2)',
                  padding: 32,
                  color: '#fff',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: -20,
                    right: -20,
                    width: 80,
                    height: 80,
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: '50%'
                  }} />
                  <div style={{ fontSize: 18, color: 'rgba(255,255,255,0.9)', fontWeight: 600, marginBottom: 12 }}>Services</div>
                  <div style={{ fontSize: 'clamp(28px, 5vw, 40px)', fontWeight: 800, color: '#fff', marginBottom: 8 }}>{services.length}</div>
                  <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)' }}>
                    {services.filter((s: any) => s.service_type === 'appointment').length} Appointments • {services.filter((s: any) => s.service_type === 'subscription').length} Subscriptions
                  </div>
                </div>

                {/* Products Card */}
                <div style={{
                  background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                  borderRadius: 20,
                  boxShadow: '0 8px 32px rgba(118, 75, 162, 0.2)',
                  padding: 32,
                  color: '#fff',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: -20,
                    right: -20,
                    width: 80,
                    height: 80,
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: '50%'
                  }} />
                  <div style={{ fontSize: 18, color: 'rgba(255,255,255,0.9)', fontWeight: 600, marginBottom: 12 }}>Products</div>
                  <div style={{ fontSize: 'clamp(28px, 5vw, 40px)', fontWeight: 800, color: '#fff', marginBottom: 8 }}>{products.length}</div>
                  <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)' }}>
                    {products.filter((p: any) => p.type === 'Course').length} Courses • {products.filter((p: any) => p.type === 'E-book').length} E-books
                  </div>
                </div>
              </div>

              {/* Real-time Charts Section */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                gap: 24,
                marginBottom: 32
              }}>
                {/* Activity Chart */}
                <div style={{
                  background: '#fff',
                  borderRadius: 20,
                  boxShadow: '0 8px 32px rgba(102, 126, 234, 0.1)',
                  padding: 32,
                  border: '1px solid rgba(102, 126, 234, 0.1)'
                }}>
                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    color: '#667eea',
                    marginBottom: '24px',
                    textAlign: 'center'
                  }}>Monthly Activity</h3>
                  <div style={{
                    height: '200px',
                    display: 'flex',
                    alignItems: 'end',
                    justifyContent: 'space-around',
                    gap: '8px'
                  }}>
                    {Array.from({ length: 12 }, (_, i) => {
                      const month = new Date(2024, i, 1).toLocaleString('default', { month: 'short' });
                      const height = Math.floor(Math.random() * 80) + 20;
                      return (
                        <div key={i} style={{ textAlign: 'center' }}>
                          <div style={{
                            width: '24px',
                            height: `${height}px`,
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            borderRadius: '12px 12px 0 0',
                            marginBottom: '8px'
                          }} />
                          <div style={{ fontSize: '12px', color: '#6b7280' }}>{month}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Category Distribution Chart */}
                <div style={{
                  background: '#fff',
                  borderRadius: 20,
                  boxShadow: '0 8px 32px rgba(102, 126, 234, 0.1)',
                  padding: 32,
                  border: '1px solid rgba(102, 126, 234, 0.1)'
                }}>
                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    color: '#667eea',
                    marginBottom: '24px',
                    textAlign: 'center'
                  }}>Category Distribution</h3>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px'
                  }}>
                    {categories.slice(0, 5).map((cat: any, index: number) => {
                      const percentage = Math.floor((cat.id || 1) / categories.length * 100);
                      const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe'];
                      return (
                        <div key={cat.id} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            background: colors[index % colors.length]
                          }} />
                          <div style={{ flex: 1, fontSize: '14px', color: '#374151' }}>{cat.name}</div>
                          <div style={{ fontSize: '14px', fontWeight: '600', color: '#667eea' }}>{percentage}%</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Real-time Orders Section */}
              <div style={{
                background: '#fff',
                borderRadius: 20,
                boxShadow: '0 8px 32px rgba(102, 126, 234, 0.1)',
                padding: 32,
                border: '1px solid rgba(102, 126, 234, 0.1)',
                marginBottom: 32
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '24px'
                }}>
                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    color: '#667eea'
                  }}>Recent Orders</h3>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: '#10b981',
                      animation: 'pulse 2s infinite'
                    }} />
                    <span style={{ fontSize: '14px', color: '#6b7280' }}>Live Updates</span>
                  </div>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '16px'
                }}>
                  {/* Sample Orders - Replace with real data */}
                  {[
                    { id: 1, customer: 'John Doe', service: 'Therapy Session', amount: '$150', status: 'completed', time: '2 min ago' },
                    { id: 2, customer: 'Jane Smith', service: 'Consultation', amount: '$80', status: 'pending', time: '5 min ago' },
                    { id: 3, customer: 'Mike Johnson', service: 'Course Purchase', amount: '$299', status: 'processing', time: '8 min ago' },
                    { id: 4, customer: 'Sarah Wilson', service: 'Subscription', amount: '$99/month', status: 'active', time: '12 min ago' }
                  ].map((order: any) => (
                    <div key={order.id} style={{
                      background: '#f8fafc',
                      borderRadius: '12px',
                      padding: '16px',
                      border: '1px solid #e2e8f0',
                      transition: 'all 0.2s ease'
                    }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: '8px'
                      }}>
                        <div style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>{order.customer}</div>
                        <div style={{
                          fontSize: '12px',
                          padding: '4px 8px',
                          borderRadius: '6px',
                          background: order.status === 'completed' ? '#d1fae5' :
                            order.status === 'pending' ? '#fef3c7' :
                              order.status === 'processing' ? '#dbeafe' : '#e0e7ff',
                          color: order.status === 'completed' ? '#065f46' :
                            order.status === 'pending' ? '#92400e' :
                              order.status === 'processing' ? '#1e40af' : '#3730a3'
                        }}>
                          {order.status}
                        </div>
                      </div>
                      <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>{order.service}</div>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <div style={{ fontSize: '14px', fontWeight: '600', color: '#667eea' }}>{order.amount}</div>
                        <div style={{ fontSize: '12px', color: '#9ca3b8' }}>{order.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          
    </>
  );
}
