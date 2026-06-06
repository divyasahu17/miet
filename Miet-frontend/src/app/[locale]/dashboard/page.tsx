'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import GoogleAuth from '@/components/GoogleAuth';
import { useNotifications } from '@/components/NotificationSystem';
import { getApiUrl } from '@/utils/api';
import { supabase, getSupabaseAccessToken } from '@/utils/supabase';
import { FaCalendarAlt, FaVideo, FaUserMd, FaClock, FaMapMarkerAlt, FaPhone, FaEnvelope, FaEdit, FaTrash, FaUser, FaHome, FaShoppingCart } from 'react-icons/fa';
import TopBar from '@/components/TopBar';
import Footer from '@/components/Footer';
import SearchPanel from '@/components/SearchPanel';
import { useLocale } from 'next-intl';
import MyEvents from './MyEvents';

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  subscription_plan?: string;
  subscription_start?: string;
  subscription_end?: string;
}


interface Consultation {
  id: number;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  price: number;
  status: string;
  payment_status: string;
  google_meet_link?: string;
  google_calendar_event_id?: string;
  consultant_name?: string;
  consultant_email?: string;
}

interface Webinar {
  id: number;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  price: number;
  is_free: boolean;
  status: string;
  google_meet_link?: string;
  organizer_email?: string;
}

