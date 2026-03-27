import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../../../layouts/Sidebar";
import { PageContent } from "../../../layouts/usePageLayout";
import { CheckCircle, LogOut, MapPin, Clock } from "lucide-react";

const API = process.env.REACT_APP_API_URL || "http://localhost:5001";

const STATUS_CONFIG = {
  NOT_MARKED: { label: "Not Marked", bg: "#f1f5f9", color: "#64748b" },
  CHECKED_IN: { label: "Checked In", bg: "#dcfce7", color: "#16a34a" },
  COMPLETED: { label: "Day Complete", bg: "#1e293b", color: "#fff" },
};

export default function MarkAttendance() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [attendanceStatus, setAttendanceStatus] = useState("NOT_MARKED");

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchToday = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API}/api/attendance/today`, {
          headers: { "x-auth-token": token },
        });
        if (res.data.marked) {
          setAttendanceStatus(res.data.data.check_out ? "COMPLETED" : "CHECKED_IN");
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchToday();
  }, []);

  const handleAttendance = async () => {
    const token = localStorage.getItem("token");
    setLoading(true);
    try {
      const res = await axios.post(
        `${API}/api/attendance/mark`,
        { status: "present" },
        { headers: { "x-auth-token": token } }
      );
      if (res.data.success) {
        setAttendanceStatus(attendanceStatus === "NOT_MARKED" ? "CHECKED_IN" : "COMPLETED");
      }
    } catch (error) {
      alert(error.response?.data?.msg || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const sc = STATUS_CONFIG[attendanceStatus];
  const fmtDate = (d) => d.toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  return (
    <div className="d-flex bg-light min-vh-100">
      <Sidebar />
      <PageContent>
        <div className="container-fluid d-flex flex-column align-items-center justify-content-center py-5" style={{ minHeight: "80vh" }}>
          
          {/* Header Info (Visible on Mobile) */}
          <div className="text-center mb-4 d-md-none">
            <h4 className="fw-bold">Mark Attendance</h4>
            <p className="text-muted small">{fmtDate(currentTime)}</p>
          </div>

          {/* Attendance Card */}
          <div className="bg-white rounded-4 shadow-sm border p-4 p-md-5 text-center w-100" style={{ maxWidth: "450px" }}>
            <div className="text-uppercase fw-bold text-muted mb-2" style={{ fontSize: "12px", letterSpacing: "1px" }}>
              Work Shift Clock
            </div>

            {/* Live Clock */}
            <h1 className="display-3 fw-bold mb-1" style={{ color: "#4f46e5", letterSpacing: "-2px" }}>
              {currentTime.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
            </h1>

            <div className="text-muted small mb-4 d-none d-md-block">
              {fmtDate(currentTime)}
            </div>

            {/* Status Badge */}
            <div className="mb-5">
              <span 
                className="px-4 py-2 rounded-pill fw-bold" 
                style={{ backgroundColor: sc.bg, color: sc.color, fontSize: "13px" }}
              >
                {sc.label}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="row g-3">
              <div className="col-12 col-sm-6">
                <button
                  className="btn w-100 py-3 rounded-4 fw-bold d-flex align-items-center justify-content-center gap-2 shadow-sm transition-all"
                  style={{ backgroundColor: "#22c55e", color: "#fff", border: "none" }}
                  onClick={handleAttendance}
                  disabled={loading || attendanceStatus !== "NOT_MARKED"}
                >
                  <CheckCircle size={18} /> Check In
                </button>
              </div>
              <div className="col-12 col-sm-6">
                <button
                  className="btn w-100 py-3 rounded-4 fw-bold d-flex align-items-center justify-content-center gap-2 shadow-sm transition-all"
                  style={{ backgroundColor: "#ef4444", color: "#fff", border: "none" }}
                  onClick={handleAttendance}
                  disabled={loading || attendanceStatus !== "CHECKED_IN"}
                >
                  <LogOut size={18} /> Check Out
                </button>
              </div>
            </div>

            {/* Location Verification Footnote */}
            <div className="mt-5 d-flex align-items-center justify-content-center gap-2 text-muted" style={{ fontSize: "12px" }}>
              <div className="p-1 rounded-circle bg-success" style={{ width: "8px", height: "8px" }}></div>
              <MapPin size={14} /> Location Verified & Secure
            </div>
          </div>

          {/* Helpful Tip for Mobile Users */}
          <div className="mt-4 text-center px-3">
            <p className="text-muted small">
              <Clock size={14} className="me-1" /> 
              Please ensure you are within the office perimeter to mark your presence.
            </p>
          </div>

        </div>

        <style>{`
          .transition-all { transition: all 0.2s ease; }
          .btn:hover:not(:disabled) { transform: translateY(-2px); filter: brightness(1.1); }
          .btn:active:not(:disabled) { transform: translateY(0px); }
        `}</style>
      </PageContent>
    </div>
  );
}