import React, { useEffect, useState } from "react";
import API from "../../../api/api";

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

  return (
    <div className="container-fluid p-4" style={{ marginLeft: "250px" }}>
      
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Employee Attendance</h2>
      </div>

      {/* ERROR MESSAGE */}
      {error && (
        <div className="alert alert-danger">{error}</div>
      )}

      {/* CARD */}
      <div className="card shadow-sm border-0">
        <div className="card-body">

          {/* LOADING */}
          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary"></div>
              <p className="mt-2">Loading attendance...</p>
            </div>
          ) : (

            <div className="table-responsive">
              <table className="table table-hover align-middle">
                
                {/* TABLE HEADER */}
                <thead className="table-dark">
                  <tr>
                    <th>Name</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Check In</th>
                    <th>Check Out</th>
                  </tr>
                </thead>

                {/* TABLE BODY */}
                <tbody>
                  {attendance.length > 0 ? (
                    attendance.map((item, index) => (
                      <tr key={index}>
                        <td className="fw-semibold">{item.name}</td>

                        <td>
                          {new Date(item.date).toLocaleDateString()}
                        </td>

                        <td>
                          <span className={`badge ${
                            item.status === "Present"
                              ? "bg-success"
                              : "bg-warning text-dark"
                          }`}>
                            {item.status}
                          </span>
                        </td>

                        <td>{item.check_in || "-"}</td>
                        <td>{item.check_out || "-"}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center text-muted py-4">
                        No attendance data available
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
  );
};

export default AdminAttendancePage;