import React, { useState, useEffect } from "react";
import Sidebar from "../../../layouts/Sidebar";
import { DollarSign, CheckCircle2, Download, Loader2 } from "lucide-react";
import axios from "axios";

function Payroll() {
  const [payrollData, setPayrollData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [selectedEmp, setSelectedEmp] = useState("");
  const [salary, setSalary] = useState("");
  const [deductions, setDeductions] = useState("0");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchPayroll = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5001/api/payroll", {
        headers: { "x-auth-token": token }
      });
      setPayrollData(res.data.data || []);
    } catch (err) {
      console.error("Error fetching payroll:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayroll();
  }, []);

  // --- DOWNLOAD LOGIC ---
  const handleDownload = async (payrollId, employeeName) => {
    if (!payrollId) {
      alert("No payment record found to download.");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:5001/api/payroll/download/${payrollId}`, {
        headers: { "x-auth-token": token }
      });

      const data = res.data.data;

      const content = `
-----------------------------------------
PAYSLIP: ${data.company_name || 'Shnoor International'}
-----------------------------------------
Employee Name : ${data.name}
Reference ID  : EMP-${data.employee_id}
Payment Date  : ${new Date(data.pay_date).toLocaleDateString()}
Department    : ${data.department_name || 'General'}
-----------------------------------------
Earnings:
Base Salary   : ₹${parseFloat(data.salary).toLocaleString()}
Bonus         : ₹${parseFloat(data.bonus || 0).toLocaleString()}

Deductions:
Total Deduct. : ₹${parseFloat(data.deductions || 0).toLocaleString()}
-----------------------------------------
NET SALARY    : ₹${parseFloat(data.net_salary).toLocaleString()}
-----------------------------------------
This is a computer-generated document.
      `;

      const element = document.createElement("a");
      const file = new Blob([content], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = `Payslip_${employeeName.replace(/\s+/g, "_")}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    } catch (err) {
      console.error("Download error:", err);
      alert(err.response?.data?.error || "Could not download payslip");
    }
  };

  const handleRunPayroll = async (e) => {
    e.preventDefault();
    if (!selectedEmp) return;

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5001/api/payroll/generate", {
        employee_id: parseInt(selectedEmp),
        salary: parseFloat(salary),
        deductions: parseFloat(deductions)
      }, { headers: { "x-auth-token": token } });

      alert("Payroll Generated Successfully!");
      setShowModal(false);
      setSelectedEmp("");
      setSalary("");
      setDeductions("0");
      fetchPayroll();
    } catch (err) {
      alert(err.response?.data?.error || "Error generating payroll");
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalPayout = payrollData.reduce((acc, curr) => acc + (parseFloat(curr.last_net_salary) || 0), 0);

  return (
    <div className="d-flex bg-light min-vh-100">
      <Sidebar />
      <div className="flex-grow-1" style={{ marginLeft: "250px" }}>
        <div className="container-fluid p-4">

          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="fw-bold text-dark">Payroll Management</h2>
              <p className="text-muted small">Financial records and salary processing</p>
            </div>
            <button className="btn btn-primary d-flex align-items-center shadow-sm px-4" onClick={() => setShowModal(true)}>
              <DollarSign size={18} className="me-2" />
              Process Payment
            </button>
          </div>

          <div className="row g-3 mb-4">
            <div className="col-md-4">
              <div className="card p-3 shadow-sm border-0">
                <p className="text-muted small mb-1">Total Payout (Current Cycle)</p>
                <h4 className="fw-bold mb-1 text-primary">₹{totalPayout.toLocaleString()}</h4>
                <div className="text-success small d-flex align-items-center">
                  <CheckCircle2 size={14} className="me-1" /> Cycle Active
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card p-3 shadow-sm border-0">
                <p className="text-muted small mb-1">Total Employees</p>
                <h4 className="fw-bold mb-1">{payrollData.length}</h4>
                <span className="text-muted small">Staff on record</span>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card p-3 shadow-sm border-0 text-center">
                <p className="text-muted small mb-1">Status</p>
                <div className="badge bg-primary bg-opacity-10 text-primary py-2 px-3">Live Records</div>
              </div>
            </div>
          </div>

          <div className="card shadow-sm border-0 overflow-hidden">
            <div className="table-responsive">
              <table className="table table-hover mb-0 align-middle">
                <thead className="table-light">
                  <tr>
                    <th className="ps-4">Employee</th>
                    <th>Net Salary</th>
                    <th>Status</th>
                    <th>Payment Date</th>
                    <th className="text-end pe-4">Payslip</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="5" className="text-center py-5"><Loader2 className="animate-spin mx-auto" /></td></tr>
                  ) : payrollData.length > 0 ? payrollData.map((pay) => (
                    <tr key={pay.employee_id}>
                      <td className="ps-4 fw-semibold text-dark">{pay.name}</td>
                      <td className="fw-bold">₹{parseFloat(pay.last_net_salary || 0).toLocaleString()}</td>
                      <td>
                        <span className={`badge ${pay.pay_date ? "bg-success" : "bg-warning text-dark"} bg-opacity-10 text-${pay.pay_date ? "success" : "warning"} border`}>
                          {pay.pay_date ? "Paid" : "Pending"}
                        </span>
                      </td>
                      <td>{pay.pay_date ? new Date(pay.pay_date).toLocaleDateString() : "No record"}</td>
                      <td className="text-end pe-4">
                        <button
                          className={`btn btn-sm ${pay.pay_date ? "btn-outline-primary" : "btn-outline-secondary disabled border-0"}`}
                          onClick={() => handleDownload(pay.payroll_id, pay.name)}
                        >
                          <Download size={16} />
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan="5" className="text-center py-5 text-muted">No records found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL (Unchanged) */}
      {showModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content shadow-lg border-0">
              <div className="modal-header border-bottom-0 pb-0">
                <h5 className="modal-title fw-bold">Process Payment</h5>
                <button className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleRunPayroll}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label small fw-bold">Select Staff Member</label>
                    <select
                      className="form-select border-2"
                      value={selectedEmp}
                      onChange={(e) => setSelectedEmp(e.target.value)}
                      required
                    >
                      <option value="">-- Choose Employee --</option>
                      {payrollData.map(emp => (
                        <option key={emp.employee_id} value={emp.employee_id}>{emp.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="row g-3">
                    <div className="col-md-6 mb-3">
                      <label className="form-label small fw-bold">Base Salary (₹)</label>
                      <input
                        type="number"
                        className="form-control border-2"
                        placeholder="0.00"
                        value={salary}
                        onChange={(e) => setSalary(e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label small fw-bold">Deductions (₹)</label>
                      <input
                        type="number"
                        className="form-control border-2"
                        value={deductions}
                        onChange={(e) => setDeductions(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-top-0 pt-0">
                  <button type="button" className="btn btn-light rounded-pill px-4" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary rounded-pill px-4 fw-bold" disabled={isSubmitting}>
                    {isSubmitting ? "Processing..." : "Confirm & Pay"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Payroll;