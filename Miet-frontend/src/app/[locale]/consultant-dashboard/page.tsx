'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaCalendarAlt, FaVideo, FaUserMd, FaClock, FaMapMarkerAlt, FaPhone, FaEnvelope, FaUsers, FaChartLine, FaBell, FaCog, FaSignOutAlt, FaPlus, FaEdit, FaTrash, FaEye, FaStore, FaChevronLeft, FaImages, FaGoogle, FaCheck, FaBoxOpen, FaShoppingBag, FaWallet } from 'react-icons/fa';
import TopBar from '@/components/TopBar';
import Footer from '@/components/Footer';
import RazorpayPayment from '@/components/RazorpayPayment';
import { getApiUrl } from '@/utils/api';
import ConsultantOrdersTab from './ConsultantOrdersTab';
import WalletTab from './WalletTab';

interface Consultant {
  id: number;
  name: string;
  email: string;
  phone?: string;
  image?: string;
  description?: string;
  tagline?: string;
  speciality?: string;
  city?: string;
  status: string;
  is_pro?: boolean;
  subscription_plan?: string;
  subscription_start?: string;
  subscription_end?: string;
  promoted_by_admin?: boolean;
  needs_password?: boolean;
  needs_profile_update?: boolean;
}

interface Appointment {
  id: number;
  appointment_id: string;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  status: string;
  google_meet_link?: string;
  user_name?: string;
  user_email?: string;
  user_phone?: string;
  price: number;
  payment_status: string;
  notes?: string;
}

interface Webinar {
  id: number;
  webinar_id: string;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  max_attendees: number;
  current_attendees: number;
  status: string;
  google_meet_link?: string;
  manual_link?: string;
  platform_type?: 'google_meet' | 'others';
  price: number;
  is_free: boolean;
  organizer_email: string;
  registration_fields_json?: any[];
  joining_email_template?: string;
  reminder_email_template?: string;
  recording_email_template?: string;
  reminder_schedule_json?: any[];
  recording_url?: string;
}

interface Availability {
  id: number;
  date: string;
  start_time: string;
  end_time: string;
}





import ConsultantProductModal from '@/components/ConsultantProductModal';

