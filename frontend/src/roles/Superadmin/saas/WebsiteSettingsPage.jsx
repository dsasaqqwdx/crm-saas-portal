
import React, { useState, useEffect } from "react";
import Sidebar from "../../../layouts/Sidebar";
import { PageContent } from "../../../layouts/usePageLayout"; // Using the layout wrapper
import axios from "axios";
import { Layout, Type, Phone, Tag, Star, ChevronRight, Save, CheckCircle, AlertCircle, Upload, Menu } from "lucide-react";

const API = process.env.REACT_APP_API_URL || "http://localhost:5001";

const DEFAULTS = {
  header: {
    appName: "Shnoor International LLC SAAS",
    title: "Next Generation HR Management For Your Company",
    subtitle: "Grow Your Business With SHNOOR INTERNATIONAL LLC",
    description: "Best-rated HR management application for small to large scale business.",
    btn1Text: "Get Started", btn1Url: "/register",
    btn2Text: "View Features", btn2Url: "/features",
    showBtn1: "true", showBtn2: "true",
  },
  footer: {
    companyName: "Shnoor International LLC",
    tagline: "Next-gen HR management for modern businesses.",
    email: "support@shnoor.com", phone: "+91 98765 43210",
    address: "Business Bay, Dubai / Kuppam, India",
    copyright: "2025 Shnoor International LLC. All rights reserved.",
    logo: "",
  },
  contact: {
    title: "Get in Touch",
    subtitle: "Have questions about our HR modules? Our team is ready to help.",
    email: "support@shnoor.com", phone: "+91 98765 43210",
    address: "Business Bay, Dubai / Kuppam, India",
  },
  pricing: {
    title: "Simple, Scalable Pricing",
    subtitle: "Choose the plan that fits your company's growth.",
    plan1Name: "Basic", plan1Price: "10",
    plan2Name: "Pro", plan2Price: "25",
    plan3Name: "Enterprise", plan3Price: "50",
  },
  features: {
    title: "Platform Capabilities",
    subtitle: "Everything you need to manage a modern workforce efficiently.",
  },
};

const navItems = [
  { key: "header", label: "Header", icon: <Layout size={15} /> },
  { key: "footer", label: "Footer", icon: <Type size={15} /> },
  { key: "contact", label: "Contact", icon: <Phone size={15} /> },
  { key: "pricing", label: "Pricing", icon: <Tag size={15} /> },
  { key: "features", label: "Features", icon: <Star size={15} /> },
];

// --- Styled Components Replacements ---
const inputCls = {
  display: "block", width: "100%", padding: "10px 12px",
  border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 14,
  outline: "none", background: "#fff", color: "#1e293b", transition: "all 0.2s",
};

const labelCls = {
  fontSize: 11, fontWeight: 700, color: "#64748b",
  textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6, display: "block",
};

const sectionDivider = {
  fontSize: 11, fontWeight: 700, color: "#4f46e5", textTransform: "uppercase",
  letterSpacing: "0.08em", borderBottom: "1px solid #e0e7ff", paddingBottom: 6, marginBottom: 16, marginTop: 12,
};

// --- Form Components ---
function Field({ label, name, value, onChange, type = "text", rows }) {
  return (
    <div className="mb-3">
      <label style={labelCls}>{label}</label>
      {rows ? (
        <textarea name={name} value={value || ""} onChange={onChange} rows={rows}
          style={{ ...inputCls, resize: "vertical", lineHeight: 1.5 }}
          onFocus={e => e.target.style.borderColor = "#4f46e5"}
          onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
      ) : (
        <input type={type} name={name} value={value || ""} onChange={onChange} style={inputCls}
          onFocus={e => e.target.style.borderColor = "#4f46e5"}
          onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
      )}
    </div>
  );
}

function Toggle({ label, name, value, onChange }) {
  const isOn = value === "true" || value === true;
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, padding: "12px 14px", background: "#f8fafc", borderRadius: 8, border: "1px solid #e2e8f0" }}>
      <span style={{ fontSize: 14, color: "#374151", fontWeight: 500 }}>{label}</span>
      <div onClick={() => onChange({ target: { name, value: isOn ? "false" : "true" } })}
        style={{ width: 44, height: 24, borderRadius: 12, cursor: "pointer", background: isOn ? "#4f46e5" : "#cbd5e1", position: "relative", transition: "0.2s" }}>
        <div style={{ position: "absolute", top: 3, left: isOn ? 23 : 3, width: 18, height: 18, borderRadius: "50%", background: "#fff", transition: "0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
      </div>
    </div>
  );
}

