"use client";
import React from 'react';
import Image from 'next/image';
import { FaThLarge, FaList, FaTags, FaUserCircle, FaSignOutAlt, FaChevronLeft, FaChevronRight, FaUserMd, FaChevronDown, FaSearch, FaEdit, FaTrash, FaPlus, FaEye, FaImages, FaCog } from "react-icons/fa";
import Select from "react-select";

export default function SubcategoriesTab(props: any) {
  const {
    subcategories,
    categories,
    setSubEditId,
    setSubName,
    setSubCatId,
    setShowSubcategoryModal,
    handleSubDelete,
    DataTable,
  } = props;

  return (
    <>

          <section>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 24,
              flexWrap: 'wrap',
              gap: '16px'
            }}>
              <h2 style={{
                fontSize: 'clamp(20px, 3vw, 28px)',
                fontWeight: 700,
                color: '#667eea',
                margin: 0,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>Manage Subcategories</h2>
              <button
                onClick={() => {
                  setSubEditId(null);
                  setSubName("");
                  setSubCatId("");
                  setShowSubcategoryModal(true);
                }}
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '14px 24px',
                  fontWeight: 700,
                  fontSize: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <FaPlus size={16} /> Add Subcategory
              </button>
            </div>

            <DataTable
              data={subcategories}
              columns={[
                { key: 'name', label: 'Name', sortable: true },
                {
                  key: 'category_id',
                  label: 'Category',
                  sortable: true,
                  render: (value: number) => categories.find((c: { id: number; name: string }) => c.id === value)?.name || "-"
                },
                {
                  key: 'created_at',
                  label: 'Created',
                  sortable: true,
                  render: (value: string) => new Date(value).toLocaleString()
                }
              ]}
              onEdit={(sub: { id: number; name: string; category_id: number }) => {
                setSubEditId(sub.id);
                setSubName(sub.name);
                setSubCatId(sub.category_id);
                setShowSubcategoryModal(true);
              }}
              onDelete={(sub: { id: number }) => handleSubDelete(sub.id)}
              searchPlaceholder="Search subcategories..."
              title="Subcategories"
            />
          </section>

    </>
  );
}