export default function ConsultantDashboard() {
  const [consultant, setConsultant] = useState<Consultant | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [webinars, setWebinars] = useState<Webinar[]>([]);
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'appointments' | 'webinars' | 'availability' | 'profile' | 'subscription' | 'marketplace' | 'orders' | 'wallet'>('overview');
  const [orders, setOrders] = useState<any[]>([]);
  const [showAddAvailability, setShowAddAvailability] = useState(false);
  const [googleOAuthSetup, setGoogleOAuthSetup] = useState(false);
  const [newAvailability, setNewAvailability] = useState({
    date: '',
    start_time: '',
    end_time: ''
  });

  const [showProductModal, setShowProductModal] = useState(false);
  const [productForm, setProductForm] = useState<any>({
    type: 'Course',
    status: 'active',
    featured: false,
    title: '',
    name: '',
    description: '',
    price: '',
    video_url: '',
    thumbnail: '',
    thumbnailFile: undefined,
    author: '',
    pdf_file: '',
    pdfFile: undefined,
    download_link: '',
    icon: '',
    iconFile: undefined,
    product_image: '',
    productImageFile: undefined,
    purchase_link: ''
  });

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    speciality: '',
    city: '',
    description: '',
    pan_number: '',
    gst_number: '',
    price_per_slot: '',
    password: ''
  });

  const [showWebinarModal, setShowWebinarModal] = useState(false);
  const [webinarForm, setWebinarForm] = useState({
    title: '',
    description: '',
    start_time: '',
    duration_minutes: 60,
    platform_type: 'google_meet',
    manual_link: '',
    is_free: true,
    price: 0,
    registration_fields: [] as any[],
    joining_email_template: 'Hello, here is your joining link: {{link}}',
    reminder_email_template: 'Reminder: The webinar starts soon! Join here: {{link}}',
    recording_email_template: 'The recording is now available: {{recording_url}}',
    reminder_schedule: [{ minutes: 60 }, { minutes: 10 }]
  });

  const [showRegistrantsModal, setShowRegistrantsModal] = useState(false);
  const [selectedWebinar, setSelectedWebinar] = useState<Webinar | null>(null);
  const [registrants, setRegistrants] = useState<any[]>([]);
  const [showRecordingModal, setShowRecordingModal] = useState(false);
  const [recordingUrl, setRecordingUrl] = useState('');


  const [products, setProducts] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    checkAuthAndLoadData();
  }, []);

  const checkAuthAndLoadData = async () => {
    const token = localStorage.getItem('consultant_jwt');
    if (!token) {
      router.push('/consultants/login');
      return;
    }

    try {
      // Load consultant profile
      const profileData = await loadConsultantProfile(token);
      if (profileData && (profileData.needs_password || profileData.needs_profile_update)) {
        setActiveTab('profile');
      }
      // Load appointments
      await loadAppointments(token);
      // Load webinars
      await loadWebinars(token);
      // Load availability
      await loadAvailability(token);
      // Load plans
      await loadPlans(token);
      // Load products
      if (profileData && profileData.id) {
        await loadProducts(token, profileData.id);
      } else {
        await loadProducts(token);
      }
    } catch (error) {

    } finally {
      setLoading(false);
    }
  };

  const loadOrders = async (token: string, consultantId: number) => {
    try {
      const res = await fetch(getApiUrl(`api/consultants/${consultantId}/orders`), {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error('Failed to load orders', err);
    }
  };

  const handleUpdateDeliveryStatus = async (orderId: number, itemId: number, status: string) => {
    try {
      const token = localStorage.getItem('consultant_jwt');
      const res = await fetch(getApiUrl(`api/orders/${orderId}/items/${itemId}/status`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ delivery_status: status })
      });
      if (res.ok) {
        alert('Delivery status updated successfully');
        if (consultant) loadOrders(token as string, consultant.id);
      } else {
        alert('Failed to update status');
      }
    } catch (err) {
      alert('Error updating status');
    }
  };

  const loadPlans = async (token: string) => {
    try {
      const response = await fetch(`${getApiUrl('api/admin/subscriptions')}`);
      if (response.ok) {
        const data = await response.json();
        const consultantPlans = (data.data || data || []).filter((p: any) => p.target_audience === 'consultant' && (p.is_active === 1 || p.is_active === true));
        setPlans(consultantPlans);
      }
    } catch (error) {
      console.error('Error loading plans:', error);
    }
  };

  const loadProducts = async (token: string, consultantId?: number) => {
    try {
      const idToUse = consultantId || consultant?.id;
      const url = idToUse 
        ? `${getApiUrl('api/products')}?consultant_id=${idToUse}&all=true`
        : `${getApiUrl('api/products')}`;

      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` },
        cache: 'no-store'
      });
      if (response.ok) {
        const data = await response.json();
        const allProducts = data.products || data.data || [];
        setProducts(allProducts);
      }
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  const loadConsultantProfile = async (token: string) => {

    
    try {
      const response = await fetch(`${getApiUrl('api/consultants/profile')}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setFormData({
          name: data.name || '',
          phone: data.phone || '',
          speciality: data.speciality || '',
          city: data.city || '',
          description: data.description || '',
          pan_number: data.pan_number || '',
          gst_number: data.gst_number || '',
          price_per_slot: data.price_per_slot || '',
          password: ''
        });
        console.log("ok Next");
        console.log(data);

        setConsultant(data);
        return data;
      }
    } catch (error) {

    }
    return null;
  };

  const loadAppointments = async (token: string) => {
    try {
      const response = await fetch(`${getApiUrl('api/consultants/appointments')}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setAppointments(data.appointments || []);
      }
    } catch (error) {

    }
  };

  const handleGoogleOAuthSetup = async () => {
    try {
      const token = localStorage.getItem("consultant_jwt");
      const res = await fetch(getApiUrl("api/auth/admin/google"), {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        window.open(data.authUrl, '_blank');
        setGoogleOAuthSetup(true);
        alert('Google OAuth setup initiated. Please complete the authorization in the popup window.');
      } else {
        alert('Failed to initiate Google OAuth setup');
      }
    } catch (error) {
      console.error('Error setting up Google OAuth:', error);
      alert('Error setting up Google OAuth');
    }
  };

  const loadWebinars = async (token: string) => {
    try {
      const response = await fetch(`${getApiUrl('api/consultants/webinars')}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setWebinars(data.webinars || []);
      }
    } catch (error) {
      console.error('Error loading webinars:', error);
    }
  };

  const handleCreateWebinar = async () => {
    if (!consultant) {
      alert('Consultant profile not loaded');
      return;
    }
    if (!webinarForm.title || !webinarForm.start_time) {
      alert('Please fill in required fields');
      return;
    }

    try {
      const token = localStorage.getItem('consultant_jwt');
      
      // Calculate end_time based on duration
      const startDate = new Date(webinarForm.start_time);
      const endDate = new Date(startDate.getTime() + webinarForm.duration_minutes * 60000);
      const end_time = endDate.toISOString().split('.')[0]; // remove milliseconds

      // Construct clean payload matching Postman precisely
      const payload = {
        title: webinarForm.title,
        description: webinarForm.description,
        start_time: webinarForm.start_time,
        end_time: end_time,
        duration_minutes: webinarForm.duration_minutes,
        max_attendees: 100, // Default to 100 as seen in admin
        platform_type: webinarForm.platform_type,
        manual_link: webinarForm.manual_link,
        is_free: webinarForm.is_free,
        price: webinarForm.is_free ? 0 : webinarForm.price,
        registration_fields_json: webinarForm.registration_fields,
        joining_email_template: webinarForm.joining_email_template,
        reminder_email_template: webinarForm.reminder_email_template,
        recording_email_template: webinarForm.recording_email_template,
        reminder_schedule_json: webinarForm.reminder_schedule,
        // Host identification
        organizer_id: consultant.id,
        organizer_email: consultant.email
      };

      console.log('Sending Webinar Payload:', payload);

      const response = await fetch(getApiUrl('api/webinars'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setShowWebinarModal(false);
        await loadWebinars(token!);
        alert('Webinar scheduled successfully! ✅');
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Webinar Creation Error:', errorData);
        alert(`Permission Denied (403). Status Detail: ${JSON.stringify(errorData)}. This usually means your account lacks 'Host' privileges on the backend.`);
      }
    } catch (error) {
      console.error('Webinar Creation Catch Error:', error);
      alert('Error creating webinar');
    }
  };

  const loadRegistrants = async (webinarId: number) => {
    try {
      const token = localStorage.getItem('consultant_jwt');
      const response = await fetch(getApiUrl(`api/webinars/${webinarId}/registrants`), {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setRegistrants(data.registrants || []);
      }
    } catch (error) {
      console.error('Error loading registrants:', error);
    }
  };

  const handleSendJoiningLink = async (webinarId: number) => {
    try {
      const token = localStorage.getItem('consultant_jwt');
      const response = await fetch(getApiUrl(`api/webinars/${webinarId}/send-joining-link`), {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) alert('Joining links sent successfully!');
      else alert('Failed to send joining links');
    } catch (error) {
      alert('Error sending joining links');
    }
  };

  const handleSendReminder = async (webinarId: number) => {
    try {
      const token = localStorage.getItem('consultant_jwt');
      const response = await fetch(getApiUrl(`api/webinars/${webinarId}/send-reminder`), {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) alert('Reminders sent successfully!');
      else alert('Failed to send reminders');
    } catch (error) {
      alert('Error sending reminders');
    }
  };

  const handleUploadRecording = async (webinarId: number) => {
    if (!recordingUrl) return;
    try {
      const token = localStorage.getItem('consultant_jwt');
      const response = await fetch(getApiUrl(`api/webinars/${webinarId}/upload-recording`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ recording_url: recordingUrl })
      });
      if (response.ok) {
        alert('Recording URL updated!');
        setShowRecordingModal(false);
        await loadWebinars(token!);
      } else alert('Failed to update recording URL');
    } catch (error) {
      alert('Error updating recording URL');
    }
  };

  const handleSendRecordingLink = async (webinarId: number) => {
    try {
      const token = localStorage.getItem('consultant_jwt');
      const response = await fetch(getApiUrl(`api/webinars/${webinarId}/send-recording-link`), {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) alert('Recording links sent successfully!');
      else alert('Failed to send recording links');
    } catch (error) {
      alert('Error sending recording links');
    }
  };


  const loadAvailability = async (token: string) => {
    try {
      const response = await fetch(`${getApiUrl('api/consultants/availability')}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setAvailability(data.availability || []);
      }
    } catch (error) {

    }
  };

  const handleAddAvailability = async () => {
    if (!newAvailability.date || !newAvailability.start_time || !newAvailability.end_time) {
      alert('Please fill in all availability fields');
      return;
    }

    try {
      const token = localStorage.getItem('consultant_jwt');
      const response = await fetch(`${getApiUrl('api/consultants/availability')}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newAvailability)
      });

      if (response.ok) {
        setNewAvailability({ date: '', start_time: '', end_time: '' });
        setShowAddAvailability(false);
        await loadAvailability(token!);
      } else {
        alert('Failed to add availability');
      }
    } catch (error) {

      alert('Error adding availability');
    }
  };

  const handleDeleteAvailability = async (id: number) => {
    if (!confirm('Are you sure you want to delete this availability slot?')) return;

    try {
      const token = localStorage.getItem('consultant_jwt');
      const response = await fetch(`${getApiUrl(`api/consultants/availability/${id}`)}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        await loadAvailability(token!);
      } else {
        alert('Failed to delete availability');
      }
    } catch (error) {

      alert('Error deleting availability');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('consultant_jwt');
    router.push('/admin/login');
  };


  const titleStyle = {
    fontSize: '24px',
    fontWeight: '600',
    marginBottom: '20px',
    color: '#333'
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px'
  };

  const labelStyle = {
    display: 'block',
    fontWeight: '600',
    marginBottom: '6px',
    color: '#374151',
    fontSize: '14px'
  };

  const inputStyle = {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #d1d5db',
    fontSize: '14px'
  };

  const fileStyle = {
    width: '100%',
    padding: '8px'
  };

  const buttonStyle = {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    padding: '14px 30px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    width: '100%',
    maxWidth: '300px'
  };

  const [panFile, setPanFile] = useState<File | null>(null);
  const [gstFile, setGstFile] = useState<File | null>(null);
  const [degreeFiles, setDegreeFiles] = useState<File[]>([]);





const handleProfileUpdate = async () => {
  if (!formData.pan_number || !formData.gst_number || !formData.price_per_slot) {
    alert('Please fill out all required fields: PAN Number, GST Number, and Price per slot.');
    return;
  }

  try {
    const token = localStorage.getItem('consultant_jwt');

    const formDataObj = new FormData();

    // ✅ ALL FIELDS ADD KARO
    formDataObj.append('name', formData.name);
    formDataObj.append('phone', formData.phone);
    formDataObj.append('speciality', formData.speciality);
    formDataObj.append('city', formData.city);
    formDataObj.append('description', formData.description);

    formDataObj.append('pan_number', formData.pan_number);
    formDataObj.append('gst_number', formData.gst_number);
    formDataObj.append('price_per_slot', formData.price_per_slot);

    // files
    if (panFile) formDataObj.append('pan_card', panFile);
    if (gstFile) formDataObj.append('gst_certificate', gstFile);

    degreeFiles.forEach(file => {
      formDataObj.append('degree_certificates', file);
    });

    const res = await fetch(getApiUrl('api/consultants/update-profile'), {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formDataObj
    });

    const data = await res.json();

    let passwordUpdated = true;
    if (consultant?.needs_password && formData.password) {
      const pwRes = await fetch(getApiUrl('api/consultants/set-password'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ password: formData.password })
      });
      if (!pwRes.ok) passwordUpdated = false;
    }

    if (data.success && passwordUpdated) {
      alert('Profile updated successfully ✅');
      await loadConsultantProfile(token!);
    } else {
      alert(data.message || 'Update failed ❌');
    }

  } catch (error) {
    console.error(error);
    alert('Error updating profile');
  }
};


  // const handleProfileUpdate = async () => {
  //   try {
  //     const token = localStorage.getItem('consultant_jwt');

  //     const formData = new FormData();

  //     formData.append('pan_number', pan);
  //     formData.append('gst_number', gst);
  //     formData.append('price_per_slot', price);

  //     if (panFile) formData.append('pan_card', panFile);
  //     if (gstFile) formData.append('gst_certificate', gstFile);

  //     degreeFiles.forEach(file => {
  //       formData.append('degree_certificates', file);
  //     });

  //     const res = await fetch(getApiUrl('api/consultants/update-profile'), {
  //       method: 'POST',
  //       headers: {
  //         Authorization: `Bearer ${token}`
  //       },
  //       body: formData
  //     });

  //     const data = await res.json();

  //     if (data.success) {
  //       alert('Profile updated successfully ✅');
  //     } else {
  //       alert('Update failed ❌');
  //     }

  //   } catch (error) {
  //     alert('Error updating profile');
  //   }
  // };









  useEffect(() => {
    const loadRazorpay = () => {
      return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => {
          resolve(true);
        };
        document.body.appendChild(script);
      });
    };

    loadRazorpay();
  }, []);




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

  if (!consultant) {
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
            Access Denied
          </h1>
          <p style={{
            fontSize: '16px',
            color: '#666',
            marginBottom: '32px',
            lineHeight: '1.5'
          }}>
            You need to be logged in as a consultant to access this dashboard
          </p>
          <button
            onClick={() => router.push('/consultants/login')}
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const upcomingAppointments = appointments.filter(apt =>
    new Date(apt.start_time) > new Date() && apt.status === 'scheduled'
  );

  const todayAppointments = appointments.filter(apt => {
    const aptDate = new Date(apt.start_time);
    const today = new Date();
    return aptDate.toDateString() === today.toDateString();
  });

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <TopBar />
      <div style={{
        flex: 1,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '20px'
      }}>
        <div style={{
          maxWidth: '1400px',
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

                  Welcome, {consultant.name}

                  {Number(consultant?.is_pro) === 1 ? (
                    <span
                      style={{
                        display: "inline-block",
                        background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                        color: "white",
                        fontSize: "12px",
                        fontWeight: "700",
                        padding: "4px 12px",
                        borderRadius: "20px",
                        marginLeft: "12px",
                        verticalAlign: "middle",
                      }}
                    >
                      ⭐ PRO
                    </span>
                  ) : null}

                </h1>

                <p style={{
                  fontSize: '16px',
                  color: '#666'
                }}>
                  Manage your appointments, webinars, and availability
                  {Number(consultant?.is_pro) === 1 &&
                    consultant?.subscription_plan && (
                      <span style={{ color: "#d97706", fontWeight: "600" }}>
                        {" "}
                        |{" "}
                        {consultant.subscription_plan.charAt(0).toUpperCase() +
                          consultant.subscription_plan.slice(1)}{" "}
                        Plan
                      </span>
                  )}
                </p>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={handleLogout}
                  style={{
                    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '12px 24px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <FaSignOutAlt />
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '24px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{
              display: 'flex',
              gap: '8px',
              flexWrap: 'wrap'
            }}>
              {[
                { id: 'overview', label: 'Overview', icon: FaChartLine },
                { id: 'appointments', label: 'Appointments', icon: FaCalendarAlt },
                { id: 'webinars', label: 'Webinars', icon: FaVideo },
                { id: 'availability', label: 'Availability', icon: FaClock },
                { id: 'subscription', label: consultant?.is_pro ? '⭐ Pro' : 'Subscription', icon: FaCog },
                { id: 'marketplace', label: 'Marketplace', icon: FaStore },
                { id: 'orders', label: 'Product Orders', icon: FaBoxOpen },
                { id: 'wallet', label: 'Wallet', icon: FaWallet },
                { id: 'profile', label: 'Profile', icon: FaUserMd }
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id as any)}
                  style={{
                    background: activeTab === id ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
                    color: activeTab === id ? 'white' : '#667eea',
                    border: `2px solid ${activeTab === id ? 'transparent' : '#667eea'}`,
                    borderRadius: '8px',
                    padding: '12px 24px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <Icon />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}>
            {activeTab === 'overview' && (
              <div>
                <h2 style={{
                  fontSize: '24px',
                  fontWeight: '600',
                  color: '#333',
                  marginBottom: '24px'
                }}>
                  Dashboard Overview
                </h2>

                {/* Stats Cards */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: '24px',
                  marginBottom: '32px'
                }}>
                  <div style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    borderRadius: '12px',
                    padding: '24px',
                    textAlign: 'center'
                  }}>
                    <FaCalendarAlt style={{ fontSize: '32px', marginBottom: '12px' }} />
                    <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>
                      {upcomingAppointments.length}
                    </h3>
                    <p style={{ fontSize: '14px', opacity: 0.9 }}>
                      Upcoming Appointments
                    </p>
                  </div>

                  <div style={{
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: 'white',
                    borderRadius: '12px',
                    padding: '24px',
                    textAlign: 'center'
                  }}>
                    <FaVideo style={{ fontSize: '32px', marginBottom: '12px' }} />
                    <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>
                      {webinars.length}
                    </h3>
                    <p style={{ fontSize: '14px', opacity: 0.9 }}>
                      Total Webinars
                    </p>
                  </div>

                  <div style={{
                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    color: 'white',
                    borderRadius: '12px',
                    padding: '24px',
                    textAlign: 'center'
                  }}>
                    <FaClock style={{ fontSize: '32px', marginBottom: '12px' }} />
                    <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>
                      {todayAppointments.length}
                    </h3>
                    <p style={{ fontSize: '14px', opacity: 0.9 }}>
                      Today's Appointments
                    </p>
                  </div>

                  <div style={{
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                    color: 'white',
                    borderRadius: '12px',
                    padding: '24px',
                    textAlign: 'center'
                  }}>
                    <FaUsers style={{ fontSize: '32px', marginBottom: '12px' }} />
                    <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>
                      {availability.length}
                    </h3>
                    <p style={{ fontSize: '14px', opacity: 0.9 }}>
                      Available Slots
                    </p>
                  </div>
                </div>

                {/* Recent Appointments */}
                <div>
                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: '600',
                    color: '#333',
                    marginBottom: '16px'
                  }}>
                    Recent Appointments
                  </h3>
                  {appointments.slice(0, 5).map((appointment) => (
                    <div
                      key={appointment.id}
                      style={{
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        padding: '16px',
                        marginBottom: '12px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div>
                        <h4 style={{
                          fontSize: '16px',
                          fontWeight: '600',
                          color: '#333',
                          marginBottom: '4px'
                        }}>
                          {appointment.title}
                        </h4>
                        <p style={{
                          fontSize: '14px',
                          color: '#666',
                          marginBottom: '4px'
                        }}>
                          {new Date(appointment.start_time).toLocaleString()}
                        </p>
                        <p style={{
                          fontSize: '12px',
                          color: '#666'
                        }}>
                          {appointment.user_name || 'Client'}
                        </p>
                      </div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: '600',
                          background: appointment.status === 'scheduled' ? '#e3f2fd' : '#e8f5e8',
                          color: appointment.status === 'scheduled' ? '#1976d2' : '#388e3c'
                        }}>
                          {appointment.status}
                        </span>
                        {appointment.google_meet_link && (
                          <a
                            href={appointment.google_meet_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                              color: 'white',
                              textDecoration: 'none',
                              padding: '6px 12px',
                              borderRadius: '6px',
                              fontSize: '12px',
                              fontWeight: '600'
                            }}
                          >
                            Join
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'appointments' && (
              <div>
                <h2 style={{
                  fontSize: '24px',
                  fontWeight: '600',
                  color: '#333',
                  marginBottom: '24px'
                }}>
                  My Appointments
                </h2>

                {appointments.length === 0 ? (
                  <div style={{
                    textAlign: 'center',
                    padding: '40px',
                    color: '#666'
                  }}>
                    <FaCalendarAlt style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.5 }} />
                    <p style={{ fontSize: '16px' }}>No appointments scheduled yet</p>
                  </div>
                ) : (
                  <div style={{
                    display: 'grid',
                    gap: '16px'
                  }}>
                    {appointments.map((appointment) => (
                      <div
                        key={appointment.id}
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
                              {appointment.title}
                            </h3>
                            <p style={{
                              fontSize: '14px',
                              color: '#666',
                              marginBottom: '12px'
                            }}>
                              {appointment.description}
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
                                {new Date(appointment.start_time).toLocaleString()}
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <FaUserMd />
                                {appointment.user_name || 'Client'}
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                ₹{appointment.price}
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
                              background: appointment.status === 'scheduled' ? '#e3f2fd' :
                                appointment.status === 'confirmed' ? '#e8f5e8' : '#ffebee',
                              color: appointment.status === 'scheduled' ? '#1976d2' :
                                appointment.status === 'confirmed' ? '#388e3c' : '#d32f2f'
                            }}>
                              {appointment.status}
                            </span>
                            {appointment.google_meet_link && (
                              <a
                                href={appointment.google_meet_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                  color: 'white',
                                  textDecoration: 'none',
                                  padding: '8px 16px',
                                  borderRadius: '6px',
                                  fontSize: '12px',
                                  fontWeight: '600'
                                }}
                              >
                                🎥 Join Meeting
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

            {activeTab === 'webinars' && (
              <div>
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
                    My Webinars
                  </h2>
                  <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'center' }}>
                    <button
                      onClick={() => setShowWebinarModal(true)}
                      style={{
                        backgroundColor: '#10b981',
                        color: 'white',
                        padding: '12px 24px',
                        borderRadius: '8px',
                        border: 'none',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                    >
                      <FaPlus /> Schedule Webinar
                    </button>

                    {!googleOAuthSetup ? (
                      <button
                        onClick={handleGoogleOAuthSetup}
                        style={{
                          backgroundColor: '#4285F4',
                          color: 'white',
                          padding: '12px 24px',
                          borderRadius: '8px',
                          border: 'none',
                          fontWeight: '600',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}
                      >
                        <FaGoogle /> Link Google Account
                      </button>
                    ) : (
                      <div style={{
                        backgroundColor: '#ecfdf5',
                        color: '#059669',
                        padding: '12px 24px',
                        borderRadius: '8px',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        border: '1px solid #10b981'
                      }}>
                        <FaCheck /> Google Connected
                      </div>
                    )}
                  </div>
                </div>

                {webinars.length === 0 ? (
                  <div style={{
                    textAlign: 'center',
                    padding: '40px',
                    color: '#666'
                  }}>
                    <FaVideo style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.5 }} />
                    <p style={{ fontSize: '16px' }}>No webinars created yet</p>
                  </div>
                ) : (
                  <div style={{
                    display: 'grid',
                    gap: '16px'
                  }}>
                    {webinars.map((webinar) => (
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
                                <FaUsers />
                                {webinar.current_attendees}/{webinar.max_attendees} attendees
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
                            {webinar.platform_type === 'google_meet' && webinar.google_meet_link && (
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
                                🎥 Join (Host)
                              </a>
                            )}
                            {webinar.platform_type === 'others' && webinar.manual_link && (
                              <a
                                href={webinar.manual_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                  color: 'white',
                                  textDecoration: 'none',
                                  padding: '8px 16px',
                                  borderRadius: '6px',
                                  fontSize: '12px',
                                  fontWeight: '600'
                                }}
                              >
                                🔗 Join (Host)
                              </a>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div style={{
                          display: 'flex',
                          gap: '8px',
                          marginTop: '16px',
                          flexWrap: 'wrap',
                          borderTop: '1px solid #eee',
                          paddingTop: '16px'
                        }}>
                          <button
                            onClick={() => {
                              setSelectedWebinar(webinar);
                              loadRegistrants(webinar.id);
                              setShowRegistrantsModal(true);
                            }}
                            style={{
                              background: '#f3f4f6',
                              color: '#374151',
                              border: '1px solid #d1d5db',
                              padding: '6px 12px',
                              borderRadius: '6px',
                              fontSize: '12px',
                              fontWeight: '600',
                              cursor: 'pointer'
                            }}
                          >
                            👥 See Registrants
                          </button>
                          <button
                            onClick={() => handleSendJoiningLink(webinar.id)}
                            style={{
                              background: '#f3f4f6',
                              color: '#374151',
                              border: '1px solid #d1d5db',
                              padding: '6px 12px',
                              borderRadius: '6px',
                              fontSize: '12px',
                              fontWeight: '600',
                              cursor: 'pointer'
                            }}
                          >
                            📧 Send Joining Link
                          </button>
                          <button
                            onClick={() => handleSendReminder(webinar.id)}
                            style={{
                              background: '#f3f4f6',
                              color: '#374151',
                              border: '1px solid #d1d5db',
                              padding: '6px 12px',
                              borderRadius: '6px',
                              fontSize: '12px',
                              fontWeight: '600',
                              cursor: 'pointer'
                            }}
                          >
                            🔔 Send Joining Reminder
                          </button>
                          <button
                            onClick={() => {
                              setSelectedWebinar(webinar);
                              setRecordingUrl(webinar.recording_url || '');
                              setShowRecordingModal(true);
                            }}
                            style={{
                              background: '#f3f4f6',
                              color: '#374151',
                              border: '1px solid #d1d5db',
                              padding: '6px 12px',
                              borderRadius: '6px',
                              fontSize: '12px',
                              fontWeight: '600',
                              cursor: 'pointer'
                            }}
                          >
                            📽️ Upload Recording
                          </button>
                          {webinar.recording_url && (
                             <button
                             onClick={() => handleSendRecordingLink(webinar.id)}
                             style={{
                               background: '#f3f4f6',
                               color: '#374151',
                               border: '1px solid #d1d5db',
                               padding: '6px 12px',
                               borderRadius: '6px',
                               fontSize: '12px',
                               fontWeight: '600',
                               cursor: 'pointer'
                             }}
                           >
                             ✉️ Send Recording Link
                           </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'availability' && (
              <div>
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
                    My Availability
                  </h2>
                  <button
                    onClick={() => setShowAddAvailability(true)}
                    style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '12px 24px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <FaPlus />
                    Add Availability
                  </button>
                </div>

                {/* Add Availability Modal */}
                {showAddAvailability && (
                  <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                  }}>
                    <div style={{
                      background: 'white',
                      borderRadius: '16px',
                      padding: '32px',
                      maxWidth: '500px',
                      width: '90%',
                      maxHeight: '90vh',
                      overflow: 'auto'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <h3 style={{
                          fontSize: '20px',
                          fontWeight: '600',
                          color: '#333',
                          margin: 0
                        }}>
                          Add Availability
                        </h3>
                        <button onClick={() => setShowAddAvailability(false)} style={{ background: 'none', border: 'none', fontSize: '28px', cursor: 'pointer', color: '#6b7280', lineHeight: 1 }}>×</button>
                      </div>

                      <div style={{ marginBottom: '16px' }}>
                        <label style={{
                          display: 'block',
                          fontWeight: '600',
                          color: '#374151',
                          marginBottom: '8px'
                        }}>
                          Date
                        </label>
                        <input
                          type="date"
                          value={newAvailability.date}
                          onChange={(e) => setNewAvailability({ ...newAvailability, date: e.target.value })}
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            borderRadius: '8px',
                            border: '1px solid #d1d5db',
                            fontSize: '16px'
                          }}
                        />
                      </div>

                      <div style={{ marginBottom: '16px' }}>
                        <label style={{
                          display: 'block',
                          fontWeight: '600',
                          color: '#374151',
                          marginBottom: '8px'
                        }}>
                          Start Time
                        </label>
                        <input
                          type="time"
                          value={newAvailability.start_time}
                          onChange={(e) => setNewAvailability({ ...newAvailability, start_time: e.target.value })}
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            borderRadius: '8px',
                            border: '1px solid #d1d5db',
                            fontSize: '16px'
                          }}
                        />
                      </div>

                      <div style={{ marginBottom: '24px' }}>
                        <label style={{
                          display: 'block',
                          fontWeight: '600',
                          color: '#374151',
                          marginBottom: '8px'
                        }}>
                          End Time
                        </label>
                        <input
                          type="time"
                          value={newAvailability.end_time}
                          onChange={(e) => setNewAvailability({ ...newAvailability, end_time: e.target.value })}
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            borderRadius: '8px',
                            border: '1px solid #d1d5db',
                            fontSize: '16px'
                          }}
                        />
                      </div>

                      <div style={{
                        display: 'flex',
                        gap: '12px',
                        justifyContent: 'flex-end'
                      }}>
                        <button
                          onClick={() => setShowAddAvailability(false)}
                          style={{
                            background: 'transparent',
                            color: '#6b7280',
                            border: '1px solid #d1d5db',
                            borderRadius: '8px',
                            padding: '12px 24px',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: 'pointer'
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleAddAvailability}
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
                          Add Availability
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {availability.length === 0 ? (
                  <div style={{
                    textAlign: 'center',
                    padding: '40px',
                    color: '#666'
                  }}>
                    <FaClock style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.5 }} />
                    <p style={{ fontSize: '16px' }}>No availability slots added yet</p>
                  </div>
                ) : (
                  <div style={{
                    display: 'grid',
                    gap: '16px'
                  }}>
                    {availability.map((slot) => (
                      <div
                        key={slot.id}
                        style={{
                          border: '1px solid #e5e7eb',
                          borderRadius: '12px',
                          padding: '20px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}
                      >
                        <div>
                          <h3 style={{
                            fontSize: '16px',
                            fontWeight: '600',
                            color: '#333',
                            marginBottom: '4px'
                          }}>
                            {new Date(slot.date).toLocaleDateString()}
                          </h3>
                          <p style={{
                            fontSize: '14px',
                            color: '#666'
                          }}>
                            {slot.start_time} - {slot.end_time}
                          </p>
                        </div>
                        <button
                          onClick={() => handleDeleteAvailability(slot.id)}
                          style={{
                            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '8px 16px',
                            fontSize: '12px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          <FaTrash />
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'subscription' && (
              <div>
                <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#333', marginBottom: '24px' }}>
                  {consultant.is_pro ? '⭐ Your Pro Subscription' : 'Upgrade to Pro'}
                </h2>

                {consultant.is_pro ? (
                  <div>
                    <div style={{
                      background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                      borderRadius: '16px',
                      padding: '32px',
                      marginBottom: '24px',
                      border: '2px solid #f59e0b'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                        <span style={{ fontSize: '48px' }}>⭐</span>
                        <div>
                          <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#92400e', margin: '0 0 4px 0' }}>
                            Pro {consultant.subscription_plan ? consultant.subscription_plan.charAt(0).toUpperCase() + consultant.subscription_plan.slice(1) : ''} Plan
                          </h3>
                          <p style={{ color: '#a16207', margin: 0, fontSize: '14px' }}>
                            {consultant.promoted_by_admin ? 'Promoted by Admin' : 'Active Subscription'}
                          </p>
                        </div>
                      </div>
                      {consultant.subscription_end && (
                        <p style={{ color: '#92400e', fontSize: '14px', margin: 0 }}>
                          Valid until: {new Date(consultant.subscription_end).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                      )}
                    </div>
                    <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#333', marginBottom: '16px' }}>Pro Benefits</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
                      {['Priority listing in search results', 'Featured badge on your profile', 'Advanced analytics dashboard', 'Priority booking slots', 'Dedicated support channel', 'Marketing & promotion'].map((benefit, i) => (
                        <div key={i} style={{
                          display: 'flex', alignItems: 'center', gap: '12px', padding: '16px',
                          background: '#f9fafb', borderRadius: '12px', border: '1px solid #e5e7eb'
                        }}>
                          <span style={{ color: '#10b981', fontSize: '18px' }}>✓</span>
                          <span style={{ color: '#374151', fontSize: '14px', fontWeight: '500' }}>{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div>
                    <p style={{ color: '#6b7280', fontSize: '16px', marginBottom: '32px', lineHeight: '1.6' }}>
                      Upgrade to a Pro plan to get featured placement, priority bookings, and advanced tools to grow your practice.
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                      {Object.values(plans.reduce((acc: any, plan: any) => {
                        if (!acc[plan.plan_key]) {
                          let parsedFeats = [];
                          try {
                            const parsed = JSON.parse(plan.features_json || '[]');
                            if (Array.isArray(parsed)) parsedFeats = parsed;
                            else parsedFeats = Object.entries(parsed).map(([k,v]) => `${k}: ${v}`);
                          } catch(e) {
                             parsedFeats = plan.description ? plan.description.split('\n').map((s: string) => s.trim()).filter(Boolean) : [];
                          }
                          
                          acc[plan.plan_key] = {
                            key: plan.plan_key,
                            name: plan.plan_name,
                            features: parsedFeats,
                            monthly: 0,
                            yearly: 0,
                            currency: plan.currency || 'INR'
                          };
                        }
                        if (plan.billing_cycle === 'monthly') acc[plan.plan_key].monthly = parseInt(plan.base_price, 10);
                        if (plan.billing_cycle === 'yearly') acc[plan.plan_key].yearly = parseInt(plan.base_price, 10);
                        return acc;
                      }, {} as Record<string, any>)).map((plan: any) => (
                        <div key={plan.key} style={{
                          border: plan.key === 'standard' ? '2px solid #667eea' : '1px solid #e5e7eb',
                          borderRadius: '16px', padding: '32px', textAlign: 'center', position: 'relative',
                          background: plan.key === 'standard' ? 'linear-gradient(135deg, #eff6ff 0%, #f5f3ff 100%)' : 'white'
                        }}>
                          {plan.key === 'standard' && (
                            <div style={{
                              position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)',
                              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white',
                              padding: '4px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: '700'
                            }}>MOST POPULAR</div>
                          )}
                          <h3 style={{ fontSize: '22px', fontWeight: '700', color: '#1e293b', marginBottom: '8px' }}>{plan.name}</h3>
                          <div style={{ fontSize: '36px', fontWeight: '800', color: '#667eea', marginBottom: '4px' }}>
                            {plan.currency === 'INR' ? '₹' : plan.currency}{plan.monthly}
                            {plan.monthly > 0 && <span style={{ fontSize: '16px', color: '#6b7280', fontWeight: '500' }}>/mo</span>}
                          </div>
                          <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '24px' }}>
                            {plan.yearly > 0 ? `or ${plan.currency === 'INR' ? '₹' : plan.currency}${plan.yearly}/year` : ''}
                            {plan.monthly > 0 && plan.yearly > 0 && ` (save ${Math.round((1 - plan.yearly / (plan.monthly * 12)) * 100)}%)`}
                          </p>
                          <ul style={{ textAlign: 'left', listStyle: 'none', padding: 0, marginBottom: '24px' }}>
                            {plan.features.map((f: string, i: number) => (
                              <li key={i} style={{ padding: '8px 0', borderBottom: '1px solid #f3f4f6', fontSize: '14px', color: '#374151', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ color: '#10b981' }}>✓</span> {f}
                              </li>
                            ))}
                          </ul>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <button
                              onClick={async () => {
                                try {
                                  const token = localStorage.getItem('consultant_jwt');
                                  const amount = plan.monthly;

                                  const res = await fetch(
                                    getApiUrl('api/consultants/razorpay/create-order'),
                                    {
                                      method: 'POST',
                                      headers: {
                                        'Content-Type': 'application/json',
                                        'Authorization': `Bearer ${token}`
                                      },
                                      body: JSON.stringify({
                                        amount: amount,
                                        receipt: `sub_${Date.now()}`
                                      })
                                    }
                                  );

                                  const data = await res.json();

                                  if (!data.success) {
                                    alert(data.message || "Unable to initiate payment");
                                    return;
                                  }

                                  const options = {
                                    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
                                    amount: data.order.amount,
                                    currency: "INR",
                                    name: "MieT Subscription",
                                    description: `${plan.name} Plan (Monthly)`,
                                    order_id: data.order.id,

                                    handler: async function (response: any) {
                                      const verifyRes = await fetch(
                                        getApiUrl('api/consultants/subscription/verify'),
                                        {
                                          method: 'POST',
                                          headers: {
                                            'Content-Type': 'application/json',
                                            'Authorization': `Bearer ${token}`
                                          },
                                          body: JSON.stringify({
                                            razorpay_payment_id: response.razorpay_payment_id,
                                            razorpay_order_id: response.razorpay_order_id,
                                            razorpay_signature: response.razorpay_signature,
                                            plan: plan.key,
                                            billing_cycle: 'monthly'
                                          })
                                        }
                                      );

                                      const verifyData = await verifyRes.json();

                                      if (verifyData.success) {
                                        alert("Monthly Subscription Activated Successfully 🎉");
                                        window.location.reload();
                                      } else {
                                        alert(verifyData.message || "Verification failed");
                                      }
                                    },
                                    prefill: {
                                      name: consultant?.name,
                                      email: consultant?.email,
                                      contact: consultant?.phone
                                    },
                                    theme: {
                                      color: "#667eea"
                                    }
                                  };

                                  const rzp = new (window as any).Razorpay(options);
                                  rzp.open();

                                } catch (error) {
                                  alert("Something went wrong");
                                }
                              }}
                              style={{
                                width: '100%',
                                background: plan.key === 'standard' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'white',
                                color: plan.key === 'standard' ? 'white' : '#667eea',
                                border: plan.key === 'standard' ? 'none' : '2px solid #667eea',
                                borderRadius: '12px', padding: '14px 0', fontWeight: '700', fontSize: '16px', cursor: 'pointer',
                                transition: 'all 0.3s ease'
                              }}
                            >
                              Subscribe Monthly
                            </button>

                            <button
                              onClick={async () => {
                                try {
                                  const token = localStorage.getItem('consultant_jwt');
                                  const amount = plan.yearly;

                                  const res = await fetch(
                                    getApiUrl('api/consultants/razorpay/create-order'),
                                    {
                                      method: 'POST',
                                      headers: {
                                        'Content-Type': 'application/json',
                                        'Authorization': `Bearer ${token}`
                                      },
                                      body: JSON.stringify({
                                        amount: amount,
                                        receipt: `sub_${Date.now()}_yearly`
                                      })
                                    }
                                  );

                                  const data = await res.json();

                                  if (!data.success) {
                                    alert(data.message || "Unable to initiate payment");
                                    return;
                                  }

                                  const options = {
                                    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
                                    amount: data.order.amount,
                                    currency: "INR",
                                    name: "MieT Subscription",
                                    description: `${plan.name} Plan (Yearly)`,
                                    order_id: data.order.id,

                                    handler: async function (response: any) {
                                      const verifyRes = await fetch(
                                        getApiUrl('api/consultants/subscription/verify'),
                                        {
                                          method: 'POST',
                                          headers: {
                                            'Content-Type': 'application/json',
                                            'Authorization': `Bearer ${token}`
                                          },
                                          body: JSON.stringify({
                                            razorpay_payment_id: response.razorpay_payment_id,
                                            razorpay_order_id: response.razorpay_order_id,
                                            razorpay_signature: response.razorpay_signature,
                                            plan: plan.key,
                                            billing_cycle: 'yearly'
                                          })
                                        }
                                      );

                                      const verifyData = await verifyRes.json();

                                      if (verifyData.success) {
                                        alert("Yearly Subscription Activated Successfully 🎉");
                                        window.location.reload();
                                      } else {
                                        alert(verifyData.message || "Verification failed");
                                      }
                                    },
                                    prefill: {
                                      name: consultant?.name,
                                      email: consultant?.email,
                                      contact: consultant?.phone
                                    },
                                    theme: {
                                      color: "#667eea"
                                    }
                                  };

                                  const rzp = new (window as any).Razorpay(options);
                                  rzp.open();

                                } catch (error) {
                                  alert("Something went wrong");
                                }
                              }}
                              style={{
                                width: '100%',
                                background: 'white',
                                color: '#6b7280',
                                border: '1px solid #d1d5db',
                                borderRadius: '12px', padding: '14px 0', fontWeight: '600', fontSize: '16px', cursor: 'pointer',
                                transition: 'all 0.3s ease'
                              }}
                            >
                              Subscribe Yearly
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'marketplace' && (
              <div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '24px'
                }}>
                  <h2 style={{
                    fontSize: '24px',
                    fontWeight: '600',
                    color: '#333',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}>
                    {activeCategory && (
                      <button
                        onClick={() => setActiveCategory(null)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#6b7280',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        <FaChevronLeft />
                      </button>
                    )}
                    {activeCategory ? `Manage ${activeCategory}` : 'My Marketplace Items'}
                  </h2>
                  {activeCategory && (
                    <button
                      onClick={() => {
                        const typeMap: Record<string, string> = {
                          courses: 'Course',
                          ebooks: 'E-book',
                          apps: 'App',
                          gadgets: 'Gadget',
                        };
                        setProductForm({
                          type: typeMap[activeCategory] || 'Course',
                          status: 'active',
                          featured: false,
                          title: '', name: '', description: '', price: '',
                          video_url: '', thumbnail: '', author: '',
                          pdf_file: '', download_link: '', icon: '',
                          product_image: '', purchase_link: ''
                        });
                        setShowProductModal(true);
                      }}
                      style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '10px 20px',
                        fontWeight: '600',
                        fontSize: '14px',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                    >
                      <FaPlus /> Add New
                    </button>
                  )}
                </div>
                
                <p style={{ color: '#6b7280', fontSize: '16px', marginBottom: '32px', lineHeight: '1.6' }}>
                  Upload and manage your digital products. All submitted products require admin approval before they go live on the public marketplace.
                </p>

                {!activeCategory ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                    {[
                      { key: 'courses', title: 'Video Courses', desc: 'Pre-recorded courses and masterclasses', icon: '🎓' },
                      { key: 'ebooks', title: 'E-Books', desc: 'Digital books, guides, and written materials', icon: '📚' },
                      { key: 'apps', title: 'Software & Apps', desc: 'Digital tools and applications', icon: '📱' },
                      { key: 'gadgets', title: 'Gadgets', desc: 'Physical or digital gadgets', icon: '💻' }
                    ].map((category) => (
                      <div
                        key={category.key}
                        style={{
                          background: '#f9fafb',
                          border: '1px solid #e5e7eb',
                          borderRadius: '16px',
                          padding: '24px',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          textAlign: 'center',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <div style={{ fontSize: '48px', marginBottom: '16px' }}>{category.icon}</div>
                        <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b', marginBottom: '8px' }}>
                          {category.title}
                        </h3>
                        <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '24px', flex: 1 }}>
                          {category.desc}
                        </p>
                        <button
                          onClick={() => setActiveCategory(category.key)}
                          style={{
                            width: '100%',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '12px 0',
                            fontWeight: '600',
                            fontSize: '14px',
                            cursor: 'pointer',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: '8px'
                          }}
                        >
                          <FaCog /> Manage
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div>
                    {/* Render matching products */}
                    <div style={{ display: 'grid', gap: '16px' }}>
                      {products.filter((p: any) => {
                        const isOwner = (p.consultant_id && String(p.consultant_id) === String(consultant?.id)) || 
                                        (!p.consultant_id && consultant?.name && (
                                           (p.author && p.author.toLowerCase() === consultant.name.toLowerCase()) || 
                                           (p.instructor_name && p.instructor_name.toLowerCase() === consultant.name.toLowerCase())
                                        ));
                        
                        const typeMap: Record<string, string[]> = {
                          courses: ['Course', 'course'],
                          ebooks: ['E-book', 'e-book'],
                          apps: ['App', 'app'],
                          gadgets: ['Gadget', 'gadget'],
                        };
                        const matchesType = typeMap[activeCategory]?.includes(p.type || p.product_type) || typeMap[activeCategory]?.includes(p.product_type);
                        
                        return isOwner && matchesType;
                      }).length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#666', border: '1px dashed #d1d5db', borderRadius: '12px' }}>
                          <p>No products found in this category.</p>
                        </div>
                      ) : (
                        products.filter((p: any) => {
                          const isOwner = (p.consultant_id && String(p.consultant_id) === String(consultant?.id)) || 
                                          (!p.consultant_id && consultant?.name && (
                                             (p.author && p.author.toLowerCase() === consultant.name.toLowerCase()) || 
                                             (p.instructor_name && p.instructor_name.toLowerCase() === consultant.name.toLowerCase())
                                          ));
                          
                          const typeMap: Record<string, string[]> = {
                            courses: ['Course', 'course'],
                            ebooks: ['E-book', 'e-book'],
                            apps: ['App', 'app'],
                            gadgets: ['Gadget', 'gadget'],
                          };
                          const matchesType = typeMap[activeCategory]?.includes(p.type || p.product_type) || typeMap[activeCategory]?.includes(p.product_type);
                          
                          return isOwner && matchesType;
                        }).map((product) => (
                          <div key={product.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', border: '1px solid #e5e7eb', borderRadius: '12px', background: '#f9fafb' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                              {product.thumbnail || product.product_image || product.icon ? (
                                <img src={process.env.NEXT_PUBLIC_BACKEND_URL + (product.thumbnail || product.product_image || product.icon)} alt={product.title || product.name} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }} />
                              ) : (
                                <div style={{ width: '60px', height: '60px', background: '#e5e7eb', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>
                                  <FaImages size={24} />
                                </div>
                              )}
                              <div>
                                <h4 style={{ fontWeight: '600', color: '#111827', margin: 0, fontSize: '16px' }}>{product.title || product.name}</h4>
                                <p style={{ color: '#6b7280', margin: '4px 0 0 0', fontSize: '13px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                                  Approval Status: 
                                  {(!product.approval_status || product.approval_status === 'pending') && <span style={{ background: '#fef3c7', color: '#d97706', padding: '2px 8px', borderRadius: '4px', fontWeight: '600', fontSize: '12px' }}>PENDING</span>}
                                  {product.approval_status === 'approved' && <span style={{ background: '#dcfce7', color: '#059669', padding: '2px 8px', borderRadius: '4px', fontWeight: '600', fontSize: '12px' }}>APPROVED</span>}
                                  {product.approval_status === 'rejected' && <span style={{ background: '#fee2e2', color: '#dc2626', padding: '2px 8px', borderRadius: '4px', fontWeight: '600', fontSize: '12px' }}>REJECTED</span>}
                                </p>
                              </div>
                            </div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button
                                onClick={() => {
                                  setProductForm({ ...product, type: activeCategory === 'courses' ? 'Course' : activeCategory === 'ebooks' ? 'E-book' : activeCategory === 'apps' ? 'App' : 'Gadget' });
                                  setShowProductModal(true);
                                }}
                                style={{ background: '#eff6ff', color: '#3b82f6', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '600' }}
                              >
                                <FaEdit /> Edit
                              </button>
                              <button
                                onClick={async () => {
                                  if (confirm('Are you sure you want to delete this product?')) {
                                    try {
                                      const token = localStorage.getItem('consultant_jwt');
                                      const res = await fetch(getApiUrl(`api/products/${product.id}`), {
                                        method: 'DELETE',
                                        headers: { 'Authorization': `Bearer ${token}` }
                                      });
                                      if (res.ok) {
                                        alert('Product deleted successfully');
                                        await loadProducts(token!);
                                      } else {
                                        alert('Failed to delete product');
                                      }
                                    } catch (e) {
                                      alert('Error deleting product');
                                    }
                                  }
                                }}
                                style={{ background: '#fef2f2', color: '#ef4444', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '600' }}
                              >
                                <FaTrash /> Delete
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'orders' && (
              <ConsultantOrdersTab orders={orders} fetchOrders={() => {
                if (consultant) loadOrders(localStorage.getItem('consultant_jwt') as string, consultant.id);
              }} />
            )}

            {activeTab === 'wallet' && (
              <WalletTab />
            )}

            {activeTab === 'profile' && (
              <div>
                <h2 style={titleStyle}>My Profile</h2>

                {(consultant?.needs_password || consultant?.needs_profile_update) && (
                  <div style={{ padding: '16px', background: '#fff3cd', color: '#856404', borderRadius: '8px', marginBottom: '20px' }}>
                    <strong>Profile Update Required:</strong> Please complete your profile information below.
                    {consultant?.needs_password && " You also need to set a password for your account."}
                  </div>
                )}

                <div style={gridStyle}>

                  {/* Name */}
                  <div>
                    <label style={labelStyle}>Name</label>
                    <input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      style={inputStyle}
                    />
                  </div>

                  {/* Email (readonly) */}
                  <div>
                    <label style={labelStyle}>Email</label>
                    <input
                      value={consultant.email}
                      readOnly
                      style={{ ...inputStyle, background: '#f3f4f6', cursor: 'not-allowed' }}
                    />
                  </div>

                  {consultant?.needs_password && (
                    <div>
                      <label style={labelStyle}>Set Password</label>
                      <input
                        type="password"
                        placeholder="Enter new password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        style={inputStyle}
                        required
                      />
                    </div>
                  )}

                  {/* Phone */}
                  <div>
                    <label style={labelStyle}>Phone</label>
                    <input
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      style={inputStyle}
                    />
                  </div>

                  {/* Speciality */}
                  <div>
                    <label style={labelStyle}>Speciality</label>
                    <input
                      value={formData.speciality}
                      onChange={(e) => setFormData({ ...formData, speciality: e.target.value })}
                      style={inputStyle}
                    />
                  </div>

                  {/* City */}
                  <div>
                    <label style={labelStyle}>City</label>
                    <input
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      style={inputStyle}
                    />
                  </div>

                  {/* Price */}
                  <div>
                    <label style={labelStyle}>Price per Slot (₹) *</label>
                    <input
                      type="number"
                      value={formData.price_per_slot}
                      onChange={(e) => setFormData({ ...formData, price_per_slot: e.target.value })}
                      style={inputStyle}
                      required
                    />
                  </div>

                  {/* PAN */}
                  <div>
                    <label style={labelStyle}>PAN Number *</label>
                    <input
                      value={formData.pan_number}
                      onChange={(e) => setFormData({ ...formData, pan_number: e.target.value })}
                      style={inputStyle}
                      required
                    />
                  </div>

                  {/* GST */}
                  <div>
                    <label style={labelStyle}>GST Number *</label>
                    <input
                      value={formData.gst_number}
                      onChange={(e) => setFormData({ ...formData, gst_number: e.target.value })}
                      style={inputStyle}
                      required
                    />
                  </div>

                  {/* PAN FILE */}
                  <div>
                    <label style={labelStyle}>Upload PAN Card</label>
                    <input
                      type="file"
                      onChange={(e) => setPanFile(e.target.files?.[0] || null)}
                      style={fileStyle}
                    />
                  </div>

                  {/* GST FILE */}
                  <div>
                    <label style={labelStyle}>Upload GST Certificate</label>
                    <input
                      type="file"
                      onChange={(e) => setGstFile(e.target.files?.[0] || null)}
                      style={fileStyle}
                    />
                  </div>

                  {/* DEGREE FILE */}
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={labelStyle}>Degree Certificates (Multiple)</label>
                    <input
                      type="file"
                      multiple
                      onChange={(e) => setDegreeFiles(Array.from(e.target.files || []))}
                      style={fileStyle}
                    />
                  </div>

                  {/* Description */}
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={labelStyle}>Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={4}
                      style={inputStyle}
                    />
                  </div>

                </div>

                {/* Save Button */}
                <div style={{ textAlign: 'center', marginTop: '30px' }}>
                  <button onClick={handleProfileUpdate} style={buttonStyle}>
                    💾 Save Profile
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
      
      {showProductModal && (
        <ConsultantProductModal
          productForm={productForm}
          setProductForm={setProductForm}
          consultantId={consultant?.id}
          onClose={async () => {
            setShowProductModal(false);
            const token = localStorage.getItem('consultant_jwt');
            if (token) {
              await loadWebinars(token);
              await loadProducts(token);
              if (consultant) await loadOrders(token, consultant.id);
            }
          }}
        />
      )}

      {/* Schedule Webinar Modal */}
      {showWebinarModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0, 0, 0, 0.6)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 3000
        }}>
          <div style={{
            background: 'white', borderRadius: '16px', padding: '32px',
            maxWidth: '800px', width: '95%', maxHeight: '90vh', overflow: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '24px', fontWeight: '700', margin: 0 }}>Schedule New Webinar</h3>
              <button onClick={() => setShowWebinarModal(false)} style={{ background: 'none', border: 'none', fontSize: '32px', cursor: 'pointer', color: '#6b7280', lineHeight: 1 }}>×</button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={labelStyle}>Title</label>
                <input type="text" style={inputStyle} value={webinarForm.title} onChange={e => setWebinarForm({...webinarForm, title: e.target.value})} />
              </div>
              <div>
                <label style={labelStyle}>Start Time</label>
                <input type="datetime-local" style={inputStyle} value={webinarForm.start_time} onChange={e => setWebinarForm({...webinarForm, start_time: e.target.value})} />
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>Description</label>
              <textarea style={{...inputStyle, height: '80px'}} value={webinarForm.description} onChange={e => setWebinarForm({...webinarForm, description: e.target.value})} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={labelStyle}>Duration (Minutes)</label>
                <input type="number" style={inputStyle} value={webinarForm.duration_minutes} onChange={e => setWebinarForm({...webinarForm, duration_minutes: parseInt(e.target.value)})} />
              </div>
              <div>
                <label style={labelStyle}>Platform</label>
                <select style={inputStyle} value={webinarForm.platform_type} onChange={e => setWebinarForm({...webinarForm, platform_type: e.target.value as any})}>
                  <option value="google_meet">Google Meet (Auto-generated)</option>
                  <option value="others">Others (Manual Link)</option>
                </select>
              </div>
            </div>

            {webinarForm.platform_type === 'others' && (
              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>Manual Meeting Link</label>
                <input type="text" style={inputStyle} value={webinarForm.manual_link} onChange={e => setWebinarForm({...webinarForm, manual_link: e.target.value})} />
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={labelStyle}>Type</label>
                <select style={inputStyle} value={webinarForm.is_free ? 'free' : 'paid'} onChange={e => setWebinarForm({...webinarForm, is_free: e.target.value === 'free'})}>
                  <option value="free">Free</option>
                  <option value="paid">Paid</option>
                </select>
              </div>
              {!webinarForm.is_free && (
                <div>
                  <label style={labelStyle}>Price (INR)</label>
                  <input type="number" style={inputStyle} value={webinarForm.price} onChange={e => setWebinarForm({...webinarForm, price: parseInt(e.target.value)})} />
                </div>
              )}
            </div>

            {/* Registration Fields Builder */}
            <div style={{ marginBottom: '20px', border: '1px solid #eee', padding: '15px', borderRadius: '8px' }}>
              <label style={{...labelStyle, marginBottom: '10px'}}>Registration Form Custom Fields</label>
              {webinarForm.registration_fields.map((field, index) => (
                <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                  <input type="text" placeholder="Field Name (e.g. Company)" style={inputStyle} value={field.name} onChange={e => {
                    const newFields = [...webinarForm.registration_fields];
                    newFields[index].name = e.target.value;
                    setWebinarForm({...webinarForm, registration_fields: newFields});
                  }} />
                  <select style={inputStyle} value={field.type} onChange={e => {
                    const newFields = [...webinarForm.registration_fields];
                    newFields[index].type = e.target.value;
                    setWebinarForm({...webinarForm, registration_fields: newFields});
                  }}>
                    <option value="text">Text</option>
                    <option value="number">Number</option>
                  </select>
                  <button onClick={() => {
                    const newFields = webinarForm.registration_fields.filter((_, i) => i !== index);
                    setWebinarForm({...webinarForm, registration_fields: newFields});
                  }} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '6px', padding: '0 12px' }}>×</button>
                </div>
              ))}
              <button 
                onClick={() => setWebinarForm({...webinarForm, registration_fields: [...webinarForm.registration_fields, { name: '', type: 'text' }]})}
                style={{ background: '#f3f4f6', border: '1px dashed #d1d5db', borderRadius: '6px', padding: '8px', width: '100%', cursor: 'pointer' }}
              >+ Add Field</button>
            </div>

            {/* Email Templates */}
            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>Email Templates (Customizable)</label>
              <div style={{ display: 'grid', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: '#666' }}>Joining Link Email</label>
                  <textarea style={inputStyle} value={webinarForm.joining_email_template} onChange={e => setWebinarForm({...webinarForm, joining_email_template: e.target.value})} />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#666' }}>Reminder Email</label>
                  <textarea style={inputStyle} value={webinarForm.reminder_email_template} onChange={e => setWebinarForm({...webinarForm, reminder_email_template: e.target.value})} />
                </div>
                <div>
                   <label style={{ fontSize: '12px', color: '#666' }}>Recording Link Email</label>
                   <textarea style={inputStyle} value={webinarForm.recording_email_template} onChange={e => setWebinarForm({...webinarForm, recording_email_template: e.target.value})} />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowWebinarModal(false)} style={{ background: '#f3f4f6', border: '1px solid #d1d5db', color: '#4b5563', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>Cancel</button>
              <button onClick={handleCreateWebinar} style={{...buttonStyle, maxWidth: '200px', padding: '12px 24px'}}>Schedule Webinar</button>
            </div>
          </div>
        </div>
      )}

      {/* Registrants Modal */}
      {showRegistrantsModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0, 0, 0, 0.6)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 3000
        }}>
          <div style={{
            background: 'white', borderRadius: '16px', padding: '32px',
            maxWidth: '800px', width: '95%', maxHeight: '80vh', overflow: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
              <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#333' }}>Registrants: {selectedWebinar?.title}</h3>
              <button onClick={() => setShowRegistrantsModal(false)} style={{ background: 'none', border: 'none', fontSize: '32px', cursor: 'pointer', color: '#666', lineHeight: '1' }}>×</button>
            </div>
            
            {registrants.length === 0 ? (
              <p>No registrants found.</p>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #eee', textAlign: 'left' }}>
                    <th style={{ padding: '12px' }}>Name</th>
                    <th style={{ padding: '12px' }}>Email</th>
                    <th style={{ padding: '12px' }}>Phone</th>
                    <th style={{ padding: '12px' }}>Registered At</th>
                  </tr>
                </thead>
                <tbody>
                  {registrants.map((reg, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '12px' }}>{reg.name}</td>
                      <td style={{ padding: '12px' }}>{reg.email}</td>
                      <td style={{ padding: '12px' }}>{reg.phone}</td>
                      <td style={{ padding: '12px' }}>{new Date(reg.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* Recording Modal */}
      {showRecordingModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0, 0, 0, 0.6)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 3000
        }}>
          <div style={{
            background: 'white', borderRadius: '16px', padding: '32px',
            maxWidth: '500px', width: '90%'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: '700', margin: 0 }}>Upload Recording Link</h3>
              <button onClick={() => setShowRecordingModal(false)} style={{ background: 'none', border: 'none', fontSize: '32px', cursor: 'pointer', color: '#6b7280', lineHeight: 1 }}>×</button>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>Recording URL</label>
              <input 
                type="text" 
                style={inputStyle} 
                value={recordingUrl} 
                onChange={e => setRecordingUrl(e.target.value)} 
                placeholder="https://youtube.com/... or google drive link"
              />
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowRecordingModal(false)} style={{ background: '#f3f4f6', border: '1px solid #d1d5db', color: '#4b5563', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>Cancel</button>
              <button 
                onClick={() => selectedWebinar && handleUploadRecording(selectedWebinar.id)} 
                style={{...buttonStyle, maxWidth: '150px', padding: '10px 20px'}}
              >Save URL</button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
