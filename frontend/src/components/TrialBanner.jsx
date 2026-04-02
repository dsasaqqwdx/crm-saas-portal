import React, { useState, useEffect } from "react";
import { Clock, X, AlertTriangle } from "lucide-react";


export default function TrialBanner() {
  const [trial,     setTrial    ] = useState(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("trial");
      if (raw) setTrial(JSON.parse(raw));
    } catch {}
  }, []);

  if (!trial || !trial.is_trial || dismissed) return null;

  const days = parseInt(trial.days_left ?? 0);
  if (days > 10) return null; // Only show when <= 10 days remaining

  const expired = days <= 0;
  const urgent  = days <= 3;

  const bg      = expired ? "#fef2f2" : urgent ? "#fff7ed" : "#eff6ff";
  const border  = expired ? "#fecaca" : urgent ? "#fed7aa" : "#bfdbfe";
  const color   = expired ? "#dc2626" : urgent ? "#c2410c" : "#1d4ed8";
  const icon    = expired || urgent ? <AlertTriangle size={16} /> : <Clock size={16} />;

  const fmtD = (d) => d
    ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
    : "";

  return (
    <div style={{
      background:   bg,
      border:       `1px solid ${border}`,
      borderRadius: 10,
      padding:      "10px 16px",
      marginBottom: 20,
      display:      "flex",
      alignItems:   "center",
      gap:          12,
      color,
    }}>
      <span style={{ flexShrink: 0 }}>{icon}</span>
      <span style={{ flex: 1, fontSize: 13, fontWeight: 500 }}>
        {expired
          ? "Your 15-day free trial has expired. Contact your administrator to restore access."
          : `Your free trial ends in ${days} day${days !== 1 ? "s" : ""} (${fmtD(trial.trial_end)}). Contact your administrator to continue.`}
      </span>
      {!expired && (
        <button onClick={() => setDismissed(true)}
          style={{ background: "transparent", border: "none", cursor: "pointer", color, padding: 0, flexShrink: 0 }}>
          <X size={15} />
        </button>
      )}
    </div>
  );
}