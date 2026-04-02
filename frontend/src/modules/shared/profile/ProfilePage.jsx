
import React, { useEffect, useState, useCallback } from "react";
import Sidebar from "../../../layouts/Sidebar";
import { PageContent } from "../../../layouts/usePageLayout";
import axios from "axios";
import { Loader2, Upload, Trash2, KeyRound, CheckCircle, AlertCircle } from "lucide-react";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5001";

const Toast = ({ toast }) => {
  if (!toast) return null;
  return (
    <div
      style={{
        position: "fixed",
        bottom: "28px",
        right: "28px",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "13px 20px",
        borderRadius: "12px",
        fontWeight: 600,
        fontSize: "14px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
        background: toast.type === "success" ? "#0b2e1e" : "#2e0b0b",
        color: toast.type === "success" ? "#6ee7b7" : "#fca5a5",
        border: `1px solid ${toast.type === "success" ? "rgba(110,231,183,0.2)" : "rgba(252,165,165,0.2)"}`,
        animation: "fadeUp 0.3s ease",
      }}
    >
      {toast.type === "success" ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
      {toast.msg}
      <style>{`@keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }`}</style>
    </div>
  );
};

const ProfilePage = () => {
  const [profile, setProfile] = useState({
    name: "",
    employee_id: "",
    email: "",
    phone: "",
    department: "",
    role: "Employee",
  });
  const [loading, setLoading]         = useState(true);
  const [saving, setSaving]           = useState(false);
  const [pwSaving, setPwSaving]       = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile]   = useState(null);
  const [avatarError, setAvatarError] = useState(false);
  const [toast, setToast]             = useState(null);

  const [isNewProfile, setIsNewProfile] = useState(false);

  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [showPw, setShowPw] = useState({ current: false, next: false, confirm: false });

  const token      = localStorage.getItem("token");
  const role       = localStorage.getItem("role") || "";
  const activeRole = localStorage.getItem("activeRole") || role;
  const headers    = { "x-auth-token": token };
  const profileEndpoint = `${API_BASE}/api/employees/profile`;

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);

      const res  = await axios.get(profileEndpoint, { headers });
      const data = res.data?.data || {};

      setProfile({
        name:       data.name       || "",
        email:      data.email      || "",
        phone:      data.phone      || "",
        department: data.department || "",
        role:       data.role       || "Employee",
        employee_id: data.employee_id || "",
      });

      setAvatarPreview(data.avatar || null);
      setAvatarError(false);
      setIsNewProfile(false);

    } catch (err) {
      const status = err.response?.status;

      if (status === 404) {
        setIsNewProfile(true);
        setProfile({
          name:       localStorage.getItem("name") || "",
          email:      "",
          phone:      "",
          department: "",
          role:       "Employee",
          employee_id: "",
        });
        setAvatarPreview(null);
        showToast("No profile found — fill in your details and save to create one.", "success");
      } else {
        showToast("Failed to load profile. Please try again.", "error");
      }
    } finally {
      setLoading(false);
    }
  }, [token, profileEndpoint]);

  useEffect(() => { loadProfile(); }, [loadProfile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatar = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
      showToast("Image must be under 3MB", "error");
      return;
    }
    setAvatarFile(file);
    setAvatarError(false);
    const reader = new FileReader();
    reader.onload = (ev) => setAvatarPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const updateProfile = async () => {
    if (!profile.name.trim() || !profile.email.trim()) {
      showToast("Name and email are required", "error");
      return;
    }
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("name",       profile.name);
      formData.append("email",      profile.email);
      formData.append("phone",      profile.phone);
      formData.append("department", profile.department);
      if (avatarFile) formData.append("avatar", avatarFile);
      await axios.put(profileEndpoint, formData, { headers });

      showToast(isNewProfile ? "Profile created successfully!" : "Profile updated successfully");
      setAvatarFile(null);
      setIsNewProfile(false);
      loadProfile(); 
    } catch (err) {
      showToast(err.response?.data?.message || "Error updating profile", "error");
    } finally {
      setSaving(false);
    }
  };

  const deleteAvatar = async () => {
    try {
      await axios.delete(`${API_BASE}/api/employees/avatar`, { headers });
      setAvatarPreview(null);
      setAvatarFile(null);
      setAvatarError(false);
      showToast("Profile photo removed");
      loadProfile();
    } catch (err) {
      showToast("Failed to remove photo", "error");
    }
  };

  const changePassword = async () => {
    if (passwordData.new_password !== passwordData.confirm_password) {
      showToast("Passwords do not match", "error");
      return;
    }
    if (passwordData.new_password.length < 6) {
      showToast("Password must be at least 6 characters", "error");
      return;
    }
    setPwSaving(true);
    try {
      await axios.put(
        `${API_BASE}/api/employees/change-password`,
        { current_password: passwordData.current_password, new_password: passwordData.new_password },
        { headers }
      );
      showToast("Password changed successfully");
      setPasswordData({ current_password: "", new_password: "", confirm_password: "" });
    } catch (err) {
      showToast(err.response?.data?.message || "Error changing password", "error");
    } finally {
      setPwSaving(false);
    }
  };

  const pwStrength = (pw) => {
    if (!pw) return null;
    if (pw.length >= 10) return { width: "100%", color: "#10b981", label: "Strong" };
    if (pw.length >= 7)  return { width: "66%",  color: "#f59e0b", label: "Medium" };
    return { width: "33%", color: "#ef4444", label: "Weak" };
  };
  const strength   = pwStrength(passwordData.new_password);
  const showImage  = avatarPreview && !avatarError;
  const card = {
    background: "#fff", borderRadius: "16px",
    border: "1px solid #e8eaf0",
    boxShadow: "0 2px 12px rgba(17,19,48,0.07)",
    marginBottom: "24px", overflow: "hidden",
  };
  const cardHead = {
    padding: "18px 24px", borderBottom: "1px solid #f0f1f8",
    background: "linear-gradient(180deg,#fff 0%,#f8f9fd 100%)",
    display: "flex", alignItems: "center", gap: "10px",
  };
  const cardBody = { padding: "24px" };
  const label = {
    display: "block", fontSize: "11px", fontWeight: 700, color: "#8e91b8",
    textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "6px",
  };
  const input = {
    width: "100%", border: "1.5px solid #dde0ef", borderRadius: "9px",
    padding: "10px 13px", fontSize: "14px", fontFamily: "inherit",
    color: "#111330", outline: "none", background: "#f8f9fd",
    transition: "border-color 0.2s, box-shadow 0.2s",
  };
  const btnPrimary = {
    background: "#5b5ef4", color: "#fff", border: "none", borderRadius: "9px",
    padding: "11px 22px", fontWeight: 700, fontSize: "14px", cursor: "pointer",
    display: "inline-flex", alignItems: "center", gap: "7px",
    transition: "all 0.18s", boxShadow: "0 4px 14px rgba(91,94,244,0.28)",
  };
  const btnDanger = {
    background: "rgba(239,68,68,0.1)", color: "#ef4444",
    border: "1.5px solid rgba(239,68,68,0.25)", borderRadius: "9px",
    padding: "11px 18px", fontWeight: 700, fontSize: "14px", cursor: "pointer",
    display: "inline-flex", alignItems: "center", gap: "7px", transition: "all 0.18s",
  };
  const btnDark = {
    background: "#111330", color: "#fff", border: "none", borderRadius: "9px",
    padding: "12px", fontWeight: 700, fontSize: "14px", cursor: "pointer",
    width: "100%", display: "flex", alignItems: "center", justifyContent: "center",
    gap: "7px", boxShadow: "0 4px 16px rgba(17,19,48,0.2)", transition: "all 0.18s",
  };

  const isAdminSelfView = role === "company_admin" && activeRole === "self";

  return (
    <div className="d-flex bg-light min-vh-100">
      <Sidebar />
      <PageContent>
        <div className="container-fluid px-3 px-md-4 py-4" style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}>
          <div className="mb-4">
            <div
              className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-2"
              style={{ background: "#eef0fe", color: "#5b5ef4", fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", border: "1px solid rgba(91,94,244,0.18)" }}
            >
              {isAdminSelfView ? "Self View" : "Employee"} • Profile
            </div>
            <h2 className="fw-bold mb-1" style={{ color: "#111330", fontSize: "26px", letterSpacing: "-0.5px" }}>
              My Profile
            </h2>
            <p style={{ color: "#8e91b8", fontSize: "14px" }}>Manage your personal information and account security</p>
          </div>
          {isNewProfile && !loading && (
            <div
              className="d-flex align-items-center gap-2 rounded-3 px-3 py-2 mb-4"
              style={{ background: "#eff6ff", color: "#1d4ed8", fontSize: "13px", fontWeight: 600, border: "1px solid #bfdbfe" }}
            >
              <CheckCircle size={16} />
              No employee profile exists yet. Fill in your details below and click <strong>&nbsp;Update Profile&nbsp;</strong> to create one.
            </div>
          )}
          {loading ? (
            <div className="text-center py-5">
              <Loader2 size={40} style={{ color: "#5b5ef4", animation: "spin 1s linear infinite" }} />
              <p className="mt-3" style={{ color: "#8e91b8" }}>Loading profile…</p>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>

          ) : (
            <>
              <div style={card}>
                <div style={cardHead}>
                  <div style={{ width: 34, height: 34, borderRadius: 9, background: "#eef0fe", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#5b5ef4" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
                  </div>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: "14px", color: "#111330", margin: 0 }}>Personal Information</p>
                    <p style={{ fontSize: "12px", color: "#8e91b8", margin: 0 }}>Update your photo and profile details</p>
                  </div>
                </div>

                <div style={cardBody}>
                  <div className="row g-4">
                    <div className="col-md-3 text-center">
                      <div style={{ position: "relative", display: "inline-block", marginBottom: "16px" }}>
                        <div style={{
                          width: 110, height: 110, borderRadius: "50%",
                          background: showImage ? "transparent" : "linear-gradient(140deg,#7c7fff,#5b5ef4)",
                          overflow: "hidden",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          boxShadow: "0 8px 28px rgba(91,94,244,0.25)",
                          border: "4px solid #fff",
                          outline: "2px solid rgba(91,94,244,0.15)",
                          margin: "0 auto",
                        }}>
                          {showImage ? (
                            <img
                              src={avatarPreview}
                              alt="avatar"
                              onError={() => setAvatarError(true)}
                              style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                          ) : (
                            <span style={{ fontSize: 36, fontWeight: 700, color: "#fff", userSelect: "none" }}>
                              {profile.name?.charAt(0)?.toUpperCase() || "E"}
                            </span>
                          )}
                        </div>
                      </div>

                      <p style={{ fontWeight: 700, fontSize: "15px", color: "#111330", marginBottom: "2px" }}>{profile.name || "—"}</p>
                      <p style={{ fontSize: "12px", color: "#8e91b8", marginBottom: "16px" }}>{profile.role}</p>
                      <label style={{
                        display: "block", border: "1.5px dashed #c5c8e8", borderRadius: "10px",
                        padding: "10px", cursor: "pointer", background: "#f8f9fd",
                        fontSize: "12px", color: "#8e91b8", marginBottom: "10px",
                      }}>
                        <Upload size={14} style={{ marginRight: 5 }} />
                        Choose photo
                        <input type="file" accept="image/*" style={{ display: "none" }} onChange={handleAvatar} />
                      </label>

                      <div className="d-flex gap-2 justify-content-center">
                        <button style={{ ...btnPrimary, padding: "8px 14px", fontSize: "12px" }} onClick={updateProfile} disabled={saving}>
                          {saving ? <Loader2 size={13} style={{ animation: "spin 1s linear infinite" }} /> : <Upload size={13} />}
                          {saving ? "Saving…" : "Save"}
                        </button>
                        {avatarPreview && (
                          <button style={{ ...btnDanger, padding: "8px 12px", fontSize: "12px" }} onClick={deleteAvatar}>
                            <Trash2 size={13} /> Remove
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="col-md-9">
                      <div className="row g-3">
                        {[
                          { name: "name",       label: "Full Name",    type: "text",  ph: "Your full name" },
                          { name: "email",      label: "Email Address",type: "email", ph: "you@company.com" },
                          { name: "phone",      label: "Phone Number", type: "tel",   ph: "+91 9XXXXXXXXX" },
                          { name: "department", label: "Department",   type: "text",  ph: "e.g. Engineering" },
                        ].map(({ name, label: lbl, type, ph }) => (
                          <div className="col-md-6" key={name}>
                            <label style={label}>{lbl}</label>
                            <input
                              type={type}
                              name={name}
                              value={profile[name] || ""}
                              placeholder={ph}
                              onChange={handleChange}
                              style={input}
                              onFocus={(e) => { e.target.style.borderColor = "#5b5ef4"; e.target.style.boxShadow = "0 0 0 3px rgba(91,94,244,0.14)"; e.target.style.background = "#fff"; }}
                              onBlur={(e)  => { e.target.style.borderColor = "#dde0ef"; e.target.style.boxShadow = "none"; e.target.style.background = "#f8f9fd"; }}
                            />
                          </div>
                        ))}

                        <div className="col-12 mt-2">
                          <button style={btnPrimary} onClick={updateProfile} disabled={saving}>
                            {saving ? <Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} /> : null}
                            {saving ? "Updating…" : isNewProfile ? "Create Profile" : "Update Profile"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div style={card}>
                <div style={cardHead}>
                  <div style={{ width: 34, height: 34, borderRadius: 9, background: "#eef0fe", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <KeyRound size={16} color="#5b5ef4" />
                  </div>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: "14px", color: "#111330", margin: 0 }}>Change Password</p>
                    <p style={{ fontSize: "12px", color: "#8e91b8", margin: 0 }}>Keep your account secure with a strong password</p>
                  </div>
                </div>

                <div style={cardBody}>
                  <div className="row g-3">
                    {[
                      { key: "current_password", label: "Current Password",    ph: "Enter current password", show: showPw.current, toggle: () => setShowPw(p => ({ ...p, current: !p.current })) },
                      { key: "new_password",      label: "New Password",         ph: "Min. 6 characters",      show: showPw.next,    toggle: () => setShowPw(p => ({ ...p, next:    !p.next    })) },
                      { key: "confirm_password",  label: "Confirm New Password", ph: "Repeat new password",    show: showPw.confirm, toggle: () => setShowPw(p => ({ ...p, confirm: !p.confirm })) },
                    ].map(({ key, label: lbl, ph, show, toggle }) => (
                      <div className="col-md-4" key={key}>
                        <label style={label}>{lbl}</label>
                        <div style={{ position: "relative" }}>
                          <input
                            type={show ? "text" : "password"}
                            placeholder={ph}
                            value={passwordData[key]}
                            onChange={(e) => setPasswordData(p => ({ ...p, [key]: e.target.value }))}
                            style={{ ...input, paddingRight: "42px" }}
                            onFocus={(e) => { e.target.style.borderColor = "#5b5ef4"; e.target.style.boxShadow = "0 0 0 3px rgba(91,94,244,0.14)"; e.target.style.background = "#fff"; }}
                            onBlur={(e)  => { e.target.style.borderColor = "#dde0ef"; e.target.style.boxShadow = "none"; e.target.style.background = "#f8f9fd"; }}
                          />
                          <button type="button" onClick={toggle} style={{ position: "absolute", right: "11px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#8e91b8", padding: "3px" }}>
                            {show
                              ? <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                              : <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                            }
                          </button>
                        </div>
                        {key === "new_password" && strength && (
                          <div style={{ height: 4, borderRadius: 99, background: "#e8eaf0", marginTop: 7, overflow: "hidden" }}>
                            <div style={{ height: "100%", borderRadius: 99, width: strength.width, background: strength.color, transition: "width 0.3s, background 0.3s" }} />
                          </div>
                        )}
                        {key === "new_password" && strength && (
                          <span style={{ fontSize: "11px", color: strength.color, fontWeight: 600, marginTop: 3, display: "block" }}>{strength.label}</span>
                        )}
                      </div>
                    ))}

                    <div className="col-12">
                      <button
                        style={{ ...btnDark, width: "auto", padding: "12px 28px" }}
                        onClick={changePassword}
                        disabled={pwSaving || !passwordData.current_password || !passwordData.new_password || !passwordData.confirm_password}
                      >
                        {pwSaving ? <Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} /> : <KeyRound size={15} />}
                        {pwSaving ? "Updating…" : "Update Password"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

        </div>
      </PageContent>

      <Toast toast={toast} />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default ProfilePage;