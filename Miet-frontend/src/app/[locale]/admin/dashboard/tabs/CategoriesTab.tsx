"use client";
import React from "react";
import { FaPlus } from "react-icons/fa";

interface Category {
  id: number;
  name: string;
  created_at: string;
}

interface CategoriesTabProps {
  categories: Category[];
  setCatEditId: (id: number | null) => void;
  setCatName: (name: string) => void;
  setShowCategoryModal: (show: boolean) => void;
  handleCatDelete: (id: number) => void;
  DataTable: any;
}

export default function CategoriesTab({
  categories,
  setCatEditId,
  setCatName,
  setShowCategoryModal,
  handleCatDelete,
  DataTable,
}: CategoriesTabProps) {
  return (
    <section>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <h2
          style={{
            fontSize: "clamp(20px, 3vw, 28px)",
            fontWeight: 700,
            color: "#667eea",
            margin: 0,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Manage Categories
        </h2>
        <button
          onClick={() => {
            setCatEditId(null);
            setCatName("");
            setShowCategoryModal(true);
          }}
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "#fff",
            border: "none",
            borderRadius: "12px",
            padding: "14px 24px",
            fontWeight: 700,
            fontSize: "16px",
            cursor: "pointer",
            transition: "all 0.2s ease",
            boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.transform = "translateY(-2px)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.transform = "translateY(0)")
          }
        >
          <FaPlus size={16} /> Add Category
        </button>
      </div>

      <DataTable
        data={categories}
        columns={[
          { key: "name", label: "Name", sortable: true },
          {
            key: "created_at",
            label: "Created",
            sortable: true,
            render: (value: string) => new Date(value).toLocaleString(),
          },
        ]}
        onEdit={(cat: Category) => {
          setCatEditId(cat.id);
          setCatName(cat.name);
          setShowCategoryModal(true);
        }}
        onDelete={(cat: Category) => handleCatDelete(cat.id)}
        searchPlaceholder="Search categories..."
        title="Categories"
      />
    </section>
  );
}
