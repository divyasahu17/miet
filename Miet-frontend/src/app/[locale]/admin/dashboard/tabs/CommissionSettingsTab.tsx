"use client";
import React, { useState, useEffect } from "react";
import { FaSave } from "react-icons/fa";
import { getApiUrl } from "@/utils/api";
import { useNotifications } from "@/components/NotificationSystem";

export default function CommissionSettingsTab() {
  const [settings, setSettings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { addNotification } = useNotifications();

  const commissionKeys = ['commission_course', 'commission_ebook', 'commission_gadget', 'commission_app'];
  
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("admin_jwt");
      const res = await fetch(getApiUrl("api/admin/settings"), {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const json = await res.json();
        setSettings(json.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("admin_jwt");
      const res = await fetch(getApiUrl("api/admin/settings"), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ settings }),
      });
      if (res.ok) {
        addNotification({ type: "success", title: "Success", message: "Commission settings updated successfully!" });
      } else {
        addNotification({ type: "error", title: "Error", message: "Failed to update commission settings" });
      }
    } catch (error) {
      console.error("Error saving settings", error);
      addNotification({ type: "error", title: "Error", message: "Error saving settings" });
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (key: string, value: string) => {
    setSettings((prev) =>
      prev.map((s) => (s.setting_key === key ? { ...s, setting_value: value } : s))
    );
  };

  if (loading) {
    return <div>Loading commission settings...</div>;
  }

  return (
    <section>
      <div style={{ marginBottom: 24 }}>
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
          Marketplace Commission Settings
        </h2>
        <p style={{ color: "#666", marginTop: "8px" }}>
          Set the commission percentage taken from consultant earnings for each product type.
        </p>
      </div>

      <div style={{
        background: "white",
        padding: "24px",
        borderRadius: "16px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        maxWidth: "600px"
      }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {commissionKeys.map((key) => {
            const setting = settings.find(s => s.setting_key === key);
            if (!setting) return null;
            
            // formatting label: commission_course -> Course
            const label = key.replace("commission_", "");
            const displayLabel = label.charAt(0).toUpperCase() + label.slice(1);

            return (
              <div key={key} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <label style={{ fontWeight: 600, color: "#333", fontSize: "14px" }}>
                  {displayLabel} Commission (%)
                </label>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <input
                    type="number"
                    value={setting.setting_value}
                    onChange={(e) => handleChange(key, e.target.value)}
                    min="0"
                    max="100"
                    step="0.1"
                    style={{
                      flex: 1,
                      padding: "12px 16px",
                      borderRadius: "10px",
                      border: "1px solid #ddd",
                      fontSize: "15px",
                      outline: "none",
                      transition: "border-color 0.2s",
                    }}
                  />
                  <span style={{ color: "#888", fontSize: "14px" }}>%</span>
                </div>
                <span style={{ fontSize: "12px", color: "#888" }}>{setting.description}</span>
              </div>
            );
          })}

          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              marginTop: "16px",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "#fff",
              border: "none",
              borderRadius: "12px",
              padding: "14px 24px",
              fontWeight: 700,
              fontSize: "16px",
              cursor: saving ? "not-allowed" : "pointer",
              transition: "all 0.2s ease",
              boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              opacity: saving ? 0.7 : 1,
            }}
          >
            <FaSave size={16} /> {saving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </div>
    </section>
  );
}
