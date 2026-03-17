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
        <h2>Mark Attendance</h2>

        <h3>{currentTime.toLocaleTimeString()}</h3>

        <p>
          {attendanceStatus === "NOT_MARKED" && "Not Marked"}
          {attendanceStatus === "CHECKED_IN" && "Checked In"}
          {attendanceStatus === "COMPLETED" && "Completed"}
        </p>

        <button
          onClick={handleAttendance}
          disabled={attendanceStatus !== "NOT_MARKED"}
        >
          Check In
        </button>

        <button
          onClick={handleAttendance}
          disabled={attendanceStatus !== "CHECKED_IN"}
        >
          Check Out
        </button>
      </div>
    </div>
  );
}

export default MarkAttendance;