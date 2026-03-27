import React, { useEffect, useState } from "react";
import API from "../../../api/api";
import Sidebar from "../../../layouts/Sidebar";
import { PageContent } from "../../../layouts/usePageLayout";

const AdminAttendancePage = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      const res = await API.get("/attendance/all");
      setAttendance(res.data);
      setError("");
    } catch (err) {
      console.error("Error fetching attendance", err);
      setError("Failed to load attendance");
    } finally {
      setLoading(false);
    }
  };

  const getBadgeStyle = (status) => ({
    padding: "6px 12px",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: "700",
    backgroundColor: status === "Present" ? "#dcfce7" : "#fef9c3",
    color: status === "Present" ? "#15803d" : "#a16207",
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
  });

  return (
    <div className="d-flex bg-light min-vh-100">
      <Sidebar />
      <PageContent>
        <div className="container-fluid px-3 px-md-4 py-4">
          
          {/* Header Section */}
          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-end mb-4 gap-3">
            <div>
              <h2 className="fw-bold fs-3 mb-1" style={{ color: "#0f172a", letterSpacing: "-0.5px" }}>
                Attendance
              </h2>
              <p className="text-muted small mb-0">
                Real-time monitoring of workplace presence and clock-in metrics.
              </p>
            </div>
            <div className="bg-white p-3 rounded-4 border shadow-sm text-center text-sm-end" style={{ minWidth: "140px" }}>
              <span className="d-block fs-3 fw-bold" style={{ color: "#4f46e5", lineHeight: 1 }}>
                {attendance.length}
              </span>
              <span className="text-uppercase fw-bold text-muted" style={{ fontSize: "10px", letterSpacing: "1px" }}>
                Total Entries
              </span>
            </div>
          </div>

          {/* Main Content Box */}
          <div className="bg-white rounded-4 border shadow-sm overflow-hidden" style={{ minHeight: "60vh" }}>
            <div className="p-3 p-md-4">
              {error && (
                <div className="alert alert-danger border-0 rounded-3 mb-4" style={{ fontSize: "14px" }}>
                  {error}
                </div>
              )}

              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status" style={{ width: "2.5rem", height: "2.5rem" }} />
                  <p className="mt-3 text-muted fw-medium">Fetching secure records...</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table align-middle mb-0">
                    <thead className="bg-light">
                      <tr style={{ fontSize: "11px", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px" }}>
                        <th className="px-4 py-3 border-0">Employee Name</th>
                        <th className="px-4 py-3 border-0">Calendar Date</th>
                        <th className="px-4 py-3 border-0">Status</th>
                        <th className="px-4 py-3 border-0">Entry Time</th>
                        <th className="px-4 py-3 border-0">Exit Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendance.length > 0 ? (
                        attendance.map((item, index) => (
                          <tr key={index} className="hover-fade">
                            <td className="px-4 py-3 fw-bold" style={{ color: "#1e293b" }}>{item.name}</td>
                            <td className="px-4 py-3 text-muted" style={{ fontSize: "14px" }}>
                              {new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                            </td>
                            <td className="px-4 py-3">
                              <span style={getBadgeStyle(item.status)}>
                                <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: item.status === "Present" ? "#15803d" : "#a16207" }} />
                                {item.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-muted font-monospace" style={{ fontSize: "14px" }}>
                              {item.check_in || "—"}
                            </td>
                            <td className="px-4 py-3 text-muted font-monospace" style={{ fontSize: "14px" }}>
                              {item.check_out || "—"}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="text-center py-5 text-muted">
                            No attendance records found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </PageContent>
      
      <style>{`
        .hover-fade:hover { background-color: #fcfdfe; transition: background 0.2s ease; }
      `}</style>
    </div>
  );
};

export default AdminAttendancePage;