"use client";
// Redeploy trigger: 2026-06-02
import React, { useState } from 'react';
import { FaEye, FaTimes } from "react-icons/fa";
import { getApiUrl } from "@/utils/api";

export default function OrdersTab(props: any) {
  const {
    DataTable,
    orders = [],
    fetchOrders
  } = props;

  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    try {
      setUpdatingStatus(String(orderId));
      const token = localStorage.getItem("admin_jwt");
      
      const response = await fetch(getApiUrl(`api/admin/orders/${orderId}/status`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        // Refresh orders list
        if (fetchOrders) {
          await fetchOrders();
        }
        // Update selected order in state if it's open
        if (selectedOrder && selectedOrder.order_id === orderId) {
          setSelectedOrder((prev: any) => ({ ...prev, status: newStatus }));
        }
      } else {
        alert("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Something went wrong");
    } finally {
      setUpdatingStatus(null);
    }
  };

  return (
    <>
      <section style={{ position: 'relative' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#1e293b', marginBottom: '20px' }}>Orders</h2>

        <DataTable
          data={orders}
          columns={[
            { key: 'order_id', label: 'Order ID' },
            {
              key: 'customer',
              label: 'Customer',
              render: (v: any, row: any) => (
                <div>
                  <strong>{row.first_name} {row.last_name}</strong>
                  <br />
                  <span style={{ fontSize: '12px', color: '#64748b' }}>{row.email}</span>
                </div>
              )
            },
            { key: 'product_name', label: 'Product' },
            { 
              key: 'price', 
              label: 'Price',
              render: (v: any) => `₹${v}`
            },
            { key: 'quantity', label: 'Qty' },
            { 
              key: 'total', 
              label: 'Total',
              render: (v: any, row: any) => `₹${Number(row.price) * Number(row.quantity)}`
            },
            { 
              key: 'payment_status', 
              label: 'Payment',
              render: (v: any) => (
                <span style={{
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: 600,
                  background: v === 'paid' ? '#e2fbe8' : '#fffbeb',
                  color: v === 'paid' ? '#15803d' : '#b45309'
                }}>
                  {v ? v.toUpperCase() : 'PENDING'}
                </span>
              )
            },
            {
              key: 'status',
              label: 'Delivery Status',
              render: (v: any, row: any) => (
                <select
                  value={row.status || 'pending'}
                  disabled={updatingStatus === String(row.order_id)}
                  onChange={(e) => handleStatusChange(row.order_id, e.target.value)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    background: '#f8fafc',
                    color: '#334155',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    outline: 'none'
                  }}
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              )
            },
            {
              key: 'created_at',
              label: 'Date',
              render: (v: string) => {
                if (!v) return '';
                try {
                  const utcStr = v.includes('T') ? v : v.replace(' ', 'T') + 'Z';
                  return new Date(utcStr).toLocaleString('en-IN', {
                    timeZone: 'Asia/Kolkata',
                    dateStyle: 'medium',
                    timeStyle: 'short'
                  });
                } catch {
                  return new Date(v).toLocaleString();
                }
              }
            },
            {
              key: 'actions',
              label: 'Actions',
              render: (v: any, row: any) => (
                <button
                  onClick={() => setSelectedOrder(row)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '12px',
                    boxShadow: '0 2px 4px rgba(102, 126, 234, 0.2)'
                  }}
                >
                  <FaEye /> View
                </button>
              )
            }
          ]}
        />
      </section>

      {/* Modern Order Details Popup Modal */}
      {selectedOrder && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '650px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            animation: 'fadeIn 0.2s ease-out'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
            }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                  Order Details - #{selectedOrder.order_id}
                </h3>
                <span style={{ fontSize: '12px', color: '#64748b' }}>
                  Placed on: {(() => {
                    if (!selectedOrder.created_at) return '';
                    const utcStr = selectedOrder.created_at.includes('T') ? selectedOrder.created_at : selectedOrder.created_at.replace(' ', 'T') + 'Z';
                    return new Date(utcStr).toLocaleString('en-IN', {
                      timeZone: 'Asia/Kolkata',
                      dateStyle: 'medium',
                      timeStyle: 'short'
                    });
                  })()}
                </span>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                style={{
                  background: '#f1f5f9',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#64748b',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e2e8f0'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
              >
                <FaTimes />
              </button>
            </div>

            {/* Modal Content */}
            <div style={{ padding: '24px', overflowY: 'auto', maxHeight: '75vh', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Product Info */}
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', fontWeight: 700, color: '#334155' }}>Items Purchased</h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '15px' }}>{selectedOrder.product_name}</div>
                    <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                      Price: ₹{selectedOrder.price} | Quantity: {selectedOrder.quantity}
                    </div>
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: '#667eea' }}>
                    Total: ₹{Number(selectedOrder.price) * Number(selectedOrder.quantity)}
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {/* Customer Details */}
                <div style={{ border: '1px solid #e2e8f0', padding: '16px', borderRadius: '12px' }}>
                  <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 700, color: '#334155', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
                    Customer Details
                  </h4>
                  <p style={{ margin: '6px 0', fontSize: '13px', color: '#475569' }}>
                    <strong>Name:</strong> {selectedOrder.first_name} {selectedOrder.last_name}
                  </p>
                  <p style={{ margin: '6px 0', fontSize: '13px', color: '#475569' }}>
                    <strong>Email:</strong> {selectedOrder.email}
                  </p>
                  <p style={{ margin: '6px 0', fontSize: '13px', color: '#475569' }}>
                    <strong>Phone:</strong> {selectedOrder.phone || 'N/A'}
                  </p>
                </div>

                {/* Shipping / Delivery Details */}
                <div style={{ border: '1px solid #e2e8f0', padding: '16px', borderRadius: '12px' }}>
                  <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 700, color: '#334155', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
                    Delivery Address
                  </h4>
                  <p style={{ margin: '6px 0', fontSize: '13px', color: '#475569', lineHeight: 1.4 }}>
                    {selectedOrder.address}<br />
                    {selectedOrder.city}, {selectedOrder.state} - {selectedOrder.zip_code}<br />
                    {selectedOrder.country || 'India'}
                  </p>
                </div>
              </div>

              {/* Status Update Block */}
              <div style={{
                background: '#f8fafc',
                padding: '16px',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px'
              }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#334155' }}>Payment Status</h4>
                  <span style={{
                    display: 'inline-block',
                    marginTop: '4px',
                    padding: '4px 10px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: 600,
                    background: selectedOrder.payment_status === 'paid' ? '#e2fbe8' : '#fffbeb',
                    color: selectedOrder.payment_status === 'paid' ? '#15803d' : '#b45309'
                  }}>
                    {selectedOrder.payment_status ? selectedOrder.payment_status.toUpperCase() : 'PENDING'}
                  </span>
                </div>
                
                <div>
                  <h4 style={{ margin: '0 0 6px 0', fontSize: '14px', fontWeight: 700, color: '#334155' }}>Update Delivery Status</h4>
                  <select
                    value={selectedOrder.status || 'pending'}
                    disabled={updatingStatus === String(selectedOrder.order_id)}
                    onChange={(e) => handleStatusChange(selectedOrder.order_id, e.target.value)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      background: 'white',
                      color: '#334155',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      outline: 'none',
                      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
                    }}
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div style={{
              padding: '16px 24px',
              borderTop: '1px solid #e2e8f0',
              display: 'flex',
              justifyContent: 'flex-end',
              background: '#f8fafc'
            }}>
              <button
                onClick={() => setSelectedOrder(null)}
                style={{
                  padding: '8px 20px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  background: 'white',
                  color: '#475569',
                  fontWeight: 600,
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
