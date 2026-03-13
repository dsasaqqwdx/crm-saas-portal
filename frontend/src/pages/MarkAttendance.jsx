import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import { Clock, CheckCircle, LogOut, MapPin } from "lucide-react";

function MarkAttendance() {
  const [employeeId, setEmployeeId] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update clock every second
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
          status: status // "present" or "absent"
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
    <div className="flex bg-[#f3f4f6] min-h-screen">
      <Sidebar />

      <div className="flex-1 ml-64 p-8">
        <div className="max-w-2xl mx-auto mt-10">
          {/* Attendance Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-800">Attendance System</h1>
            <p className="text-gray-500">Log your daily work hours</p>
          </div>

          {/* Time & Date Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 flex flex-col items-center">
            <div className="bg-blue-50 text-blue-600 p-4 rounded-full mb-4">
              <Clock size={40} />
            </div>
            <h2 className="text-5xl font-black text-gray-800 tracking-tight">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </h2>
            <p className="text-gray-400 font-medium mt-2">
              {currentTime.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            {/* Input Field Styling */}
            <div className="w-full mt-8">
              <label className="block text-sm font-semibold text-gray-600 mb-2">Confirm Employee ID</label>
              <div className="relative">
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-center text-lg font-bold"
                  placeholder="e.g. EMP102"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4 w-full mt-8">
              <button
                onClick={() => handleAttendance("present")}
                className="flex items-center justify-center space-x-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-emerald-100"
              >
                <CheckCircle size={20} />
                <span>Check In</span>
              </button>

              <button
                onClick={() => handleAttendance("absent")} // Or logic for "Check Out"
                className="flex items-center justify-center space-x-2 bg-gray-800 hover:bg-gray-900 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-gray-200"
              >
                <LogOut size={20} />
                <span>Check Out</span>
              </button>
            </div>

            <div className="mt-6 flex items-center text-gray-400 text-sm">
               <MapPin size={14} className="mr-1" />
               <span>Auto-detecting location: Hyderabad, India</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MarkAttendance;