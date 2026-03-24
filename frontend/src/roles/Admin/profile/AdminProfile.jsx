import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../../../layouts/Sidebar";
import {
  Camera, Save, User, Mail, Phone, Shield,
  Lock, Eye, EyeOff, CheckCircle, AlertCircle,
  Edit3, Building2, Trash2, ImagePlus
} from "lucide-react";
import axios from "axios";

const API = process.env.REACT_APP_API_URL || "http://localhost:5001";

const AdminProfile = () => {
  const [profile, setProfile] = useState({
    name: "", email: "", phone: "", department: "",
    role: "Admin", joined: "", avatar: "",
  });
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

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await axios.get(`${API}/api/admin/profile`, { headers });
        const d = res.data.data || res.data;
        const p = {
          name: d.name || "", email: d.email || "", phone: d.phone || "",
          department: d.department || "Administration", role: d.role || "Admin",
          joined: d.joined_at || d.created_at || "", avatar: d.avatar || "",
        };
        setProfile(p); setDraft(p);
      } catch {
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          const p = {
            name: payload.name || "Administrator", email: payload.email || "",
            phone: payload.phone || "", department: payload.department || "Administration",
            role: "Admin", joined: "", avatar: "",
          };
          setProfile(p); setDraft(p);
        } catch {}
      }
    };
    loadProfile();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setShowAvatarMenu(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const initials = (name) =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) { showToast("Image must be under 3MB", "error"); return; }
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setAvatarPreview(ev.target.result);
    reader.readAsDataURL(file);
    setShowAvatarMenu(false);
  };

  const handleDeleteAvatar = async () => {
    setShowAvatarMenu(false);
    if (!profile.avatar && avatarPreview) {
      setAvatarPreview(null); setAvatarFile(null); showToast("Photo removed"); return;
    }
    if (!profile.avatar) { showToast("No photo to remove", "error"); return; }
    try {
      await axios.delete(`${API}/api/admin/avatar`, { headers });
      setProfile((prev) => ({ ...prev, avatar: "" }));
      setAvatarPreview(null); setAvatarFile(null);
      showToast("Profile photo removed successfully");
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to remove photo", "error");
    }
  };

  const handleSave = async () => {
    if (!draft.name.trim() || !draft.email.trim()) {
      showToast("Name and email are required", "error"); return;
    }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("name", draft.name); fd.append("email", draft.email);
      fd.append("phone", draft.phone); fd.append("department", draft.department);
      if (avatarFile) fd.append("avatar", avatarFile);
      await axios.put(`${API}/api/admin/profile`, fd, {
        headers: { ...headers, "Content-Type": "multipart/form-data" },
      });
      const updated = { ...draft, avatar: avatarPreview || profile.avatar };
      setProfile(updated); setEditing(false); setAvatarFile(null); setShowAvatarMenu(false);
      showToast("Profile updated successfully");
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to save", "error");
    } finally { setSaving(false); }
  };

  const handleCancel = () => {
    setDraft(profile); setAvatarPreview(null); setAvatarFile(null);
    setShowAvatarMenu(false); setEditing(false);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (pwForm.next !== pwForm.confirm) { showToast("Passwords do not match", "error"); return; }
    if (pwForm.next.length < 6) { showToast("Password must be at least 6 characters", "error"); return; }
    setPwSaving(true);
    try {
      await axios.put(`${API}/api/admin/change-password`,
        { current_password: pwForm.current, new_password: pwForm.next }, { headers });
      setPwForm({ current: "", next: "", confirm: "" });
      showToast("Password changed successfully");
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to change password", "error");
    } finally { setPwSaving(false); }
  };

  const displayAvatar = avatarPreview || profile.avatar;
  const hasAvatar = !!displayAvatar;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,500;12..96,600;12..96,700;12..96,800&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --indigo:        #5b5ef4;
          --indigo-dark:   #4344d4;
          --indigo-xdark:  #3333b0;
          --indigo-light:  #eef0fe;
          --indigo-glow:   rgba(91,94,244,0.16);
          --green:         #0ea86a;
          --green-light:   #e6f9f2;
          --red:           #e63b3b;
          --red-light:     #fff0f0;
          --amber:         #f59e0b;
          --surface:       #ffffff;
          --surface-2:     #f7f8fc;
          --surface-3:     #eff0f8;
          --border:        #e6e8f5;
          --border-2:      #d4d6ed;
          --text-1:        #111330;
          --text-2:        #484b6e;
          --text-3:        #8e91b8;
          --shadow-xs:     0 1px 2px rgba(17,19,48,0.05);
          --shadow-sm:     0 1px 4px rgba(17,19,48,0.07), 0 1px 2px rgba(17,19,48,0.04);
          --shadow-md:     0 4px 18px rgba(17,19,48,0.09), 0 2px 6px rgba(17,19,48,0.05);
          --shadow-lg:     0 12px 44px rgba(17,19,48,0.13), 0 4px 14px rgba(17,19,48,0.07);
          --shadow-indigo: 0 6px 22px rgba(91,94,244,0.28);
          --radius-sm:     9px;
          --radius-md:     14px;
          --radius-lg:     20px;
          --radius-xl:     26px;
          --font-display:  'Bricolage Grotesque', sans-serif;
          --font-body:     'Plus Jakarta Sans', sans-serif;
        }

        /* ── Layout ─────────────────────────────────────────── */
        .pr-root {
          display: flex;
          background: var(--surface-2);
          min-height: 100vh;
          font-family: var(--font-body);
          color: var(--text-1);
        }

        .pr-main {
          margin-left: 250px;
          flex: 1;
          padding: 42px 48px 64px;
          max-width: 1140px;
        }

        /* ── Page header ────────────────────────────────────── */
        .pr-header { margin-bottom: 32px; }

        .pr-eyebrow {
          display: inline-flex; align-items: center; gap: 6px;
          background: var(--indigo-light);
          color: var(--indigo);
          font-size: 10.5px; font-weight: 700;
          letter-spacing: 0.1em; text-transform: uppercase;
          padding: 4px 12px; border-radius: 99px;
          border: 1px solid rgba(91,94,244,0.18);
          margin-bottom: 10px;
        }

        .pr-title {
          font-family: var(--font-display);
          font-size: 30px; font-weight: 800;
          color: var(--text-1); letter-spacing: -0.7px;
          line-height: 1.12; margin-bottom: 5px;
        }

        .pr-sub { color: var(--text-3); font-size: 14px; font-weight: 400; }

        /* ── Hero card ──────────────────────────────────────── */
        .hero-card {
          background: var(--surface);
          border-radius: var(--radius-xl);
          border: 1px solid var(--border);
          box-shadow: var(--shadow-md);
          overflow: hidden;
          margin-bottom: 26px;
        }

        .hero-banner {
          height: 128px;
          border-radius: 0;
          background:
            radial-gradient(ellipse at 15% 60%, rgba(147,112,255,0.55) 0%, transparent 55%),
            radial-gradient(ellipse at 85% 15%, rgba(59,130,246,0.38) 0%, transparent 52%),
            radial-gradient(ellipse at 55% 90%, rgba(91,94,244,0.5)  0%, transparent 48%),
            linear-gradient(130deg, #3436c4 0%, #5558f0 48%, #7879ff 100%);
          position: relative; overflow: hidden;
        }

        /* dot-grid texture */
        .hero-banner::before {
          content: '';
          position: absolute; inset: 0;
          background-image: radial-gradient(circle, rgba(255,255,255,0.16) 1px, transparent 1px);
          background-size: 20px 20px;
        }

        /* glowing orb top-right */
        .hero-banner::after {
          content: '';
          position: absolute;
          width: 240px; height: 240px; border-radius: 50%;
          background: radial-gradient(circle, rgba(255,255,255,0.1), transparent 68%);
          top: -80px; right: 60px; pointer-events: none;
        }

        .hero-body {
          padding: 0 32px 28px;
          display: flex; align-items: flex-end;
          justify-content: space-between; gap: 16px;
        }

        .hero-left { display: flex; align-items: flex-end; gap: 20px; }

        /* ── Avatar ─────────────────────────────────────────── */
        .avatar-wrap {
          margin-top: -54px;
          position: relative; flex-shrink: 0; z-index: 10;
        }

        .avatar-ring {
          width: 104px; height: 104px; border-radius: 50%;
          padding: 4px;
          background: linear-gradient(145deg, #ffffff 0%, #e8eaf6 100%);
          box-shadow: var(--shadow-lg), 0 0 0 1px rgba(91,94,244,0.12);
        }

        .avatar-circle {
          width: 100%; height: 100%; border-radius: 50%;
          background: linear-gradient(140deg, #7c7fff 0%, #5b5ef4 50%, #4344d4 100%);
          display: flex; align-items: center; justify-content: center;
          font-family: var(--font-display);
          font-size: 32px; font-weight: 700; color: #fff;
          overflow: hidden; user-select: none; position: relative;
        }

        .avatar-circle img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; }

        /* inner highlight */
        .avatar-circle::after {
          content: '';
          position: absolute; inset: 0; border-radius: 50%;
          background: linear-gradient(140deg, rgba(255,255,255,0.18) 0%, transparent 55%);
          pointer-events: none;
        }

        /* camera trigger badge */
        .avatar-edit-trigger {
          position: absolute; bottom: 3px; right: 3px;
          width: 30px; height: 30px; border-radius: 50%;
          background: var(--indigo);
          border: 2.5px solid #fff;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          box-shadow: var(--shadow-indigo);
          transition: background 0.2s, transform 0.18s, box-shadow 0.2s;
          z-index: 12;
        }
        .avatar-edit-trigger:hover {
          background: var(--indigo-dark);
          transform: scale(1.12);
          box-shadow: 0 8px 28px rgba(91,94,244,0.38);
        }

        /* ── Avatar dropdown ────────────────────────────────── */
        .avatar-menu {
          position: absolute; top: calc(100% + 10px); left: 0;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-lg);
          z-index: 200; min-width: 205px;
          overflow: hidden;
          animation: menuPop 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        @keyframes menuPop {
          from { opacity: 0; transform: translateY(-8px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0)   scale(1);    }
        }

        .avatar-menu-header {
          padding: 10px 15px 9px;
          font-size: 10px; font-weight: 700;
          color: var(--text-3); text-transform: uppercase; letter-spacing: 0.09em;
          border-bottom: 1px solid var(--border);
          background: var(--surface-2);
        }

        .avatar-menu-item {
          display: flex; align-items: center; gap: 11px;
          padding: 11px 15px; font-size: 13.5px; font-weight: 500;
          color: var(--text-2); cursor: pointer; border: none;
          background: none; width: 100%; font-family: var(--font-body);
          transition: background 0.13s, color 0.13s; text-align: left;
        }
        .avatar-menu-item:hover { background: var(--surface-2); color: var(--text-1); }
        .avatar-menu-item.danger { color: var(--red); }
        .avatar-menu-item.danger:hover { background: var(--red-light); }

        .avatar-menu-divider { height: 1px; background: var(--border); margin: 2px 0; }

        .ami-icon {
          width: 30px; height: 30px; border-radius: 8px;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .ami-add  { background: var(--indigo-light); }
        .ami-edit { background: var(--green-light); }
        .ami-del  { background: var(--red-light); }

        /* ── Hero info ──────────────────────────────────────── */
        .hero-info { padding-top: 20px; }

        .hero-name {
          font-family: var(--font-display);
          font-size: 22px; font-weight: 800;
          color: var(--text-1); letter-spacing: -0.5px; margin-bottom: 8px;
        }

        .hero-badges { display: flex; align-items: center; gap: 7px; flex-wrap: wrap; }

        .badge {
          display: inline-flex; align-items: center; gap: 5px;
          font-size: 11.5px; font-weight: 600;
          padding: 4px 11px; border-radius: 99px;
          border: 1px solid transparent;
        }
        .badge-role { background: var(--indigo-light); color: var(--indigo); border-color: rgba(91,94,244,0.22); }
        .badge-dept { background: var(--surface-3); color: var(--text-2); border-color: var(--border-2); }

        /* ── Hero actions ───────────────────────────────────── */
        .hero-actions { display: flex; gap: 10px; padding-top: 20px; flex-shrink: 0; }

        .btn {
          display: inline-flex; align-items: center; gap: 7px;
          border: none; border-radius: var(--radius-sm);
          padding: 10px 20px; font-size: 13.5px; font-weight: 600;
          cursor: pointer; font-family: var(--font-body);
          transition: all 0.18s ease; white-space: nowrap; letter-spacing: 0.01em;
        }
        .btn-primary {
          background: var(--indigo); color: #fff; box-shadow: var(--shadow-indigo);
        }
        .btn-primary:hover { background: var(--indigo-dark); transform: translateY(-1px); box-shadow: 0 8px 26px rgba(91,94,244,0.35); }

        .btn-success {
          background: var(--green); color: #fff;
          box-shadow: 0 4px 16px rgba(14,168,106,0.26);
        }
        .btn-success:hover:not(:disabled) { background: #0a9460; transform: translateY(-1px); }
        .btn-success:disabled { opacity: 0.52; cursor: not-allowed; transform: none; box-shadow: none; }

        .btn-ghost {
          background: var(--surface-3); color: var(--text-2);
          border: 1px solid var(--border-2);
        }
        .btn-ghost:hover { background: var(--border); color: var(--text-1); }

        /* ── Stat strip ─────────────────────────────────────── */
        .stat-strip {
          display: flex; gap: 1px;
          background: var(--border);
          border-top: 1px solid var(--border);
        }

        .stat-item {
          flex: 1; background: var(--surface);
          padding: 14px 22px;
          display: flex; align-items: center; gap: 13px;
        }

        .stat-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
        .stat-label { font-size: 10.5px; font-weight: 700; color: var(--text-3); text-transform: uppercase; letter-spacing: 0.07em; margin-bottom: 2px; }
        .stat-val   { font-size: 13.5px; font-weight: 600; color: var(--text-1); }

        /* ── Grid ───────────────────────────────────────────── */
        .info-grid {
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          gap: 24px; align-items: start;
        }

        /* ── Panel ──────────────────────────────────────────── */
        .panel {
          background: var(--surface);
          border-radius: var(--radius-lg);
          border: 1px solid var(--border);
          box-shadow: var(--shadow-sm);
          overflow: hidden;
          transition: box-shadow 0.22s, transform 0.22s;
        }
        .panel:hover { box-shadow: var(--shadow-md); }

        .panel-head {
          padding: 18px 24px;
          border-bottom: 1px solid var(--border);
          display: flex; align-items: center; gap: 13px;
          background: linear-gradient(180deg, var(--surface) 0%, var(--surface-2) 100%);
        }

        .panel-icon {
          width: 37px; height: 37px; border-radius: 10px;
          background: var(--indigo-light);
          border: 1px solid rgba(91,94,244,0.14);
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }

        .panel-title {
          font-family: var(--font-display);
          font-size: 14px; font-weight: 700; color: var(--text-1); letter-spacing: -0.2px;
        }
        .panel-subtitle { font-size: 11.5px; color: var(--text-3); margin-top: 1px; }

        .panel-body { padding: 24px; }

        /* ── Fields ─────────────────────────────────────────── */
        .field-group { margin-bottom: 20px; }
        .field-group:last-child { margin-bottom: 0; }

        .field-label {
          display: block; font-size: 10.5px; font-weight: 700;
          color: var(--text-3); text-transform: uppercase;
          letter-spacing: 0.09em; margin-bottom: 7px;
        }

        .field-value {
          font-size: 14.5px; color: var(--text-1); font-weight: 500; padding: 3px 0;
        }
        .field-value.empty { color: var(--text-3); font-style: italic; font-weight: 400; }

        .field-input {
          width: 100%;
          border: 1.5px solid var(--border-2);
          border-radius: var(--radius-sm);
          padding: 10px 14px; font-size: 13.5px; color: var(--text-1);
          font-family: var(--font-body); font-weight: 500; outline: none;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
          background: var(--surface-2);
        }
        .field-input::placeholder { color: var(--text-3); font-weight: 400; }
        .field-input:focus {
          border-color: var(--indigo);
          box-shadow: 0 0 0 3px var(--indigo-glow);
          background: var(--surface);
        }

        /* ── Password ───────────────────────────────────────── */
        .pw-wrap { position: relative; }
        .pw-wrap .field-input { padding-right: 44px; }

        .pw-eye {
          position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
          background: none; border: none; cursor: pointer; color: var(--text-3);
          display: flex; align-items: center; padding: 3px;
          border-radius: 5px; transition: color 0.18s;
        }
        .pw-eye:hover { color: var(--indigo); }

        .pw-strength { height: 4px; border-radius: 99px; background: var(--border); margin-top: 7px; overflow: hidden; }
        .pw-strength-fill { height: 100%; border-radius: 99px; transition: width 0.3s ease, background 0.3s; }

        .btn-pw {
          width: 100%; background: var(--text-1); color: #fff;
          border: none; border-radius: var(--radius-sm);
          padding: 12px; font-size: 14px; font-weight: 600;
          cursor: pointer; font-family: var(--font-body);
          transition: background 0.2s, transform 0.18s, box-shadow 0.2s;
          margin-top: 12px;
          display: flex; align-items: center; justify-content: center; gap: 7px;
          box-shadow: 0 4px 16px rgba(17,19,48,0.2); letter-spacing: 0.01em;
        }
        .btn-pw:hover:not(:disabled) { background: #1c1e52; transform: translateY(-1px); box-shadow: 0 8px 26px rgba(17,19,48,0.26); }
        .btn-pw:disabled { opacity: 0.48; cursor: not-allowed; transform: none; box-shadow: none; }

        /* ── Meta rows ──────────────────────────────────────── */
        .meta-row {
          display: flex; align-items: center; gap: 13px;
          padding: 13px 0; border-bottom: 1px solid var(--surface-2);
        }
        .meta-row:last-child { border-bottom: none; padding-bottom: 0; }
        .meta-row:first-child { padding-top: 0; }

        .meta-icon-box {
          width: 35px; height: 35px; border-radius: 9px;
          background: var(--indigo-light);
          border: 1px solid rgba(91,94,244,0.12);
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }

        .meta-label { font-size: 10.5px; font-weight: 700; color: var(--text-3); text-transform: uppercase; letter-spacing: 0.07em; margin-bottom: 3px; }
        .meta-val   { font-size: 13.5px; font-weight: 600; color: var(--text-1); }

        /* ── Toast ──────────────────────────────────────────── */
        .toast-pop {
          position: fixed; bottom: 32px; right: 32px;
          padding: 14px 20px; border-radius: var(--radius-md);
          font-size: 13.5px; font-weight: 600;
          display: flex; align-items: center; gap: 10px;
          box-shadow: var(--shadow-lg); z-index: 9999;
          animation: toastIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          max-width: 360px; border: 1px solid transparent;
        }
        .toast-pop.success { background: #0b2e1e; color: #6ee7b7; border-color: rgba(110,231,183,0.14); }
        .toast-pop.error   { background: #2e0b0b; color: #fca5a5; border-color: rgba(252,165,165,0.14); }

        @keyframes toastIn {
          from { opacity: 0; transform: translateY(16px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }

        /* ── Responsive ─────────────────────────────────────── */
        @media (max-width: 980px) {
          .info-grid { grid-template-columns: 1fr; }
          .pr-main { padding: 22px 18px 48px; margin-left: 0; }
          .hero-body { flex-direction: column; align-items: flex-start; }
          .hero-actions { padding-top: 0; }
          .stat-strip { flex-direction: column; gap: 0; }
          .stat-item { border-bottom: 1px solid var(--border); }
          .stat-item:last-child { border-bottom: none; }
        }
      `}</style>

      <div className="pr-root">
        <Sidebar />

        <div className="pr-main">

          {/* ── Page header ── */}
          <div className="pr-header">
            <div className="pr-eyebrow"><Shield size={10} />Admin Portal</div>
            <h1 className="pr-title">My Profile</h1>
            <p className="pr-sub">Manage your account information and security settings</p>
          </div>

          {/* ── Hero card ── */}
          <div className="hero-card">
            <div className="hero-banner" />

            <div className="hero-body">
              <div className="hero-left">

                {/* Avatar with menu */}
                <div className="avatar-wrap" ref={menuRef}>
                  <div className="avatar-ring">
                    <div className="avatar-circle">
                      {displayAvatar
                        ? <img src={displayAvatar} alt="avatar" />
                        : initials(profile.name || "A")}
                    </div>
                  </div>

                  <input ref={fileRef} type="file" accept="image/*"
                    style={{ display: "none" }} onChange={handleAvatarChange} />

                  {editing && (
                    <button className="avatar-edit-trigger"
                      onClick={() => setShowAvatarMenu((v) => !v)} title="Photo options">
                      <Camera size={13} color="#fff" />
                    </button>
                  )}

                  {editing && showAvatarMenu && (
                    <div className="avatar-menu">
                      <div className="avatar-menu-header">Photo options</div>

                      {!hasAvatar && (
                        <button className="avatar-menu-item"
                          onClick={() => { fileRef.current?.click(); setShowAvatarMenu(false); }}>
                          <span className="ami-icon ami-add"><ImagePlus size={14} color="var(--indigo)" /></span>
                          Add Photo
                        </button>
                      )}

                      {hasAvatar && (
                        <button className="avatar-menu-item"
                          onClick={() => { fileRef.current?.click(); setShowAvatarMenu(false); }}>
                          <span className="ami-icon ami-edit"><Camera size={14} color="var(--green)" /></span>
                          Change Photo
                        </button>
                      )}

                      {hasAvatar && (
                        <>
                          <div className="avatar-menu-divider" />
                          <button className="avatar-menu-item danger" onClick={handleDeleteAvatar}>
                            <span className="ami-icon ami-del"><Trash2 size={14} color="var(--red)" /></span>
                            Remove Photo
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Name + badges */}
                <div className="hero-info">
                  <p className="hero-name">{profile.name || "Administrator"}</p>
                  <div className="hero-badges">
                    <span className="badge badge-role"><Shield size={10} />{profile.role}</span>
                    {profile.department && (
                      <span className="badge badge-dept"><Building2 size={10} />{profile.department}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="hero-actions">
                {!editing ? (
                  <button className="btn btn-primary" onClick={() => setEditing(true)}>
                    <Edit3 size={14} />Edit Profile
                  </button>
                ) : (
                  <>
                    <button className="btn btn-ghost" onClick={handleCancel}>Cancel</button>
                    <button className="btn btn-success" onClick={handleSave} disabled={saving}>
                      <Save size={14} />{saving ? "Saving…" : "Save Changes"}
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Stat strip */}
            <div className="stat-strip">
              <div className="stat-item">
                <span className="stat-dot" style={{ background: "var(--green)" }} />
                <div><p className="stat-label">Status</p><p className="stat-val">Active</p></div>
              </div>
              <div className="stat-item">
                <span className="stat-dot" style={{ background: "var(--indigo)" }} />
                <div><p className="stat-label">Email</p><p className="stat-val">{profile.email || "—"}</p></div>
              </div>
              {profile.joined && (
                <div className="stat-item">
                  <span className="stat-dot" style={{ background: "var(--amber)" }} />
                  <div>
                    <p className="stat-label">Member Since</p>
                    <p className="stat-val">
                      {new Date(profile.joined).toLocaleDateString("en-IN", { year: "numeric", month: "short" })}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── Info grid ── */}
          <div className="info-grid">

            {/* Personal info */}
            <div className="panel">
              <div className="panel-head">
                <div className="panel-icon"><User size={16} color="var(--indigo)" /></div>
                <div>
                  <p className="panel-title">Personal Information</p>
                  <p className="panel-subtitle">Your public profile details</p>
                </div>
              </div>
              <div className="panel-body">
                {[
                  { key: "name",       label: "Full Name",     type: "text",  ph: "Your full name"      },
                  { key: "email",      label: "Email Address", type: "email", ph: "admin@company.com"   },
                  { key: "phone",      label: "Phone Number",  type: "tel",   ph: "+91 9XXXXXXXXX"      },
                  { key: "department", label: "Department",    type: "text",  ph: "e.g. Administration" },
                ].map(({ key, label, type, ph }) => (
                  <div className="field-group" key={key}>
                    <label className="field-label">{label}</label>
                    {editing ? (
                      <input className="field-input" type={type}
                        value={draft[key] || ""}
                        onChange={(e) => setDraft({ ...draft, [key]: e.target.value })}
                        placeholder={ph} />
                    ) : (
                      <p className={`field-value ${!profile[key] ? "empty" : ""}`}>
                        {profile[key] || "Not set"}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Right column */}
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

              {/* Account details */}
              <div className="panel">
                <div className="panel-head">
                  <div className="panel-icon"><Building2 size={16} color="var(--indigo)" /></div>
                  <div>
                    <p className="panel-title">Account Details</p>
                    <p className="panel-subtitle">Role and contact summary</p>
                  </div>
                </div>
                <div className="panel-body">
                  {[
                    { icon: <Shield size={15} color="var(--indigo)" />, label: "Role",  val: profile.role },
                    { icon: <Mail   size={15} color="var(--indigo)" />, label: "Email", val: profile.email || "—" },
                    { icon: <Phone  size={15} color="var(--indigo)" />, label: "Phone", val: profile.phone || "—" },
                    ...(profile.joined ? [{
                      icon: <CheckCircle size={15} color="var(--indigo)" />,
                      label: "Member Since",
                      val: new Date(profile.joined).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" }),
                    }] : []),
                  ].map(({ icon, label, val }) => (
                    <div className="meta-row" key={label}>
                      <div className="meta-icon-box">{icon}</div>
                      <div><p className="meta-label">{label}</p><p className="meta-val">{val}</p></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Change password */}
              <div className="panel">
                <div className="panel-head">
                  <div className="panel-icon"><Lock size={16} color="var(--indigo)" /></div>
                  <div>
                    <p className="panel-title">Change Password</p>
                    <p className="panel-subtitle">Keep your account secure</p>
                  </div>
                </div>
                <div className="panel-body">
                  <form onSubmit={handlePasswordChange}>
                    {[
                      { key: "current", label: "Current Password",    ph: "Enter current password" },
                      { key: "next",    label: "New Password",         ph: "Min. 6 characters"      },
                      { key: "confirm", label: "Confirm New Password", ph: "Repeat new password"    },
                    ].map(({ key, label, ph }) => (
                      <div className="field-group" key={key}>
                        <label className="field-label">{label}</label>
                        <div className="pw-wrap">
                          <input className="field-input"
                            type={showPw[key] ? "text" : "password"}
                            placeholder={ph} value={pwForm[key]}
                            onChange={(e) => setPwForm({ ...pwForm, [key]: e.target.value })} />
                          <button type="button" className="pw-eye"
                            onClick={() => setShowPw({ ...showPw, [key]: !showPw[key] })}>
                            {showPw[key] ? <EyeOff size={15} /> : <Eye size={15} />}
                          </button>
                        </div>
                        {key === "next" && pwForm.next && (
                          <div className="pw-strength">
                            <div className="pw-strength-fill" style={{
                              width:      pwForm.next.length >= 10 ? "100%" : pwForm.next.length >= 7 ? "66%" : "33%",
                              background: pwForm.next.length >= 10 ? "var(--green)" : pwForm.next.length >= 7 ? "var(--amber)" : "var(--red)",
                            }} />
                          </div>
                        )}
                      </div>
                    ))}
                    <button type="submit" className="btn-pw"
                      disabled={pwSaving || !pwForm.current || !pwForm.next || !pwForm.confirm}>
                      <Lock size={14} />{pwSaving ? "Updating…" : "Update Password"}
                    </button>
                  </form>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`toast-pop ${toast.type}`}>
          {toast.type === "success" ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          {toast.msg}
        </div>
      )}
    </>
  );
};

export default AdminProfile;