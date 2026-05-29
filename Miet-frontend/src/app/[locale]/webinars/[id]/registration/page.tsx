'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import TopBar from '@/components/TopBar';
import Footer from '@/components/Footer';
import GoogleAuth from '@/components/GoogleAuth';
import RazorpayPayment from '@/components/RazorpayPayment';
import { getApiUrl } from '@/utils/api';
import { supabase } from '@/utils/supabase';
import { FaArrowLeft, FaCheckCircle, FaLock } from 'react-icons/fa';

interface Webinar {
  id: number;
  title: string;
  description: string;
  start_time: string;
  is_free: boolean;
  price: number;
  registration_fields_json?: any[];
}

export default function WebinarRegistration() {
  const params = useParams();
  const id = params.id;
  const locale = useLocale();
  const router = useRouter();

  const [webinar, setWebinar] = useState<Webinar | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [step, setStep] = useState<'auth' | 'form' | 'payment' | 'success'>('auth');
  const [formValues, setFormValues] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchWebinar();
    checkAuth();
  }, [id]);

  const fetchWebinar = async () => {
    try {
      const res = await fetch(getApiUrl(`api/webinars/public`));
      if (res.ok) {
        const data = await res.json();
        const found = (data.webinars || []).find((w: Webinar) => w.id === Number(id));
        setWebinar(found);
      }
    } catch (error) {
      console.error('Error fetching webinar:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      setUser(session.user);
      setFormValues({
        name: session.user.user_metadata?.full_name || '',
        email: session.user.email || '',
        phone: session.user.user_metadata?.phone || ''
      });
      setStep('form');
    }
  };

  const handleInputChange = (name: string, value: string) => {
    setFormValues((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (webinar?.is_free) {
      await registerFree();
    } else {
      setStep('payment');
    }
  };

  const registerFree = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch(getApiUrl(`api/webinars/${id}/register`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formValues)
      });
      if (response.ok) {
        setStep('success');
      } else {
        alert('Registration failed');
      }
    } catch (error) {
      alert('Error during registration');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentSuccess = async (paymentData: any) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(getApiUrl(`api/webinars/${id}/verify-payment`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...paymentData,
          ...formValues
        })
      });
      if (response.ok) {
        setStep('success');
      } else {
        alert('Payment verification failed');
      }
    } catch (error) {
      alert('Error verifying payment');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!webinar) return <div>Webinar not found</div>;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8fafc' }}>
      <TopBar />
      
      <div style={{ flex: 1, padding: '40px 20px' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', background: 'white', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
          {/* Progress Header */}
          <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '30px', color: 'white' }}>
            <button 
              onClick={() => router.back()} 
              style={{ background: 'none', border: 'none', color: 'white', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '16px', opacity: 0.8 }}
            >
              <FaArrowLeft /> Back
            </button>
            <h1 style={{ fontSize: '24px', fontWeight: '700', margin: '0 0 8px 0' }}>{webinar.title}</h1>
            <p style={{ margin: 0, opacity: 0.9 }}>{new Date(webinar.start_time).toLocaleString()}</p>
          </div>

          <div style={{ padding: '40px' }}>
            {step === 'auth' && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#f3e5f5', color: '#7b1fa2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: '24px' }}>
                  <FaLock />
                </div>
                <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px' }}>Authentication Required</h2>
                <p style={{ color: '#666', marginBottom: '32px' }}>Please sign in to continue with the registration. This ensures your access is linked to your account.</p>
                <GoogleAuth />
              </div>
            )}

            {step === 'form' && (
              <form onSubmit={handleSubmitForm}>
                <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '24px' }}>Registration Details</h2>
                
                <div style={{ display: 'grid', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', fontSize: '14px' }}>Full Name *</label>
                    <input 
                      type="text" required 
                      style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db' }}
                      value={formValues.name || ''} 
                      onChange={e => handleInputChange('name', e.target.value)}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', fontSize: '14px' }}>Email address *</label>
                    <input 
                      type="email" required readOnly
                      style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', background: '#f9fafb' }}
                      value={formValues.email || ''}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', fontSize: '14px' }}>Phone Number *</label>
                    <input 
                      type="tel" required
                      style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db' }}
                      value={formValues.phone || ''}
                      onChange={e => handleInputChange('phone', e.target.value)}
                    />
                  </div>

                  {/* Custom Fields */}
                  {webinar.registration_fields_json?.map((field: any, i: number) => (
                    <div key={i}>
                      <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', fontSize: '14px' }}>{field.name} *</label>
                      <input 
                        type={field.type || 'text'} required
                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db' }}
                        value={formValues[field.name] || ''}
                        onChange={e => handleInputChange(field.name, e.target.value)}
                      />
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: '32px', borderTop: '1px solid #eee', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '18px', fontWeight: '700' }}>
                    {webinar.is_free ? 'Type: Free' : `Price: ₹${webinar.price}`}
                  </div>
                  <button 
                    type="submit" disabled={isSubmitting}
                    style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', padding: '12px 30px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}
                  >
                    {isSubmitting ? 'Processing...' : webinar.is_free ? 'Confirm Registration' : 'Proceed to Payment'}
                  </button>
                </div>
              </form>
            )}

            {step === 'payment' && (
              <div style={{ textAlign: 'center' }}>
                <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px' }}>Complete Payment</h2>
                <p style={{ color: '#666', marginBottom: '32px' }}>Please complete the payment of ₹{webinar.price} to secure your spot.</p>
                <RazorpayPayment 
                  amount={webinar.price}
                  userDetails={{
                    name: formValues.name,
                    email: formValues.email,
                    contact: formValues.phone
                  }}
                  onSuccess={handlePaymentSuccess}
                  onFailure={(err) => alert('Payment failed: ' + err.message)}
                />
                <button 
                  onClick={() => setStep('form')}
                  style={{ background: 'none', border: 'none', color: '#667eea', fontWeight: '600', marginTop: '20px', cursor: 'pointer' }}
                >
                  Edit Registration Details
                </button>
              </div>
            )}

            {step === 'success' && (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#e8f5e8', color: '#388e3c', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: '40px' }}>
                  <FaCheckCircle />
                </div>
                <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '16px' }}>Registration Successful!</h2>
                <p style={{ color: '#666', marginBottom: '32px', lineHeight: '1.6' }}>
                  You have successfully registered for <strong>{webinar.title}</strong>. 
                  A confirmation email with the joining link has been sent to <strong>{formValues.email}</strong>.
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center' }}>
                   <button 
                    onClick={() => router.push(`/${locale}/dashboard`)}
                    style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}
                  >
                    Go to Dashboard
                  </button>
                  <button 
                    onClick={() => router.push(`/${locale}/events`)}
                    style={{ background: 'white', color: '#667eea', border: '1px solid #667eea', padding: '12px 24px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}
                  >
                    View More Events
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
