<<<<<<< HEAD
import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Send, 
  Filter 
} from 'lucide-react';

const Leaves = () => {
  const [leaveRequests] = useState([
    { id: 1, type: 'Casual Leave', start: 'Mar 15, 2026', end: 'Mar 16, 2026', days: 2, status: 'Pending' },
    { id: 2, type: 'Sick Leave', start: 'Feb 10, 2026', end: 'Feb 11, 2026', days: 1, status: 'Approved' },
    { id: 3, type: 'Annual Leave', start: 'Jan 05, 2026', end: 'Jan 10, 2026', days: 5, status: 'Approved' },
  ]);

  const balances = [
    { name: 'Annual Leave', total: 20, used: 5, color: 'text-blue-600', bg: 'bg-blue-50' },
    { name: 'Sick Leave', total: 12, used: 1, color: 'text-red-600', bg: 'bg-red-50' },
    { name: 'Casual Leave', total: 10, used: 2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  return (
    <div className="flex bg-[#f8fafc] min-h-screen">
      <Sidebar />
      
      <div className="flex-1 ml-64 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Leave Management</h1>
            <p className="text-gray-500 text-sm">Request time off and track your balances</p>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold flex items-center transition-all shadow-md">
            <Send size={18} className="mr-2" />
            Apply for Leave
          </button>
        </div>

        {/* Leave Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {balances.map((leave, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className={`${leave.bg} ${leave.color} p-3 rounded-xl`}>
                  <Calendar size={24} />
                </div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Balance</span>
              </div>
              <h3 className="text-gray-500 text-sm font-medium">{leave.name}</h3>
              <div className="flex items-end space-x-2 mt-1">
                <span className="text-3xl font-black text-gray-800">{leave.total - leave.used}</span>
                <span className="text-gray-400 pb-1">/ {leave.total} Days left</span>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Requests Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex justify-between items-center">
            <h3 className="font-bold text-gray-800">My Leave History</h3>
            <button className="text-gray-400 hover:text-gray-600">
              <Filter size={18} />
            </button>
          </div>
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Leave Type</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Period</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Days</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {leaveRequests.map((req) => (
                <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-semibold text-gray-800">{req.type}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Clock size={14} className="mr-2 text-gray-400" />
                      {req.start} - {req.end}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{req.days} Days</td>
                  <td className="px-6 py-4">
                    <span className={`flex items-center w-fit px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      req.status === 'Approved' 
                      ? 'bg-emerald-100 text-emerald-600' 
                      : 'bg-orange-100 text-orange-600'
                    }`}>
                      {req.status === 'Approved' ? <CheckCircle size={12} className="mr-1" /> : <Clock size={12} className="mr-1" />}
                      {req.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
=======
import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import { Calendar, Clock, CheckCircle, Send, Filter } from "lucide-react";

const Leaves = () => {

  const [leaveRequests] = useState([
    { id: 1, type: "Casual Leave", start: "Mar 15, 2026", end: "Mar 16, 2026", days: 2, status: "Pending" },
    { id: 2, type: "Sick Leave", start: "Feb 10, 2026", end: "Feb 11, 2026", days: 1, status: "Approved" },
    { id: 3, type: "Annual Leave", start: "Jan 05, 2026", end: "Jan 10, 2026", days: 5, status: "Approved" }
  ]);

  const balances = [
    { name: "Annual Leave", total: 20, used: 5, color: "primary" },
    { name: "Sick Leave", total: 12, used: 1, color: "danger" },
    { name: "Casual Leave", total: 10, used: 2, color: "success" }
  ];

  return (

    <div className="d-flex bg-light min-vh-100">

      <Sidebar />

      <div className="container-fluid p-4">

        {/* Header */}

        <div className="d-flex justify-content-between align-items-center mb-4">

          <div>
            <h2 className="fw-bold">Leave Management</h2>
            <p className="text-muted">Request time off and track your balances</p>
          </div>

          <button className="btn btn-primary d-flex align-items-center">
            <Send size={18} className="me-2" />
            Apply for Leave
          </button>

        </div>


        {/* Leave Balance Cards */}

        <div className="row mb-4">

          {balances.map((leave, idx) => (

            <div key={idx} className="col-md-4">

              <div className="card shadow-sm p-3">

                <div className="d-flex justify-content-between mb-3">

                  <div className={`bg-${leave.color} bg-opacity-10 p-2 rounded`}>
                    <Calendar size={20} />
                  </div>

                  <span className="small text-muted">Balance</span>

                </div>

                <h6 className="text-muted">{leave.name}</h6>

                <h3 className="fw-bold">
                  {leave.total - leave.used}
                  <span className="text-muted fs-6"> / {leave.total} Days</span>
                </h3>

              </div>

            </div>

          ))}

        </div>


        {/* Leave History */}

        <div className="card shadow-sm">

          <div className="card-header d-flex justify-content-between align-items-center">

            <h6 className="fw-bold mb-0">My Leave History</h6>

            <button className="btn btn-sm btn-outline-secondary">
              <Filter size={16} className="me-1" />
              Filter
            </button>

          </div>


          <div className="table-responsive">

            <table className="table table-hover mb-0">

              <thead className="table-light">

                <tr>
                  <th>Leave Type</th>
                  <th>Period</th>
                  <th>Days</th>
                  <th>Status</th>
                </tr>

              </thead>

              <tbody>

                {leaveRequests.map((req) => (

                  <tr key={req.id}>

                    <td className="fw-semibold">{req.type}</td>

                    <td>
                      <Clock size={14} className="me-1 text-muted" />
                      {req.start} - {req.end}
                    </td>

                    <td>{req.days} Days</td>

                    <td>

                      <span
                        className={`badge ${
                          req.status === "Approved"
                            ? "bg-success"
                            : "bg-warning text-dark"
                        }`}
                      >

                        {req.status === "Approved" && (
                          <CheckCircle size={12} className="me-1" />
                        )}

                        {req.status}

                      </span>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </div>

  );

>>>>>>> 9c5a8010b4b016477788cc1b54819ccbe65ae531
};

export default Leaves;