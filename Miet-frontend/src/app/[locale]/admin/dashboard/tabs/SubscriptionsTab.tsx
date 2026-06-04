"use client";
import React, { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash, FaCheckCircle, FaTimes } from "react-icons/fa";
import { getApiUrl } from "@/utils/api";
import { useNotifications } from "@/components/NotificationSystem";

export default function SubscriptionsTab() {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"user" | "consultant">("user");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  
  // Form State
  const [planName, setPlanName] = useState("");
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [basePrice, setBasePrice] = useState("");
  const [description, setDescription] = useState("");
  const [features, setFeatures] = useState<{ key: string; value: string }[]>([]);
  
  const { addNotification } = useNotifications();

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("admin_jwt");
      const res = await fetch(getApiUrl("api/admin/subscriptions"), {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const json = await res.json();
        setPlans(json.data || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (plan: any = null) => {
    if (plan) {
      setEditId(plan.id);
      setPlanName(plan.plan_name);
      setBillingCycle(plan.billing_cycle);
      setBasePrice(plan.base_price.toString());
      setDescription(plan.description || "");
      try {
        const parsed = JSON.parse(plan.features_json || "{}");
        const featuresArray = Object.keys(parsed).map(k => ({ key: k, value: parsed[k] }));
        setFeatures(featuresArray);
      } catch (e) {
        setFeatures([]);
      }
    } else {
      setEditId(null);
      setPlanName("");
      setBillingCycle("monthly");
      setBasePrice("");
      setDescription("");
      setFeatures([]);
    }
    setIsModalOpen(true);
  };

  const savePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("admin_jwt");
      
      const featuresObj: any = {};
      features.forEach(f => {
        if (f.key.trim()) featuresObj[f.key] = f.value;
      });

      const bodyData = {
        plan_name: planName,
        billing_cycle: billingCycle,
        target_audience: activeTab,
        base_price: parseFloat(basePrice),
        description: description,
        features_json: JSON.stringify(featuresObj),
        is_active: 1
      };

      const url = editId ? getApiUrl(`api/admin/subscriptions/${editId}`) : getApiUrl("api/admin/subscriptions");
      const method = editId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(bodyData)
      });

      if (res.ok) {
        addNotification({ type: "success", title: "Success", message: `Plan ${editId ? "updated" : "created"} successfully!` });
        setIsModalOpen(false);
        fetchPlans();
      } else {
        addNotification({ type: "error", title: "Error", message: "Failed to save plan." });
      }
    } catch (error) {
      addNotification({ type: "error", title: "Error", message: "Network error occurred." });
    }
  };

  const deletePlan = async (id: number) => {
    if (!confirm("Are you sure you want to delete this plan?")) return;
    try {
      const token = localStorage.getItem("admin_jwt");
      const res = await fetch(getApiUrl(`api/admin/subscriptions/${id}`), {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        addNotification({ type: "success", title: "Success", message: "Plan deleted." });
        fetchPlans();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const addFeatureRow = () => setFeatures([...features, { key: "", value: "" }]);
  const removeFeatureRow = (index: number) => {
    const newF = [...features];
    newF.splice(index, 1);
    setFeatures(newF);
  };
  const updateFeature = (index: number, field: "key" | "value", val: string) => {
    const newF = [...features];
    newF[index][field] = val;
    setFeatures(newF);
  };

  const filteredPlans = plans.filter(p => p.target_audience === activeTab);

  if (loading) return <div style={{ padding: "40px" }}>Loading Subscriptions...</div>;

  return (
    <section>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: "28px", fontWeight: 700, color: "#1e3c72", margin: 0 }}>Subscription Plans</h2>
          <p style={{ color: "#666", marginTop: 8 }}>Manage custom membership benefits for Users and Consultants.</p>
        </div>
        <button
          onClick={() => openModal()}
          style={{
            background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
            color: "white", border: "none", padding: "12px 24px", borderRadius: "10px",
            display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontWeight: 600
          }}
        >
          <FaPlus /> Add New Plan
        </button>
      </div>

      <div style={{ display: "flex", gap: "16px", marginBottom: "24px", borderBottom: "1px solid #e2e8f0", paddingBottom: "12px" }}>
        <button 
          onClick={() => setActiveTab("user")}
          style={{ background: "transparent", border: "none", fontSize: "18px", fontWeight: activeTab === "user" ? 700 : 500, color: activeTab === "user" ? "#1e3c72" : "#64748b", cursor: "pointer", borderBottom: activeTab === "user" ? "2px solid #1e3c72" : "none", paddingBottom: "8px" }}
        >
          User Plans
        </button>
        <button 
          onClick={() => setActiveTab("consultant")}
          style={{ background: "transparent", border: "none", fontSize: "18px", fontWeight: activeTab === "consultant" ? 700 : 500, color: activeTab === "consultant" ? "#1e3c72" : "#64748b", cursor: "pointer", borderBottom: activeTab === "consultant" ? "2px solid #1e3c72" : "none", paddingBottom: "8px" }}
        >
          Consultant Plans
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "24px" }}>
        {filteredPlans.length === 0 ? (
          <p style={{ color: "#888" }}>No {activeTab} plans found.</p>
        ) : (
          filteredPlans.map(plan => {
            let parsedFeatures = {};
            try { parsedFeatures = JSON.parse(plan.features_json || "{}"); } catch(e) {}
            
            return (
              <div key={plan.id} style={{ background: "white", borderRadius: "16px", padding: "24px", boxShadow: "0 4px 15px rgba(0,0,0,0.05)", border: "1px solid #f1f5f9", position: "relative" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                  <div>
                    <span style={{ fontSize: "12px", background: "#e2e8f0", padding: "4px 8px", borderRadius: "4px", fontWeight: 600, color: "#475569", textTransform: "uppercase" }}>
                      {plan.billing_cycle}
                    </span>
                    <h3 style={{ margin: "8px 0 4px 0", fontSize: "22px", fontWeight: 700, color: "#1e293b" }}>{plan.plan_name}</h3>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <h2 style={{ margin: 0, color: "#1e3c72", fontSize: "28px" }}>₹{plan.base_price}</h2>
                  </div>
                </div>
                
                <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "20px" }}>{plan.description}</p>
                
                <div style={{ marginBottom: "24px" }}>
                  <h4 style={{ margin: "0 0 12px 0", fontSize: "14px", color: "#334155", fontWeight: 600 }}>Dynamic Benefits</h4>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
                    {Object.entries(parsedFeatures).map(([k, v]) => (
                      <li key={k} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", color: "#475569" }}>
                        <FaCheckCircle color="#10b981" /> <strong>{k}:</strong> {String(v)}
                      </li>
                    ))}
                    {Object.keys(parsedFeatures).length === 0 && <li style={{ fontSize: "13px", color: "#94a3b8", fontStyle: "italic" }}>No specific benefits added.</li>}
                  </ul>
                </div>

                <div style={{ display: "flex", gap: "12px", borderTop: "1px solid #f1f5f9", paddingTop: "16px" }}>
                  <button onClick={() => openModal(plan)} style={{ flex: 1, padding: "10px", background: "#f8fafc", color: "#3b82f6", border: "1px solid #e2e8f0", borderRadius: "8px", cursor: "pointer", fontWeight: 600, display: "flex", justifyContent: "center", alignItems: "center", gap: "6px" }}>
                    <FaEdit /> Edit
                  </button>
                  <button onClick={() => deletePlan(plan.id)} style={{ flex: 1, padding: "10px", background: "#fef2f2", color: "#ef4444", border: "1px solid #fecaca", borderRadius: "8px", cursor: "pointer", fontWeight: 600, display: "flex", justifyContent: "center", alignItems: "center", gap: "6px" }}>
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {isModalOpen && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: "white", padding: "32px", borderRadius: "16px", width: "90%", maxWidth: "600px", maxHeight: "90vh", overflowY: "auto" }}>
            <h3 style={{ margin: "0 0 20px 0", fontSize: "22px", color: "#1e293b" }}>{editId ? "Edit Plan" : "Add New Plan"} ({activeTab === "user" ? "User" : "Consultant"})</h3>
            
            <form onSubmit={savePlan} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "flex", gap: "16px" }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", marginBottom: "6px", fontWeight: 600, color: "#475569" }}>Plan Name</label>
                  <input required type="text" value={planName} onChange={e => setPlanName(e.target.value)} placeholder="e.g. Premium" style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1" }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", marginBottom: "6px", fontWeight: 600, color: "#475569" }}>Base Price (₹)</label>
                  <input required type="number" min="0" value={basePrice} onChange={e => setBasePrice(e.target.value)} placeholder="e.g. 999" style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1" }} />
                </div>
              </div>
              
              <div>
                <label style={{ display: "block", marginBottom: "6px", fontWeight: 600, color: "#475569" }}>Billing Cycle</label>
                <select value={billingCycle} onChange={e => setBillingCycle(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1" }}>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "6px", fontWeight: 600, color: "#475569" }}>Description (Optional)</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1", resize: "vertical" }}></textarea>
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: 600, color: "#475569" }}>Dynamic Benefits (e.g. Fast Delivery: Yes, Discount: 10%)</label>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "10px" }}>
                  {features.map((f, idx) => (
                    <div key={idx} style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                      <input type="text" placeholder="Feature Name" value={f.key} onChange={e => updateFeature(idx, "key", e.target.value)} style={{ flex: 1, padding: "8px", borderRadius: "6px", border: "1px solid #cbd5e1" }} />
                      <input type="text" placeholder="Value" value={f.value} onChange={e => updateFeature(idx, "value", e.target.value)} style={{ flex: 1, padding: "8px", borderRadius: "6px", border: "1px solid #cbd5e1" }} />
                      <button type="button" onClick={() => removeFeatureRow(idx)} style={{ padding: "8px", background: "none", border: "none", color: "#ef4444", cursor: "pointer" }}><FaTimes size={18} /></button>
                    </div>
                  ))}
                </div>
                <button type="button" onClick={addFeatureRow} style={{ background: "#e0e7ff", color: "#4f46e5", border: "none", padding: "8px 16px", borderRadius: "6px", cursor: "pointer", fontWeight: 600, fontSize: "14px" }}>+ Add Benefit</button>
              </div>

              <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "24px" }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ background: "#f1f5f9", color: "#475569", border: "none", padding: "12px 24px", borderRadius: "8px", cursor: "pointer", fontWeight: 600 }}>Cancel</button>
                <button type="submit" style={{ background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)", color: "white", border: "none", padding: "12px 24px", borderRadius: "8px", cursor: "pointer", fontWeight: 600 }}>Save Plan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
