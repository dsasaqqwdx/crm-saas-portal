import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../../../layouts/Sidebar";
import { UserPlus, Eye, EyeOff } from "lucide-react";

const API = process.env.REACT_APP_API_URL || "http://localhost:5001";
export default function AddSuperadminPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "super_admin",
    company_id: "",
  });
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
    } catch (err) {
      console.error("Failed to load companies");
    }
  };

  const fetchSuperadmins = async () => {
    try {
      setLoadingList(true);
      const res = await axios.get(`${API}/api/saas/users`, { headers });
      const all = res.data.data || [];
      setSuperadmins(all.filter(u => u.role === "super_admin" || u.role === "software_owner"));
    } catch (err) {
      console.error("Failed to load superadmins");
    } finally {
      setLoadingList(false);
    }
  };

useEffect(() => {
  fetchCompanies();
  fetchSuperadmins();
}, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

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

  const roleColors = {
    super_admin:    { bg: "#fce7f3", text: "#be185d" },
    software_owner: { bg: "#fef9c3", text: "#a16207" },
  };

  return (
    <div className="d-flex bg-light min-vh-100">
      <Sidebar />
      <div className="container-fluid p-4" style={{ marginLeft: "250px" }}>

       
        {toast && (
          <div style={{
            position: "fixed", top: 20, right: 20, zIndex: 9999,
            background: toast.type === "error" ? "#ef4444" : "#10b981",
            color: "#fff", padding: "12px 20px", borderRadius: 8,
            fontWeight: 500, boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
          }}>
            {toast.message}
          </div>
        )}
        <div className="mb-4">
          <h2 className="fw-bold mb-1">Add Super Admin</h2>
          <p className="text-muted mb-0">Create new super admin or software owner accounts</p>
        </div>

        <div className="row g-4">
          <div className="col-lg-5">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <div className="d-flex align-items-center gap-2 mb-4">
                  <div style={{
                    width: 40, height: 40, borderRadius: 10,
                    background: "#e0e7ff", display: "flex",
                    alignItems: "center", justifyContent: "center"
                  }}>
                    <UserPlus size={18} color="#4f46e5" />
                  </div>
                  <h5 className="fw-bold mb-0">New Account</h5>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold small">Full Name *</label>
                    <input
                      className="form-control"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="e.g. John Doe"
                      autoFocus
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold small">Email Address *</label>
                    <input
                      className="form-control"
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="admin@shnoor.com"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold small">Password *</label>
                    <div className="input-group">
                      <input
                        className="form-control"
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="Min. 6 characters"
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold small">Role *</label>
                    <select
                      className="form-select"
                      name="role"
                      value={form.role}
                      onChange={handleChange}
                    >
                      <option value="super_admin">Super Admin</option>
                      <option value="software_owner">Software Owner</option>
                    </select>
                    <div className="form-text">
                      {form.role === "software_owner"
                        ? "⚠️ Software Owner has full system access."
                        : "Super Admin can manage all companies and users."}
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-semibold small">
                      Company <span className="text-muted fw-normal">(optional)</span>
                    </label>
                    <select
                      className="form-select"
                      name="company_id"
                      value={form.company_id}
                      onChange={handleChange}
                    >
                      <option value="">No specific company</option>
                      {companies.map((c) => (
                        <option key={c.company_id} value={c.company_id}>
                          {c.company_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {error && (
                    <div className="alert alert-danger py-2 small mb-3">{error}</div>
                  )}

                  <button
                    type="submit"
                    className="btn btn-primary w-100 fw-semibold py-2"
                    disabled={submitting}
                  >
                    {submitting ? "Creating..." : "Create Account"}
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div className="col-lg-7">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <h5 className="fw-bold mb-4">Existing Super Admins</h5>
                {loadingList ? (
                  <div className="text-center text-muted py-4">Loading...</div>
                ) : superadmins.length === 0 ? (
                  <div className="text-center text-muted py-4">No super admins found.</div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Role</th>
                          <th>Company</th>
                          <th>Created</th>
                        </tr>
                      </thead>
                      <tbody>
                        {superadmins.map((u) => {
                          const rc = roleColors[u.role] || { bg: "#f1f5f9", text: "#64748b" };
                          return (
                            <tr key={u.user_id}>
                              <td>
                                <div className="d-flex align-items-center gap-2">
                                  <div style={{
                                    width: 32, height: 32, borderRadius: "50%",
                                    background: "#e0e7ff", color: "#4f46e5",
                                    display: "flex", alignItems: "center",
                                    justifyContent: "center", fontWeight: 700,
                                    fontSize: 13, flexShrink: 0
                                  }}>
                                    {(u.name || "U").charAt(0).toUpperCase()}
                                  </div>
                                  <span className="fw-semibold" style={{ fontSize: 14 }}>{u.name}</span>
                                </div>
                              </td>
                              <td style={{ fontSize: 13, color: "#64748b" }}>{u.email}</td>
                              <td>
                                <span style={{
                                  background: rc.bg, color: rc.text,
                                  padding: "3px 10px", borderRadius: 20,
                                  fontSize: 12, fontWeight: 600
                                }}>
                                  {u.role}
                                </span>
                              </td>
                              <td style={{ fontSize: 13, color: "#64748b" }}>
                                {u.company_name || "—"}
                              </td>
                              <td style={{ fontSize: 13, color: "#64748b" }}>
                                {u.created_at
                                  ? new Date(u.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
                                  : "—"}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
