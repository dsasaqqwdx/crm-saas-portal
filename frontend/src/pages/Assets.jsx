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

  const [assets] = useState([
    { id: "AST-001", name: "MacBook Pro 14\"", category: "Electronics", employee: "Abhi", status: "Assigned" },
    { id: "AST-002", name: "Dell Monitor 27\"", category: "Peripheral", employee: "Sneha", status: "Assigned" },
    { id: "AST-003", name: "Office Chair", category: "Furniture", employee: "-", status: "Available" },
    { id: "AST-004", name: "iPhone 15", category: "Mobile", employee: "Rahul", status: "Assigned" },
  ]);

  return (

    <div className="d-flex bg-light min-vh-100">

      <Sidebar />

      <div className="container-fluid p-4" style={{ marginLeft: "250px" }}>

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

}

export default Assets;