import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../../../layouts/Sidebar";
import { PageContent } from "../../../layouts/usePageLayout";
import { Search, Plus, Edit2, Trash2, AlertTriangle, X } from "lucide-react";

const API = process.env.REACT_APP_API_URL || "http://localhost:5001";

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [formName, setFormName] = useState("");
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [toast, setToast] = useState(null);
  const [search, setSearch] = useState("");

  const token = localStorage.getItem("token");
  const headers = { "x-auth-token": token };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/api/departments`, { headers });
      setDepartments(res.data.data || []);
    } catch {
      showToast("Failed to load departments", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDepartments(); }, []);

  const openAdd = () => { setEditItem(null); setFormName(""); setFormError(""); setModalOpen(true); };
  const openEdit = (dept) => { setEditItem(dept); setFormName(dept.department_name); setFormError(""); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditItem(null); setFormName(""); setFormError(""); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formName.trim()) { setFormError("Department name is required"); return; }
    setSubmitting(true); setFormError("");
    try {
      if (editItem) {
        await axios.put(`${API}/api/departments/${editItem.department_id}`, { department_name: formName }, { headers });
        showToast("Department updated successfully");
      } else {
        await axios.post(`${API}/api/departments`, { department_name: formName }, { headers });
        showToast("Department created successfully");
      }
      closeModal(); fetchDepartments();
    } catch (err) {
      setFormError(err.response?.data?.message || "Something went wrong");
    } finally { setSubmitting(false); }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/api/departments/${id}`, { headers });
      showToast("Department deleted successfully");
      setDeleteConfirm(null); fetchDepartments();
    } catch (err) {
      showToast(err.response?.data?.message || "Delete failed", "error");
      setDeleteConfirm(null);
    }
  };

  const filtered = departments.filter((d) =>
    d.department_name.toLowerCase().includes(search.toLowerCase())
  );

  const palette = [
    { bg: "#eef2ff", color: "#6366f1" },
    { bg: "#ecfdf5", color: "#10b981" },
    { bg: "#fffbeb", color: "#f59e0b" },
    { bg: "#fdf4ff", color: "#d946ef" },
    { bg: "#eff6ff", color: "#3b82f6" },
    { bg: "#fef2f2", color: "#ef4444" },
  ];

  return (
    <div className="d-flex bg-light min-vh-100">
      <Sidebar />
      <PageContent>
        <div className="container-fluid px-3 px-md-4 py-4">
          
          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center mb-4 gap-3">
            <div>
              <h2 className="fw-bold fs-3 mb-1" style={{ color: "#0f172a", letterSpacing: "-0.5px" }}>
                Departments
              </h2>
              <p className="text-muted small mb-0">Manage and structure company departments and workflows.</p>
            </div>
            <button 
              className="btn d-flex align-items-center justify-content-center gap-2 px-4 py-2 text-white shadow-sm"
              style={{ background: "#6366f1", borderRadius: "12px", fontWeight: "700", border: "none" }}
              onClick={openAdd}
            >
              <Plus size={18} /> Add Department
            </button>
          </div>

          <div className="bg-white p-3 rounded-4 border mb-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 shadow-sm">
            <div className="position-relative" style={{ maxWidth: "400px", flex: 1 }}>
              <Search className="position-absolute top-50 translate-middle-y ms-3 text-muted" size={16} />
              <input
                type="text"
                placeholder="Search departments..."
                className="form-control ps-5 py-2 border-0 bg-light rounded-3 shadow-none"
                style={{ fontSize: "14px" }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="px-3 py-1 bg-light rounded-pill small fw-bold text-muted border text-center">
              {filtered.length} Units Found
            </div>
          </div>

          <div className="bg-white rounded-4 border shadow-sm overflow-hidden">
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead className="bg-light">
                  <tr style={{ fontSize: "11px", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px" }}>
                    <th className="px-4 py-3 border-0">Department Entity</th>
                    <th className="px-4 py-3 border-0">Status</th>
                    <th className="px-4 py-3 border-0 text-end">Operational Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="3" className="text-center py-5">
                        <div className="spinner-border text-primary" role="status" />
                        <p className="mt-2 text-muted small">Syncing organization data...</p>
                      </td>
                    </tr>
                  ) : filtered.length > 0 ? (
                    filtered.map((dept, idx) => (
                      <tr key={dept.department_id} className="hover-fade">
                        <td className="px-4 py-3">
                          <div className="d-flex align-items-center gap-3">
                            <div 
                              className="flex-shrink-0 d-flex align-items-center justify-content-center rounded-3 fw-bold" 
                              style={{ 
                                width: "40px", 
                                height: "40px", 
                                backgroundColor: palette[idx % palette.length].bg, 
                                color: palette[idx % palette.length].color,
                                fontSize: "15px"
                              }}
                            >
                              {dept.department_name.charAt(0)}
                            </div>
                            <div>
                              <div className="fw-bold text-dark" style={{ fontSize: "15px" }}>{dept.department_name}</div>
                              <div className="text-muted" style={{ fontSize: "11px" }}>ID: DEPT_{dept.department_id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="badge rounded-pill bg-success-subtle text-success px-2 py-1" style={{ fontSize: "11px", fontWeight: "700" }}>
                            Active Unit
                          </span>
                        </td>
                        <td className="px-4 py-3 text-end">
                          <div className="d-flex justify-content-end gap-2">
                            <button onClick={() => openEdit(dept)} className="btn btn-sm btn-light text-primary border-0 rounded-2 p-2 shadow-none">
                              <Edit2 size={16} />
                            </button>
                            <button onClick={() => setDeleteConfirm(dept)} className="btn btn-sm btn-light text-danger border-0 rounded-2 p-2 shadow-none">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="text-center py-5 text-muted">
                        No departments match your search criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {modalOpen && (
          <div className="modal d-block show" tabIndex="-1" style={{ background: "rgba(15, 23, 42, 0.6)", backdropFilter: "blur(4px)" }}>
            <div className="modal-dialog modal-dialog-centered px-3">
              <div className="modal-content border-0 rounded-4 shadow-lg overflow-hidden">
                <div className="modal-header border-0 p-4 pb-0">
                  <h5 className="modal-title fw-bold fs-4" style={{ fontFamily: "Plus Jakarta Sans" }}>
                    {editItem ? "Modify Unit" : "New Department"}
                  </h5>
                  <button type="button" className="btn-close shadow-none" onClick={closeModal}></button>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="modal-body p-4">
                    <p className="text-muted small mb-4">Enter the official name for this organizational branch.</p>
                    <div className="mb-0">
                      <label className="form-label small fw-bold text-muted text-uppercase">Department Name</label>
                      <input
                        className="form-control rounded-3 py-2 shadow-none"
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder="e.g. Talent Acquisition"
                        autoFocus
                      />
                      {formError && <p className="text-danger small fw-bold mt-2 mb-0">{formError}</p>}
                    </div>
                  </div>
                  <div className="modal-footer border-0 p-4 pt-0 gap-2">
                    <button type="button" onClick={closeModal} className="btn btn-light rounded-3 px-4 flex-grow-1 fw-bold">Discard</button>
                    <button type="submit" disabled={submitting} className="btn text-white rounded-3 px-4 flex-grow-2 fw-bold" style={{ background: "#6366f1" }}>
                      {submitting ? "Processing..." : (editItem ? "Update Entity" : "Create Unit")}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {deleteConfirm && (
          <div className="modal d-block show" tabIndex="-1" style={{ background: "rgba(15, 23, 42, 0.6)", backdropFilter: "blur(4px)" }}>
            <div className="modal-dialog modal-dialog-centered px-3">
              <div className="modal-content border-0 rounded-4 shadow-lg text-center p-4">
                <div className="mx-auto mb-3 d-flex align-items-center justify-content-center rounded-circle bg-danger-subtle text-danger" style={{ width: "64px", height: "64px" }}>
                  <AlertTriangle size={32} />
                </div>
                <h3 className="fw-bold fs-4">Terminate Unit?</h3>
                <p className="text-muted small mb-4 px-3">
                  Are you sure you want to delete <strong>{deleteConfirm.department_name}</strong>? This action is irreversible.
                </p>
                <div className="d-flex gap-2">
                  <button onClick={() => setDeleteConfirm(null)} className="btn btn-light rounded-3 px-4 flex-grow-1 fw-bold shadow-none">Keep Unit</button>
                  <button onClick={() => handleDelete(deleteConfirm.department_id)} className="btn btn-danger rounded-3 px-4 flex-grow-1 fw-bold shadow-none">Confirm Delete</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Toast Notification */}
        {toast && (
          <div 
            className="position-fixed bottom-0 end-0 m-4 p-3 rounded-3 text-white shadow-lg animate-fade-in" 
            style={{ 
              background: toast.type === "error" ? "#ef4444" : "#1e293b", 
              zIndex: 2000,
              minWidth: "250px"
            }}
          >
            <div className="d-flex align-items-center justify-content-between gap-2">
              <div className="small fw-bold">{toast.message}</div>
              <X size={14} className="opacity-50 cursor-pointer" onClick={() => setToast(null)} />
            </div>
          </div>
        )}

        <style>{`
          .hover-fade:hover { background-color: #f8fafc; transition: background 0.2s ease; }
          .animate-fade-in { animation: fadeIn 0.3s ease-out; }
          @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
          .cursor-pointer { cursor: pointer; }
        `}</style>
      </PageContent>
    </div>
  );
}