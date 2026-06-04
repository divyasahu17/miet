"use client";
import React, { useState, useEffect } from "react";
import { FaWallet, FaArrowUp, FaArrowDown } from "react-icons/fa";
import { getApiUrl } from "@/utils/api";

export default function WalletTab() {
  const [walletData, setWalletData] = useState<{ wallet_balance: number; transactions: any[] } | null>(null);
  const [settings, setSettings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("consultant_jwt") || localStorage.getItem("admin_jwt");
      
      const [walletRes, settingsRes] = await Promise.all([
        fetch(getApiUrl("api/consultants/wallet"), { headers: { Authorization: `Bearer ${token}` } }),
        fetch(getApiUrl("api/admin/settings"), { headers: { Authorization: `Bearer ${token}` } })
      ]);

      if (walletRes.ok) {
        const json = await walletRes.json();
        setWalletData(json.data);
      }
      
      if (settingsRes.ok) {
        const json = await settingsRes.json();
        setSettings(json.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ padding: "40px", textAlign: "center" }}>Loading wallet data...</div>;
  }

  const balance = walletData?.wallet_balance || 0;
  const transactions = walletData?.transactions || [];
  const commissionKeys = ['commission_course', 'commission_ebook', 'commission_gadget', 'commission_app'];

  return (
    <section>
      <div style={{ marginBottom: 32 }}>
        <h2
          style={{
            fontSize: "clamp(24px, 4vw, 32px)",
            fontWeight: 800,
            margin: 0,
            background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            display: "flex",
            alignItems: "center",
            gap: "12px"
          }}
        >
          <FaWallet size={28} color="#1e3c72" /> My Earnings & Wallet
        </h2>
        <p style={{ color: "#666", marginTop: "8px", fontSize: "16px" }}>
          Track your marketplace sales earnings and wallet history.
        </p>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "24px", marginBottom: "32px" }}>
        {/* Balance Card */}
        <div style={{
          background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
          borderRadius: "20px",
          padding: "32px",
          color: "white",
          boxShadow: "0 10px 25px rgba(0,242,254,0.3)",
          flex: "1 1 300px"
        }}>
          <p style={{ margin: 0, fontSize: "16px", opacity: 0.9, fontWeight: 500 }}>Available Balance</p>
          <h3 style={{ margin: "8px 0 0 0", fontSize: "42px", fontWeight: 700 }}>
            ₹{balance.toFixed(2)}
          </h3>
        </div>

        {/* Commission Structure Card */}
        <div style={{
          background: "white",
          borderRadius: "20px",
          padding: "24px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
          flex: "2 1 400px"
        }}>
          <h3 style={{ margin: "0 0 16px 0", fontSize: "18px", color: "#333", fontWeight: 600 }}>
            Marketplace Commission Structure
          </h3>
          <p style={{ fontSize: "14px", color: "#666", marginBottom: "16px" }}>
            The following percentage is deducted from your product sales as a platform fee:
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "16px" }}>
            {commissionKeys.map(key => {
              const setting = settings.find(s => s.setting_key === key);
              if (!setting) return null;
              
              const label = key.replace("commission_", "");
              const displayLabel = label.charAt(0).toUpperCase() + label.slice(1);
              
              return (
                <div key={key} style={{ background: "#f8fafc", padding: "16px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                  <div style={{ fontSize: "13px", color: "#64748b", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    {displayLabel}
                  </div>
                  <div style={{ fontSize: "24px", fontWeight: 700, color: "#1e293b", marginTop: "4px" }}>
                    {setting.setting_value}%
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div style={{
        background: "white",
        borderRadius: "16px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
        overflow: "hidden"
      }}>
        <div style={{ padding: "20px 24px", borderBottom: "1px solid #f0f0f0" }}>
          <h3 style={{ margin: 0, fontSize: "18px", color: "#333", fontWeight: 600 }}>Transaction History</h3>
        </div>
        
        {transactions.length === 0 ? (
          <div style={{ padding: "40px 20px", textAlign: "center", color: "#888" }}>
            No transactions found yet. Start selling to see your earnings here!
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead style={{ background: "#f8fafc" }}>
                <tr>
                  <th style={{ padding: "16px 24px", color: "#64748b", fontWeight: 600, fontSize: "14px" }}>Date</th>
                  <th style={{ padding: "16px 24px", color: "#64748b", fontWeight: 600, fontSize: "14px" }}>Description</th>
                  <th style={{ padding: "16px 24px", color: "#64748b", fontWeight: 600, fontSize: "14px" }}>Order ID</th>
                  <th style={{ padding: "16px 24px", color: "#64748b", fontWeight: 600, fontSize: "14px", textAlign: "right" }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id} style={{ borderBottom: "1px solid #f0f0f0" }}>
                    <td style={{ padding: "16px 24px", color: "#555", fontSize: "15px" }}>
                      {new Date(tx.created_at).toLocaleDateString()} <br/>
                      <span style={{ fontSize: "12px", color: "#888" }}>{new Date(tx.created_at).toLocaleTimeString()}</span>
                    </td>
                    <td style={{ padding: "16px 24px", color: "#333", fontSize: "15px" }}>
                      {tx.description}
                    </td>
                    <td style={{ padding: "16px 24px", color: "#666", fontSize: "15px" }}>
                      #{tx.order_id || 'N/A'}
                    </td>
                    <td style={{ padding: "16px 24px", fontSize: "16px", fontWeight: 600, textAlign: "right", color: tx.amount >= 0 ? "#10b981" : "#ef4444" }}>
                      {tx.amount >= 0 ? "+" : "-"}₹{Math.abs(tx.amount).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
