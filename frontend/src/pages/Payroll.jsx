import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import { 
  CreditCard, 
  Download, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  DollarSign 
} from "lucide-react";

function Payroll() {
  const [payrollData] = useState([
    { id: "PAY-991", name: "Abhi", salary: "₹85,000", status: "Paid", date: "Mar 01, 2026", method: "Bank Transfer" },
    { id: "PAY-992", name: "Sneha", salary: "₹72,000", status: "Paid", date: "Mar 01, 2026", method: "Bank Transfer" },
    { id: "PAY-993", name: "Rahul", salary: "₹65,000", status: "Pending", date: "Pending", method: "UPI" },
    { id: "PAY-994", name: "Priya", salary: "₹90,000", status: "Paid", date: "Mar 01, 2026", method: "Bank Transfer" },
  ]);

  return (
    <div className="flex bg-[#f8fafc] min-h-screen">
      <Sidebar />

      <div className="flex-1 ml-64 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Payroll Management</h1>
            <p className="text-gray-500 text-sm">Review and process employee salaries</p>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center transition-all shadow-lg shadow-blue-100">
            <DollarSign size={18} className="mr-2" />
            Run Payroll
          </button>
        </div>

        {/* Metric Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Total Payout</p>
            <h3 className="text-2xl font-black text-gray-800">₹3,12,000</h3>
            <p className="text-emerald-500 text-xs mt-2 flex items-center font-medium">
              <CheckCircle2 size={12} className="mr-1" /> All clear for March
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Pending Approvals</p>
            <h3 className="text-2xl font-black text-gray-800">01</h3>
            <p className="text-orange-500 text-xs mt-2 flex items-center font-medium">
              <Clock size={12} className="mr-1" /> Action required
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Next Pay Date</p>
            <h3 className="text-2xl font-black text-gray-800">April 01</h3>
            <p className="text-gray-400 text-xs mt-2 font-medium">Monthly Cycle</p>
          </div>
        </div>

        {/* Table Controls */}
        <div className="bg-white rounded-t-2xl border-x border-t border-gray-100 p-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by employee name..." 
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          <div className="flex gap-3">
            <button className="flex items-center px-4 py-2 text-gray-600 bg-white border border-gray-200 rounded-lg text-sm hover:bg-gray-50">
              <Filter size={16} className="mr-2" /> Filter
            </button>
          </div>
        </div>

        {/* Payroll Table */}
        <div className="bg-white rounded-b-2xl border border-gray-100 overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-wider">Ref ID</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-wider">Employee</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-wider">Pay Date</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-wider text-right">Payslip</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {payrollData.map((pay) => (
                <tr key={pay.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-bold text-blue-600">{pay.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500 mr-3">
                        {pay.name.charAt(0)}
                      </div>
                      <span className="text-sm font-semibold text-gray-800">{pay.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-black text-gray-800">{pay.salary}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      pay.status === 'Paid' 
                      ? 'bg-emerald-100 text-emerald-600' 
                      : 'bg-orange-100 text-orange-600'
                    }`}>
                      {pay.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{pay.date}</td>
                  <td className="px-6 py-4 text-right">
                    <button className={`p-2 rounded-lg transition-colors ${
                      pay.status === 'Paid' ? 'text-blue-600 hover:bg-blue-50' : 'text-gray-300 cursor-not-allowed'
                    }`}>
                      <Download size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Payroll;