function LogoUpload({ currentLogo, onChange }) {
  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { alert("Logo must be under 2MB"); return; }
    const reader = new FileReader();
    reader.onload = () => onChange({ target: { name: "logo", value: reader.result } });
    reader.readAsDataURL(file);
  };
  return (
    <div className="mb-4">
      <label style={labelCls}>Logo Image</label>
      <div className="d-flex align-items-center gap-3">
        {currentLogo ? (
          <img src={currentLogo} alt="logo" style={{ width: 64, height: 64, objectFit: "contain", borderRadius: 8, border: "1px solid #e2e8f0", padding: 4 }} />
        ) : (
          <div style={{ width: 64, height: 64, borderRadius: 8, background: "#f1f5f9", border: "2px dashed #cbd5e1", display: "flex", alignItems: "center", justifyContent: "center" }}><Upload size={20} color="#94a3b8" /></div>
        )}
        <div>
          <label className="btn btn-sm btn-outline-primary mb-1" style={{ cursor: "pointer" }}>
            <Upload size={14} className="me-1" /> {currentLogo ? "Change" : "Upload"}
            <input type="file" accept="image/*" onChange={handleFile} style={{ display: "none" }} />
          </label>
          <div style={{ fontSize: 11, color: "#94a3b8" }}>Max 2MB (PNG/JPG)</div>
        </div>
      </div>
    </div>
  );
}

// --- Specific Forms ---
const HeaderForm = ({ data, onChange }) => (
  <>
    <div style={sectionDivider}>App Identity</div>
    <Field label="App Name" name="appName" value={data.appName} onChange={onChange} />
    <div style={sectionDivider}>Hero Section</div>
    <Field label="Title" name="title" value={data.title} onChange={onChange} />
    <Field label="Subtitle" name="subtitle" value={data.subtitle} onChange={onChange} />
    <Field label="Description" name="description" value={data.description} onChange={onChange} rows={3} />
    <div className="row g-3">
      <div className="col-12 col-md-6">
        <Toggle label="Show Button 1" name="showBtn1" value={data.showBtn1} onChange={onChange} />
        <Field label="Btn 1 Text" name="btn1Text" value={data.btn1Text} onChange={onChange} />
      </div>
      <div className="col-12 col-md-6">
        <Toggle label="Show Button 2" name="showBtn2" value={data.showBtn2} onChange={onChange} />
        <Field label="Btn 2 Text" name="btn2Text" value={data.btn2Text} onChange={onChange} />
      </div>
    </div>
  </>
);

const FooterForm = ({ data, onChange }) => (
  <>
    <LogoUpload currentLogo={data.logo} onChange={onChange} />
    <Field label="Company Name" name="companyName" value={data.companyName} onChange={onChange} />
    <Field label="Tagline" name="tagline" value={data.tagline} onChange={onChange} />
    <div className="row g-3">
      <div className="col-md-6"><Field label="Email" name="email" value={data.email} onChange={onChange} /></div>
      <div className="col-md-6"><Field label="Phone" name="phone" value={data.phone} onChange={onChange} /></div>
    </div>
    <Field label="Address" name="address" value={data.address} onChange={onChange} />
    <Field label="Copyright Text" name="copyright" value={data.copyright} onChange={onChange} />
  </>
);

const PricingForm = ({ data, onChange }) => (
  <>
    <Field label="Main Title" name="title" value={data.title} onChange={onChange} />
    {[1, 2, 3].map(num => (
      <div key={num} className="mt-3">
        <div style={sectionDivider}>Plan {num} Settings</div>
        <div className="row g-3">
          <div className="col-8"><Field label="Plan Name" name={`plan${num}Name`} value={data[`plan${num}Name`]} onChange={onChange} /></div>
          <div className="col-4"><Field label="Price ($)" name={`plan${num}Price`} value={data[`plan${num}Price`]} onChange={onChange} type="number" /></div>
        </div>
      </div>
    ))}
  </>
);

