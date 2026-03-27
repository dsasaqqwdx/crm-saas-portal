
import React, { useState, useEffect } from "react";
import Sidebar from "../../layouts/Sidebar";
import { PageContent } from "../../layouts/usePageLayout"; 
import { Building2, Plus, Search, Users, CheckCircle, AlertTriangle, X, ChevronRight, Trash2 } from "lucide-react";
import axios from "axios";

const API = process.env.REACT_APP_API_URL || "http://localhost:5001";

const CompaniesPage = () => {
  const [companies, setCompanies] = useState([]);
  const [globalStats, setGlobalStats] = useState({
    totalCompanies: 0,
    totalUsers: 0,
    activeLicenses: 0,
    systemAlerts: 0,
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState({ company_name: "", pricing_plan: "" });
  const [showModal, setShowModal] = useState(false);
  
  const [deleteModal, setDeleteModal] = useState({ show: false, id: null, name: "" });
  
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const token = localStorage.getItem("token");
  const headers = { "x-auth-token": token };

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [companiesRes, statsRes] = await Promise.all([
        axios.get(`${API}/api/saas/companies`, { headers }),
        axios.get(`${API}/api/saas/global-summary`, { headers }),
      ]);
      if (companiesRes.data.success) setCompanies(companiesRes.data.data);
      if (statsRes.data.success) setGlobalStats(statsRes.data.data);
    } catch (err) {
      showToast("Failed to load data", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDashboardData(); }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.post(`${API}/api/saas/create`, formData, { headers });
      showToast("Company added successfully");
      setShowModal(false);
      setFormData({ company_name: "", pricing_plan: "" });
      fetchDashboardData();
    } catch (err) {
      showToast(err.response?.data?.message || "Error adding company", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = (id, name) => {
    setDeleteModal({ show: true, id, name });
  };

  const executeDelete = async () => {
    setSubmitting(true);
    try {
      const res = await axios.delete(`${API}/api/saas/company/${deleteModal.id}`, { headers });
      if (res.data.success) {
        showToast("Company deleted successfully");
        setDeleteModal({ show: false, id: null, name: "" });
        fetchDashboardData();
      }
    } catch (err) {
      showToast(err.response?.data?.message || "Error deleting company", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = companies.filter((c) =>
    c.company_name?.toLowerCase().includes(search.toLowerCase()) ||
    c.pricing_plan?.toLowerCase().includes(search.toLowerCase())
  );

  const planColor = (plan) => {
    const p = (plan || "").toLowerCase();
    if (p.includes("enterprise")) return { bg: "#fff8e1", color: "#f59e0b", label: "Enterprise" };
    if (p.includes("pro")) return { bg: "#e8f5e9", color: "#22c55e", label: "Pro" };
    if (p.includes("basic")) return { bg: "#e3f2fd", color: "#3b82f6", label: "Basic" };
    return { bg: "#f3f4f6", color: "#6b7280", label: plan || "—" };
  };

  const initials = (name) => (name || "?").split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
  const avatarColors = ["#4f46e5", "#0891b2", "#059669", "#d97706", "#dc2626", "#7c3aed"];
  const avatarColor = (name) => avatarColors[(name || "").charCodeAt(0) % avatarColors.length];

  const stats = [
    { label: "Companies", value: globalStats.totalCompanies, icon: Building2, color: "#4f46e5", bg: "#eef2ff" },
    { label: "Users", value: globalStats.totalUsers, icon: Users, color: "#0891b2", bg: "#e0f2fe" },
    { label: "Licenses", value: globalStats.activeLicenses, icon: CheckCircle, color: "#059669", bg: "#d1fae5" },
    { label: "Alerts", value: globalStats.systemAlerts, icon: AlertTriangle, color: "#d97706", bg: "#fef3c7" },
  ];

  return (
    <div className="cp-root d-flex">
      <Sidebar />
      <PageContent>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
          .cp-root { font-family: 'Inter', sans-serif; background: #f8f9fc; min-height: 100vh; }
          .cp-title { font-size: 24px; font-weight: 800; letter-spacing: -0.02em; color: #0f1130; }
          .stat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 24px; }
          .stat-card { background: #fff; border-radius: 16px; border: 1px solid #e5e7f0; padding: 20px; display: flex; align-items: center; gap: 14px; }
          .table-toolbar { display: flex; flex-direction: column; gap: 16px; padding: 20px; border-bottom: 1px solid #e5e7f0; }
          @media (min-width: 768px) { .table-toolbar { flex-direction: row; align-items: center; justify-content: space-between; } }
          .search-wrap { position: relative; width: 100%; max-width: 320px; }
          .search-input { width: 100%; border: 1.5px solid #e5e7f0; border-radius: 10px; padding: 8px 12px 8px 36px; font-size: 14px; outline: none; transition: 0.2s; }
          .search-input:focus { border-color: #4f46e5; background: #fff; }
          .btn-delete { background: none; border: none; color: #9ca3b8; cursor: pointer; transition: 0.2s; padding: 5px; border-radius: 6px; }
          .btn-delete:hover { color: #ef4444; background: #fee2e2; }
          .modal-box { width: 95%; max-width: 480px; margin: 10px; }
          .btn-add { background: #4f46e5; color: #fff; border: none; border-radius: 10px; padding: 10px 20px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 8px; box-shadow: 0 4px 12px rgba(79,70,229,0.2); }
        `}</style>

        <div className="container-fluid p-3 p-md-4">
          <div className="cp-header d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1 className="cp-title mb-1">Companies</h1>
              <p className="text-muted small mb-0">Monitor and manage tenant accounts</p>
            </div>
            <button className="btn-add mt-3 mt-md-0" onClick={() => setShowModal(true)}>
              <Plus size={18} /> Add Company
            </button>
          </div>

          <div className="stat-grid">
            {stats.map(({ label, value, icon: Icon, color, bg }) => (
              <div className="stat-card" key={label}>
                <div style={{ background: bg, width: 42, height: 42, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon size={20} color={color} style={{ margin: 'auto' }} />
                </div>
                <div>
                  <p style={{ fontSize: 11, fontWeight: 700, color: "#9ca3b8", textTransform: "uppercase", margin: 0 }}>{label}</p>
                  <p style={{ fontSize: 20, fontWeight: 700, color: "#0f1130", margin: 0 }}>{loading ? "..." : (value ?? 0)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="card border-0 shadow-sm" style={{ borderRadius: 16, overflow: "hidden" }}>
            <div className="table-toolbar">
              <h6 className="fw-bold mb-0">Total Companies ({filtered.length})</h6>
              <div className="search-wrap">
                <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9ca3b8" }} />
                <input className="search-input" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
            </div>

            <div className="table-responsive">
              <table className="cp-table w-100">
                <thead className="bg-light">
                  <tr>
                    <th className="p-3 small fw-bold text-muted text-uppercase">Company</th>
                    <th className="p-3 small fw-bold text-muted text-uppercase">Subscription</th>
                    <th className="p-3 small fw-bold text-muted text-uppercase">Created</th>
                    <th className="text-end p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="4" className="text-center p-5 text-muted">Loading...</td></tr>
                  ) : filtered.length === 0 ? (
                    <tr><td colSpan="4" className="text-center p-5 text-muted">No companies found.</td></tr>
                  ) : filtered.map((c) => {
                    const plan = planColor(c.pricing_plan);
                    return (
                      <tr className="border-bottom" key={c.company_id}>
                        <td className="p-3">
                          <div className="d-flex align-items-center gap-3">
                            <div style={{ background: avatarColor(c.company_name), width: 36, height: 36, borderRadius: 8, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13 }}>
                              {initials(c.company_name)}
                            </div>
                            <div>
                              <div className="fw-bold small">{c.company_name}</div>
                              <div className="text-muted" style={{ fontSize: 10 }}>#{c.company_id.toString().slice(0, 8)}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-3">
                          <span style={{ background: plan.bg, color: plan.color, fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 99 }}>{plan.label}</span>
                        </td>
                        <td className="p-3 text-muted small">
                          {new Date(c.created_at).toLocaleDateString()}
                        </td>
                        <td className="p-3 text-end">
                          <div className="d-flex justify-content-end align-items-center gap-2">
                            <button className="btn-delete" onClick={() => confirmDelete(c.company_id, c.company_name)} title="Delete Company">
                              <Trash2 size={16} />
                            </button>
                            <ChevronRight size={16} className="text-muted" />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

       
        {showModal && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(15,17,48,0.4)", backdropFilter: "blur(4px)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div className="modal-box bg-white p-4 rounded-4 shadow-lg">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold mb-0">Add New Company</h5>
                <X size={20} className="cursor-pointer" onClick={() => setShowModal(false)} />
              </div>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="small fw-bold text-muted mb-2 d-block">Company Name</label>
                  <input className="form-control" name="company_name" value={formData.company_name} onChange={handleChange} required />
                </div>
                <div className="mb-4">
                  <label className="small fw-bold text-muted mb-2 d-block">Pricing Plan</label>
                  <select className="form-select" name="pricing_plan" value={formData.pricing_plan} onChange={handleChange} required>
                    <option value="">Select Plan</option>
                    <option value="Basic">Basic</option>
                    <option value="Pro">Pro</option>
                    <option value="Enterprise">Enterprise</option>
                  </select>
                </div>
                <div className="d-flex gap-2">
                  <button type="button" className="btn btn-light flex-grow-1" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary flex-grow-1" disabled={submitting}>{submitting ? "..." : "Create"}</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {deleteModal.show && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(15,17,48,0.4)", backdropFilter: "blur(4px)", zIndex: 2001, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div className="modal-box bg-white p-4 rounded-4 shadow-lg text-center">
              <div style={{ background: "#fee2e2", width: 52, height: 52, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                <AlertTriangle color="#ef4444" size={26} />
              </div>
              <h5 className="fw-bold mb-2">Delete Company?</h5>
              <p className="text-muted small mb-4">
                Are you sure you want to delete <strong>{deleteModal.name}</strong>? This action will remove all associated data and cannot be undone.
              </p>
              <div className="d-flex gap-2">
                <button type="button" className="btn btn-light flex-grow-1" onClick={() => setDeleteModal({ show: false, id: null, name: "" })}>
                  Cancel
                </button>
                <button type="button" className="btn btn-danger flex-grow-1" style={{ background: "#ef4444", border: "none" }} onClick={executeDelete} disabled={submitting}>
                  {submitting ? "Deleting..." : "Yes, Delete"}
                </button>
              </div>
            </div>
          </div>
        )}

        
        {toast && (
          <div style={{ position: "fixed", bottom: 20, right: 20, background: toast.type === "error" ? "#ef4444" : "#10b981", color: "#fff", padding: "12px 20px", borderRadius: 10, fontWeight: 600, zIndex: 3000, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
            {toast.msg}
          </div>
        )}
      </PageContent>
    </div>
  );
};

export default CompaniesPage;