"use client";
import React from "react";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import SearchPanel from "@/components/SearchPanel";

export default function ConsultantsPage() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#f8fafc" }}>
      <TopBar />
      <main style={{ flex: 1 }}>
        <SearchPanel />
      </main>
      <Footer />
    </div>
  );
}