const FORMS = { header: HeaderForm, footer: FooterForm, pricing: PricingForm };

export default function WebsiteSettingsPage() {
  const [activeSection, setActiveSection] = useState("header");
  const [allData, setAllData] = useState({});
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const token = localStorage.getItem("token");
  const headers = { "x-auth-token": token };

  useEffect(() => {
    axios.get(`${API}/api/website-settings`, { headers })
      .then(res => {
        const fetched = res.data.data || {};
        const merged = {};
        Object.keys(DEFAULTS).forEach(s => { merged[s] = { ...DEFAULTS[s], ...(fetched[s] || {}) }; });
        setAllData(merged);
      })
      .catch(() => setAllData(DEFAULTS));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAllData(p => ({ ...p, [activeSection]: { ...p[activeSection], [name]: value } }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.put(`${API}/api/website-settings/${activeSection}`, allData[activeSection], { headers });
      setToast({ message: "Settings Updated!", type: "success" });
    } catch {
      setToast({ message: "Update Failed", type: "error" });
    } finally {
      setSaving(false);
      setTimeout(() => setToast(null), 3000);
    }
  };

  const ActiveForm = FORMS[activeSection] || (({ data, onChange }) => (
    <>
      <Field label="Title" name="title" value={data.title} onChange={onChange} />
      <Field label="Subtitle" name="subtitle" value={data.subtitle} onChange={onChange} rows={2} />
    </>
  ));

  return (
    <div className="d-flex bg-light min-vh-100">
      <Sidebar />
      <PageContent>
        {/* Toast Notification */}
        {toast && (
          <div style={{ position: "fixed", top: 20, right: 20, zInterx: 9999, background: toast.type === "error" ? "#ef4444" : "#10b981", color: "#fff", padding: "12px 20px", borderRadius: 8, display: "flex", alignItems: "center", gap: 8, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
            {toast.type === "success" ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
            {toast.message}
          </div>
        )}

        {/* Header / Breadcrumb */}
        <div className="bg-white border-bottom p-3 d-flex align-items-center gap-2">
          <span className="text-muted small">Dashboard</span>
          <ChevronRight size={12} className="text-muted" />
          <span className="fw-bold text-primary small">Website Settings</span>
        </div>

        <div className="container-fluid p-3 p-md-4">
          <div className="row g-4">
            
            {/* Nav Column */}
            <div className="col-12 col-lg-3">
              <div className="card border-0 shadow-sm overflow-hidden" style={{ borderRadius: 12 }}>
                <div className="d-flex d-lg-block overflow-auto">
                  {navItems.map(item => {
                    const active = item.key === activeSection;
                    return (
                      <button key={item.key} onClick={() => setActiveSection(item.key)}
                        style={{ display: "flex", alignItems: "center", gap: 10, flex: "1 0 auto", width: "100%", padding: "12px 20px", border: "none", borderLeft: active ? "4px solid #4f46e5" : "4px solid transparent", background: active ? "#f5f3ff" : "transparent", color: active ? "#4f46e5" : "#64748b", fontWeight: active ? 600 : 500, fontSize: 14, textAlign: "left" }}>
                        {item.icon} {item.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Form Column */}
            <div className="col-12 col-lg-9">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="fw-bold mb-0" style={{ color: "#1e293b" }}>{navItems.find(n => n.key === activeSection)?.label} Settings</h4>
                <button onClick={handleSave} disabled={saving} className="btn btn-primary d-flex align-items-center gap-2 px-4 py-2 shadow-sm" style={{ borderRadius: 8, fontWeight: 600 }}>
                  <Save size={16} /> {saving ? "Saving..." : "Save"}
                </button>
              </div>

              <div className="card border-0 shadow-sm" style={{ borderRadius: 12 }}>
                <div className="card-body p-3 p-md-4">
                  <ActiveForm data={allData[activeSection] || {}} onChange={handleChange} />
                </div>
              </div>
            </div>

          </div>
        </div>
      </PageContent>
    </div>
  );
}