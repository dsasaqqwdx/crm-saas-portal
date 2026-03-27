
import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../../layouts/Sidebar";
import { PageContent } from "../../layouts/usePageLayout";
import { Camera, Save, User, Shield, Lock, Eye, EyeOff, CheckCircle, AlertCircle, Edit3, Trash2, ImagePlus } from "lucide-react";
import axios from "axios";

const API = process.env.REACT_APP_API_URL || "http://localhost:5001";

const SuperAdminProfile = () => {
  const [profile, setProfile] = useState({ name: "", email: "", phone: "", department: "", role: "Super Admin", joined: "", avatar: "" });
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({});
  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });
  const [showPw, setShowPw] = useState({ current: false, next: false, confirm: false });
  const [saving, setSaving] = useState(false);
  const [pwSaving, setPwSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);
  const fileRef = useRef(null);
  const menuRef = useRef(null);
  const token = localStorage.getItem("token");
  const headers = { "x-auth-token": token };

  const showToast = (msg, type = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3500); };

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await axios.get(`${API}/api/super-admin/profile`, { headers });
        const d = res.data.data || res.data;
        const p = { name: d.name || "", email: d.email || "", phone: d.phone || "", department: d.department || "Super Administration", role: d.role || "Super Admin", joined: d.joined_at || d.created_at || "", avatar: d.avatar || "" };
        setProfile(p); setDraft(p);
      } catch {
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          const p = { name: payload.name || "Super Admin", email: payload.email || "", phone: payload.phone || "", department: "Super Administration", role: "Super Admin", joined: "", avatar: "" };
          setProfile(p); setDraft(p);
        } catch {}
      }
    };
    if (token) loadProfile();
  }, []);

  useEffect(() => {
    const h = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setShowAvatarMenu(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const initials = (name) => (name || "SA").split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) { showToast("Image must be under 3MB", "error"); return; }
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setAvatarPreview(ev.target.result);
    reader.readAsDataURL(file);
    setShowAvatarMenu(false);
    e.target.value = "";
  };

  const handleDeleteAvatar = async () => {
    setShowAvatarMenu(false);
    if (!profile.avatar && avatarPreview) { setAvatarPreview(null); setAvatarFile(null); showToast("Photo removed"); return; }
    try {
      await axios.delete(`${API}/api/super-admin/avatar`, { headers });
      setProfile(prev => ({ ...prev, avatar: "" }));
      setAvatarPreview(null); setAvatarFile(null);
      showToast("Profile photo removed successfully");
    } catch (err) { showToast(err.response?.data?.message || "Failed to remove photo", "error"); }
  };

  const handleSave = async () => {
    if (!draft.name.trim() || !draft.email.trim()) { showToast("Name and email are required", "error"); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("name", draft.name); fd.append("email", draft.email);
      fd.append("phone", draft.phone || ""); fd.append("department", draft.department || "Super Administration");
      if (avatarFile) fd.append("avatar", avatarFile);
      await axios.put(`${API}/api/super-admin/profile`, fd, { headers: { ...headers, "Content-Type": "multipart/form-data" } });
      const updated = { ...draft, avatar: avatarPreview || profile.avatar };
      setProfile(updated); setEditing(false); setAvatarFile(null); setShowAvatarMenu(false);
      showToast("Profile updated");
    } catch (err) { showToast(err.response?.data?.message || "Failed to save", "error"); }
    finally { setSaving(false); }
  };

  const handleCancel = () => { setDraft(profile); setAvatarPreview(null); setAvatarFile(null); setShowAvatarMenu(false); setEditing(false); };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!pwForm.current) { showToast("Current password is required", "error"); return; }
    if (pwForm.next !== pwForm.confirm) { showToast("Passwords do not match", "error"); return; }
    if (pwForm.next.length < 6) { showToast("Password must be at least 6 characters", "error"); return; }
    setPwSaving(true);
    try {
      await axios.put(`${API}/api/admin/change-password`, { current_password: pwForm.current, new_password: pwForm.next }, { headers });
      setPwForm({ current: "", next: "", confirm: "" });
      showToast("Password changed successfully");
    } catch (err) { showToast(err.response?.data?.message || "Failed to change password", "error"); }
    finally { setPwSaving(false); }
  };

  const displayAvatar = avatarPreview || profile.avatar;
  const hasAvatar = !!displayAvatar;

  return (
    <>
      <style>{`
        .pr-root { display: flex; background: #f7f8fc; min-height: 100vh; }
        .hero-banner { height: 110px; background: linear-gradient(130deg, #1e1b4b 0%, #312e81 48%, #4338ca 100%); }
        .info-grid { display: grid; grid-template-columns: 1fr; gap: 20px; margin-top: 20px; }
        @media (min-width: 900px) { .info-grid { grid-template-columns: 1.15fr 0.85fr; } }
        .avatar-ring { width: 90px; height: 90px; border-radius: 50%; padding: 4px; background: #fff; box-shadow: 0 8px 24px rgba(17,19,48,0.13); }
        @media (min-width: 576px) { .avatar-ring { width: 104px; height: 104px; } }
        .hero-body { padding: 0 20px 24px; display: flex; align-items: flex-end; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
        @media (min-width: 576px) { .hero-body { padding: 0 32px 28px; } }
        .hero-actions { display: flex; gap: 10px; align-items: center; padding-top: 14px; flex-wrap: wrap; }
        .panel { background: #fff; border-radius: 16px; border: 1px solid #e6e8f5; box-shadow: 0 1px 4px rgba(17,19,48,0.07); overflow: hidden; }
        .field-input { width: 100%; border: 1.5px solid #d4d6ed; border-radius: 9px; padding: 10px 14px; font-size: 13.5px; background: #f7f8fc; outline: none; transition: border-color 0.2s; }
        .field-input:focus { border-color: #5b5ef4; background: #fff; }
        .pw-wrap { position: relative; }
        .pw-eye { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: #8e91b8; }
        .toast-pop { position: fixed; bottom: 24px; right: 16px; left: 16px; padding: 14px 18px; border-radius: 12px; font-size: 13px; font-weight: 600; display: flex; align-items: center; gap: 8px; box-shadow: 0 8px 24px rgba(17,19,48,0.15); z-index: 9999; }
        @media (min-width: 576px) { .toast-pop { left: auto; width: auto; } }
        .toast-pop.success { background: #0b2e1e; color: #6ee7b7; }
        .toast-pop.error { background: #2e0b0b; color: #fca5a5; }
      `}</style>

      <div className="pr-root">
        <Sidebar />
        <PageContent style={{ padding: "20px 16px 60px" }}>
          <div style={{ maxWidth: 960 }}>
            <h1 style={{ fontWeight: 800, fontSize: "clamp(20px, 4vw, 28px)", marginBottom: 4 }}>Super Admin Profile</h1>
            <p style={{ color: "#8e91b8", fontSize: 14, marginBottom: 20 }}>You can make changes to your profile</p>

            <div className="panel" style={{ marginBottom: 0 }}>
              <div className="hero-banner" />
              <div className="hero-body">
                <div style={{ display: "flex", alignItems: "flex-end", gap: 16 }}>
                  <div style={{ marginTop: "-48px", position: "relative", zIndex: 10 }} ref={menuRef}>
                    <div className="avatar-ring">
                      <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: "#5b5ef4", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 700, color: "#fff", overflow: "hidden" }}>
                        {displayAvatar ? <img src={displayAvatar} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : initials(profile.name)}
                      </div>
                    </div>
                    <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleAvatarChange} />
                    {editing && (
                      <button onClick={() => setShowAvatarMenu(v => !v)}
                        style={{ position: "absolute", bottom: 2, right: 2, width: 28, height: 28, borderRadius: "50%", background: "#5b5ef4", border: "2.5px solid #fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                        <Camera size={12} color="#fff" />
                      </button>
                    )}
                    {editing && showAvatarMenu && (
                      <div style={{ position: "absolute", top: "calc(100% + 8px)", left: 0, background: "#fff", border: "1px solid #e6e8f5", borderRadius: 12, boxShadow: "0 4px 20px rgba(0,0,0,0.12)", zIndex: 200, minWidth: 190, overflow: "hidden" }}>
                        <button onClick={() => fileRef.current?.click()} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", fontSize: 13, width: "100%", border: "none", background: "#fff", cursor: "pointer" }}>
                          <ImagePlus size={14} color="#5b5ef4" />{hasAvatar ? "Change Photo" : "Add Photo"}
                        </button>
                        {hasAvatar && (
                          <button onClick={handleDeleteAvatar} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", fontSize: 13, width: "100%", border: "none", background: "#fff", cursor: "pointer", color: "#e63b3b" }}>
                            <Trash2 size={14} color="#e63b3b" />Remove Photo
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                  <div style={{ paddingTop: 12 }}>
                    <p style={{ fontWeight: 800, fontSize: "clamp(16px, 3vw, 20px)", margin: "0 0 6px" }}>{profile.name || "Super Administrator"}</p>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "#eef0fe", color: "#5b5ef4", fontSize: 11.5, fontWeight: 600, padding: "4px 11px", borderRadius: 99 }}>
                      <Shield size={10} />{profile.role}
                    </span>
                  </div>
                </div>
                <div className="hero-actions">
                  {!editing ? (
                    <button onClick={() => setEditing(true)} style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "#5b5ef4", color: "#fff", border: "none", borderRadius: 9, padding: "9px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                      <Edit3 size={13} />Edit Profile
                    </button>
                  ) : (
                    <>
                      <button onClick={handleCancel} style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "#eff0f8", color: "#484b6e", border: "none", borderRadius: 9, padding: "9px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Cancel</button>
                      <button onClick={handleSave} disabled={saving} style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "#0ea86a", color: "#fff", border: "none", borderRadius: 9, padding: "9px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                        <Save size={13} />{saving ? "Saving…" : "Save Changes"}
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div style={{ display: "flex", borderTop: "1px solid #e6e8f5", gap: 1, background: "#e6e8f5" }}>
                {[["#0ea86a", "System Access", "Full Access"], ["#5b5ef4", "Global ID", `SA-${profile.email?.split("@")[0] || "001"}`]].map(([dot, label, val]) => (
                  <div key={label} style={{ flex: 1, background: "#fff", padding: "12px 20px", display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: dot, flexShrink: 0 }} />
                    <div>
                      <p style={{ fontSize: 10, fontWeight: 700, color: "#8e91b8", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 2px" }}>{label}</p>
                      <p style={{ fontSize: 13, fontWeight: 600, margin: 0 }}>{val}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="info-grid">
             
              <div className="panel">
                <div style={{ padding: "16px 22px", borderBottom: "1px solid #e6e8f5", background: "#f7f8fc", display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: "#eef0fe", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <User size={16} color="#5b5ef4" />
                  </div>
                  <p style={{ fontWeight: 700, fontSize: 14, margin: 0 }}>Master Identity</p>
                </div>
                <div style={{ padding: "20px 22px" }}>
                  {[{ key: "name", label: "Full Name", type: "text" }, { key: "email", label: "Email Address", type: "email" }, { key: "phone", label: "Direct Phone", type: "tel" }, { key: "department", label: "Department", type: "text" }].map(({ key, label, type }) => (
                    <div key={key} style={{ marginBottom: 18 }}>
                      <label style={{ display: "block", fontSize: 10.5, fontWeight: 700, color: "#8e91b8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 7 }}>{label}</label>
                      {editing ? (
                        <input className="field-input" type={type} value={draft[key] || ""} onChange={e => setDraft({ ...draft, [key]: e.target.value })} />
                      ) : (
                        <p style={{ fontSize: 13.5, fontWeight: 500, color: profile[key] ? "#111330" : "#8e91b8", fontStyle: profile[key] ? "normal" : "italic", margin: 0 }}>
                          {profile[key] || "Not provided"}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

             
              <div className="panel">
                <div style={{ padding: "16px 22px", borderBottom: "1px solid #e6e8f5", background: "#f7f8fc", display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: "#eef0fe", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Lock size={16} color="#5b5ef4" />
                  </div>
                  <p style={{ fontWeight: 700, fontSize: 14, margin: 0 }}>Change Password</p>
                </div>
                <div style={{ padding: "20px 22px" }}>
                  <form onSubmit={handlePasswordChange}>
                    {[{ key: "current", label: "Current Password" }, { key: "next", label: "New Password" }, { key: "confirm", label: "Confirm New Password" }].map(({ key, label }) => (
                      <div key={key} style={{ marginBottom: 18 }}>
                        <label style={{ display: "block", fontSize: 10.5, fontWeight: 700, color: "#8e91b8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 7 }}>{label}</label>
                        <div className="pw-wrap">
                          <input className="field-input" style={{ paddingRight: 38 }} type={showPw[key] ? "text" : "password"} value={pwForm[key]}
                            onChange={e => setPwForm({ ...pwForm, [key]: e.target.value })} placeholder={key === "next" ? "Min. 6 characters" : "••••••••"} />
                          <button type="button" className="pw-eye" onClick={() => setShowPw({ ...showPw, [key]: !showPw[key] })}>
                            {showPw[key] ? <EyeOff size={15} /> : <Eye size={15} />}
                          </button>
                        </div>
                      </div>
                    ))}
                    <button type="submit" disabled={pwSaving || !pwForm.current || !pwForm.next || !pwForm.confirm}
                      style={{ width: "100%", background: "#111330", color: "#fff", padding: 12, borderRadius: 9, border: "none", cursor: "pointer", fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 7, fontSize: 13.5, opacity: (pwSaving || !pwForm.current || !pwForm.next || !pwForm.confirm) ? 0.5 : 1 }}>
                      <Lock size={14} />{pwSaving ? "Updating…" : "Update Password"}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </PageContent>
      </div>

      {toast && (
        <div className={`toast-pop ${toast.type}`}>
          {toast.type === "success" ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          {toast.msg}
        </div>
      )}
    </>
  );
};

export default SuperAdminProfile;
