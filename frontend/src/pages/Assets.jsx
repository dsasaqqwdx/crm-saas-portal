import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import { 
  Laptop, 
  Plus, 
  Search, 
  MoreVertical, 
  Filter,
  Monitor,
  Smartphone
} from "lucide-react";

function Assets() {
  // Mock data to match your professional dashboard UI
  const [assets] = useState([
    { id: "AST-001", name: "MacBook Pro 14\"", category: "Electronics", employee: "Abhi", status: "Assigned" },
    { id: "AST-002", name: "Dell Monitor 27\"", category: "Peripheral", employee: "Sneha", status: "Assigned" },
    { id: "AST-003", name: "Office Chair", category: "Furniture", employee: "-", status: "Available" },
    { id: "AST-004", name: "iPhone 15", category: "Mobile", employee: "Rahul", status: "Assigned" },
  ]);

  return (
    <div className="flex bg-[#f8fafc] min-h-screen">
      <Sidebar />

      <div className="flex-1 ml-64 p-8">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Asset Management</h1>
            <p className="text-gray-500 text-sm">Track and manage company hardware and furniture</p>
          </div>
          <button className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-all shadow-md">
            <Plus size={18} className="mr-2" />
            Add Asset
          </button>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center">
            <div className="bg-blue-50 p-3 rounded-lg text-blue-600 mr-4">
              <Laptop size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-400 font-medium">Total Assets</p>
              <h3 className="text-xl font-bold text-gray-800">124</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center">
            <div className="bg-emerald-50 p-3 rounded-lg text-emerald-600 mr-4">
              <Monitor size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-400 font-medium">Assigned</p>
              <h3 className="text-xl font-bold text-gray-800">98</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center">
            <div className="bg-orange-50 p-3 rounded-lg text-orange-600 mr-4">
              <Smartphone size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-400 font-medium">Maintenance</p>
              <h3 className="text-xl font-bold text-gray-800">12</h3>
            </div>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="bg-white rounded-t-xl border-x border-t border-gray-100 p-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search assets by ID, name or employee..." 
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <button className="flex items-center px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
              <Filter size={16} className="mr-2" /> Filter
            </button>
          </div>
        </div>

        {/* Asset Table */}
        <div className="bg-white rounded-b-xl border border-gray-100 overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Asset ID</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Asset Name</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Category</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Assigned To</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {assets.map((asset) => (
                <tr key={asset.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-semibold text-blue-600">{asset.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-800">{asset.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{asset.category}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{asset.employee}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      asset.status === 'Assigned' 
                      ? 'bg-blue-100 text-blue-600' 
                      : 'bg-emerald-100 text-emerald-600'
                    }`}>
                      {asset.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-400 cursor-pointer">
                    <MoreVertical size={18} />
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

export default Assets;