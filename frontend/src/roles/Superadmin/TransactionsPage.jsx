import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../../layouts/Sidebar";

const API = process.env.REACT_APP_API_URL || "http://localhost:5001";

const STATUS_COLORS = {
  paid:    { bg: "#dcfce7", text: "#16a34a" },
  pending: { bg: "#fef9c3", text: "#a16207" },
  failed:  { bg: "#fee2e2", text: "#dc2626" },
};

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [toast, setToast] = useState(null);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [form, setForm] = useState({ company_id: "", amount: "", payment_date: "", status: "pending" });
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const token = localStorage.getItem("token");
  const headers = { "x-auth-token": token };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [txRes, statsRes, compRes] = await Promise.all([
        axios.get(`${API}/api/transactions`, { headers }),
        axios.get(`${API}/api/transactions/stats`, { headers }),
        axios.get(`${API}/api/saas/companies`, { headers }),
      ]);
      setTransactions(txRes.data.data || []);
      setStats(statsRes.data.data || null);
      setCompanies(compRes.data.data || []);
    } catch (err) {
      showToast("Failed to load data", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const openAdd = () => {
    setEditItem(null);
    setForm({ company_id: "", amount: "", payment_date: "", status: "pending" });
    setFormError("");
    setModalOpen(true);
  };

  const openEdit = (tx) => {
    setEditItem(tx);
    setForm({
      company_id: tx.company_id,
      amount: tx.amount,
      payment_date: tx.payment_date ? tx.payment_date.split("T")[0] : "",
      status: tx.status || "pending",
    });
    setFormError("");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditItem(null);
    setFormError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.company_id) { setFormError("Please select a company"); return; }
    if (!form.amount || isNaN(form.amount)) { setFormError("Enter a valid amount"); return; }
    setSubmitting(true);
    setFormError("");
    try {
      if (editItem) {
        await axios.put(`${API}/api/transactions/${editItem.transaction_id}`, form, { headers });
        showToast("Transaction updated");
      } else {
        await axios.post(`${API}/api/transactions`, form, { headers });
        showToast("Transaction created");
      }
      closeModal();
      fetchAll();
    } catch (err) {
      setFormError(err.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/api/transactions/${id}`, { headers });
      showToast("Transaction deleted");
      setDeleteConfirm(null);
      fetchAll();
    } catch (err) {
      showToast("Delete failed", "error");
      setDeleteConfirm(null);
    }
  };

  const filtered = transactions.filter((tx) => {
    const matchSearch =
      (tx.company_name || "").toLowerCase().includes(search.toLowerCase()) ||
      String(tx.transaction_id).includes(search);
    const matchStatus = filterStatus === "all" || (tx.status || "").toLowerCase() === filterStatus;
    return matchSearch && matchStatus;
  });

  const statCards = stats ? [
    { label: "Total Transactions", value: stats.total, sub: `₹${stats.totalAmount?.toLocaleString()}`, color: "#4f46e5", bg: "#e0e7ff", icon: "💳" },
    { label: "Paid", value: stats.paid, sub: `₹${stats.paidAmount?.toLocaleString()}`, color: "#16a34a", bg: "#dcfce7", icon: "✅" },
    { label: "Pending", value: stats.pending, sub: `₹${stats.pendingAmount?.toLocaleString()}`, color: "#a16207", bg: "#fef9c3", icon: "⏳" },
    { label: "Failed", value: stats.failed, sub: "requires attention", color: "#dc2626", bg: "#fee2e2", icon: "❌" },
  ] : [];

  return (
    <div className="d-flex bg-light min-vh-100">
      <Sidebar />
      <div className="container-fluid p-4" style={{ marginLeft: "250px" }}>

        {/* Toast */}
        {toast && (
          <div style={{
            position: "fixed", top: 20, right: 20, zIndex: 9999,
            background: toast.type === "error" ? "#ef4444" : "#10b981",
            color: "#fff", padding: "12px 20px", borderRadius: 8,
            fontWeight: 500, boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
          }}>
            {toast.message}
          </div>
        )}

        {/* Header */}
        <div className="d-flex justify-content-between align-items-start mb-4">
          <div>
            <h2 className="fw-bold mb-1">Transactions</h2>
            <p className="text-muted mb-0">Monitor all company subscription payments</p>
          </div>
          <button className="btn btn-primary fw-semibold" onClick={openAdd}>
            + Add Transaction
          </button>
        </div>

        {/* Stat Cards */}
        {stats && (
          <div className="row g-3 mb-4">
            {statCards.map((card) => (
              <div key={card.label} className="col-md-6 col-lg-3">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body d-flex align-items-center gap-3">
                    <div style={{
                      width: 52, height: 52, borderRadius: 12,
                      background: card.bg, display: "flex",
                      alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0
                    }}>
                      {card.icon}
                    </div>
                    <div>
                      <div style={{ fontSize: 24, fontWeight: 700, color: card.color, lineHeight: 1 }}>
                        {card.value}
                      </div>
                      <div className="text-muted small">{card.label}</div>
                      <div style={{ fontSize: 12, color: card.color, fontWeight: 600 }}>{card.sub}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Filters */}
        <div className="d-flex gap-2 mb-3 flex-wrap">
          <input
            className="form-control"
            style={{ maxWidth: 280 }}
            placeholder="Search by company or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {["all", "paid", "pending", "failed"].map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`btn btn-sm fw-semibold ${filterStatus === s ? "btn-primary" : "btn-outline-secondary"}`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
          <span className="badge bg-light text-dark border d-flex align-items-center px-3" style={{ fontSize: 13 }}>
            {filtered.length} results
          </span>
        </div>

        {/* Table */}
        <div className="card border-0 shadow-sm">
          <div className="card-body p-0">
            {loading ? (
              <div className="text-center text-muted p-5">Loading...</div>
            ) : filtered.length === 0 ? (
              <div className="text-center text-muted p-5">No transactions found.</div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="px-4">#ID</th>
                      <th>Company</th>
                      <th>Amount</th>
                      <th>Payment Date</th>
                      <th>Status</th>
                      <th className="text-end px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((tx) => {
                      const statusKey = (tx.status || "pending").toLowerCase();
                      const sc = STATUS_COLORS[statusKey] || STATUS_COLORS.pending;
                      return (
                        <tr key={tx.transaction_id}>
                          <td className="px-4 text-muted" style={{ fontSize: 13 }}>
                            #{tx.transaction_id}
                          </td>
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              <div style={{
                                width: 32, height: 32, borderRadius: "50%",
                                background: "#e0e7ff", color: "#4f46e5",
                                display: "flex", alignItems: "center",
                                justifyContent: "center", fontWeight: 700, fontSize: 13, flexShrink: 0
                              }}>
                                {(tx.company_name || "?").charAt(0).toUpperCase()}
                              </div>
                              <span className="fw-semibold" style={{ fontSize: 14 }}>{tx.company_name || "—"}</span>
                            </div>
                          </td>
                          <td className="fw-bold" style={{ fontSize: 15 }}>
                            ₹{parseFloat(tx.amount || 0).toLocaleString()}
                          </td>
                          <td style={{ fontSize: 14, color: "#64748b" }}>
                            {tx.payment_date
                              ? new Date(tx.payment_date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
                              : "—"}
                          </td>
                          <td>
                            <span style={{
                              background: sc.bg, color: sc.text,
                              padding: "4px 12px", borderRadius: 20,
                              fontSize: 12, fontWeight: 600, textTransform: "capitalize"
                            }}>
                              {tx.status || "pending"}
                            </span>
                          </td>
                          <td className="text-end px-4">
                            <button
                              className="btn btn-sm btn-light me-2"
                              style={{ color: "#4f46e5", fontWeight: 500 }}
                              onClick={() => openEdit(tx)}
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-sm"
                              style={{ background: "#fff1f2", color: "#ef4444", fontWeight: 500 }}
                              onClick={() => setDeleteConfirm(tx)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Add/Edit Modal */}
        {modalOpen && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
            <div style={{ background: "#fff", borderRadius: 12, padding: 28, width: 440, boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
              <h5 className="fw-bold mb-4">{editItem ? "Edit Transaction" : "Add Transaction"}</h5>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold small">Company *</label>
                  <select
                    className="form-select"
                    value={form.company_id}
                    onChange={(e) => setForm({ ...form, company_id: e.target.value })}
                  >
                    <option value="">Select company...</option>
                    {companies.map((c) => (
                      <option key={c.company_id} value={c.company_id}>{c.company_name}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold small">Amount (₹) *</label>
                  <input
                    className="form-control"
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                    placeholder="e.g. 4999"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold small">Payment Date</label>
                  <input
                    className="form-control"
                    type="date"
                    value={form.payment_date}
                    onChange={(e) => setForm({ ...form, payment_date: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold small">Status *</label>
                  <select
                    className="form-select"
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>
                {formError && <p className="text-danger small mb-3">{formError}</p>}
                <div className="d-flex justify-content-end gap-2">
                  <button type="button" className="btn btn-light fw-semibold" onClick={closeModal}>Cancel</button>
                  <button type="submit" className="btn btn-primary fw-semibold" disabled={submitting}>
                    {submitting ? "Saving..." : editItem ? "Update" : "Create"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirm Modal */}
        {deleteConfirm && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
            <div style={{ background: "#fff", borderRadius: 12, padding: 28, width: 400, boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
              <h5 className="fw-bold mb-3">Delete Transaction</h5>
              <p className="text-muted mb-4">
                Are you sure you want to delete transaction <strong>#{deleteConfirm.transaction_id}</strong> for <strong>{deleteConfirm.company_name}</strong>? This cannot be undone.
              </p>
              <div className="d-flex justify-content-end gap-2">
                <button className="btn btn-light fw-semibold" onClick={() => setDeleteConfirm(null)}>Cancel</button>
                <button className="btn btn-danger fw-semibold" onClick={() => handleDelete(deleteConfirm.transaction_id)}>Delete</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
