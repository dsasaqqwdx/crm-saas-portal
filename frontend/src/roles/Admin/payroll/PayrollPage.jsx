
import React, { useState, useEffect } from "react";
import { DollarSign, CheckCircle2, Download, Loader2, Wallet, Users, Activity, X, Clock } from "lucide-react";
import axios from "axios";
import Sidebar from "../../../layouts/Sidebar";
import { PageContent } from "../../../layouts/usePageLayout";

function Payroll() {
  const [payrollData, setPayrollData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedEmp, setSelectedEmp] = useState("");
  const [salary, setSalary] = useState("");
  const [deductions, setDeductions] = useState("0");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchPayroll = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5001/api/payroll", { headers: { "x-auth-token": token } });
      setPayrollData(res.data.data || []);
    } catch (err) { console.error("Error fetching payroll:", err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchPayroll(); }, []);

  const handleDownload = async (payrollId, employeeName) => {
    if (!payrollId) { alert("No payment record found."); return; }
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:5001/api/payroll/download/${payrollId}`, { headers: { "x-auth-token": token } });
      const data = res.data.data;
      const content = `-----------------------------------------\nPAYSLIP: ${data.company_name || 'Shnoor International'}\n-----------------------------------------\nEmployee Name : ${data.name}\nReference ID  : EMP-${data.employee_id}\nPayment Date  : ${new Date(data.pay_date).toLocaleDateString()}\n-----------------------------------------\nNET SALARY    : ₹${parseFloat(data.net_salary).toLocaleString()}\n-----------------------------------------`;
      const element = document.createElement("a");
      const file = new Blob([content], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = `Payslip_${employeeName.replace(/\s+/g, "_")}.txt`;
      document.body.appendChild(element); element.click(); document.body.removeChild(element);
    } catch (err) { alert("Could not download payslip"); }
  };

  const handleRunPayroll = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5001/api/payroll/generate", 
        { employee_id: parseInt(selectedEmp), salary: parseFloat(salary), deductions: parseFloat(deductions) }, 
        { headers: { "x-auth-token": token } }
      );
      alert("Payroll Generated Successfully!");
      setShowModal(false); setSelectedEmp(""); setSalary(""); setDeductions("0");
      fetchPayroll();
    } catch (err) { alert("Error generating payroll"); }
    finally { setIsSubmitting(false); }
  };

  const totalPayout = payrollData.reduce((acc, curr) => acc + (parseFloat(curr.last_net_salary) || 0), 0);

  return (
    <div className="d-flex bg-light min-vh-100">
      <Sidebar />
      <PageContent>
        <div className="container-fluid px-3 px-md-4 py-4">
          
          {/* Header */}
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
            <div>
              <h2 className="fw-bold fs-3 mb-1" style={{ color: "#0f172a", letterSpacing: "-0.5px" }}>Payroll Management</h2>
              <p className="text-muted small mb-0">Financial records and salary processing for the current cycle.</p>
            </div>
            <button 
              className="btn d-flex align-items-center justify-content-center gap-2 px-4 py-2 shadow-sm"
              style={{ background: "#4f46e5", color: "#fff", borderRadius: "12px", fontWeight: "600", border: "none" }}
              onClick={() => setShowModal(true)}
            >
              <DollarSign size={17} /> Process Payment
            </button>
          </div>

          {/* Stats Cards */}
          <div className="row g-3 mb-4">
            <div className="col-12 col-sm-6 col-xl-4">
              <div className="bg-white p-3 rounded-4 border shadow-sm d-flex align-items-center gap-3">
                <div className="p-3 rounded-3" style={{ background: "#eef2ff", color: "#4f46e5" }}><Wallet size={24} /></div>
                <div>
                  <div className="text-muted fw-semibold small">Total Payout</div>
                  <div className="fs-5 fw-bold text-dark">₹{totalPayout.toLocaleString()}</div>
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-6 col-xl-4">
              <div className="bg-white p-3 rounded-4 border shadow-sm d-flex align-items-center gap-3">
                <div className="p-3 rounded-3" style={{ background: "#f0fdf4", color: "#16a34a" }}><Users size={24} /></div>
                <div>
                  <div className="text-muted fw-semibold small">Staff Count</div>
                  <div className="fs-5 fw-bold text-dark">{payrollData.length}</div>
                </div>
              </div>
            </div>
            <div className="col-12 col-xl-4">
              <div className="bg-white p-3 rounded-4 border shadow-sm d-flex align-items-center gap-3">
                <div className="p-3 rounded-3" style={{ background: "#fff7ed", color: "#ea580c" }}><Activity size={24} /></div>
                <div>
                  <div className="text-muted fw-semibold small">System Status</div>
                  <div className="fs-6 fw-bold text-success">Active Cycle</div>
                </div>
              </div>
            </div>
          </div>

          {/* Table Card */}
          <div className="bg-white rounded-4 border shadow-sm overflow-hidden">
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead className="bg-light">
                  <tr style={{ fontSize: "11px", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px" }}>
                    <th className="px-4 py-3 border-0">Employee Name</th>
                    <th className="px-4 py-3 border-0">Net Disbursement</th>
                    <th className="px-4 py-3 border-0">Status</th>
                    <th className="px-4 py-3 border-0">Settlement Date</th>
                    <th className="px-4 py-3 border-0 text-end">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="5" className="text-center py-5"><Loader2 className="spinner-border text-muted" /></td></tr>
                  ) : payrollData.length > 0 ? (
                    payrollData.map(pay => (
                      <tr key={pay.employee_id} className="hover-row">
                        <td className="px-4 py-3 fw-bold">{pay.name}</td>
                        <td className="px-4 py-3 fw-bold text-dark">₹{parseFloat(pay.last_net_salary || 0).toLocaleString()}</td>
                        <td className="px-4 py-3">
                          <span className={`badge d-inline-flex align-items-center gap-1 px-2 py-1 rounded-2 ${pay.pay_date ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning'}`} style={{ fontSize: "12px" }}>
                            {pay.pay_date ? <CheckCircle2 size={13} /> : <Clock size={13} />}
                            {pay.pay_date ? "Paid" : "Pending"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-muted small">{pay.pay_date ? new Date(pay.pay_date).toLocaleDateString() : "Pending Cycle"}</td>
                        <td className="px-4 py-3 text-end">
                          <button 
                            className="btn btn-sm border" 
                            disabled={!pay.pay_date}
                            onClick={() => handleDownload(pay.payroll_id, pay.name)}
                            style={{ color: pay.pay_date ? "#4f46e5" : "#cbd5e1" }}
                          >
                            <Download size={17} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="5" className="text-center py-5 text-muted small">No payroll records for this cycle.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="modal d-block show" tabIndex="-1" style={{ background: "rgba(15,23,42,0.6)", backdropFilter: "blur(4px)" }}>
            <div className="modal-dialog modal-dialog-centered px-3">
              <div className="modal-content border-0 rounded-4 shadow-lg p-3">
                <div className="modal-header border-0">
                  <h5 className="modal-title fw-bold">Process Payment</h5>
                  <button type="button" className="btn-close shadow-none" onClick={() => setShowModal(false)}></button>
                </div>
                <form onSubmit={handleRunPayroll}>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="form-label small fw-bold text-muted text-uppercase">Select Employee</label>
                      <select className="form-select rounded-3 shadow-none" value={selectedEmp} onChange={e => setSelectedEmp(e.target.value)} required>
                        <option value="">Choose employee...</option>
                        {payrollData.map(emp => <option key={emp.employee_id} value={emp.employee_id}>{emp.name}</option>)}
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label small fw-bold text-muted text-uppercase">Base Salary (₹)</label>
                      <input type="number" className="form-control rounded-3 shadow-none" placeholder="0.00" value={salary} onChange={e => setSalary(e.target.value)} required />
                    </div>
                    <div className="mb-3">
                      <label className="form-label small fw-bold text-muted text-uppercase">Total Deductions (₹)</label>
                      <input type="number" className="form-control rounded-3 shadow-none" value={deductions} onChange={e => setDeductions(e.target.value)} required />
                    </div>
                  </div>
                  <div className="modal-footer border-0">
                    <button type="button" className="btn btn-light rounded-3 px-4" onClick={() => setShowModal(false)}>Cancel</button>
                    <button type="submit" disabled={isSubmitting} className="btn text-white rounded-3 px-4" style={{ background: "#4f46e5" }}>
                      {isSubmitting ? "Processing..." : "Generate Payslip"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        <style>{`.hover-row:hover { background-color: #fcfdfe; transition: 0.2s; }`}</style>
      </PageContent>
    </div>
  );
}

export default Payroll;