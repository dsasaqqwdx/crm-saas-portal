
import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../../../layouts/Sidebar";
import { PageContent } from "../../../layouts/usePageLayout";
import { PlusCircle, X, CreditCard } from "lucide-react";

const API = process.env.REACT_APP_API_URL || "http://localhost:5001";

const STATUS_STYLE = {
  approved: { bg: "#dcfce7", text: "#16a34a" },
  pending: { bg: "#fef9c3", text: "#a16207" },
  rejected: { bg: "#fee2e2", text: "#dc2626" },
};

export default function AdminPaymentsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const [form, setForm] = useState({
    amount: "",
    payment_date: "",
    plan_name: "",
    note: "",
  });

  const token = localStorage.getItem("token");
  const headers = { "x-auth-token": token };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const loadTransactions = async () => {
    try {
      const res = await axios.get(`${API}/api/transactions/my`, { headers });
      setTransactions(res.data.data || []);
    } catch {
      showToast("Failed to load transactions", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.amount || isNaN(form.amount)) {
      showToast("Valid amount is required", "error");
      return;
    }
    setSubmitting(true);
    try {
      await axios.post(`${API}/api/transactions`, form, { headers });
      showToast("Payment submitted for superadmin approval!");
      setForm({ amount: "", payment_date: "", plan_name: "", note: "" });
      setShowForm(false);
      loadTransactions();
    } catch (err) {
      showToast(err.response?.data?.message || "Submission failed", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const fmtDate = (d) =>
    new Date(d).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  const fmtAmount = (a) => "₹" + Number(a).toLocaleString("en-IN");

  const labelStyle = { fontSize: 12, fontWeight: 600, color: "#64748b", marginBottom: 4, display: "block" };
  const inputStyle = { width: "100%", border: "1px solid #e2e8f0", borderRadius: 8, padding: "9px 12px", fontSize: 13, outline: "none", background: "#f8fafc" };

  return (
    <div className="d-flex bg-light min-vh-100">
      <Sidebar />
      <PageContent>
        {toast && (
          <div style={{ position: "fixed", top: 20, right: 20, zIndex: 9999, background: toast.type === "error" ? "#ef4444" : "#10b981", color: "#fff", padding: "12px 20px", borderRadius: 8, fontWeight: 500, boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}>
            {toast.message}
          </div>
        )}

        <div className="container-fluid px-3 px-md-4 py-4">
          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center mb-4 gap-3">
            <div>
              <h2 className="fw-bold fs-3 mb-1">Payments</h2>
              <p className="text-muted small mb-0">Submit payment records for superadmin approval</p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="btn d-flex align-items-center justify-content-center gap-2 px-3 py-2 text-white shadow-sm"
              style={{ background: "#4f46e5", borderRadius: 10, fontSize: 13, fontWeight: 600, border: "none" }}
            >
              <PlusCircle size={16} /> Submit Payment
            </button>
          </div>

          {/* Transactions Table Card */}
          <div className="bg-white rounded-4 border shadow-sm overflow-hidden">
            {loading ? (
              <div className="text-center p-5 text-muted">Loading...</div>
            ) : transactions.length === 0 ? (
              <div className="text-center p-5">
                <div style={{ fontSize: 40, marginBottom: 12 }}>💳</div>
                <div className="fw-bold text-dark mb-1">No payments yet</div>
                <div className="text-muted small">Click Submit Payment to add your first record</div>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table align-middle mb-0">
                  <thead className="bg-light">
                    <tr style={{ fontSize: 11, color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                      <th className="px-4 py-3">#</th>
                      <th className="py-3">Plan</th>
                      <th className="py-3">Amount</th>
                      <th className="py-3">Payment Date</th>
                      <th className="py-3">Status</th>
                      <th className="py-3 text-end px-4">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((tx, i) => (
                      <tr key={tx.transaction_id} className="hover-row">
                        <td className="px-4 py-3 text-muted small">{i + 1}</td>
                        <td className="py-3 fw-semibold text-dark">{tx.plan_name || "—"}</td>
                        <td className="py-3 fw-bold text-dark">{fmtAmount(tx.amount)}</td>
                        <td className="py-3 text-muted small">{fmtDate(tx.payment_date)}</td>
                        <td className="py-3">
                          <span className="badge rounded-pill px-2 py-1" style={{ background: STATUS_STYLE[tx.status]?.bg || "#f1f5f9", color: STATUS_STYLE[tx.status]?.text || "#64748b", fontSize: "11px" }}>
                            {tx.status}
                          </span>
                        </td>
                        <td className="py-3 text-end px-4">
                           {tx.status === 'rejected' && <span className="text-danger small" title={tx.reject_reason}>View Reason</span>}
                           {tx.status !== 'rejected' && <span className="text-muted small">—</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Payment Modal */}
        {showForm && (
          <div className="modal d-block show" tabIndex="-1" style={{ background: "rgba(15,23,42,0.6)", backdropFilter: "blur(4px)", zIndex: 1050 }}>
            <div className="modal-dialog modal-dialog-centered px-3">
              <div className="modal-content border-0 rounded-4 shadow-lg overflow-hidden">
                <div className="modal-header border-0 p-4 pb-0">
                  <div>
                    <h5 className="modal-title fw-bold">Submit Payment</h5>
                    <p className="text-muted small mb-0">Sent to superadmin for verification</p>
                  </div>
                  <button type="button" className="btn-close shadow-none" onClick={() => setShowForm(false)}></button>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="modal-body p-4">
                    <div className="mb-3">
                      <label style={labelStyle}>Amount (₹) *</label>
                      <input type="number" value={form.amount} onChange={e => setForm(p => ({ ...p, amount: e.target.value }))} placeholder="Enter amount" required style={inputStyle} />
                    </div>
                    <div className="mb-3">
                      <label style={labelStyle}>Plan Name</label>
                      <input type="text" value={form.plan_name} onChange={e => setForm(p => ({ ...p, plan_name: e.target.value }))} placeholder="e.g. Basic, Pro" style={inputStyle} />
                    </div>
                    <div className="mb-3">
                      <label style={labelStyle}>Payment Date</label>
                      <input type="date" value={form.payment_date} onChange={e => setForm(p => ({ ...p, payment_date: e.target.value }))} style={inputStyle} />
                    </div>
                    <div className="mb-0">
                      <label style={labelStyle}>Note (optional)</label>
                      <textarea value={form.note} onChange={e => setForm(p => ({ ...p, note: e.target.value }))} placeholder="Additional details..." rows={3} style={{ ...inputStyle, resize: "none" }} />
                    </div>
                  </div>
                  <div className="modal-footer border-0 p-4 pt-0 gap-2">
                    <button type="button" className="btn btn-light rounded-3 px-4 flex-grow-1" style={{ fontWeight: 600 }} onClick={() => setShowForm(false)}>Cancel</button>
                    <button type="submit" disabled={submitting} className="btn text-white rounded-3 px-4 flex-grow-2" style={{ background: "#4f46e5", fontWeight: 600 }}>
                      {submitting ? "Submitting..." : "Submit for Approval"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
        <style>{`.hover-row:hover { background-color: #f8fafc; transition: 0.2s; }`}</style>
      </PageContent>
    </div>
  );
}