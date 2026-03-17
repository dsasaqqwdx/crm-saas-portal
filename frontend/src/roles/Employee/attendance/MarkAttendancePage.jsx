import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../../../layouts/Sidebar";
import { CheckCircle, LogOut, MapPin } from "lucide-react";

function MarkAttendance() {
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

        const res = await axios.get(
          "http://localhost:5001/api/attendance/today",
          { headers: { "x-auth-token": token } }
        );

        if (res.data.marked) {
          if (res.data.data.check_out) {
            setAttendanceStatus("COMPLETED");
          } else {
            setAttendanceStatus("CHECKED_IN");
          }
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
        "http://localhost:5001/api/attendance/mark",
        { status: "present" },
        { headers: { "x-auth-token": token } }
      );

      if (res.data.success) {
        if (attendanceStatus === "NOT_MARKED") {
          setAttendanceStatus("CHECKED_IN");
        } else {
          setAttendanceStatus("COMPLETED");
        }
      }
    } catch (error) {
      alert(error.response?.data?.msg || "Error");
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

            {/* CARD */}
            <div className="card shadow border-0 text-center p-4">
              
              <h2 className="fw-bold mb-3">Mark Attendance</h2>

              {/* TIME */}
              <h1 className="display-5 fw-bold text-primary">
                {currentTime.toLocaleTimeString()}
              </h1>

              {/* STATUS */}
              <p className="mt-3">
                {attendanceStatus === "NOT_MARKED" && (
                  <span className="badge bg-secondary fs-6">Not Marked</span>
                )}
                {attendanceStatus === "CHECKED_IN" && (
                  <span className="badge bg-success fs-6">Checked In</span>
                )}
                {attendanceStatus === "COMPLETED" && (
                  <span className="badge bg-dark fs-6">Completed</span>
                )}
              </p>

              {/* BUTTONS */}
              <div className="d-flex gap-3 mt-4">

                <button
                  className="btn btn-success w-100 d-flex align-items-center justify-content-center"
                  onClick={handleAttendance}
                  disabled={loading || attendanceStatus !== "NOT_MARKED"}
                >
                  <CheckCircle size={18} className="me-2" />
                  Check In
                </button>

                <button
                  className="btn btn-danger w-100 d-flex align-items-center justify-content-center"
                  onClick={handleAttendance}
                  disabled={loading || attendanceStatus !== "CHECKED_IN"}
                >
                  <LogOut size={18} className="me-2" />
                  Check Out
                </button>

              </div>

              {/* LOCATION */}
              <div className="mt-4 text-muted">
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