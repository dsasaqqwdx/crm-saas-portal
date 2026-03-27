import React, { useEffect, useState } from "react";
import Sidebar from "../layouts/Sidebar";
import { PageContent } from "../layouts/usePageLayout";
import { Briefcase, Plus, Trash2, Hash, Building, Info } from "lucide-react";
import axios from "axios";

const Designations = () => {
  const [designations, setDesignations] = useState([]);
  const [designationName, setDesignationName] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchDesignations = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5001/api/designations");
      setDesignations(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDesignations();
  }, []);

  const addDesignation = async () => {
    if (!designationName || !companyId) {
      return alert("Please enter both designation name and company ID");
    }

    try {
      await axios.post("http://localhost:5001/api/designations", {
        designation_name: designationName,
        company_id: parseInt(companyId),
      });

      setDesignationName("");
      setCompanyId("");
      fetchDesignations();
    } catch (err) {
      console.error(err);
      alert("Failed to add designation");
    }
  };

  const deleteDesignation = async (id) => {
    if (window.confirm("Are you sure you want to remove this role?")) {
      try {
        await axios.delete(`http://localhost:5001/api/designations/${id}`);
        fetchDesignations();
      } catch (err) {
        console.error(err);
        alert("Failed to delete designation");
      }
    }
  };

  return (
    <div className="d-flex bg-light min-vh-100">
      <Sidebar />
      <PageContent>
        <div className="container-fluid px-3 px-md-4 py-4">
          
          {/* Header Section */}
          <div className="mb-4">
            <h2 className="fw-bold fs-3 mb-1" style={{ color: "#0f172a", letterSpacing: "-0.5px" }}>
              Designations
            </h2>
            <p className="text-muted small mb-0">
              Configure organizational hierarchies and define system-level roles.
            </p>
          </div>

          {/* Registration Form Card */}
          <div className="bg-white rounded-4 border shadow-sm p-4 mb-4">
            <div className="row g-3 align-items-end">
              <div className="col-12 col-md-5">
                <label className="form-label small fw-bold text-muted text-uppercase">Role Title</label>
                <div className="input-group shadow-none">
                  <span className="input-group-text bg-light border-end-0 rounded-start-3 text-muted">
                    <Briefcase size={16} />
                  </span>
                  <input
                    type="text"
                    className="form-control bg-light border-start-0 rounded-end-3 py-2 shadow-none"
                    placeholder="e.g. Senior Software Engineer"
                    value={designationName}
                    onChange={(e) => setDesignationName(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-12 col-sm-6 col-md-3">
                <label className="form-label small fw-bold text-muted text-uppercase">Company ID</label>
                <div className="input-group shadow-none">
                  <span className="input-group-text bg-light border-end-0 rounded-start-3 text-muted">
                    <Building size={16} />
                  </span>
                  <input
                    type="number"
                    className="form-control bg-light border-start-0 rounded-end-3 py-2 shadow-none"
                    placeholder="ID"
                    value={companyId}
                    onChange={(e) => setCompanyId(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-12 col-sm-6 col-md-4 col-lg-2">
                <button 
                  className="btn w-100 text-white fw-bold py-2 shadow-sm d-flex align-items-center justify-content-center gap-2"
                  style={{ background: "#4f46e5", borderRadius: "12px", border: "none" }}
                  onClick={addDesignation}
                >
                  <Plus size={18} /> Register Role
                </button>
              </div>
            </div>
          </div>

          {/* Roles Table Card */}
          <div className="bg-white rounded-4 border shadow-sm overflow-hidden">
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead className="bg-light">
                  <tr style={{ fontSize: "11px", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px" }}>
                    <th className="px-4 py-3 border-0">Identity</th>
                    <th className="px-4 py-3 border-0">Role Designation</th>
                    <th className="px-4 py-3 border-0">Entity Mapping</th>
                    <th className="px-4 py-3 border-0 text-end">Management</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="4" className="text-center py-5">
                        <div className="spinner-border text-primary border-0" role="status" style={{ width: "2rem", height: "2rem" }} />
                        <p className="mt-2 text-muted small fw-medium">Loading directory...</p>
                      </td>
                    </tr>
                  ) : designations.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center py-5">
                        <Info size={40} className="text-light mb-2" />
                        <p className="text-muted small mb-0">The role directory is currently empty.</p>
                      </td>
                    </tr>
                  ) : (
                    designations.map((d) => (
                      <tr key={d.designation_id} className="hover-row">
                        <td className="px-4 py-3">
                          <span className="badge font-monospace text-secondary bg-light border px-2 py-1" style={{ fontSize: "11px" }}>
                            #{d.designation_id}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="fw-bold text-dark" style={{ fontSize: "15px" }}>{d.designation_name}</span>
                        </td>
                        <td className="px-4 py-3 text-muted">
                          <span className="badge rounded-pill bg-primary-subtle text-primary px-3 py-1 fw-bold" style={{ fontSize: "11px" }}>
                            ORG_UNIT_{d.company_id}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-end">
                          <button
                            className="btn btn-sm btn-outline-danger border-0 rounded-2 p-2 shadow-none"
                            onClick={() => deleteDesignation(d.designation_id)}
                            title="Remove Role"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <style>{`
          .hover-row:hover { background-color: #f8fafc; transition: 0.2s; }
          input[type=number]::-webkit-inner-spin-button, 
          input[type=number]::-webkit-outer-spin-button { 
            -webkit-appearance: none; margin: 0; 
          }
        `}</style>
      </PageContent>
    </div>
  );
};

export default Designations;