export default function UserDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [upcomingWebinars, setUpcomingWebinars] = useState<Webinar[]>([]);
  const [purchases, setPurchases] = useState<any[]>([]);
  const [subscriptionPlans, setSubscriptionPlans] = useState<any[]>([]);
  const [ordersPage, setOrdersPage] = useState(1);
  const ordersPerPage = 4;
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<'overview' | 'consultations' | 'webinars' | 'search' | 'profile' | 'orders' | 'events' | 'subscriptions'>('search');
  const [profileLoading, setProfileLoading] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [country, setCountry] = useState('India');
  const [currentAddressId, setCurrentAddressId] = useState<number | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addNotification } = useNotifications();
  const locale = useLocale();

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && ['overview', 'consultations', 'webinars', 'search', 'profile', 'orders', 'events', 'subscriptions'].includes(tabParam)) {
      setActiveSection(tabParam as any);
    }
  }, [searchParams]);

  useEffect(() => {
    if (activeSection === 'profile') {
      loadProfileAndAddresses();
    }
  }, [activeSection]);

  useEffect(() => {
    checkAuthAndLoadData();
  }, []);

  const checkAuthAndLoadData = async () => {
    try {
      // Check Supabase session first
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !session?.user) {
        setLoading(false);
        return;
      }

      // Map Supabase user to our User interface
      const supabaseUser = session.user;
      const fullName = supabaseUser.user_metadata?.full_name ||
                       supabaseUser.user_metadata?.name ||
                       supabaseUser.email?.split('@')[0] ||
                       'User';
      const nameParts = fullName.split(' ');
      const first_name = nameParts[0] || '';
      const last_name = nameParts.slice(1).join(' ') || '';

      const mappedUser: User = {
        id: parseInt(supabaseUser.id) || 0,
        first_name,
        last_name,
        email: supabaseUser.email || '',
        phone: supabaseUser.user_metadata?.phone || undefined
      };

      setUser(mappedUser);
      setFirstName(first_name);
      setLastName(last_name);
      setPhone(supabaseUser.user_metadata?.phone || '');

      // Get Supabase access token for API calls
      const token = session.access_token;
      
      // Store token globally so other pages know we are logged in
      localStorage.setItem('user_jwt', token);

      // Load user's consultations
      await loadConsultations(token);

      await loadPurchases(mappedUser.email);

      // Load upcoming webinars
      await loadUpcomingWebinars();

      // Pre-load profile addresses
      await loadProfileAndAddresses();

      // Load User Subscription Plans
      try {
        const subRes = await fetch(getApiUrl('api/admin/subscription-plans'));
        if (subRes.ok) {
          const allPlans = await subRes.json();
          setSubscriptionPlans(allPlans.filter((p: any) => p.target_audience === 'user' && p.status === 'active'));
        }
      } catch (err) {
        console.error('Error fetching subscription plans:', err);
      }

      // Check for pending booking redirection
      const pendingConsultantId = localStorage.getItem('pending_consultant_id');
      if (pendingConsultantId) {
        // Redirect to consultations page to resume booking
        router.push(`/${locale}/services/consultations?consultantId=${pendingConsultantId}`);
        return;
      }

      // Check for pending event redirection
      const pendingEventId = localStorage.getItem('pending_event_id');
      if (pendingEventId) {
        localStorage.removeItem('pending_event_id');
        router.push(`/${locale}/events?eventId=${pendingEventId}`);
      }
    } catch (error) {
      console.error('Error checking auth:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadProfileAndAddresses = async () => {
    try {
      setProfileLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      
      const token = session.access_token;
      const response = await fetch(getApiUrl('api/auth/profile'), {
        headers: { 
          'Authorization': `Bearer ${token}` 
        }
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.user) {
          setFirstName(data.user.first_name || '');
          setLastName(data.user.last_name || '');
          setPhone(data.user.phone || '');
          setUser((prev: any) => ({
            ...prev,
            subscription_plan: data.user.subscription_plan,
            subscription_start: data.user.subscription_start,
            subscription_end: data.user.subscription_end,
          }));
          const userAddress = data.user.addresses && data.user.addresses.length > 0 
            ? data.user.addresses[0] 
            : null;
            
          if (userAddress) {
            setAddressLine1(userAddress.address_line1 || '');
            setCity(userAddress.city || '');
            setState(userAddress.state || '');
            setZipCode(userAddress.zip_code || '');
            setCountry(userAddress.country || 'India');
            setCurrentAddressId(userAddress.id);
          }
        }
      }
    } catch (error) {
      console.error('Error loading profile address:', error);
    } finally {
      setProfileLoading(false);
    }
  };

  const handleSaveProfileAndAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName) {
      addNotification({
        type: 'error',
        title: 'Validation Error',
        message: 'First name and last name are required'
      });
      return;
    }
    if (!addressLine1 || !city || !state || !zipCode) {
      addNotification({
        type: 'error',
        title: 'Validation Error',
        message: 'Please fill in all address fields'
      });
      return;
    }
    
    try {
      setSavingProfile(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        addNotification({
          type: 'error',
          title: 'Authentication Error',
          message: 'Session not found. Please log in again.'
        });
        return;
      }
      
      const token = session.access_token;
      
      // 1. Update user profile first_name, last_name, phone
      const profileResponse = await fetch(getApiUrl('api/auth/profile'), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          phone: phone
        })
      });
      
      const profileData = await profileResponse.json();
      if (!profileResponse.ok || !profileData.success) {
        addNotification({
          type: 'error',
          title: 'Error',
          message: profileData.message || 'Failed to update profile details'
        });
        setSavingProfile(false);
        return;
      }

      // Update user context
      if (user) {
        setUser({
          ...user,
          first_name: firstName,
          last_name: lastName,
          phone: phone
        });
      }

      // Update Supabase user metadata so other components (like TopBar) sync up immediately
      await supabase.auth.updateUser({
        data: {
          full_name: `${firstName} ${lastName}`,
          name: `${firstName} ${lastName}`
        }
      });

      // 2. Update/create address
      const payload = {
        addressLine1,
        city,
        state,
        zipCode,
        country,
        isDefault: true
      };
      
      let url = getApiUrl('api/auth/addresses');
      let method = 'POST';
      
      if (currentAddressId) {
        url = getApiUrl(`api/auth/addresses/${currentAddressId}`);
        method = 'PUT';
      }
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      if (response.ok && data.success) {
        addNotification({
          type: 'success',
          title: 'Success',
          message: 'Profile and address updated successfully'
        });
        if (data.address && data.address.id) {
          setCurrentAddressId(data.address.id);
        }
      } else {
        addNotification({
          type: 'error',
          title: 'Error',
          message: data.message || 'Failed to save address'
        });
      }
    } catch (error) {
      console.error('Error saving profile/address:', error);
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Something went wrong while saving details'
      });
    } finally {
      setSavingProfile(false);
    }
  };



  const loadPurchases = async (email: string) => {

    try {

      const response = await fetch(
        `${getApiUrl('api/user/purchases')}?email=${email}&t=${Date.now()}`,
        { cache: 'no-store' }
      );

      if (response.ok) {

        const data = await response.json();

        setPurchases(data.purchases || []);

      }

    } catch (error) {

      console.error("Purchase load error:", error);

    }

  };









  const loadConsultations = async (token: string) => {
    try {

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      const response = await fetch(`${getApiUrl('api/consultations/by-email')}`, {
        headers: { 'Authorization': `Bearer ${token}` },
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();


        setConsultations(data.appointments || []);
      } else {
        const errorData = await response.json();

      }
    } catch (error) {

    }
  };

  const loadUpcomingWebinars = async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      const response = await fetch(`${getApiUrl('api/webinars/public')}`, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (response.ok) {
        const data = await response.json();
        // Filter for upcoming webinars
        const upcoming = (data.webinars || []).filter((webinar: Webinar) =>
          new Date(webinar.start_time) > new Date() && webinar.status === 'scheduled'
        );
        setUpcomingWebinars(upcoming);
      }
    } catch (error) {

    }
  };

  const handleBookConsultation = () => {
    router.push('/services/consultations');
  };

  const handleViewWebinars = () => {
    router.push('/services/webinars');
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div style={{
          fontSize: '18px',
          color: 'white',
          fontWeight: '600'
        }}>
          Loading Dashboard...
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '40px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
          textAlign: 'center',
          maxWidth: '400px',
          width: '100%'
        }}>
          <h1 style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#333',
            marginBottom: '16px'
          }}>
            Welcome to MIET
          </h1>
          <p style={{
            fontSize: '16px',
            color: '#666',
            marginBottom: '32px',
            lineHeight: '1.5'
          }}>
            Please login to access your dashboard and book consultations
          </p>
          <GoogleAuth />
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <TopBar />
      <div style={{
        flex: 1,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '20px'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {/* Header */}
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '32px',
            marginBottom: '24px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '16px'
            }}>
              <div>
                <h1 style={{
                  fontSize: '32px',
                  fontWeight: '700',
                  color: '#333',
                  marginBottom: '8px'
                }}>
                  Welcome back, {user.first_name}  {user.last_name}
                </h1>
                <p style={{
                  fontSize: '16px',
                  color: '#666'
                }}>
                  Manage your consultations and explore upcoming webinars
                </p>
              </div>
              {/* <GoogleAuth /> */}
            </div>
          </div>

          {/* Breadcrumbs Navigation */}
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '20px 32px',
            marginBottom: '24px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{
              display: 'flex',
              gap: '8px',
              alignItems: 'center',
              flexWrap: 'wrap'
            }}>
              <button
                onClick={() => setActiveSection('overview')}
                style={{
                  background: activeSection === 'overview' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
                  color: activeSection === 'overview' ? 'white' : '#666',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '10px 20px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <FaCalendarAlt />
                Overview
              </button>
              <span style={{ color: '#d1d5db', fontSize: '18px' }}>|</span>
              <button
                onClick={() => setActiveSection('consultations')}
                style={{
                  background: activeSection === 'consultations' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
                  color: activeSection === 'consultations' ? 'white' : '#666',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '10px 20px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <FaUserMd />
                My Consultations
              </button>
              <span style={{ color: '#d1d5db', fontSize: '18px' }}>|</span>
              <button
                onClick={() => setActiveSection('webinars')}
                style={{
                  background: activeSection === 'webinars' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'transparent',
                  color: activeSection === 'webinars' ? 'white' : '#666',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '10px 20px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <FaVideo />
                Upcoming Webinars
              </button>
              <span style={{ color: '#d1d5db', fontSize: '18px' }}>|</span>
              <button
                onClick={() => setActiveSection('profile')}
                style={{
                  background: activeSection === 'profile' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
                  color: activeSection === 'profile' ? 'white' : '#666',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '10px 20px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <FaUser />
                My Profile
              </button>
              <span style={{ color: '#d1d5db', fontSize: '18px' }}>|</span>
              <button
                onClick={() => setActiveSection('orders')}
                style={{
                  background: activeSection === 'orders' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
                  color: activeSection === 'orders' ? 'white' : '#666',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '10px 20px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <FaShoppingCart />
                My Orders
              </button>
              <span style={{ color: '#d1d5db', fontSize: '18px' }}>|</span>
              <button
                onClick={() => setActiveSection('events')}
                style={{
                  background: activeSection === 'events' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
                  color: activeSection === 'events' ? 'white' : '#666',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '10px 20px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
            <FaCalendarAlt />
                My Events
              </button>
              <span style={{ color: '#d1d5db', fontSize: '18px' }}>|</span>
              <button
                onClick={() => setActiveSection('subscriptions')}
                style={{
                  background: activeSection === 'subscriptions' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
                  color: activeSection === 'subscriptions' ? 'white' : '#666',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '10px 20px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <FaCalendarAlt />
                My Subscriptions
              </button>
            </div>
          </div>

          {/* Content based on active section */}
          {activeSection === 'search' && (
            <div style={{ marginBottom: '32px' }}>
              <SearchPanel />
            </div>
          )}
          {activeSection === 'events' && (
            <div style={{ marginBottom: '32px' }}>
              <MyEvents />
            </div>
          )}
          {activeSection === 'overview' && (
            <>
              {/* Quick Actions */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '24px',
                marginBottom: '32px'
              }}>
                <div style={{
                  background: 'white',
                  borderRadius: '16px',
                  padding: '24px',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  textAlign: 'center'
                }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px',
                    color: 'white',
                    fontSize: '24px'
                  }}>
                    <FaUserMd />
                  </div>
                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: '600',
                    color: '#333',
                    marginBottom: '8px'
                  }}>
                    Book Consultation
                  </h3>
                  <p style={{
                    fontSize: '14px',
                    color: '#666',
                    marginBottom: '16px'
                  }}>
                    Schedule a one-on-one session with our expert consultants
                  </p>
                  <button
                    onClick={handleBookConsultation}
                    style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '12px 24px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Book Now
                  </button>
                </div>

                <div style={{
                  background: 'white',
                  borderRadius: '16px',
                  padding: '24px',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  textAlign: 'center'
                }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px',
                    color: 'white',
                    fontSize: '24px'
                  }}>
                    <FaVideo />
                  </div>
                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: '600',
                    color: '#333',
                    marginBottom: '8px'
                  }}>
                    Upcoming Webinars
                  </h3>
                  <p style={{
                    fontSize: '14px',
                    color: '#666',
                    marginBottom: '16px'
                  }}>
                    Join our educational webinars and workshops
                  </p>
                  <button
                    onClick={handleViewWebinars}
                    style={{
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '12px 24px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    View Webinars
                  </button>
                </div>
              </div>

              {/* My Consultations Preview */}
              <div style={{
                background: 'white',
                borderRadius: '16px',
                padding: '32px',
                marginBottom: '24px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '24px'
                }}>
                  <h2 style={{
                    fontSize: '24px',
                    fontWeight: '600',
                    color: '#333'
                  }}>
                    My Consultations
                  </h2>
                  <button
                    onClick={() => setActiveSection('consultations')}
                    style={{
                      background: 'transparent',
                      color: '#667eea',
                      border: '1px solid #667eea',
                      borderRadius: '8px',
                      padding: '8px 16px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    View All
                  </button>
                </div>

                {consultations.length === 0 ? (
                  <div style={{
                    textAlign: 'center',
                    padding: '40px',
                    color: '#666'
                  }}>
                    <FaCalendarAlt style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.5 }} />
                    <p style={{ fontSize: '16px', marginBottom: '16px' }}>No consultations scheduled yet</p>
                    <button
                      onClick={handleBookConsultation}
                      style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '12px 24px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      Book Your First Consultation
                    </button>
                  </div>
                ) : (
                  <div style={{
                    display: 'grid',
                    gap: '16px'
                  }}>
                    {consultations.slice(0, 2).map((consultation) => (
                      <div
                        key={consultation.id}
                        style={{
                          border: '1px solid #e5e7eb',
                          borderRadius: '12px',
                          padding: '20px',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          flexWrap: 'wrap',
                          gap: '16px'
                        }}>
                          <div style={{ flex: 1 }}>
                            <h3 style={{
                              fontSize: '18px',
                              fontWeight: '600',
                              color: '#333',
                              marginBottom: '8px'
                            }}>
                              {consultation.title}
                            </h3>
                            <p style={{
                              fontSize: '14px',
                              color: '#666',
                              marginBottom: '12px'
                            }}>
                              {consultation.description}
                            </p>
                            <div style={{
                              display: 'flex',
                              flexWrap: 'wrap',
                              gap: '16px',
                              fontSize: '14px',
                              color: '#666'
                            }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <FaClock />
                                {new Date(consultation.start_time).toLocaleString()}
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <FaUserMd />
                                {consultation.consultant_name || 'Consultant'}
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                ₹{consultation.price}
                              </div>
                            </div>
                          </div>
                          <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px',
                            alignItems: 'flex-end'
                          }}>
                            <span style={{
                              padding: '4px 12px',
                              borderRadius: '20px',
                              fontSize: '12px',
                              fontWeight: '600',
                              background: consultation.status === 'scheduled' ? '#e3f2fd' :
                                consultation.status === 'confirmed' ? '#e8f5e8' : '#ffebee',
                              color: consultation.status === 'scheduled' ? '#1976d2' :
                                consultation.status === 'confirmed' ? '#388e3c' : '#d32f2f'
                            }}>
                              {consultation.status}
                            </span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div style={{
                          display: 'flex',
                          gap: '8px',
                          marginTop: '16px',
                          flexWrap: 'wrap'
                        }}>
                          {consultation.google_meet_link && (
                            <a
                              href={consultation.google_meet_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                background: '#e3f2fd',
                                color: '#1976d2',
                                textDecoration: 'none',
                                padding: '8px 12px',
                                borderRadius: '6px',
                                fontSize: '12px',
                                fontWeight: '600',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                transition: 'all 0.3s ease'
                              }}
                              onMouseOver={(e) => {
                                e.currentTarget.style.background = '#bbdefb';
                              }}
                              onMouseOut={(e) => {
                                e.currentTarget.style.background = '#e3f2fd';
                              }}
                            >
                              <FaVideo style={{ fontSize: '14px' }} />
                              Join Meeting
                            </a>
                          )}

                          {consultation.google_calendar_event_id && (
                            <a
                              href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(consultation.title)}&dates=${new Date(consultation.start_time).toISOString().replace(/[-:]/g, '').split('.')[0]}Z/${new Date(consultation.end_time).toISOString().replace(/[-:]/g, '').split('.')[0]}Z&details=${encodeURIComponent(consultation.description)}&location=${consultation.google_meet_link || ''}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                background: '#e8f5e8',
                                color: '#388e3c',
                                textDecoration: 'none',
                                padding: '8px 12px',
                                borderRadius: '6px',
                                fontSize: '12px',
                                fontWeight: '600',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                transition: 'all 0.3s ease'
                              }}
                              onMouseOver={(e) => {
                                e.currentTarget.style.background = '#c8e6c9';
                              }}
                              onMouseOut={(e) => {
                                e.currentTarget.style.background = '#e8f5e8';
                              }}
                            >
                              <FaCalendarAlt style={{ fontSize: '14px' }} />
                              Add to Calendar
                            </a>
                          )}

                          <button
                            onClick={() => {
                              // TODO: Implement edit functionality

                            }}
                            style={{
                              background: '#f3e5f5',
                              color: '#7b1fa2',
                              border: 'none',
                              padding: '8px 12px',
                              borderRadius: '6px',
                              fontSize: '12px',
                              fontWeight: '600',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              transition: 'all 0.3s ease'
                            }}
                            onMouseOver={(e) => {
                              e.currentTarget.style.background = '#e1bee7';
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.background = '#f3e5f5';
                            }}
                          >
                            <FaEdit style={{ fontSize: '14px' }} />
                            Edit
                          </button>

                          <button
                            onClick={async () => {
                              if (window.confirm('Are you sure you want to delete this consultation?')) {
                                try {
                                  const token = localStorage.getItem('user_jwt');
                                  if (!token) {
                                    addNotification({
                                      type: 'error',
                                      title: 'Error',
                                      message: 'Authentication token not found'
                                    });
                                    return;
                                  }

                                  const response = await fetch(`${getApiUrl('api/consultations/by-email')}/${consultation.id}`, {
                                    method: 'DELETE',
                                    headers: { 'Authorization': `Bearer ${token}` }
                                  });

                                  if (response.ok) {
                                    addNotification({
                                      type: 'success',
                                      title: 'Success',
                                      message: 'Consultation deleted successfully'
                                    });
                                    // Reload consultations
                                    await loadConsultations(token);
                                  } else {
                                    const errorData = await response.json();
                                    addNotification({
                                      type: 'error',
                                      title: 'Error',
                                      message: errorData.message || 'Failed to delete consultation'
                                    });
                                  }
                                } catch (error) {

                                  addNotification({
                                    type: 'error',
                                    title: 'Error',
                                    message: 'Failed to delete consultation'
                                  });
                                }
                              }
                            }}
                            style={{
                              background: '#ffebee',
                              color: '#d32f2f',
                              border: 'none',
                              padding: '8px 12px',
                              borderRadius: '6px',
                              fontSize: '12px',
                              fontWeight: '600',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              transition: 'all 0.3s ease'
                            }}
                            onMouseOver={(e) => {
                              e.currentTarget.style.background = '#ffcdd2';
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.background = '#ffebee';
                            }}
                          >
                            <FaTrash style={{ fontSize: '14px' }} />
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>


















              {/* Upcoming Webinars Preview */}
              <div style={{
                background: 'white',
                borderRadius: '16px',
                padding: '32px',
                marginBottom: '24px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '24px'
                }}>
                  <h2 style={{
                    fontSize: '24px',
                    fontWeight: '600',
                    color: '#333'
                  }}>
                    Upcoming Webinars
                  </h2>
                  <button
                    onClick={() => setActiveSection('webinars')}
                    style={{
                      background: 'transparent',
                      color: '#10b981',
                      border: '1px solid #10b981',
                      borderRadius: '8px',
                      padding: '8px 16px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    View All
                  </button>
                </div>

                {upcomingWebinars.length === 0 ? (
                  <div style={{
                    textAlign: 'center',
                    padding: '40px',
                    color: '#666'
                  }}>
                    <FaVideo style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.5 }} />
                    <p style={{ fontSize: '16px' }}>No upcoming webinars at the moment</p>
                  </div>
                ) : (
                  <div style={{
                    display: 'grid',
                    gap: '16px'
                  }}>
                    {upcomingWebinars.slice(0, 2).map((webinar) => (
                      <div
                        key={webinar.id}
                        style={{
                          border: '1px solid #e5e7eb',
                          borderRadius: '12px',
                          padding: '20px',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          flexWrap: 'wrap',
                          gap: '16px'
                        }}>
                          <div style={{ flex: 1 }}>
                            <h3 style={{
                              fontSize: '18px',
                              fontWeight: '600',
                              color: '#333',
                              marginBottom: '8px'
                            }}>
                              {webinar.title}
                            </h3>
                            <p style={{
                              fontSize: '14px',
                              color: '#666',
                              marginBottom: '12px'
                            }}>
                              {webinar.description}
                            </p>
                            <div style={{
                              display: 'flex',
                              flexWrap: 'wrap',
                              gap: '16px',
                              fontSize: '14px',
                              color: '#666'
                            }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <FaClock />
                                {new Date(webinar.start_time).toLocaleString()}
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                {webinar.is_free ? 'Free' : `₹${webinar.price}`}
                              </div>
                            </div>
                          </div>
                          <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px',
                            alignItems: 'flex-end'
                          }}>
                            <span style={{
                              padding: '4px 12px',
                              borderRadius: '20px',
                              fontSize: '12px',
                              fontWeight: '600',
                              background: '#e8f5e8',
                              color: '#388e3c'
                            }}>
                              {webinar.status}
                            </span>
                            {(webinar.is_free || purchases.some(p => Number(p.product_id) === webinar.id && p.payment_status === 'paid')) && webinar.google_meet_link && (
                              <a
                                href={webinar.google_meet_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                  color: 'white',
                                  textDecoration: 'none',
                                  padding: '8px 16px',
                                  borderRadius: '6px',
                                  fontSize: '12px',
                                  fontWeight: '600'
                                }}
                              >
                                🎥 Join Webinar
                              </a>
                            )}
                            {(!webinar.is_free && !purchases.some(p => Number(p.product_id) === webinar.id && p.payment_status === 'paid')) && (
                              <button
                                onClick={() => router.push(`/${locale}/webinars/${webinar.id}/registration`)}
                                style={{
                                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                  color: 'white',
                                  border: 'none',
                                  padding: '8px 16px',
                                  borderRadius: '6px',
                                  fontSize: '12px',
                                  fontWeight: '600',
                                  cursor: 'pointer'
                                }}
                              >
                                📝 Register Now
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>















              {/* My Purchased Courses */}

              <div
                style={{
                  background: "white",
                  borderRadius: "16px",
                  padding: "32px",
                  marginBottom: "24px",
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                }}
              >
                <h2
                  style={{
                    fontSize: "24px",
                    fontWeight: "600",
                    color: "#333",
                    marginBottom: "24px",
                  }}
                >
                  My Purchased Courses
                </h2>

                {purchases.length === 0 ? (
                  <div style={{ textAlign: "center", color: "#666" }}>
                    No courses purchased yet
                  </div>
                ) : (
                  <div style={{ display: "grid", gap: "16px" }}>
                    {purchases.map((course: any, index: number) => (
                      <div
                        key={`${course.order_id}-${course.product_id}-${index}`}
                        style={{
                          border: "1px solid #e5e7eb",
                          borderRadius: "12px",
                          padding: "20px",
                          display: "flex",
                          gap: "20px",
                          alignItems: "flex-start",
                          background: "#fafafa",
                        }}
                      >
                        {/* Course Image */}
                        {course.thumbnail && (
                          <img
                            src={`https://api.miet.life${course.thumbnail}`}
                            alt={course.product_name}
                            style={{
                              width: "100px",
                              height: "100px",
                              objectFit: "cover",
                              borderRadius: "8px",
                            }}
                          />
                        )}

                        <div style={{ flex: 1 }}>
                          {/* Title */}
                          <h3
                            style={{
                              fontSize: "18px",
                              fontWeight: "600",
                              marginBottom: "6px",
                            }}
                          >
                            {course.product_name}
                          </h3>

                          {/* Description */}
                          {course.description && (
                            <p
                              style={{
                                color: "#6b7280",
                                fontSize: "14px",
                                marginBottom: "8px",
                              }}
                            >
                              {course.description}
                            </p>
                          )}

                          {/* Order Info */}
                          <div
                            style={{
                              display: "grid",
                              gridTemplateColumns: "repeat(auto-fit, minmax(150px,1fr))",
                              gap: "6px",
                              fontSize: "14px",
                              marginBottom: "10px",
                            }}
                          >
                            <div>
                              <strong>Order ID:</strong> #{course.order_id}
                            </div>

                            <div>
                              <strong>Price:</strong> ₹{course.price}
                            </div>

                            <div>
                              <strong>Quantity:</strong> {course.quantity}
                            </div>

                            <div>
                              <strong>Payment:</strong>{" "}
                              <span
                                style={{
                                  color:
                                    course.payment_status === "paid"
                                      ? "#16a34a"
                                      : "#dc2626",
                                  fontWeight: "600",
                                }}
                              >
                                {course.payment_status}
                              </span>
                            </div>

                            {course.product_type && (
                              <div>
                                <strong>Type:</strong> {course.product_type}
                              </div>
                            )}
                          </div>

                          {/* Buttons */}
                          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                            {course.video_url && (
                              <a
                                href={`{course.video_url}`}
                                target="_blank"
                                style={{
                                  background: "#8b5cf6",
                                  color: "white",
                                  padding: "6px 12px",
                                  borderRadius: "6px",
                                  textDecoration: "none",
                                  fontSize: "14px",
                                }}
                              >
                                ▶ Watch Course
                              </a>
                            )}

                            {course.pdf_file && (
                              <a
                                href={`https://api.miet.life${course.pdf_file}`}
                                target="_blank"
                                style={{
                                  background: "#10b981",
                                  color: "white",
                                  padding: "6px 12px",
                                  borderRadius: "6px",
                                  textDecoration: "none",
                                  fontSize: "14px",
                                }}
                              >
                                ⬇ Download Notes
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>














            </>
          )}

          {/* Consultations Section */}
          {activeSection === 'consultations' && (
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '32px',
              marginBottom: '24px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}>
              <h2 style={{
                fontSize: '24px',
                fontWeight: '600',
                color: '#333',
                marginBottom: '24px'
              }}>
                My Consultations
              </h2>

              {consultations.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: '40px',
                  color: '#666'
                }}>
                  <FaCalendarAlt style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.5 }} />
                  <p style={{ fontSize: '16px', marginBottom: '16px' }}>No consultations scheduled yet</p>
                  <button
                    onClick={handleBookConsultation}
                    style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '12px 24px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Book Your First Consultation
                  </button>
                </div>
              ) : (
                <div style={{
                  display: 'grid',
                  gap: '16px'
                }}>
                  {consultations.map((consultation) => (
                    <div
                      key={consultation.id}
                      style={{
                        border: '1px solid #e5e7eb',
                        borderRadius: '12px',
                        padding: '20px',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        flexWrap: 'wrap',
                        gap: '16px'
                      }}>
                        <div style={{ flex: 1 }}>
                          <h3 style={{
                            fontSize: '18px',
                            fontWeight: '600',
                            color: '#333',
                            marginBottom: '8px'
                          }}>
                            {consultation.title}
                          </h3>
                          <p style={{
                            fontSize: '14px',
                            color: '#666',
                            marginBottom: '12px'
                          }}>
                            {consultation.description}
                          </p>
                          <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '16px',
                            fontSize: '14px',
                            color: '#666'
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <FaClock />
                              {new Date(consultation.start_time).toLocaleString()}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <FaUserMd />
                              {consultation.consultant_name || 'Consultant'}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              ₹{consultation.price}
                            </div>
                          </div>
                        </div>
                        <div style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '8px',
                          alignItems: 'flex-end'
                        }}>
                          <span style={{
                            padding: '4px 12px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: '600',
                            background: consultation.status === 'scheduled' ? '#e3f2fd' :
                              consultation.status === 'confirmed' ? '#e8f5e8' : '#ffebee',
                            color: consultation.status === 'scheduled' ? '#1976d2' :
                              consultation.status === 'confirmed' ? '#388e3c' : '#d32f2f'
                          }}>
                            {consultation.status}
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div style={{
                        display: 'flex',
                        gap: '8px',
                        marginTop: '16px',
                        flexWrap: 'wrap'
                      }}>
                        {consultation.google_meet_link && (
                          <a
                            href={consultation.google_meet_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              background: '#e3f2fd',
                              color: '#1976d2',
                              textDecoration: 'none',
                              padding: '8px 12px',
                              borderRadius: '6px',
                              fontSize: '12px',
                              fontWeight: '600',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              transition: 'all 0.3s ease'
                            }}
                            onMouseOver={(e) => {
                              e.currentTarget.style.background = '#bbdefb';
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.background = '#e3f2fd';
                            }}
                          >
                            <FaVideo style={{ fontSize: '14px' }} />
                            Join Meeting
                          </a>
                        )}

                        {consultation.google_calendar_event_id && (
                          <a
                            href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(consultation.title)}&dates=${new Date(consultation.start_time).toISOString().replace(/[-:]/g, '').split('.')[0]}Z/${new Date(consultation.end_time).toISOString().replace(/[-:]/g, '').split('.')[0]}Z&details=${encodeURIComponent(consultation.description)}&location=${consultation.google_meet_link || ''}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              background: '#e8f5e8',
                              color: '#388e3c',
                              textDecoration: 'none',
                              padding: '8px 12px',
                              borderRadius: '6px',
                              fontSize: '12px',
                              fontWeight: '600',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              transition: 'all 0.3s ease'
                            }}
                            onMouseOver={(e) => {
                              e.currentTarget.style.background = '#c8e6c9';
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.background = '#e8f5e8';
                            }}
                          >
                            <FaCalendarAlt style={{ fontSize: '14px' }} />
                            Add to Calendar
                          </a>
                        )}

                        <button
                          onClick={() => {
                            // TODO: Implement edit functionality

                          }}
                          style={{
                            background: '#f3e5f5',
                            color: '#7b1fa2',
                            border: 'none',
                            padding: '8px 12px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.background = '#e1bee7';
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.background = '#f3e5f5';
                          }}
                        >
                          <FaEdit style={{ fontSize: '14px' }} />
                          Edit
                        </button>

                        <button
                          onClick={async () => {
                            if (window.confirm('Are you sure you want to delete this consultation?')) {
                              try {
                                const token = localStorage.getItem('user_jwt');
                                if (!token) {
                                  addNotification({
                                    type: 'error',
                                    title: 'Error',
                                    message: 'Authentication token not found'
                                  });
                                  return;
                                }

                                const response = await fetch(`${getApiUrl('api/consultations/by-email')}/${consultation.id}`, {
                                  method: 'DELETE',
                                  headers: { 'Authorization': `Bearer ${token}` }
                                });

                                if (response.ok) {
                                  addNotification({
                                    type: 'success',
                                    title: 'Success',
                                    message: 'Consultation deleted successfully'
                                  });
                                  // Reload consultations
                                  await loadConsultations(token);
                                } else {
                                  const errorData = await response.json();
                                  addNotification({
                                    type: 'error',
                                    title: 'Error',
                                    message: errorData.message || 'Failed to delete consultation'
                                  });
                                }
                              } catch (error) {

                                addNotification({
                                  type: 'error',
                                  title: 'Error',
                                  message: 'Failed to delete consultation'
                                });
                              }
                            }
                          }}
                          style={{
                            background: '#ffebee',
                            color: '#d32f2f',
                            border: 'none',
                            padding: '8px 12px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.background = '#ffcdd2';
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.background = '#ffebee';
                          }}
                        >
                          <FaTrash style={{ fontSize: '14px' }} />
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Webinars Section */}
          {activeSection === 'webinars' && (
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '32px',
              marginBottom: '24px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}>
              <h2 style={{
                fontSize: '24px',
                fontWeight: '600',
                color: '#333',
                marginBottom: '24px'
              }}>
                Upcoming Webinars
              </h2>

              {upcomingWebinars.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: '40px',
                  color: '#666'
                }}>
                  <FaVideo style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.5 }} />
                  <p style={{ fontSize: '16px' }}>No upcoming webinars at the moment</p>
                </div>
              ) : (
                <div style={{
                  display: 'grid',
                  gap: '16px'
                }}>
                  {upcomingWebinars.map((webinar) => (
                    <div
                      key={webinar.id}
                      style={{
                        border: '1px solid #e5e7eb',
                        borderRadius: '12px',
                        padding: '20px',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        flexWrap: 'wrap',
                        gap: '16px'
                      }}>
                        <div style={{ flex: 1 }}>
                          <h3 style={{
                            fontSize: '18px',
                            fontWeight: '600',
                            color: '#333',
                            marginBottom: '8px'
                          }}>
                            {webinar.title}
                          </h3>
                          <p style={{
                            fontSize: '14px',
                            color: '#666',
                            marginBottom: '12px'
                          }}>
                            {webinar.description}
                          </p>
                          <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '16px',
                            fontSize: '14px',
                            color: '#666'
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <FaClock />
                              {new Date(webinar.start_time).toLocaleString()}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              {webinar.is_free ? 'Free' : `₹${webinar.price}`}
                            </div>
                          </div>
                        </div>
                        <div style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '8px',
                          alignItems: 'flex-end'
                        }}>
                          <span style={{
                            padding: '4px 12px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: '600',
                            background: '#e8f5e8',
                            color: '#388e3c'
                          }}>
                            {webinar.status}
                          </span>
                          {webinar.google_meet_link && (
                            <a
                              href={webinar.google_meet_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                color: 'white',
                                textDecoration: 'none',
                                padding: '8px 16px',
                                borderRadius: '6px',
                                fontSize: '12px',
                                fontWeight: '600'
                              }}
                            >
                              🎥 Join Webinar
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* My Profile Section */}
          {activeSection === 'profile' && (
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '32px',
              marginBottom: '24px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}>
              <h2 style={{
                fontSize: '24px',
                fontWeight: '600',
                color: '#333',
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <FaUser style={{ color: '#667eea' }} />
                My Profile
              </h2>

              {profileLoading ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                  Loading profile data...
                </div>
              ) : (
                <form onSubmit={handleSaveProfileAndAddress}>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '24px',
                    marginBottom: '32px'
                  }}>
                    {/* Personal Information */}
                    <div style={{
                      background: '#f8fafc',
                      borderRadius: '12px',
                      padding: '24px',
                      border: '1px solid #e2e8f0'
                    }}>
                      <h3 style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#475569',
                        marginBottom: '16px',
                        borderBottom: '1px solid #e2e8f0',
                        paddingBottom: '8px'
                      }}>
                        Personal Information
                      </h3>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#334155', marginBottom: '6px' }}>
                            First Name *
                          </label>
                          <input
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                            style={{
                              width: '100%',
                              padding: '10px 14px',
                              borderRadius: '8px',
                              border: '1px solid #cbd5e1',
                              backgroundColor: '#ffffff',
                              color: '#0f172a',
                              fontSize: '14px'
                            }}
                          />
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#334155', marginBottom: '6px' }}>
                            Last Name *
                          </label>
                          <input
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                            style={{
                              width: '100%',
                              padding: '10px 14px',
                              borderRadius: '8px',
                              border: '1px solid #cbd5e1',
                              backgroundColor: '#ffffff',
                              color: '#0f172a',
                              fontSize: '14px'
                            }}
                          />
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#64748b', marginBottom: '6px' }}>
                            Email Address (Cannot be changed)
                          </label>
                          <input
                            type="email"
                            value={user.email || ''}
                            disabled
                            style={{
                              width: '100%',
                              padding: '10px 14px',
                              borderRadius: '8px',
                              border: '1px solid #cbd5e1',
                              backgroundColor: '#e2e8f0',
                              color: '#64748b',
                              cursor: 'not-allowed',
                              fontSize: '14px'
                            }}
                          />
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#334155', marginBottom: '6px' }}>
                            Phone Number
                          </label>
                          <input
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="Enter phone number"
                            style={{
                              width: '100%',
                              padding: '10px 14px',
                              borderRadius: '8px',
                              border: '1px solid #cbd5e1',
                              backgroundColor: '#ffffff',
                              color: '#0f172a',
                              fontSize: '14px'
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Address Information (Editable) */}
                    <div style={{
                      background: '#f8fafc',
                      borderRadius: '12px',
                      padding: '24px',
                      border: '1px solid #e2e8f0'
                    }}>
                      <h3 style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#475569',
                        marginBottom: '16px',
                        borderBottom: '1px solid #e2e8f0',
                        paddingBottom: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        <FaHome style={{ color: '#667eea' }} />
                        Address Details
                      </h3>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#334155', marginBottom: '6px' }}>
                            Address Line 1 *
                          </label>
                          <input
                            type="text"
                            value={addressLine1}
                            onChange={(e) => setAddressLine1(e.target.value)}
                            required
                            placeholder="Street address, P.O. box, company name"
                            style={{
                              width: '100%',
                              padding: '10px 14px',
                              borderRadius: '8px',
                              border: '1px solid #cbd5e1',
                              backgroundColor: '#ffffff',
                              color: '#0f172a',
                              fontSize: '14px'
                            }}
                          />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                          <div>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#334155', marginBottom: '6px' }}>
                              City *
                            </label>
                            <input
                              type="text"
                              value={city}
                              onChange={(e) => setCity(e.target.value)}
                              required
                              placeholder="City"
                              style={{
                                width: '100%',
                                padding: '10px 14px',
                                borderRadius: '8px',
                                border: '1px solid #cbd5e1',
                                backgroundColor: '#ffffff',
                                color: '#0f172a',
                                fontSize: '14px'
                              }}
                            />
                          </div>

                          <div>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#334155', marginBottom: '6px' }}>
                              State *
                            </label>
                            <input
                              type="text"
                              value={state}
                              onChange={(e) => setState(e.target.value)}
                              required
                              placeholder="State"
                              style={{
                                width: '100%',
                                padding: '10px 14px',
                                borderRadius: '8px',
                                border: '1px solid #cbd5e1',
                                backgroundColor: '#ffffff',
                                color: '#0f172a',
                                fontSize: '14px'
                              }}
                            />
                          </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                          <div>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#334155', marginBottom: '6px' }}>
                              PIN / Zip Code *
                            </label>
                            <input
                              type="text"
                              value={zipCode}
                              onChange={(e) => setZipCode(e.target.value)}
                              required
                              placeholder="PIN Code"
                              style={{
                                width: '100%',
                                padding: '10px 14px',
                                borderRadius: '8px',
                                border: '1px solid #cbd5e1',
                                backgroundColor: '#ffffff',
                                color: '#0f172a',
                                fontSize: '14px'
                              }}
                            />
                          </div>

                          <div>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#334155', marginBottom: '6px' }}>
                              Country *
                            </label>
                            <input
                              type="text"
                              value={country}
                              onChange={(e) => setCountry(e.target.value)}
                              required
                              placeholder="Country"
                              style={{
                                width: '100%',
                                padding: '10px 14px',
                                borderRadius: '8px',
                                border: '1px solid #cbd5e1',
                                backgroundColor: '#ffffff',
                                color: '#0f172a',
                                fontSize: '14px'
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
                    <button
                      type="submit"
                      disabled={savingProfile}
                      style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '12px 32px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: savingProfile ? 'not-allowed' : 'pointer',
                        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                        transition: 'all 0.3s ease',
                        opacity: savingProfile ? 0.7 : 1
                      }}
                    >
                      {savingProfile ? 'Saving...' : 'Save Profile & Address'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* My Orders Section */}
          {activeSection === 'orders' && (
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '32px',
              marginBottom: '24px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}>
              <h2 style={{
                fontSize: '24px',
                fontWeight: '600',
                color: '#333',
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <FaShoppingCart style={{ color: '#667eea' }} />
                My Orders
              </h2>

              {purchases.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: '40px',
                  color: '#666'
                }}>
                  <FaShoppingCart style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.5 }} />
                  <p style={{ fontSize: '16px' }}>No orders placed yet</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {(() => {
                    const formatToIndiaTime = (dateStr: string) => {
                      if (!dateStr) return '';
                      try {
                        // SQLite CURRENT_TIMESTAMP is stored in UTC without timezone offset info.
                        // We format it to ISO (by appending 'Z') to force JS to parse it as UTC.
                        const utcStr = dateStr.includes('T') ? dateStr : dateStr.replace(' ', 'T') + 'Z';
                        const date = new Date(utcStr);
                        return date.toLocaleString('en-IN', {
                          timeZone: 'Asia/Kolkata',
                          dateStyle: 'medium',
                          timeStyle: 'short'
                        });
                      } catch (e) {
                        return dateStr;
                      }
                    };

                    const totalPages = Math.ceil(purchases.length / ordersPerPage);
                    const startIndex = (ordersPage - 1) * ordersPerPage;
                    const paginatedPurchases = purchases.slice(startIndex, startIndex + ordersPerPage);

                    return (
                      <>
                        {paginatedPurchases.map((order: any, index: number) => (
                          <div
                            key={`${order.order_id}-${order.product_id}-${index}`}
                            style={{
                              border: '1px solid #e2e8f0',
                              borderRadius: '12px',
                              padding: '20px',
                              background: '#f8fafc',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '12px'
                            }}
                          >
                            <div style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              borderBottom: '1px solid #e2e8f0',
                              paddingBottom: '10px',
                              flexWrap: 'wrap',
                              gap: '10px'
                            }}>
                              <span style={{ fontWeight: '700', color: '#1e293b' }}>
                                Order ID: #{order.order_id}
                              </span>
                              
                              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                                {order.order_created_at && (
                                  <span style={{ fontSize: '13px', color: '#64748b' }}>
                                    Date: {formatToIndiaTime(order.order_created_at)}
                                  </span>
                                )}
                                <span style={{
                                  padding: '4px 12px',
                                  borderRadius: '20px',
                                  fontSize: '12px',
                                  fontWeight: '600',
                                  background: order.payment_status === 'paid' ? '#e2fbe8' : '#fffbeb',
                                  color: order.payment_status === 'paid' ? '#15803d' : '#b45309'
                                }}>
                                  Payment: {order.payment_status ? order.payment_status.toUpperCase() : 'PENDING'}
                                </span>
                                <span style={{
                                  padding: '4px 12px',
                                  borderRadius: '20px',
                                  fontSize: '12px',
                                  fontWeight: '600',
                                  background: order.status === 'delivered' ? '#d1fae5' : order.status === 'shipped' ? '#dbeafe' : order.status === 'processing' ? '#fef3c7' : order.status === 'cancelled' ? '#fee2e2' : '#f1f5f9',
                                  color: order.status === 'delivered' ? '#065f46' : order.status === 'shipped' ? '#1e40af' : order.status === 'processing' ? '#92400e' : order.status === 'cancelled' ? '#991b1b' : '#475569'
                                }}>
                                  Delivery: {order.status ? order.status.toUpperCase() : 'PENDING'}
                                </span>
                              </div>
                            </div>

                            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                              {order.thumbnail && (
                                <img
                                  src={order.thumbnail.startsWith('http') ? order.thumbnail : `https://api.miet.life${order.thumbnail}`}
                                  alt={order.product_name}
                                  style={{
                                    width: '60px',
                                    height: '60px',
                                    objectFit: 'cover',
                                    borderRadius: '8px'
                                  }}
                                />
                              )}
                              <div style={{ flex: 1 }}>
                                <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#334155' }}>
                                  {order.product_name}
                                </h4>
                                <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
                                  Price: ₹{order.price} | Qty: {order.quantity}
                                </p>
                              </div>
                              <div style={{ fontSize: '16px', fontWeight: '700', color: '#667eea' }}>
                                Total: ₹{Number(order.price) * Number(order.quantity)}
                              </div>
                            </div>

                            {/* Delivery Address Details */}
                            {order.address && (
                              <div style={{
                                marginTop: '8px',
                                padding: '12px',
                                background: '#f1f5f9',
                                borderRadius: '8px',
                                fontSize: '13px',
                                color: '#475569',
                                borderLeft: '4px solid #667eea',
                                lineHeight: '1.5'
                              }}>
                                <div style={{ fontWeight: '600', color: '#334155', marginBottom: '4px' }}>
                                  Delivery Details:
                                </div>
                                <strong>Recipient:</strong> {order.first_name} {order.last_name} | <strong>Phone:</strong> {order.phone || 'N/A'}<br />
                                <strong>Address:</strong> {order.address}, {order.city}, {order.state} - {order.zip_code}, {order.country}
                              </div>
                            )}

                            {/* Live Delivery Status Stepper */}
                            {order.status === 'cancelled' ? (
                              <div style={{
                                marginTop: '16px',
                                padding: '12px 16px',
                                background: '#fee2e2',
                                color: '#991b1b',
                                borderRadius: '8px',
                                fontWeight: '600',
                                fontSize: '13px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                              }}>
                                🚫 This order has been cancelled
                              </div>
                            ) : (
                              <div style={{
                                marginTop: '16px',
                                padding: '16px',
                                background: '#ffffff',
                                borderRadius: '12px',
                                border: '1px solid #e2e8f0',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '12px'
                              }}>
                                <div style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  position: 'relative',
                                  padding: '0 10px'
                                }}>
                                  {/* Progress Line Background */}
                                  <div style={{
                                    position: 'absolute',
                                    top: '14px',
                                    left: '20px',
                                    right: '20px',
                                    height: '4px',
                                    background: '#e2e8f0',
                                    zIndex: 1,
                                    borderRadius: '2px'
                                  }} />
                                  {/* Progress Line Active */}
                                  <div style={{
                                    position: 'absolute',
                                    top: '14px',
                                    left: '20px',
                                    width: `${
                                      (() => {
                                        const s = order.status || 'pending';
                                        if (s === 'processing') return 33;
                                        if (s === 'shipped') return 66;
                                        if (s === 'delivered') return 100;
                                        return 0; // pending/ordered
                                      })()
                                    }%`,
                                    height: '4px',
                                    background: 'linear-gradient(90deg, #4ade80 0%, #22c55e 100%)',
                                    zIndex: 2,
                                    borderRadius: '2px',
                                    transition: 'width 0.4s ease'
                                  }} />

                                  {/* Stepper Dots */}
                                  {[
                                    { label: 'Ordered', key: 'pending' },
                                    { label: 'Processing', key: 'processing' },
                                    { label: 'Shipped', key: 'shipped' },
                                    { label: 'Delivered', key: 'delivered' }
                                  ].map((step, idx) => {
                                    const activeIndex = (() => {
                                      const s = order.status || 'pending';
                                      if (s === 'processing') return 1;
                                      if (s === 'shipped') return 2;
                                      if (s === 'delivered') return 3;
                                      return 0; // pending
                                    })();
                                    const isCompleted = idx <= activeIndex;
                                    return (
                                      <div key={step.key} style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        zIndex: 3,
                                        flex: 1,
                                        position: 'relative'
                                      }}>
                                        <div style={{
                                          width: '28px',
                                          height: '28px',
                                          borderRadius: '50%',
                                          background: isCompleted ? 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)' : '#ffffff',
                                          border: isCompleted ? 'none' : '2px solid #cbd5e1',
                                          color: isCompleted ? '#ffffff' : '#64748b',
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          fontWeight: 'bold',
                                          fontSize: '12px',
                                          boxShadow: isCompleted ? '0 4px 10px rgba(34, 197, 94, 0.2)' : 'none',
                                          transition: 'all 0.4s ease'
                                        }}>
                                          {isCompleted ? '✓' : idx + 1}
                                        </div>
                                        <span style={{
                                          marginTop: '6px',
                                          fontSize: '11px',
                                          fontWeight: isCompleted ? '600' : '500',
                                          color: isCompleted ? '#16a34a' : '#64748b',
                                          textAlign: 'center'
                                        }}>
                                          {step.label}
                                        </span>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                          <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: '8px',
                            marginTop: '20px',
                            paddingTop: '20px',
                            borderTop: '1px solid #e2e8f0'
                          }}>
                            <button
                              onClick={() => setOrdersPage(prev => Math.max(prev - 1, 1))}
                              disabled={ordersPage === 1}
                              style={{
                                padding: '8px 16px',
                                borderRadius: '8px',
                                border: '1px solid #cbd5e1',
                                background: 'white',
                                color: ordersPage === 1 ? '#cbd5e1' : '#475569',
                                cursor: ordersPage === 1 ? 'not-allowed' : 'pointer',
                                fontSize: '14px',
                                fontWeight: '500',
                                transition: 'all 0.2s'
                              }}
                            >
                              Previous
                            </button>

                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                              <button
                                key={pageNum}
                                onClick={() => setOrdersPage(pageNum)}
                                style={{
                                  width: '36px',
                                  height: '36px',
                                  borderRadius: '8px',
                                  border: pageNum === ordersPage ? 'none' : '1px solid #cbd5e1',
                                  background: pageNum === ordersPage ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'white',
                                  color: pageNum === ordersPage ? 'white' : '#475569',
                                  cursor: 'pointer',
                                  fontSize: '14px',
                                  fontWeight: '600',
                                  transition: 'all 0.2s'
                                }}
                              >
                                {pageNum}
                              </button>
                            ))}

                            <button
                              onClick={() => setOrdersPage(prev => Math.min(prev + 1, totalPages))}
                              disabled={ordersPage === totalPages}
                              style={{
                                padding: '8px 16px',
                                borderRadius: '8px',
                                border: '1px solid #cbd5e1',
                                background: 'white',
                                color: ordersPage === totalPages ? '#cbd5e1' : '#475569',
                                cursor: ordersPage === totalPages ? 'not-allowed' : 'pointer',
                                fontSize: '14px',
                                fontWeight: '500',
                                transition: 'all 0.2s'
                              }}
                            >
                              Next
                            </button>
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              )}

            </div>
          )}

          {activeSection === 'subscriptions' && (
            <div style={{ background: 'white', borderRadius: '16px', padding: '30px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b', marginBottom: '20px' }}>My Subscriptions</h2>
              
              {user?.subscription_plan && (
                <div style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white', borderRadius: '12px', padding: '20px', marginBottom: '30px' }}>
                  <h3 style={{ fontSize: '20px', marginBottom: '10px' }}>Current Active Plan: {user.subscription_plan}</h3>
                  <p>Valid from {new Date(user.subscription_start || '').toLocaleDateString()} to {new Date(user.subscription_end || '').toLocaleDateString()}</p>
                </div>
              )}

              <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#334155', marginBottom: '20px' }}>Available Plans for You</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {subscriptionPlans.length === 0 ? (
                  <p>No subscription plans available right now.</p>
                ) : (
                  subscriptionPlans.map((plan: any) => (
                    <div key={plan.id} style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column' }}>
                      <h4 style={{ fontSize: '22px', fontWeight: 'bold', color: '#1e293b', marginBottom: '10px' }}>{plan.name}</h4>
                      <div style={{ fontSize: '28px', fontWeight: '800', color: '#667eea', marginBottom: '20px' }}>
                        ₹{plan.monthly_price} <span style={{ fontSize: '16px', fontWeight: 'normal', color: '#64748b' }}>/ mo</span>
                      </div>
                      
                      <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px 0', flex: 1 }}>
                        {JSON.parse(plan.features_json || '[]').map((f: string, i: number) => (
                          <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: '#475569' }}>
                            <span style={{ color: '#10b981' }}>✓</span> {f}
                          </li>
                        ))}
                      </ul>

                      <button 
                        onClick={() => {
                          // We could navigate to a checkout page or start Razorpay logic here
                          alert('Checkout functionality for User Subscriptions is handled in the frontend Subscription Page.');
                        }}
                        style={{ background: '#667eea', color: 'white', border: 'none', borderRadius: '8px', padding: '12px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' }}
                      >
                        Select {plan.name}
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

        </div>
      </div>
      <Footer />
    </div>
  );
}
