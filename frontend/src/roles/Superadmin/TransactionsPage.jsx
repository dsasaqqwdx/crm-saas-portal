

import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../layouts/Sidebar";
import { PageContent } from "../../layouts/usePageLayout";
import { X } from "lucide-react";

const API = process.env.REACT_APP_API_URL || "http://localhost:5001";

const STATUS_STYLE = {
  approved: { bg: "#dcfce7", text: "#16a34a" },
  pending:  { bg: "#fef9c3", text: "#a16207" },
  rejected: { bg: "#fee2e2", text: "#dc2626" },
};

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [rejectModal, setRejectModal] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [rejecting, setRejecting] = useState(false);
  const [toast, setToast] = useState(null);

  const token = localStorage.getItem("token");
  const headers = { "x-auth-token": token };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadAll = async () => {
    try {
      const [txRes, statsRes] = await Promise.all([
        axios.get(`${API}/api/transactions`, { headers }),
        axios.get(`${API}/api/transactions/stats`, { headers }),
      ]);
      setTransactions(txRes.data.data || []);
      setStats(statsRes.data.data || {});
    } catch { showToast("Failed to load", "error"); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadAll(); }, []);

  const handleApprove = async (id) => {
    try {
      await axios.put(`${API}/api/transactions/approve/${id}`, {}, { headers });
      showToast("Transaction approved"); loadAll();
    } catch { showToast("Approval failed", "error"); }
  };

  const handleReject = async () => {
    setRejecting(true);
    try {
      await axios.put(`${API}/api/transactions/reject/${rejectModal}`, { reason: rejectReason }, { headers });
      showToast("Transaction rejected");
      setRejectModal(null); setRejectReason(""); loadAll();
    } catch { showToast("Rejection failed", "error"); }
    finally { setRejecting(false); }
  };

  const fmtDate = (d) => new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  const fmtAmount = (a) => "₹" + Number(a).toLocaleString("en-IN");

  return (
    <div className="d-flex bg-light min-vh-100">
      <Sidebar />
      <PageContent>
        <div className="container-fluid p-3 p-md-4">
          {toast && (
            <div style={{ position: "fixed", top: 20, right: 20, zIndex: 9999, background: toast.type === "error" ? "#ef4444" : "#10b981", color: "#fff", padding: "12px 20px", borderRadius: 8, fontWeight: 500 }}>
              {toast.message}
            </div>
          )}

          {rejectModal && (
            <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 9998, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
              <div style={{ background: "#fff", borderRadius: 14, padding: 24, width: "100%", maxWidth: 420 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>Reject Transaction</div>
                  <button onClick={() => { setRejectModal(null); setRejectReason(""); }} style={{ background: "transparent", border: "none", cursor: "pointer" }}>
                    <X size={18} />
                  </button>
                </div>
                <div style={{ fontSize: 13, color: "#64748b", marginBottom: 12 }}>Provide a reason for rejection (optional)</div>
                <textarea value={rejectReason} onChange={e => setRejectReason(e.target.value)}
                  placeholder="e.g. Payment amount mismatch..." rows={3}
                  style={{ width: "100%", border: "1px solid #e2e8f0", borderRadius: 8, padding: "9px 12px", fontSize: 13, resize: "none", marginBottom: 16 }} />
                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={() => { setRejectModal(null); setRejectReason(""); }}
                    style={{ flex: 1, padding: 10, background: "#f1f5f9", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Cancel</button>
                  <button onClick={handleReject} disabled={rejecting}
                    style={{ flex: 1, padding: 10, background: "#ef4444", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                    {rejecting ? "Rejecting..." : "Confirm Reject"}
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="mb-4">
            <h2 className="fw-bold mb-1 fs-4">Transactions</h2>
            <p className="text-muted mb-0 small">Review and approve company payment submissions</p>
          </div>

          <div className="row g-3 mb-4">
            {[
              { label: "Total",    value: stats.total,    amount: stats.totalAmount,    color: "#6366f1" },
              { label: "Approved", value: stats.approved, amount: stats.approvedAmount, color: "#16a34a" },
              { label: "Pending",  value: stats.pending,  amount: stats.pendingAmount,  color: "#ca8a04" },
              { label: "Rejected", value: stats.rejected, amount: null,                 color: "#dc2626" },
            ].map(s => (
              <div key={s.label} className="col-6 col-md-3">
                <div style={{ background: "#fff", borderRadius: 12, padding: "14px 16px", boxShadow: "0 4px 16px rgba(0,0,0,0.06)" }}>
                  <div style={{ fontSize: 11, color: "#64748b", marginBottom: 4 }}>{s.label}</div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: s.color }}>{s.value || 0}</div>
                  {s.amount !== null && (
                    <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>{fmtAmount(s.amount || 0)}</div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div style={{ background: "#fff", borderRadius: 14, boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
            {loading ? (
              <div className="text-center p-5 text-muted">Loading...</div>
            ) : transactions.length === 0 ? (
              <div className="text-center p-5">
                <div style={{ fontSize: 36, marginBottom: 12 }}>💳</div>
                <div style={{ fontWeight: 600 }}>No transactions yet</div>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table align-middle mb-0" style={{ minWidth: "600px" }}>
                  <thead style={{ background: "#f8fafc" }}>
                    <tr style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>
                      <th style={{ padding: "14px 16px" }}>#</th>
                      <th>Company</th>
                      <th className="d-none d-sm-table-cell">Plan</th>
                      <th>Amount</th>
                      <th className="d-none d-md-table-cell">Date</th>
                      <th>Status</th>
                      <th className="text-end" style={{ paddingRight: 16 }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((tx, i) => (
                      <tr key={tx.transaction_id} style={{ fontSize: 13, borderTop: "1px solid #f1f5f9" }}>
                        <td style={{ padding: "14px 16px", color: "#94a3b8" }}>{i + 1}</td>
                        <td style={{ fontWeight: 600, fontSize: "0.85rem" }}>{tx.company_name || "—"}</td>
                        <td className="d-none d-sm-table-cell" style={{ color: "#64748b", fontSize: "0.85rem" }}>{tx.plan_name || "—"}</td>
                        <td style={{ fontWeight: 700, fontSize: "0.9rem" }}>{fmtAmount(tx.amount)}</td>
                        <td className="d-none d-md-table-cell" style={{ fontSize: "0.85rem" }}>{fmtDate(tx.payment_date)}</td>
                        <td>
                          <span style={{ background: STATUS_STYLE[tx.status]?.bg, color: STATUS_STYLE[tx.status]?.text, padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600 }}>
                            {tx.status}
                          </span>
                        </td>
                        <td className="text-end" style={{ paddingRight: 16 }}>
                          {tx.status === "pending" ? (
                            <div style={{ display: "flex", gap: 4, justifyContent: "flex-end", flexWrap: "wrap" }}>
                              <button onClick={() => handleApprove(tx.transaction_id)}
                                style={{ padding: "4px 10px", background: "#dcfce7", color: "#16a34a", border: "1px solid #bbf7d0", borderRadius: 8, fontSize: 11, fontWeight: 600, cursor: "pointer" }}>
                                Approve
                              </button>
                              <button onClick={() => { setRejectModal(tx.transaction_id); setRejectReason(""); }}
                                style={{ padding: "4px 10px", background: "#fee2e2", color: "#dc2626", border: "1px solid #fecaca", borderRadius: 8, fontSize: 11, fontWeight: 600, cursor: "pointer" }}>
                                Reject
                              </button>
                            </div>
                          ) : (
                            <span style={{ fontSize: 12, color: "#94a3b8" }}>
                              {tx.status === "approved" ? "✅" : "❌"}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </PageContent>
    </div>
  );
}
