"use client";

import React, { useState, useMemo } from 'react';
import { FaEye, FaTimes, FaSearch, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { getApiUrl } from "@/utils/api";

export default function ConsultantOrdersTab({ orders, fetchOrders }: { orders: any[], fetchOrders: () => void }) {
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  
  // State for datatable features
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Flatten orders so each product item is a separate row
  const flattenedOrders = useMemo(() => {
    const flat: any[] = [];
    if (!orders) return flat;
    
    orders.forEach(order => {
      if (order.items && order.items.length > 0) {
        order.items.forEach((item: any) => {
          flat.push({
            order_id: order.id,
            first_name: order.customer_name?.split(' ')[0] || '',
            last_name: order.customer_name?.split(' ').slice(1).join(' ') || '',
            email: order.email,
            phone: order.phone,
            address: order.address?.split(', ')[0] || '',
            city: order.address?.split(', ')[1] || '',
            state: order.address?.split(', ')[2]?.split(' ')[0] || '',
            zip_code: order.address?.split(', ')[2]?.split(' ')[1] || '',
            country: 'India',
            payment_status: order.payment_status,
            created_at: order.created_at,
            // item specifics
            item_id: item.id,
            product_id: item.product_id,
            product_name: item.product_name,
            price: item.price,
            quantity: item.quantity,
            status: item.delivery_status || 'pending',
            addressFull: order.address
          });
        });
      }
    });
    return flat;
  }, [orders]);

  // Filter
  const filteredData = useMemo(() => {
    if (!searchTerm) return flattenedOrders;
    const lowerSearch = searchTerm.toLowerCase();
    return flattenedOrders.filter(o => 
      String(o.order_id).includes(lowerSearch) ||
      o.first_name.toLowerCase().includes(lowerSearch) ||
      o.email.toLowerCase().includes(lowerSearch) ||
      o.product_name.toLowerCase().includes(lowerSearch)
    );
  }, [flattenedOrders, searchTerm]);

  // Paginate
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleStatusChange = async (orderId: number, itemId: number, newStatus: string) => {
    try {
      setUpdatingStatus(String(itemId));
      const token = localStorage.getItem("consultant_jwt");
      
      const response = await fetch(getApiUrl(`api/orders/${orderId}/items/${itemId}/status`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ delivery_status: newStatus })
      });

      if (response.ok) {
        if (fetchOrders) await fetchOrders();
        
        if (selectedOrder && selectedOrder.item_id === itemId) {
          setSelectedOrder((prev: any) => ({ ...prev, status: newStatus }));
        }
      } else {
        alert("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating item status:", error);
      alert("Something went wrong");
    } finally {
      setUpdatingStatus(null);
    }
  };

  return (
    <>
      <section style={{ position: 'relative', background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#1e293b', margin: 0 }}>Product Orders</h2>
          
          <div style={{ position: 'relative', width: '250px' }}>
            <FaSearch style={{ position: 'absolute', left: '12px', top: '10px', color: '#9ca3af' }} />
            <input 
              type="text" 
              placeholder="Search orders..." 
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              style={{
                width: '100%',
                padding: '8px 12px 8px 36px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                outline: 'none',
                fontSize: '14px'
              }}
            />
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', color: '#475569', fontWeight: 600, fontSize: '13px' }}>Order ID</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', color: '#475569', fontWeight: 600, fontSize: '13px' }}>Customer</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', color: '#475569', fontWeight: 600, fontSize: '13px' }}>Product</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', color: '#475569', fontWeight: 600, fontSize: '13px' }}>Price</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', color: '#475569', fontWeight: 600, fontSize: '13px' }}>Qty</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', color: '#475569', fontWeight: 600, fontSize: '13px' }}>Total</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', color: '#475569', fontWeight: 600, fontSize: '13px' }}>Payment</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', color: '#475569', fontWeight: 600, fontSize: '13px' }}>Delivery Status</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', color: '#475569', fontWeight: 600, fontSize: '13px' }}>Date</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', color: '#475569', fontWeight: 600, fontSize: '13px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={10} style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
                    No orders found.
                  </td>
                </tr>
              ) : (
                paginatedData.map((row, idx) => (
                  <tr key={row.item_id || idx} style={{ borderBottom: '1px solid #e2e8f0', transition: 'background-color 0.2s' }}>
                    <td style={{ padding: '12px 16px', fontSize: '14px', color: '#334155' }}>#{row.order_id}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '14px' }}>{row.first_name} {row.last_name}</div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>{row.email}</div>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '14px', color: '#334155' }}>{row.product_name}</td>
                    <td style={{ padding: '12px 16px', fontSize: '14px', color: '#334155' }}>₹{row.price}</td>
                    <td style={{ padding: '12px 16px', fontSize: '14px', color: '#334155' }}>{row.quantity}</td>
                    <td style={{ padding: '12px 16px', fontSize: '14px', fontWeight: 600, color: '#334155' }}>₹{Number(row.price) * Number(row.quantity)}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{
                        padding: '4px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 600,
                        background: row.payment_status === 'paid' ? '#e2fbe8' : '#fffbeb',
                        color: row.payment_status === 'paid' ? '#15803d' : '#b45309'
                      }}>
                        {row.payment_status ? row.payment_status.toUpperCase() : 'PENDING'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <select
                        value={row.status}
                        disabled={updatingStatus === String(row.item_id)}
                        onChange={(e) => handleStatusChange(row.order_id, row.item_id, e.target.value)}
                        style={{
                          padding: '6px 12px', borderRadius: '8px', border: '1px solid #cbd5e1',
                          background: '#f8fafc', color: '#334155', fontSize: '12px', fontWeight: 600,
                          cursor: 'pointer', outline: 'none'
                        }}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '13px', color: '#64748b' }}>
                      {row.created_at ? new Date(row.created_at.includes('T') ? row.created_at : row.created_at.replace(' ', 'T') + 'Z').toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' }) : ''}
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      <button
                        onClick={() => setSelectedOrder(row)}
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: '6px',
                          padding: '6px 10px', borderRadius: '6px', border: 'none',
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          color: 'white', cursor: 'pointer', fontWeight: 600, fontSize: '12px',
                          boxShadow: '0 2px 4px rgba(102, 126, 234, 0.2)'
                        }}
                      >
                        <FaEye /> View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
            <div style={{ fontSize: '13px', color: '#64748b' }}>
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} results
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                style={{
                  padding: '6px 12px', borderRadius: '6px', border: '1px solid #cbd5e1',
                  background: currentPage === 1 ? '#f8fafc' : 'white',
                  color: currentPage === 1 ? '#9ca3af' : '#475569',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer', fontSize: '13px', fontWeight: 500
                }}
              >
                <FaChevronLeft />
              </button>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                style={{
                  padding: '6px 12px', borderRadius: '6px', border: '1px solid #cbd5e1',
                  background: currentPage === totalPages ? '#f8fafc' : 'white',
                  color: currentPage === totalPages ? '#9ca3af' : '#475569',
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', fontSize: '13px', fontWeight: 500
                }}
              >
                <FaChevronRight />
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Modern Order Details Popup Modal */}
      {selectedOrder && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(8px)',
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          zIndex: 9999, padding: '20px'
        }}>
          <div style={{
            background: 'white', borderRadius: '16px', width: '100%', maxWidth: '650px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            overflow: 'hidden', display: 'flex', flexDirection: 'column'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '20px 24px', borderBottom: '1px solid #e2e8f0',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
            }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                  Order Details - #{selectedOrder.order_id}
                </h3>
                <span style={{ fontSize: '12px', color: '#64748b' }}>
                  Placed on: {selectedOrder.created_at ? new Date(selectedOrder.created_at.includes('T') ? selectedOrder.created_at : selectedOrder.created_at.replace(' ', 'T') + 'Z').toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' }) : ''}
                </span>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                style={{
                  background: '#f1f5f9', border: 'none', borderRadius: '50%',
                  width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: '#64748b', transition: 'background-color 0.2s'
                }}
              >
                <FaTimes />
              </button>
            </div>

            {/* Modal Content */}
            <div style={{ padding: '24px', overflowY: 'auto', maxHeight: '75vh', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Product Info */}
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', fontWeight: 700, color: '#334155' }}>Item Purchased</h4>
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
                    {selectedOrder.addressFull}
                  </p>
                </div>
              </div>

              {/* Status Update Block */}
              <div style={{
                background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px'
              }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#334155' }}>Payment Status</h4>
                  <span style={{
                    display: 'inline-block', marginTop: '4px', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 600,
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
                    disabled={updatingStatus === String(selectedOrder.item_id)}
                    onChange={(e) => handleStatusChange(selectedOrder.order_id, selectedOrder.item_id, e.target.value)}
                    style={{
                      padding: '8px 16px', borderRadius: '8px', border: '1px solid #cbd5e1',
                      background: 'white', color: '#334155', fontSize: '13px', fontWeight: 600,
                      cursor: 'pointer', outline: 'none', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
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
            <div style={{ padding: '16px 24px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', background: '#f8fafc' }}>
              <button
                onClick={() => setSelectedOrder(null)}
                style={{
                  padding: '8px 20px', borderRadius: '8px', border: '1px solid #cbd5e1', background: 'white',
                  color: '#475569', fontWeight: 600, fontSize: '13px', cursor: 'pointer'
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
