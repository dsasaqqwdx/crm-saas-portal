import React, { useState, useEffect } from "react";
import axios from "axios";

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
    } catch (err) {
      showToast("Failed to load departments", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const openAdd = () => {
    setEditItem(null);
    setFormName("");
    setFormError("");
    setModalOpen(true);
  };

  const openEdit = (dept) => {
    setEditItem(dept);
    setFormName(dept.department_name);
    setFormError("");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditItem(null);
    setFormName("");
    setFormError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formName.trim()) {
      setFormError("Department name is required");
      return;
    }
    setSubmitting(true);
    setFormError("");
    try {
      if (editItem) {
        await axios.put(
          `${API}/api/departments/${editItem.department_id}`,
          { department_name: formName },
          { headers }
        );
        showToast("Department updated successfully");
      } else {
        await axios.post(
          `${API}/api/departments`,
          { department_name: formName },
          { headers }
        );
        showToast("Department created successfully");
      }
      closeModal();
      fetchDepartments();
    } catch (err) {
      setFormError(err.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/api/departments/${id}`, { headers });
      showToast("Department deleted successfully");
      setDeleteConfirm(null);
      fetchDepartments();
    } catch (err) {
      showToast(err.response?.data?.message || "Delete failed", "error");
      setDeleteConfirm(null);
    }
  };

  const filtered = departments.filter((d) =>
    d.department_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={styles.page}>
      {/* Toast */}
      {toast && (
        <div style={{ ...styles.toast, background: toast.type === "error" ? "#ef4444" : "#10b981" }}>
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Departments</h1>
          <p style={styles.subtitle}>Manage your company departments</p>
        </div>
        <button style={styles.addBtn} onClick={openAdd}>
          + Add Department
        </button>
      </div>

      {/* Search */}
      <div style={styles.searchRow}>
        <input
          style={styles.searchInput}
          placeholder="Search departments..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <span style={styles.countBadge}>{filtered.length} total</span>
      </div>

      {/* Table */}
      <div style={styles.card}>
        {loading ? (
          <div style={styles.center}>Loading...</div>
        ) : filtered.length === 0 ? (
          <div style={styles.center}>
            {search ? "No departments match your search." : "No departments found. Add one!"}
          </div>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr style={styles.thead}>
                <th style={styles.th}>#</th>
                <th style={styles.th}>Department Name</th>
                <th style={{ ...styles.th, textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((dept, idx) => (
                <tr key={dept.department_id} style={styles.tr}>
                  <td style={styles.td}>{idx + 1}</td>
                  <td style={styles.td}>
                    <div style={styles.nameCell}>
                      <span style={styles.avatar}>
                        {dept.department_name.charAt(0).toUpperCase()}
                      </span>
                      {dept.department_name}
                    </div>
                  </td>
                  <td style={{ ...styles.td, textAlign: "right" }}>
                    <button style={styles.editBtn} onClick={() => openEdit(dept)}>
                      Edit
                    </button>
                    <button
                      style={styles.deleteBtn}
                      onClick={() => setDeleteConfirm(dept)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h2 style={styles.modalTitle}>
              {editItem ? "Edit Department" : "Add Department"}
            </h2>
            <form onSubmit={handleSubmit}>
              <label style={styles.label}>Department Name *</label>
              <input
                style={styles.input}
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="e.g. Human Resources"
                autoFocus
              />
              {formError && <p style={styles.errorText}>{formError}</p>}
              <div style={styles.modalActions}>
                <button type="button" style={styles.cancelBtn} onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" style={styles.saveBtn} disabled={submitting}>
                  {submitting ? "Saving..." : editItem ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h2 style={styles.modalTitle}>Delete Department</h2>
            <p style={styles.confirmText}>
              Are you sure you want to delete{" "}
              <strong>"{deleteConfirm.department_name}"</strong>? This action cannot be undone.
            </p>
            <div style={styles.modalActions}>
              <button
                style={styles.cancelBtn}
                onClick={() => setDeleteConfirm(null)}
              >
                Cancel
              </button>
              <button
                style={styles.deleteConfirmBtn}
                onClick={() => handleDelete(deleteConfirm.department_id)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: {
    padding: "24px",
    fontFamily: "'Segoe UI', sans-serif",
    background: "#f8fafc",
    minHeight: "100vh",
    position: "relative",
  },
  toast: {
    position: "fixed",
    top: 20,
    right: 20,
    color: "#fff",
    padding: "12px 20px",
    borderRadius: 8,
    fontWeight: 500,
    zIndex: 9999,
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  title: { margin: 0, fontSize: 24, fontWeight: 700, color: "#1e293b" },
  subtitle: { margin: "4px 0 0", color: "#64748b", fontSize: 14 },
  addBtn: {
    background: "#4f46e5",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "10px 18px",
    fontWeight: 600,
    cursor: "pointer",
    fontSize: 14,
  },
  searchRow: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    maxWidth: 320,
    border: "1px solid #e2e8f0",
    borderRadius: 8,
    padding: "8px 14px",
    fontSize: 14,
    outline: "none",
    background: "#fff",
  },
  countBadge: {
    background: "#e0e7ff",
    color: "#4f46e5",
    padding: "4px 12px",
    borderRadius: 20,
    fontSize: 13,
    fontWeight: 600,
  },
  card: {
    background: "#fff",
    borderRadius: 12,
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
    overflow: "hidden",
  },
  center: { padding: 40, textAlign: "center", color: "#94a3b8" },
  table: { width: "100%", borderCollapse: "collapse" },
  thead: { background: "#f1f5f9" },
  th: {
    padding: "12px 16px",
    textAlign: "left",
    fontSize: 12,
    fontWeight: 600,
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  tr: { borderBottom: "1px solid #f1f5f9" },
  td: { padding: "14px 16px", fontSize: 14, color: "#334155" },
  nameCell: { display: "flex", alignItems: "center", gap: 10 },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: "50%",
    background: "#e0e7ff",
    color: "#4f46e5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    fontSize: 14,
    flexShrink: 0,
  },
  editBtn: {
    background: "#f1f5f9",
    color: "#4f46e5",
    border: "none",
    borderRadius: 6,
    padding: "6px 12px",
    cursor: "pointer",
    fontWeight: 500,
    fontSize: 13,
    marginRight: 6,
  },
  deleteBtn: {
    background: "#fff1f2",
    color: "#ef4444",
    border: "none",
    borderRadius: 6,
    padding: "6px 12px",
    cursor: "pointer",
    fontWeight: 500,
    fontSize: 13,
  },
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modal: {
    background: "#fff",
    borderRadius: 12,
    padding: 28,
    width: 420,
    boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
  },
  modalTitle: { margin: "0 0 20px", fontSize: 18, fontWeight: 700, color: "#1e293b" },
  label: { display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 },
  input: {
    width: "100%",
    border: "1px solid #e2e8f0",
    borderRadius: 8,
    padding: "10px 12px",
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box",
  },
  errorText: { color: "#ef4444", fontSize: 13, margin: "6px 0 0" },
  confirmText: { color: "#475569", fontSize: 14, margin: "0 0 20px", lineHeight: 1.6 },
  modalActions: { display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20 },
  cancelBtn: {
    background: "#f1f5f9",
    color: "#64748b",
    border: "none",
    borderRadius: 8,
    padding: "10px 18px",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: 14,
  },
  saveBtn: {
    background: "#4f46e5",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "10px 18px",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: 14,
  },
  deleteConfirmBtn: {
    background: "#ef4444",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "10px 18px",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: 14,
  },
};