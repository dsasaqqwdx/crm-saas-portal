import React from "react";
import { useNavigate } from "react-router-dom";
import { ShieldOff, Mail, ArrowLeft } from "lucide-react";
import Logo from "../../assets/logo.png";


export default function SuspendedScreen() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight:       "100vh",
      backgroundColor: "#0F172A",
      display:         "flex",
      alignItems:      "center",
      justifyContent:  "center",
      fontFamily:      "'Ubuntu', sans-serif",
      padding:         24,
    }}>
      <div style={{
        width:        "100%",
        maxWidth:     460,
        background:   "#1E293B",
        borderRadius: 16,
        padding:      "48px 40px",
        textAlign:    "center",
        boxShadow:    "0 20px 60px rgba(0,0,0,0.4)",
        border:       "1px solid #334155",
      }}>

        <img
          src={Logo}
          alt="Shnoor"
          style={{ width: 56, height: 56, objectFit: "contain", marginBottom: 28 }}
        />

        <div style={{
          width:           72,
          height:          72,
          borderRadius:    "50%",
          background:      "rgba(239,68,68,0.12)",
          border:          "2px solid rgba(239,68,68,0.3)",
          display:         "flex",
          alignItems:      "center",
          justifyContent:  "center",
          margin:          "0 auto 24px",
        }}>
          <ShieldOff size={32} color="#ef4444" />
        </div>

        <h2 style={{
          color:        "#E2E8F0",
          fontSize:     22,
          fontWeight:   700,
          margin:       "0 0 12px",
          lineHeight:   1.3,
        }}>
          Account Suspended
        </h2>

        <p style={{
          color:        "#94A3B8",
          fontSize:     14,
          lineHeight:   1.7,
          margin:       "0 0 28px",
        }}>
          Your account has been suspended by the platform administrator.
          You currently do not have access to any features.
        </p>

        
        <div style={{
          background:   "rgba(239,68,68,0.08)",
          border:       "1px solid rgba(239,68,68,0.2)",
          borderRadius: 10,
          padding:      "16px 18px",
          marginBottom: 28,
          textAlign:    "left",
        }}>
          <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
            <Mail size={16} color="#ef4444" style={{ marginTop: 2, flexShrink: 0 }} />
            <div>
              <div style={{ color: "#fca5a5", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
                What should you do?
              </div>
              <div style={{ color: "#94A3B8", fontSize: 13, lineHeight: 1.6 }}>
                Contact your platform administrator or the Shnoor support team
                to understand why your account was suspended and how to restore access.
              </div>
            </div>
          </div>
        </div>

        
        <button
          onClick={() => navigate("/login")}
          style={{
            width:        "100%",
            padding:      "12px 0",
            background:   "transparent",
            border:       "1.5px solid #334155",
            borderRadius: 10,
            color:        "#94A3B8",
            fontSize:     14,
            fontWeight:   600,
            cursor:       "pointer",
            display:      "flex",
            alignItems:   "center",
            justifyContent: "center",
            gap:          8,
            transition:   "border-color 0.15s, color 0.15s",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = "#6366F1";
            e.currentTarget.style.color = "#E2E8F0";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = "#334155";
            e.currentTarget.style.color = "#94A3B8";
          }}
        >
          <ArrowLeft size={16} />
          Back to Login
        </button>

      </div>
    </div>
  );
}