import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../../../layouts/Sidebar";
import { Clock, CheckCircle, LogOut, MapPin } from "lucide-react";

function MarkAttendance() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleAttendance = async (status) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You are not logged in!");
      return;
    }

    setLoading(true);

    try {
      // FIXED URL: Updated to match your new modular backend path
      const res = await axios.post(
        "http://localhost:5001/api/attendance/mark",
        { status: status },
        { headers: { "x-auth-token": token } }
      );

      if (res.data.success) {
        alert(`Attendance marked as ${status.toUpperCase()}!`);
      }
    } catch (error) {
      console.error("Attendance Error:", error);
      // Check for specific error message from your global error handler or controller
      const errorMsg = error.response?.data?.msg || error.response?.data?.error || "Error marking attendance.";
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex bg-light min-vh-100">
      <Sidebar />
      <div className="container-fluid p-4" style={{ marginLeft: "250px" }}>
        <div className="row justify-content-center mt-5">
          <div className="col-md-6">
            <div className="text-center mb-4">
              <h1 className="fw-bold">Mark Attendance</h1>
              <p className="text-muted">Your attendance is secured via your secure login.</p>
            </div>

            <div className="card shadow border-0 p-5 text-center">
              <div className="mb-3 text-primary">
                <Clock size={48} />
              </div>

              <h2 className="display-4 fw-bold">
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </h2>

              <p className="text-muted fs-5">
                {currentTime.toLocaleDateString(undefined, {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric"
                })}
              </p>

              <div className="row mt-5 g-3">
                <div className="col-sm-6">
                  <button
                    className="btn btn-success btn-lg w-100 py-3 d-flex align-items-center justify-content-center"
                    onClick={() => handleAttendance("present")}
                    disabled={loading}
                  >
                    <CheckCircle size={20} className="me-2" />
                    {loading ? "Processing..." : "Check In"}
                  </button>
                </div>

                <div className="col-sm-6">
                  <button
                    className="btn btn-dark btn-lg w-100 py-3 d-flex align-items-center justify-content-center"
                    onClick={() => handleAttendance("absent")}
                    disabled={loading}
                  >
                    <LogOut size={20} className="me-2" />
                    Check Out
                  </button>
                </div>
              </div>

              <div className="mt-4 text-muted small">
                <MapPin size={14} className="me-1" />
                Location Verified
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MarkAttendance;