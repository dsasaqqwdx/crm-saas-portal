import React, { useEffect, useState } from "react";
import axios from "axios";

function AdminAttendancePage() {
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/attendance/all");
      setAttendance(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch attendance");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Employee Attendance</h2>

      <table className="table table-bordered mt-3">
        <thead>
          <tr>
            <th>Name</th>
            <th>Date</th>
            <th>Status</th>
            <th>Check In</th>
            <th>Check Out</th>
          </tr>
        </thead>

        <tbody>
          {attendance.map((item, index) => (
            <tr key={index}>
              <td>{item.name}</td>
              <td>{item.date}</td>
              <td>{item.status}</td>
              <td>{item.check_in || "-"}</td>
              <td>{item.check_out || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminAttendancePage;