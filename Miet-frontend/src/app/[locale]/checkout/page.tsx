"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import TopBar from '@/components/TopBar';
import Footer from '@/components/Footer';
import { getApiUrl } from '@/utils/api';
import { FaSpinner, FaLock, FaRupeeSign, FaCalendarAlt, FaCheckCircle } from 'react-icons/fa';

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const serviceId = searchParams.get('service_id');
  const type = searchParams.get('type');
  
  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (serviceId) {
      fetchServiceDetails();
    } else {
      router.push('/');
    }
    
    // Load Razorpay script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [serviceId]);

  const fetchServiceDetails = async () => {
    try {
      const res = await fetch(getApiUrl(`api/services/${serviceId}`));
      if (res.ok) {
        const data = await res.json();
        setService(data);
      } else {
        alert("Service not found");
        router.push('/');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    const token = localStorage.getItem("user_jwt");
    if (!token) {
      alert("Please log in first.");
      router.push('/en/dashboard');
      return;
    }

    setProcessing(true);
    try {
      // 1. Create order
      const orderRes = await fetch(getApiUrl('api/razorpay/create-order'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ amount: service.price, currency: 'INR' })
      });
      const orderData = await orderRes.json();
      
      if (!orderData.success) {
        throw new Error(orderData.message || "Failed to create order");
      }

      // 2. Fetch Razorpay key
      const keyRes = await fetch(getApiUrl('api/razorpay/key'));
      const keyData = await keyRes.json();

      // 3. Open Razorpay Checkout
      const options = {
        key: keyData.key,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: "MIET",
        description: `Payment for ${service.name}`,
        order_id: orderData.order.id,
        handler: async function (response: any) {
          try {
            // 4. Verify Payment & Register
            let verifyUrl = '';
            let payload = {};
            
            if (type === 'event') {
              verifyUrl = getApiUrl('api/events/checkout');
              payload = {
                event_id: service.id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              };
            } else {
              // Add other handlers here if needed
              verifyUrl = getApiUrl('api/razorpay/verify-payment');
              payload = {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              };
            }

            const verifyRes = await fetch(verifyUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
              },
              body: JSON.stringify(payload)
            });
            const verifyData = await verifyRes.json();
            
            if (verifyRes.ok) {
              alert("Payment successful! You are registered.");
              if (type === 'event') {
                router.push('/en/dashboard?tab=events');
              } else {
                router.push('/en/dashboard');
              }
            } else {
              alert(verifyData.error || "Payment verification failed.");
            }
          } catch (e) {
            console.error(e);
            alert("Error completing registration.");
          } finally {
            setProcessing(false);
          }
        },
        prefill: {
          name: "",
          email: "",
          contact: ""
        },
        theme: {
          color: "#6366f1"
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        alert("Payment failed: " + response.error.description);
        setProcessing(false);
      });
      rzp.open();

    } catch (e: any) {
      alert("Error initiating checkout: " + e.message);
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f8fafc' }}>
        <FaSpinner className="spin" size={40} color="#6366f1" style={{ animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  if (!service) return null;

  return (
    <>
      <TopBar />
      <main style={{ background: '#f8fafc', minHeight: '80vh', padding: '4rem 2rem' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          
          <h1 style={{ textAlign: 'center', color: '#1e1b4b', marginBottom: '2rem', fontSize: '2.5rem', fontWeight: 800 }}>
            Secure Checkout
          </h1>

          <div style={{ background: '#fff', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.06)' }}>
            <div style={{ padding: '30px', borderBottom: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
                  {type === 'event' ? <FaCalendarAlt /> : <FaCheckCircle />}
                </div>
                <div>
                  <div style={{ color: '#6366f1', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
                    {type === 'event' ? 'Event Registration' : 'Service Booking'}
                  </div>
                  <h2 style={{ margin: '4px 0 0 0', color: '#1e1b4b', fontSize: '1.4rem', fontWeight: 700 }}>
                    {service.name}
                  </h2>
                </div>
              </div>
              <p style={{ color: '#64748b', fontSize: '15px', lineHeight: 1.6, margin: 0 }}>
                {service.description}
              </p>
            </div>

            <div style={{ padding: '30px', background: '#f8fafc' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <span style={{ color: '#475569', fontSize: '1.1rem', fontWeight: 600 }}>Total Amount to Pay</span>
                <span style={{ color: '#10b981', fontSize: '1.8rem', fontWeight: 800, display: 'flex', alignItems: 'center' }}>
                  <FaRupeeSign size={20} />
                  {service.price}
                </span>
              </div>

              <button
                onClick={handlePayment}
                disabled={processing}
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '16px',
                  padding: '18px',
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  cursor: processing ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  boxShadow: '0 10px 20px rgba(99, 102, 241, 0.3)',
                  transition: 'all 0.3s ease'
                }}
              >
                {processing ? (
                  <><FaSpinner className="spin" style={{ animation: 'spin 1s linear infinite' }} /> Processing Securely...</>
                ) : (
                  <><FaLock /> Pay Securely with Razorpay</>
                )}
              </button>
              
              <div style={{ textAlign: 'center', marginTop: '16px', color: '#94a3b8', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <FaLock /> 100% Secure Payment Processing
              </div>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
