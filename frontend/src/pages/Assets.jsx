import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
<<<<<<< HEAD
import { 
  Laptop, 
  Plus, 
  Search, 
  MoreVertical, 
=======
import {
  Laptop,
  Plus,
  Search,
  MoreVertical,
>>>>>>> 9c5a8010b4b016477788cc1b54819ccbe65ae531
  Filter,
  Monitor,
  Smartphone
} from "lucide-react";

function Assets() {
<<<<<<< HEAD
  // Mock data to match your professional dashboard UI
=======

>>>>>>> 9c5a8010b4b016477788cc1b54819ccbe65ae531
  const [assets] = useState([
    { id: "AST-001", name: "MacBook Pro 14\"", category: "Electronics", employee: "Abhi", status: "Assigned" },
    { id: "AST-002", name: "Dell Monitor 27\"", category: "Peripheral", employee: "Sneha", status: "Assigned" },
    { id: "AST-003", name: "Office Chair", category: "Furniture", employee: "-", status: "Available" },
    { id: "AST-004", name: "iPhone 15", category: "Mobile", employee: "Rahul", status: "Assigned" },
  ]);

  return (
<<<<<<< HEAD
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
=======

    <div className="d-flex bg-light min-vh-100">

      <Sidebar />

      <div className="container-fluid p-4">

        {/* Header */}

        <div className="d-flex justify-content-between align-items-center mb-4">

          <div>
            <h2 className="fw-bold">Asset Management</h2>
            <p className="text-muted">
              Track and manage company hardware and furniture
            </p>
          </div>

          <button className="btn btn-primary d-flex align-items-center">
            <Plus size={16} className="me-2" />
            Add Asset
          </button>

        </div>


        {/* Stats Cards */}

        <div className="row g-3 mb-4">

          <div className="col-md-4">

            <div className="card shadow-sm border-0">

              <div className="card-body d-flex align-items-center">

                <div className="bg-primary text-white p-3 rounded me-3">
                  <Laptop />
                </div>

                <div>
                  <p className="text-muted small mb-1">
                    Total Assets
                  </p>
                  <h4 className="fw-bold mb-0">
                    124
                  </h4>
                </div>

              </div>

            </div>

          </div>


          <div className="col-md-4">

            <div className="card shadow-sm border-0">

              <div className="card-body d-flex align-items-center">

                <div className="bg-success text-white p-3 rounded me-3">
                  <Monitor />
                </div>

                <div>
                  <p className="text-muted small mb-1">
                    Assigned
                  </p>
                  <h4 className="fw-bold mb-0">
                    98
                  </h4>
                </div>

              </div>

            </div>

          </div>


          <div className="col-md-4">

            <div className="card shadow-sm border-0">

              <div className="card-body d-flex align-items-center">

                <div className="bg-warning text-white p-3 rounded me-3">
                  <Smartphone />
                </div>

                <div>
                  <p className="text-muted small mb-1">
                    Maintenance
                  </p>
                  <h4 className="fw-bold mb-0">
                    12
                  </h4>
                </div>

              </div>

            </div>

          </div>

        </div>


        {/* Search & Filter */}

        <div className="card shadow-sm mb-3">

          <div className="card-body d-flex justify-content-between align-items-center">

            <div className="input-group w-50">

              <span className="input-group-text">
                <Search size={16} />
              </span>

              <input
                type="text"
                className="form-control"
                placeholder="Search assets by ID, name or employee..."
              />

            </div>

            <button className="btn btn-outline-secondary d-flex align-items-center">
              <Filter size={16} className="me-2" />
              Filter
            </button>

          </div>

        </div>


        {/* Assets Table */}

        <div className="card shadow-sm">

          <div className="table-responsive">

            <table className="table table-hover mb-0">

              <thead className="table-light">

                <tr>
                  <th>Asset ID</th>
                  <th>Asset Name</th>
                  <th>Category</th>
                  <th>Assigned To</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>

              </thead>

              <tbody>

                {assets.map((asset) => (

                  <tr key={asset.id}>

                    <td className="fw-semibold text-primary">
                      {asset.id}
                    </td>

                    <td>{asset.name}</td>

                    <td>{asset.category}</td>

                    <td>{asset.employee}</td>

                    <td>

                      <span className={`badge ${
                        asset.status === "Assigned"
                          ? "bg-primary"
                          : "bg-success"
                      }`}>

                        {asset.status}

                      </span>

                    </td>

                    <td className="text-muted">
                      <MoreVertical size={18} />
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
}

export default Assets;