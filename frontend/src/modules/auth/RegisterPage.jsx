
import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../../assets/logo.png";

const API = process.env.REACT_APP_API_URL || "http://localhost:5001";

export default function Register() {
  const [form, setForm]       = useState({ name: "", email: "", password: "", company_name: "" });
  const [showPw, setShowPw]   = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const navigate              = useNavigate();

  const set = (k) => (e) => {
    setForm(p => ({ ...p, [k]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      
      await axios.post(`${API}/api/auth/register`, {
        name:         form.name.trim(),
        email:        form.email.trim(),
        password:     form.password,
        company_name: form.company_name.trim(),
      });
      navigate("/login", { state: { registered: true } });
    } catch (err) {
      setError(err.response?.data?.msg || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    background:  "#1E293B",
    color:       "#E2E8F0",
    borderColor: "#334155",
    borderRadius: 10,
    padding:     "11px 14px",
    fontSize:    14,
    outline:     "none",
    width:       "100%",
    border:      "1.5px solid #334155",
    boxSizing:   "border-box",
    transition:  "border-color 0.15s",
  };

  const labelStyle = {
    color:          "#94A3B8",
    fontSize:       12,
    fontWeight:     600,
    textTransform:  "uppercase",
    letterSpacing:  "0.06em",
    display:        "block",
    marginBottom:   6,
  };

  const onFocus = e => (e.target.style.borderColor = "#6366f1");
  const onBlur  = e => (e.target.style.borderColor = "#334155");

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'Segoe UI', sans-serif", background: "#0F172A" }}>

      <div style={{
        width: "100%", maxWidth: 480,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "32px 24px", background: "#0F172A", flexShrink: 0,
      }}>
        <div style={{ width: "100%", maxWidth: 420 }}>

          
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <img src={Logo} alt="Shnoor" style={{ width: 64, height: 64, objectFit: "contain", marginBottom: 16 }} />
            <h2 style={{ color: "#E2E8F0", fontWeight: 700, fontSize: 22, margin: "0 0 6px" }}>
              Create Admin Account
            </h2>
            <p style={{ color: "#64748b", fontSize: 13, margin: 0 }}>
              Start your 15-day free trial today
            </p>
          </div>

          <div style={{
            background:  "linear-gradient(135deg, rgba(79,70,229,0.2), rgba(124,58,237,0.2))",
            border:      "1px solid rgba(79,70,229,0.4)",
            borderRadius: 12,
            padding:     "12px 16px",
            marginBottom: 24,
            display:     "flex",
            alignItems:  "center",
            gap:          12,
          }}>
            <div style={{ fontSize: 28, lineHeight: 1 }}>🎉</div>
            <div>
              <div style={{ color: "#a5b4fc", fontWeight: 700, fontSize: 13 }}>15-Day Free Trial</div>
              <div style={{ color: "#94a3b8", fontSize: 12, marginTop: 2 }}>
                Full access to all features. No credit card required.
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>

            
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Company Name *</label>
              <input
                style={inputStyle}
                placeholder="Acme Technologies"
                value={form.company_name}
                onChange={set("company_name")}
                required
                onFocus={onFocus}
                onBlur={onBlur}
              />
            </div>

          
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Your Full Name *</label>
              <input
                style={inputStyle}
                placeholder="John Doe"
                value={form.name}
                onChange={set("name")}
                required
                onFocus={onFocus}
                onBlur={onBlur}
              />
            </div>

       
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Work Email *</label>
              <input
                type="email"
                style={inputStyle}
                placeholder="admin@yourcompany.com"
                value={form.email}
                onChange={set("email")}
                required
                onFocus={onFocus}
                onBlur={onBlur}
              />
            </div>

            
            <div style={{ marginBottom: 24 }}>
              <label style={labelStyle}>Password *</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPw ? "text" : "password"}
                  style={{ ...inputStyle, paddingRight: 44 }}
                  placeholder="Min. 6 characters"
                  value={form.password}
                  onChange={set("password")}
                  required
                  onFocus={onFocus}
                  onBlur={onBlur}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  style={{
                    position:  "absolute", right: 12, top: "50%",
                    transform: "translateY(-50%)",
                    background: "transparent", border: "none",
                    color: "#64748b", cursor: "pointer", fontSize: 13, padding: 0,
                  }}
                >
                  {showPw ? "Hide" : "Show"}
                </button>
              </div>
            </div>

           
            {error && (
              <div style={{
                background: "#fee2e2", border: "1px solid #fecaca",
                borderRadius: 8, padding: "10px 14px",
                fontSize: 13, color: "#dc2626", marginBottom: 16,
              }}>
                {error}
              </div>
            )}

            
            <button
              type="submit"
              disabled={loading}
              style={{
                width:      "100%",
                padding:    "13px",
                background: loading
                  ? "#4338ca"
                  : "linear-gradient(135deg, #4f46e5, #7c3aed)",
                color:        "#fff",
                border:       "none",
                borderRadius: 10,
                fontWeight:   700,
                fontSize:     15,
                cursor:       loading ? "not-allowed" : "pointer",
                boxShadow:    "0 4px 16px rgba(79,70,229,0.4)",
              }}
            >
              {loading ? "Creating account…" : "Start Free Trial →"}
            </button>
          </form>

        
          <div style={{ marginTop: 24, background: "#1e293b", borderRadius: 12, padding: "16px 18px" }}>
            <div style={{
              color: "#94a3b8", fontSize: 11, fontWeight: 700,
              textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10,
            }}>
              Included in trial
            </div>
            {[
              "Employee management",
              "Attendance & Leave tracking",
              "Payroll with PDF payslips",
              "Support tickets",
              "Holiday calendar",
            ].map(f => (
              <div key={f} style={{
                display: "flex", alignItems: "center", gap: 8,
                color: "#e2e8f0", fontSize: 13, marginBottom: 6,
              }}>
                <span style={{ color: "#22c55e", fontSize: 15 }}>✓</span> {f}
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: 24 }}>
            <span style={{ color: "#64748b", fontSize: 13 }}>Already have an account? </span>
            <Link to="/login" style={{ color: "#6366f1", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
              Sign in
            </Link>
          </div>
        </div>
      </div>

      <div
        className="d-none d-lg-flex"
        style={{
          flex:       1,
          display:    "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)",
          padding:    48,
          position:   "relative",
          overflow:   "hidden",
        }}
      >
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 30% 50%, rgba(99,102,241,0.15) 0%, transparent 60%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 70% 80%, rgba(124,58,237,0.1) 0%, transparent 50%)",  pointerEvents: "none" }} />

        <div style={{ textAlign: "center", zIndex: 1, maxWidth: 480 }}>
          <img
            src={Logo}
            alt="Shnoor"
            style={{
              width: 120, height: 120, objectFit: "contain",
              filter: "drop-shadow(0 8px 24px rgba(99,102,241,0.5))",
              marginBottom: 32,
            }}
          />
          <h1 style={{
            color: "#e2e8f0", fontSize: 36, fontWeight: 800,
            letterSpacing: "-0.03em", margin: "0 0 16px", lineHeight: 1.2,
          }}>
            Shnoor SaaS<br />HR Platform
          </h1>
          <p style={{ color: "#94a3b8", fontSize: 16, lineHeight: 1.7, margin: "0 0 40px" }}>
            Everything your company needs to manage employees, payroll, attendance,
            and leaves — all in one place.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {[
              { emoji: "👥", label: "Employee Management" },
              { emoji: "📊", label: "Attendance Tracking" },
              { emoji: "💰", label: "Payroll & Payslips" },
              { emoji: "🌴", label: "Leave Management" },
              { emoji: "🎫", label: "Support Tickets" },
              { emoji: "📅", label: "Holiday Calendar" },
            ].map(f => (
              <div key={f.label} style={{
                background:   "rgba(255,255,255,0.05)",
                border:       "1px solid rgba(255,255,255,0.08)",
                borderRadius: 12,
                padding:      "14px 16px",
                display:      "flex",
                alignItems:   "center",
                gap:           10,
              }}>
                <span style={{ fontSize: 20 }}>{f.emoji}</span>
                <span style={{ color: "#c7d2fe", fontSize: 13, fontWeight: 500 }}>{f.label}</span>
              </div>
            ))}
          </div>

          <div style={{
            marginTop:    32,
            background:   "rgba(79,70,229,0.15)",
            border:       "1px solid rgba(79,70,229,0.3)",
            borderRadius: 12,
            padding:      "16px 20px",
          }}>
            <div style={{ color: "#a5b4fc", fontSize: 22, fontWeight: 800 }}>15 Days Free</div>
            <div style={{ color: "#94a3b8", fontSize: 13, marginTop: 4 }}>
              Full access · No credit card · Cancel anytime
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}