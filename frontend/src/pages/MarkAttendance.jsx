import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import { Clock, CheckCircle, LogOut, MapPin } from "lucide-react";

function MarkAttendance() {
  const [employeeId, setEmployeeId] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleAttendance = async (status) => {
    const token = localStorage.getItem("token");

    try {
      await axios.post(
        "http://localhost:5000/api/employees/attendance",
        {
          employee_id: employeeId,
          status: status
        },
        {
          headers: { "x-auth-token": token }
        }
      );

      alert(`Attendance marked as ${status.toUpperCase()}!`);
    } catch (error) {
      console.error(error);
      alert("Error marking attendance. Please check Employee ID.");
    }
  };

  return (
    <div className="d-flex bg-light min-vh-100">
      <Sidebar />

      <div className="container mt-5">
        <div className="row justify-content-center">

          <div className="col-md-6">

            <div className="text-center mb-4">
              <h1 className="fw-bold">Attendance System</h1>
              <p className="text-muted">Log your daily work hours</p>
            </div>

            <div className="card shadow p-4 text-center">

              <div className="mb-3 text-primary">
                <Clock size={40} />
              </div>

              <h2 className="fw-bold">
                {currentTime.toLocaleTimeString()}
              </h2>

              <p className="text-muted">
                {currentTime.toLocaleDateString(undefined, {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric"
                })}
              </p>

              <div className="mt-4">
                <label className="form-label fw-semibold">
                  Confirm Employee ID
                </label>

                <input
                  type="text"
                  className="form-control text-center fw-bold"
                  placeholder="e.g. EMP102"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                />
              </div>

              <div className="row mt-4">

                <div className="col">
                  <button
                    className="btn btn-success w-100"
                    onClick={() => handleAttendance("present")}
                  >
                    <CheckCircle size={18} className="me-2" />
                    Check In
                  </button>
                </div>

                <div className="col">
                  <button
                    className="btn btn-dark w-100"
                    onClick={() => handleAttendance("absent")}
                  >
                    <LogOut size={18} className="me-2" />
                    Check Out
                  </button>
                </div>

              </div>

              <div className="mt-3 text-muted">
                <MapPin size={14} className="me-1" />
                Auto-detecting location: Hyderabad, India
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default MarkAttendance;