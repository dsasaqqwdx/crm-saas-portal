import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Sidebar from "../../../layouts/Sidebar";
import { PageContent } from "../../../layouts/usePageLayout";
import { Eye, EyeOff } from "lucide-react";

const API = process.env.REACT_APP_API_URL || "http://localhost:5001";

export default function AddSuperadminPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "super_admin", company_id: "" });
  const [companies, setCompanies] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);
  const [superadmins, setSuperadmins] = useState([]);
  const [loadingList, setLoadingList] = useState(true);

  const token = localStorage.getItem("token");
  const headers = { "x-auth-token": token };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchCompanies = async () => {
    try {
      const res = await axios.get(`${API}/api/saas/companies`, { headers });
      setCompanies(res.data.data || []);
    } catch (err) { console.error(err); }
  };

  const fetchSuperadmins = async () => {
    try {
      setLoadingList(true);
      const res = await axios.get(`${API}/api/saas/users`, { headers });
      const all = res.data.data || [];
      setSuperadmins(all.filter(u => u.role === "super_admin" || u.role === "software_owner"));
    } catch (err) { console.error(err); }
    finally { setLoadingList(false); }
  };

  useEffect(() => { fetchCompanies(); fetchSuperadmins(); }, []);

  const handleChange = (e) => { setForm({ ...form, [e.target.name]: e.target.value }); setError(""); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { setError("Name is required"); return; }
    if (!form.email.trim()) { setError("Email is required"); return; }
    if (!form.password || form.password.length < 6) { setError("Password must be at least 6 characters"); return; }
    setSubmitting(true);
    setError("");
    try {
      await axios.post(`${API}/api/auth/register`, {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        role: form.role,
        company_id: form.company_id || null,
      }, { headers });
      showToast(`${form.role === "software_owner" ? "Software Owner" : "Super Admin"} created successfully!`);
      setForm({ name: "", email: "", password: "", role: "super_admin", company_id: "" });
      fetchSuperadmins();
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.msg || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="d-flex bg-light min-vh-100">
      <Sidebar />
      <PageContent>
        {toast && (
          <div style={{ position: "fixed", top: 20, right: 20, zIndex: 9999, background: toast.type === "error" ? "#ef4444" : "#10b981", color: "#fff", padding: "12px 18px", borderRadius: 10, fontWeight: 500, fontSize: 13 }}>
            {toast.message}
          </div>
        )}

        <div className="container-fluid px-3 px-md-4 py-4">
          <div className="mb-4">
            <h2 className="fw-bold fs-4">Add Super Admin</h2>
            <p style={{ color: "#64748b", fontSize: 14 }}>Create and manage super admin accounts</p>
          </div>

          <div className="row g-4">
            
            <div className="col-12 col-lg-5">
              <div className="p-3 p-md-4" style={{ background: "#fff", borderRadius: 16, boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
                <h6 className="mb-4 fw-bold">New Account</h6>
                <form onSubmit={handleSubmit}>
                  {[
                    { label: "Full Name", name: "name", type: "text", placeholder: "John Doe" },
                    { label: "Email Address", name: "email", type: "email", placeholder: "admin@company.com" },
                  ].map(f => (
                    <div className="mb-3" key={f.name}>
                      <label className="mb-1" style={{ fontSize: 12, color: "#64748b" }}>{f.label}</label>
                      <input
                        className="form-control"
                        style={{ borderRadius: 10, padding: "10px" }}
                        type={f.type} name={f.name} value={form[f.name]}
                        onChange={handleChange} placeholder={f.placeholder}
                      />
                    </div>
                  ))}

                  <div className="mb-3">
                    <label className="mb-1" style={{ fontSize: 12, color: "#64748b" }}>Password</label>
                    <div style={{ position: "relative" }}>
                      <input
                        className="form-control"
                        style={{ borderRadius: 10, padding: "10px" }}
                        type={showPassword ? "text" : "password"}
                        name="password" value={form.password}
                        onChange={handleChange} placeholder="Minimum 6 characters"
                      />
                      <span onClick={() => setShowPassword(!showPassword)}
                        style={{ position: "absolute", right: 10, top: 10, cursor: "pointer" }}>
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </span>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="mb-1" style={{ fontSize: 12, color: "#64748b" }}>Role</label>
                    <select className="form-select" style={{ borderRadius: 10 }} name="role" value={form.role} onChange={handleChange}>
                      <option value="super_admin">Super Admin</option>
                      <option value="software_owner">Software Owner</option>
                    </select>
                  </div>

                  <div className="mb-4">
                    <label className="mb-1" style={{ fontSize: 12, color: "#64748b" }}>Company (optional)</label>
                    <select className="form-select" style={{ borderRadius: 10 }} name="company_id" value={form.company_id} onChange={handleChange}>
                      <option value="">Select company</option>
                      {companies.map((c) => (
                        <option key={c.company_id} value={c.company_id}>{c.company_name}</option>
                      ))}
                    </select>
                  </div>

                  {error && <div className="text-danger mb-3" style={{ fontSize: 13 }}>{error}</div>}

                  <button type="submit" className="btn w-100"
                    style={{ background: "#4f46e5", color: "#fff", borderRadius: 10, padding: "10px", fontWeight: 600 }}
                    disabled={submitting}>
                    {submitting ? "Creating..." : "Create Account"}
                  </button>
                </form>
              </div>
            </div>

            
            <div className="col-12 col-lg-7">
              <div className="p-3 p-md-4" style={{ background: "#fff", borderRadius: 16, boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
                <h6 className="fw-bold mb-4">Existing Super Admins</h6>
                {loadingList ? (
                  <div className="text-center text-muted">Loading...</div>
                ) : (
                  <div className="table-responsive">
                    <table className="table align-middle" style={{ minWidth: "400px" }}>
                      <thead>
                        <tr style={{ fontSize: 13, color: "#64748b" }}>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Role</th>
                        </tr>
                      </thead>
                      <tbody>
                        {superadmins.map((u) => (
                          <tr key={u.user_id}>
                            <td className="fw-semibold" style={{ fontSize: "0.9rem" }}>{u.name}</td>
                            <td style={{ fontSize: 12 }}>{u.email}</td>
                            <td>
                              <span style={{ background: "#eef2ff", color: "#4f46e5", padding: "4px 10px", borderRadius: 20, fontSize: 11 }}>
                                {u.role}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </PageContent>
    </div>
  );
}
