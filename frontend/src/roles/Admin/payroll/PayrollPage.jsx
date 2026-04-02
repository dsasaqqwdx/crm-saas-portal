
// import React, { useState, useEffect } from "react";
// import { DollarSign, CheckCircle2, Download, Loader2, Wallet, Users, Activity, X, Clock } from "lucide-react";
// import axios from "axios";
// import Sidebar from "../../../layouts/Sidebar";
// import { PageContent } from "../../../layouts/usePageLayout";

// function Payroll() {
//   const [payrollData, setPayrollData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showModal, setShowModal] = useState(false);
//   const [selectedEmp, setSelectedEmp] = useState("");
//   const [salary, setSalary] = useState("");
//   const [deductions, setDeductions] = useState("0");
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const fetchPayroll = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem("token");
//       const res = await axios.get("http://localhost:5001/api/payroll", { headers: { "x-auth-token": token } });
//       setPayrollData(res.data.data || []);
//     } catch (err) { console.error("Error fetching payroll:", err); }
//     finally { setLoading(false); }
//   };

//   useEffect(() => { fetchPayroll(); }, []);

//   const handleDownload = async (payrollId, employeeName) => {
//     if (!payrollId) { alert("No payment record found."); return; }
//     try {
//       const token = localStorage.getItem("token");
//       const res = await axios.get(`http://localhost:5001/api/payroll/download/${payrollId}`, { headers: { "x-auth-token": token } });
//       const data = res.data.data;
//       const content = `-----------------------------------------\nPAYSLIP: ${data.company_name || 'Shnoor International'}\n-----------------------------------------\nEmployee Name : ${data.name}\nReference ID  : EMP-${data.employee_id}\nPayment Date  : ${new Date(data.pay_date).toLocaleDateString()}\n-----------------------------------------\nNET SALARY    : ₹${parseFloat(data.net_salary).toLocaleString()}\n-----------------------------------------`;
//       const element = document.createElement("a");
//       const file = new Blob([content], { type: 'text/plain' });
//       element.href = URL.createObjectURL(file);
//       element.download = `Payslip_${employeeName.replace(/\s+/g, "_")}.txt`;
//       document.body.appendChild(element); element.click(); document.body.removeChild(element);
//     } catch (err) { alert("Could not download payslip"); }
//   };

//   const handleRunPayroll = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     try {
//       const token = localStorage.getItem("token");
//       await axios.post("http://localhost:5001/api/payroll/generate", 
//         { employee_id: parseInt(selectedEmp), salary: parseFloat(salary), deductions: parseFloat(deductions) }, 
//         { headers: { "x-auth-token": token } }
//       );
//       alert("Payroll Generated Successfully!");
//       setShowModal(false); setSelectedEmp(""); setSalary(""); setDeductions("0");
//       fetchPayroll();
//     } catch (err) { alert("Error generating payroll"); }
//     finally { setIsSubmitting(false); }
//   };

//   const totalPayout = payrollData.reduce((acc, curr) => acc + (parseFloat(curr.last_net_salary) || 0), 0);

//   return (
//     <div className="d-flex bg-light min-vh-100">
//       <Sidebar />
//       <PageContent>
//         <div className="container-fluid px-3 px-md-4 py-4">
          
//           {/* Header */}
//           <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
//             <div>
//               <h2 className="fw-bold fs-3 mb-1" style={{ color: "#0f172a", letterSpacing: "-0.5px" }}>Payroll Management</h2>
//               <p className="text-muted small mb-0">Financial records and salary processing for the current cycle.</p>
//             </div>
//             <button 
//               className="btn d-flex align-items-center justify-content-center gap-2 px-4 py-2 shadow-sm"
//               style={{ background: "#4f46e5", color: "#fff", borderRadius: "12px", fontWeight: "600", border: "none" }}
//               onClick={() => setShowModal(true)}
//             >
//               <DollarSign size={17} /> Process Payment
//             </button>
//           </div>

//           {/* Stats Cards */}
//           <div className="row g-3 mb-4">
//             <div className="col-12 col-sm-6 col-xl-4">
//               <div className="bg-white p-3 rounded-4 border shadow-sm d-flex align-items-center gap-3">
//                 <div className="p-3 rounded-3" style={{ background: "#eef2ff", color: "#4f46e5" }}><Wallet size={24} /></div>
//                 <div>
//                   <div className="text-muted fw-semibold small">Total Payout</div>
//                   <div className="fs-5 fw-bold text-dark">₹{totalPayout.toLocaleString()}</div>
//                 </div>
//               </div>
//             </div>
//             <div className="col-12 col-sm-6 col-xl-4">
//               <div className="bg-white p-3 rounded-4 border shadow-sm d-flex align-items-center gap-3">
//                 <div className="p-3 rounded-3" style={{ background: "#f0fdf4", color: "#16a34a" }}><Users size={24} /></div>
//                 <div>
//                   <div className="text-muted fw-semibold small">Staff Count</div>
//                   <div className="fs-5 fw-bold text-dark">{payrollData.length}</div>
//                 </div>
//               </div>
//             </div>
//             <div className="col-12 col-xl-4">
//               <div className="bg-white p-3 rounded-4 border shadow-sm d-flex align-items-center gap-3">
//                 <div className="p-3 rounded-3" style={{ background: "#fff7ed", color: "#ea580c" }}><Activity size={24} /></div>
//                 <div>
//                   <div className="text-muted fw-semibold small">System Status</div>
//                   <div className="fs-6 fw-bold text-success">Active Cycle</div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Table Card */}
//           <div className="bg-white rounded-4 border shadow-sm overflow-hidden">
//             <div className="table-responsive">
//               <table className="table align-middle mb-0">
//                 <thead className="bg-light">
//                   <tr style={{ fontSize: "11px", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px" }}>
//                     <th className="px-4 py-3 border-0">Employee Name</th>
//                     <th className="px-4 py-3 border-0">Net Disbursement</th>
//                     <th className="px-4 py-3 border-0">Status</th>
//                     <th className="px-4 py-3 border-0">Settlement Date</th>
//                     <th className="px-4 py-3 border-0 text-end">Action</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {loading ? (
//                     <tr><td colSpan="5" className="text-center py-5"><Loader2 className="spinner-border text-muted" /></td></tr>
//                   ) : payrollData.length > 0 ? (
//                     payrollData.map(pay => (
//                       <tr key={pay.employee_id} className="hover-row">
//                         <td className="px-4 py-3 fw-bold">{pay.name}</td>
//                         <td className="px-4 py-3 fw-bold text-dark">₹{parseFloat(pay.last_net_salary || 0).toLocaleString()}</td>
//                         <td className="px-4 py-3">
//                           <span className={`badge d-inline-flex align-items-center gap-1 px-2 py-1 rounded-2 ${pay.pay_date ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning'}`} style={{ fontSize: "12px" }}>
//                             {pay.pay_date ? <CheckCircle2 size={13} /> : <Clock size={13} />}
//                             {pay.pay_date ? "Paid" : "Pending"}
//                           </span>
//                         </td>
//                         <td className="px-4 py-3 text-muted small">{pay.pay_date ? new Date(pay.pay_date).toLocaleDateString() : "Pending Cycle"}</td>
//                         <td className="px-4 py-3 text-end">
//                           <button 
//                             className="btn btn-sm border" 
//                             disabled={!pay.pay_date}
//                             onClick={() => handleDownload(pay.payroll_id, pay.name)}
//                             style={{ color: pay.pay_date ? "#4f46e5" : "#cbd5e1" }}
//                           >
//                             <Download size={17} />
//                           </button>
//                         </td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr><td colSpan="5" className="text-center py-5 text-muted small">No payroll records for this cycle.</td></tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>

//         {/* Modal */}
//         {showModal && (
//           <div className="modal d-block show" tabIndex="-1" style={{ background: "rgba(15,23,42,0.6)", backdropFilter: "blur(4px)" }}>
//             <div className="modal-dialog modal-dialog-centered px-3">
//               <div className="modal-content border-0 rounded-4 shadow-lg p-3">
//                 <div className="modal-header border-0">
//                   <h5 className="modal-title fw-bold">Process Payment</h5>
//                   <button type="button" className="btn-close shadow-none" onClick={() => setShowModal(false)}></button>
//                 </div>
//                 <form onSubmit={handleRunPayroll}>
//                   <div className="modal-body">
//                     <div className="mb-3">
//                       <label className="form-label small fw-bold text-muted text-uppercase">Select Employee</label>
//                       <select className="form-select rounded-3 shadow-none" value={selectedEmp} onChange={e => setSelectedEmp(e.target.value)} required>
//                         <option value="">Choose employee...</option>
//                         {payrollData.map(emp => <option key={emp.employee_id} value={emp.employee_id}>{emp.name}</option>)}
//                       </select>
//                     </div>
//                     <div className="mb-3">
//                       <label className="form-label small fw-bold text-muted text-uppercase">Base Salary (₹)</label>
//                       <input type="number" className="form-control rounded-3 shadow-none" placeholder="0.00" value={salary} onChange={e => setSalary(e.target.value)} required />
//                     </div>
//                     <div className="mb-3">
//                       <label className="form-label small fw-bold text-muted text-uppercase">Total Deductions (₹)</label>
//                       <input type="number" className="form-control rounded-3 shadow-none" value={deductions} onChange={e => setDeductions(e.target.value)} required />
//                     </div>
//                   </div>
//                   <div className="modal-footer border-0">
//                     <button type="button" className="btn btn-light rounded-3 px-4" onClick={() => setShowModal(false)}>Cancel</button>
//                     <button type="submit" disabled={isSubmitting} className="btn text-white rounded-3 px-4" style={{ background: "#4f46e5" }}>
//                       {isSubmitting ? "Processing..." : "Generate Payslip"}
//                     </button>
//                   </div>
//                 </form>
//               </div>
//             </div>
//           </div>
//         )}

//         <style>{`.hover-row:hover { background-color: #fcfdfe; transition: 0.2s; }`}</style>
//       </PageContent>
//     </div>
//   );
// }

// export default Payroll;
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Sidebar from "../../../layouts/Sidebar";
import Logo from "../../../assets/logo.png";

import {
  DollarSign, Download, Trash2, Search,
  Wallet, Users, CheckCircle2, Clock, X, Plus, History, ChevronDown, Minus
} from "lucide-react";

const API = process.env.REACT_APP_API_URL || "http://localhost:5001";

const BONUS_OPTIONS     = ["Performance Bonus","Festival Bonus","Annual Bonus","Project Completion","Referral Bonus","Overtime Pay","Other"];
const ALLOWANCE_OPTIONS = ["House Rent Allowance (HRA)","Travel Allowance","Medical Allowance","Food Allowance","Communication Allowance","Uniform Allowance","Other"];
const DEDUCTION_OPTIONS = ["Provident Fund (PF)","ESI","Professional Tax","Loan Recovery","Advance Recovery","Late / Absence Deduction","Other"];
const TAX_OPTIONS       = ["TDS (Income Tax)","Surcharge","Education Cess","Other"];

let _jsPDFLoaded = false;
async function loadJsPDF() {
  if (_jsPDFLoaded) return window.jspdf?.jsPDF;
  await new Promise((res, rej) => {
    const s = document.createElement("script");
    s.src = "https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js";
    s.onload = res; s.onerror = rej;
    document.head.appendChild(s);
  });
  _jsPDFLoaded = true;
  return window.jspdf?.jsPDF;
}

async function generatePayslipPDF(d, logoBase64) {
  const JsPDF = await loadJsPDF();
  if (!JsPDF) { alert("PDF library could not be loaded."); return; }

  const doc = new JsPDF({ unit: "mm", format: "a4" });
  const W = 210, margin = 15, cW = W - margin * 2;

  const TEAL   = [0, 128, 128];
  const TEAL_L = [224, 242, 242];
  const GRAY   = [100, 100, 100];
  const DGRAY  = [50,  50,  50];
  const LGRAY  = [245, 245, 245];
  const WHITE  = [255, 255, 255];
  const BLACK  = [20,  20,  20];
  const BORDER = [200, 200, 200];

  const money = n => "Rs." + parseFloat(n || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 });
  const fmtD  = v => v ? new Date(v).toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric" }) : "-";

  
  doc.setFillColor(...TEAL); doc.rect(0, 0, W, 18, "F");
  doc.setFontSize(12); doc.setFont("helvetica", "bold"); doc.setTextColor(...WHITE);
  doc.text("PAYSLIP", W / 2, 12, { align: "center" });

  let y = 24;
  const logoSize = 24, logoX = (W - logoSize) / 2;
  if (logoBase64) {
    doc.addImage(logoBase64, "PNG", logoX, y, logoSize, logoSize);
  } else {
    doc.setFillColor(...TEAL); doc.roundedRect(logoX, y, logoSize, logoSize, 3, 3, "F");
    doc.setFontSize(8); doc.setFont("helvetica", "bold"); doc.setTextColor(...WHITE);
    doc.text("LOGO", logoX + logoSize / 2, y + logoSize / 2 + 2, { align: "center" });
  }
  y += logoSize + 4;

  doc.setFontSize(13); doc.setFont("helvetica", "bold"); doc.setTextColor(...BLACK);
  doc.text(d.company_name || "Company Name", W / 2, y, { align: "center" });
  y += 6;
  doc.setFontSize(8.5); doc.setFont("helvetica", "normal"); doc.setTextColor(...GRAY);
  doc.text(d.company_email || "shnoorinfo@company.com", W / 2, y, { align: "center" });
  y += 10;

  doc.setFillColor(...TEAL_L); doc.rect(margin, y, cW, 12, "F");
  doc.setFontSize(11); doc.setFont("helvetica", "bold"); doc.setTextColor(...TEAL);
  doc.text((d.name || "Employee Name").toUpperCase(), W / 2, y + 8, { align: "center" });
  y += 18;

  const infoData = [
   
    ["Pay Date", fmtD(d.pay_date)],
    ["Tax Category", d.tax_category || "A"],
    ["Pay Period", d.pay_period || "—"],
    ["Employee Payroll N0", "EMP-" + String(d.employee_id || 0).padStart(4, "0")],
    
    ["Department", d.department_name || "N/A"],
    
    ["Tax Year", d.tax_year || new Date().getFullYear()],
  ];

  const colW = cW / 2, cellH = 8;
  doc.setLineWidth(0.3); doc.setDrawColor(...BORDER);
  infoData.forEach((item, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const cx = margin + col * colW, cy = y + row * cellH;
    doc.setFillColor(...(row % 2 === 0 ? LGRAY : WHITE));
    doc.rect(cx, cy, colW, cellH, "F"); doc.rect(cx, cy, colW, cellH, "S");
    doc.setFontSize(7.5); doc.setFont("helvetica", "bold"); doc.setTextColor(...GRAY);
    doc.text(item[0], cx + 3, cy + 4.5);
    doc.setFontSize(8); doc.setFont("helvetica", "normal"); doc.setTextColor(...BLACK);
    doc.text(String(item[1]), cx + colW - 3, cy + 4.5, { align: "right" });
  });
  y += Math.ceil(infoData.length / 2) * cellH + 8;

  const earn_items = Array.isArray(d.earnings_items) && d.earnings_items.length
    ? d.earnings_items
    : [
        { description: "Basic Gross Pay", amount: d.salary || 0 },
        ...(parseFloat(d.bonus      || 0) > 0 ? [{ description: d.bonus_reason     || "Bonus",      amount: d.bonus      }] : []),
        ...(parseFloat(d.allowances || 0) > 0 ? [{ description: d.allowance_reason || "Allowances", amount: d.allowances }] : []),
      ];
  const ded_items = Array.isArray(d.deductions_items) && d.deductions_items.length
    ? d.deductions_items
    : [
        ...(parseFloat(d.deductions || 0) > 0 ? [{ description: d.deduction_reason || "Deductions", amount: d.deductions }] : [{ description: "National Insurance", amount: 0 }]),
        ...(parseFloat(d.tax        || 0) > 0 ? [{ description: d.tax_reason       || "Income Tax", amount: d.tax        }] : []),
      ];

  const maxRows = Math.max(earn_items.length, ded_items.length);
  const halfW = cW / 2, rowH = 8;

  doc.setFillColor(...TEAL);
  doc.rect(margin, y, halfW, 9, "F"); doc.rect(margin + halfW, y, halfW, 9, "F");
  doc.setFontSize(8.5); doc.setFont("helvetica", "bold"); doc.setTextColor(...WHITE);
  doc.text("Earnings",   margin + halfW / 2,         y + 6, { align: "center" });
  doc.text("Deductions", margin + halfW + halfW / 2, y + 6, { align: "center" });

  let ry = y + 9;
  [margin, margin + halfW].forEach(cx => {
    doc.setFillColor(220, 240, 240); doc.rect(cx, ry, halfW, 7, "F");
    doc.setDrawColor(...BORDER); doc.setLineWidth(0.25); doc.rect(cx, ry, halfW, 7, "S");
  });
  doc.setFontSize(7); doc.setFont("helvetica", "bold"); doc.setTextColor(...TEAL);
  doc.text("Description", margin + 3,          ry + 4.5);
  doc.text("Amount",      margin + halfW - 3,  ry + 4.5, { align: "right" });
  doc.text("Description", margin + halfW + 3,  ry + 4.5);
  doc.text("Amount",      margin + cW - 3,     ry + 4.5, { align: "right" });
  ry += 7;

  for (let i = 0; i < maxRows; i++) {
    const ei = earn_items[i], di = ded_items[i];
    const bg = i % 2 === 0 ? WHITE : LGRAY;
    [margin, margin + halfW].forEach(cx => {
      doc.setFillColor(...bg); doc.rect(cx, ry, halfW, rowH, "F");
      doc.setDrawColor(...BORDER); doc.setLineWidth(0.25); doc.rect(cx, ry, halfW, rowH, "S");
    });
    doc.setFontSize(8); doc.setFont("helvetica", "normal"); doc.setTextColor(...DGRAY);
    if (ei) { doc.text(String(ei.description || ""), margin + 3,        ry + 5.5); doc.text(money(ei.amount), margin + halfW - 3, ry + 5.5, { align: "right" }); }
    if (di) { doc.text(String(di.description || ""), margin + halfW + 3, ry + 5.5); doc.text(money(di.amount), margin + cW - 3,    ry + 5.5, { align: "right" }); }
    ry += rowH;
  }

  const totEarn = earn_items.reduce((s, i) => s + parseFloat(i.amount || 0), 0);
  const totDed  = ded_items.reduce( (s, i) => s + parseFloat(i.amount || 0), 0);
  [margin, margin + halfW].forEach(cx => {
    doc.setFillColor(220, 240, 240); doc.rect(cx, ry, halfW, 9, "F");
    doc.setDrawColor(...TEAL); doc.setLineWidth(0.5); doc.rect(cx, ry, halfW, 9, "S");
  });
  doc.setFontSize(8.5); doc.setFont("helvetica", "bold"); doc.setTextColor(...TEAL);
  doc.text("Total Earnings",   margin + 3,           ry + 6);
  doc.text(money(totEarn),      margin + halfW - 3,   ry + 6, { align: "right" });
  doc.text("Total Deductions", margin + halfW + 3,   ry + 6);
  doc.text(money(totDed),       margin + cW - 3,      ry + 6, { align: "right" });
  ry += 14;

  doc.setFillColor(...TEAL); doc.roundedRect(margin, ry, cW, 14, 3, 3, "F");
  doc.setFontSize(10); doc.setFont("helvetica", "bold"); doc.setTextColor(...WHITE);
  doc.text("Net Pay = " + money(d.net_salary), W / 2, ry + 9, { align: "center" });
  ry += 22;

  doc.setFontSize(8.5); doc.setFont("helvetica", "bold"); doc.setTextColor(...GRAY);
  
  doc.setFontSize(8.5); doc.setFont("helvetica", "normal"); doc.setTextColor(...BLACK);
 

  if (d.notes) {
    ry += 8;
    doc.setFontSize(8); doc.setFont("helvetica", "italic"); doc.setTextColor(...GRAY);
    doc.text(doc.splitTextToSize(d.notes, cW), margin, ry);
  }

  doc.setFillColor(...TEAL); doc.rect(0, 283, W, 14, "F");
  doc.setFontSize(7.5); doc.setFont("helvetica", "normal"); doc.setTextColor(...WHITE);
  doc.text("If you have any questions about your payslip, please contact:", W / 2, 289, { align: "center" });
  doc.text(d.company_email || "shnoorinfo@company.com", W / 2, 294, { align: "center" });

  doc.save("Payslip_" + (d.name || "Employee").replace(/\s+/g, "_") + "_" + fmtD(d.pay_date) + ".pdf");
}

const css = `
  .pr-layout { display:flex; min-height:100vh; background:#f8fafc; }
  .pr-main   { margin-left:250px; flex:1; padding:32px 28px; }
  .pr-stats  { display:grid; grid-template-columns:repeat(4,1fr); gap:14px; margin-bottom:24px; }
  .pr-stat   { background:#fff; border-radius:12px; padding:16px 18px; box-shadow:0 2px 8px rgba(0,0,0,.05); display:flex; align-items:center; gap:12px; }
  .pr-toolbar    { display:flex; align-items:center; justify-content:space-between; gap:12px; flex-wrap:wrap; margin-bottom:16px; }
  .pr-left-tools { display:flex; align-items:center; gap:10px; flex-wrap:wrap; }
  .pr-search { position:relative; }
  .pr-search svg { position:absolute; left:11px; top:50%; transform:translateY(-50%); color:#94a3b8; pointer-events:none; }
  .pr-search input { border:1.5px solid #e2e8f0; border-radius:10px; padding:9px 14px 9px 36px; font-size:13px; outline:none; width:220px; background:#fff; }
  .pr-search input:focus { border-color:#4f46e5; }
  .pr-tabs { display:flex; gap:4px; background:#f1f5f9; border-radius:10px; padding:4px; }
  .pr-tab  { padding:7px 16px; border-radius:8px; border:none; font-size:13px; font-weight:600; cursor:pointer; }
  .pr-tab.active       { background:#fff; color:#4f46e5; box-shadow:0 1px 4px rgba(0,0,0,.1); }
  .pr-tab:not(.active) { background:transparent; color:#64748b; }
  .pr-table-card { background:#fff; border-radius:14px; box-shadow:0 4px 20px rgba(0,0,0,.06); overflow-x:auto; }
  .pr-table      { width:100%; border-collapse:collapse; min-width:900px; }
  .pr-table th   { padding:12px 14px; font-size:11px; font-weight:700; color:#64748b; text-transform:uppercase; letter-spacing:.05em; background:#f8fafc; text-align:left; white-space:nowrap; }
  .pr-table td   { padding:12px 14px; font-size:13px; border-top:1px solid #f1f5f9; vertical-align:middle; }
  .pr-table tr:hover td { background:#fafbff; }
  .pr-cards { display:none; }
  .pr-card  { background:#fff; border-radius:12px; padding:16px; margin-bottom:12px; box-shadow:0 2px 8px rgba(0,0,0,.05); }
  .modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,.45); z-index:9999; display:flex; align-items:center; justify-content:center; padding:16px; }
  .modal-box     { background:#fff; border-radius:16px; width:100%; max-width:600px; max-height:92vh; overflow-y:auto; box-shadow:0 20px 60px rgba(0,0,0,.2); }
  .modal-head    { padding:20px 24px 16px; display:flex; justify-content:space-between; align-items:center; position:sticky; top:0; background:#fff; z-index:2; border-bottom:1px solid #f1f5f9; }
  .modal-body    { padding:20px 24px; }
  .modal-foot    { padding:16px 24px; border-top:1px solid #f1f5f9; display:flex; justify-content:flex-end; gap:10px; background:#f8fafc; border-radius:0 0 16px 16px; position:sticky; bottom:0; }
  .fl { font-size:12px; font-weight:600; color:#64748b; display:block; margin-bottom:5px; }
  .fi { width:100%; border:1.5px solid #e2e8f0; border-radius:9px; padding:9px 12px; font-size:13px; outline:none; background:#f8fafc; box-sizing:border-box; }
  .fi:focus { border-color:#4f46e5; background:#fff; }
  .fi-sel { appearance:none; padding-right:28px; }
  .section-box  { border-radius:10px; padding:14px 16px; margin-bottom:14px; }
  .section-earn { background:#f0fdf4; border:1px solid #bbf7d0; }
  .section-ded  { background:#fff1f2; border:1px solid #fecaca; }
  .section-ttl  { font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:.06em; margin-bottom:12px; }
  .li-row { display:grid; grid-template-columns:1fr 110px 28px; gap:8px; align-items:start; margin-bottom:8px; }
  .li-sel-wrap { position:relative; }
  .li-sel-wrap svg { position:absolute; right:8px; top:11px; color:#94a3b8; pointer-events:none; }
  .li-other { margin-top:5px; }
  .add-btn { display:flex; align-items:center; justify-content:center; gap:5px; font-size:12px; font-weight:600; color:#4f46e5; background:transparent; border:1.5px dashed #c7d2fe; border-radius:8px; padding:6px 12px; cursor:pointer; width:100%; margin-top:4px; }
  .add-btn:hover { background:#eef2ff; }
  .rm-btn { width:28px; height:28px; border-radius:7px; border:none; background:#fee2e2; color:#ef4444; cursor:pointer; display:flex; align-items:center; justify-content:center; flex-shrink:0; margin-top:1px; }
  .rm-btn:hover { background:#fecaca; }
  .two-col { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
  .net-preview { background:linear-gradient(135deg,#4f46e5,#7c3aed); border-radius:12px; padding:16px 20px; text-align:center; margin-top:4px; }
  .rsub { font-size:10px; color:#94a3b8; margin-top:2px; }
  @media (max-width:1100px) { .pr-stats { grid-template-columns:repeat(2,1fr); } }
  @media (max-width:768px) {
    .pr-main { margin-left:70px; padding:20px 14px; }
    .pr-stats { grid-template-columns:1fr 1fr; gap:10px; }
    .pr-table-card { display:none; }
    .pr-cards { display:block; }
    .pr-search input { width:100%; }
    .pr-toolbar, .pr-left-tools { flex-direction:column; align-items:stretch; }
    .two-col { grid-template-columns:1fr; }
    .li-row  { grid-template-columns:1fr 90px 28px; }
  }
  @media (max-width:480px) {
    .pr-main  { margin-left:70px; padding:14px 10px; }
    .pr-stats { grid-template-columns:1fr 1fr; }
    .pr-stat  { padding:12px; }
  }
`;

const fmt  = n => "₹" + parseFloat(n || 0).toLocaleString("en-IN");
const fmtD = d => d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";
const newItem = () => ({ preset: "", other: "", amount: "" });
const initForm = () => ({
  employee_id: "", pay_date: "", pay_period: "", salary: "",
  bonus_items: [newItem()], allowance_items: [newItem()],
  deduction_items: [newItem()], tax_items: [newItem()],
  notes: "",
});


const LineItemsSection = React.memo(function LineItemsSection({
  label, arrayKey, options, items, onUpdate, onAdd, onRemove,
}) {
  return (
    <div>
      <label className="fl">{label}</label>
      {items.map((item, idx) => (
        <div key={idx} className="li-row">
          
          <div>
            <div className="li-sel-wrap">
              <select
                className="fi fi-sel"
                value={item.preset}
                onChange={e => onUpdate(arrayKey, idx, "preset", e.target.value)}
              >
                <option value="">Select or enter below…</option>
                {options.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
              <ChevronDown size={13} />
            </div>
           
            {(item.preset === "Other" || item.preset === "") && (
              <input
                className="fi li-other"
                placeholder="Enter description…"
                value={item.other}
                onChange={e => onUpdate(arrayKey, idx, "other", e.target.value)}
              />
            )}
          </div>

          
          <input
            type="number"
            className="fi"
            placeholder="0.00"
            min="0"
            value={item.amount}
            onChange={e => onUpdate(arrayKey, idx, "amount", e.target.value)}
          />

          {/* remove row */}
          <button type="button" className="rm-btn" onClick={() => onRemove(arrayKey, idx)} title="Remove">
            <Minus size={13} />
          </button>
        </div>
      ))}
      <button type="button" className="add-btn" onClick={() => onAdd(arrayKey)}>
        <Plus size={13} /> Add {label} Line
      </button>
    </div>
  );
});

export default function AdminPayrollPage() {
  const [payrollData, setPayrollData] = useState([]);
  const [history,     setHistory    ] = useState([]);
  const [loading,     setLoading    ] = useState(true);
  const [tab,         setTab        ] = useState("current");
  const [search,      setSearch     ] = useState("");
  const [showModal,   setShowModal  ] = useState(false);
  const [form,        setForm       ] = useState(initForm());
  const [submitting,  setSubmitting ] = useState(false);
  const [deleteId,    setDeleteId   ] = useState(null);
  const [deleting,    setDeleting   ] = useState(false);
  const [toast,       setToast      ] = useState(null);
  const [logoBase64,  setLogoBase64 ] = useState(null);

  const headers = { "x-auth-token": localStorage.getItem("token") };

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth; canvas.height = img.naturalHeight;
      canvas.getContext("2d").drawImage(img, 0, 0);
      setLogoBase64(canvas.toDataURL("image/png"));
    };
    img.src = Logo;
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleFormChange = useCallback((key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  }, []);

  const updateItem = useCallback((arrayKey, index, field, value) => {
    setForm(prev => {
      const arr = [...prev[arrayKey]];
      arr[index] = { ...arr[index], [field]: value };
      return { ...prev, [arrayKey]: arr };
    });
  }, []);

  const addItem = useCallback((arrayKey) => {
    setForm(prev => ({ ...prev, [arrayKey]: [...prev[arrayKey], newItem()] }));
  }, []);

  const removeItem = useCallback((arrayKey, index) => {
    setForm(prev => {
      const arr = prev[arrayKey].filter((_, i) => i !== index);
      return { ...prev, [arrayKey]: arr.length > 0 ? arr : [newItem()] };
    });
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [cur, hist] = await Promise.all([
        axios.get(`${API}/api/payroll`,         { headers }),
        axios.get(`${API}/api/payroll/history`, { headers }),
      ]);
      setPayrollData(cur.data.data  || []);
      setHistory(    hist.data.data || []);
    } catch { showToast("Failed to load payroll", "error"); }
    finally  { setLoading(false); }
  }, []); 

  useEffect(() => { loadData(); }, [loadData]);

  const resolveDesc = item => (item.preset === "Other" || item.preset === "") ? item.other : item.preset;
  const sumAmt      = arr  => arr.reduce((s, i) => s + parseFloat(i.amount || 0), 0);

  const totalEarnings   = parseFloat(form.salary || 0) + sumAmt(form.bonus_items) + sumAmt(form.allowance_items);
  const totalDeductions = sumAmt(form.deduction_items) + sumAmt(form.tax_items);
  const netPreview      = totalEarnings - totalDeductions;

  const activeData = tab === "current" ? payrollData : history;
  const filtered   = search.trim() === ""
    ? activeData
    : activeData.filter(p => {
        const q = search.toLowerCase();
        return (p.name || "").toLowerCase().includes(q) || (p.email || "").toLowerCase().includes(q);
      });

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.employee_id)                            { showToast("Select an employee", "error"); return; }
    if (!form.salary || parseFloat(form.salary) <= 0) { showToast("Enter a valid basic salary", "error"); return; }
    setSubmitting(true);

    const vBonus = form.bonus_items.filter(    i => parseFloat(i.amount || 0) > 0);
    const vAllow = form.allowance_items.filter(i => parseFloat(i.amount || 0) > 0);
    const vDed   = form.deduction_items.filter(i => parseFloat(i.amount || 0) > 0);
    const vTax   = form.tax_items.filter(      i => parseFloat(i.amount || 0) > 0);

    const payload = {
      employee_id:      form.employee_id,
      pay_date:         form.pay_date || null,
      pay_period:       form.pay_period,
      salary:           form.salary,
      bonus:            vBonus.reduce((s, i) => s + parseFloat(i.amount || 0), 0),
      bonus_reason:     vBonus.map(i => resolveDesc(i)).filter(Boolean).join(", "),
      allowances:       vAllow.reduce((s, i) => s + parseFloat(i.amount || 0), 0),
      allowance_reason: vAllow.map(i => resolveDesc(i)).filter(Boolean).join(", "),
      deductions:       vDed.reduce(  (s, i) => s + parseFloat(i.amount || 0), 0),
      deduction_reason: vDed.map(i => resolveDesc(i)).filter(Boolean).join(", "),
      tax:              vTax.reduce(  (s, i) => s + parseFloat(i.amount || 0), 0),
      tax_reason:       vTax.map(i => resolveDesc(i)).filter(Boolean).join(", "),
      earnings_items: [
        { description: "Basic Gross Pay", amount: form.salary },
        ...vBonus.map(i => ({ description: resolveDesc(i) || "Bonus",     amount: i.amount })),
        ...vAllow.map(i => ({ description: resolveDesc(i) || "Allowance", amount: i.amount })),
      ],
      deductions_items: [
        ...vDed.map(i => ({ description: resolveDesc(i) || "Deduction", amount: i.amount })),
        ...vTax.map(i => ({ description: resolveDesc(i) || "Tax",        amount: i.amount })),
      ],
      notes: form.notes,
    };

    try {
      await axios.post(`${API}/api/payroll/generate`, payload, { headers });
      showToast("Payroll processed! Employee notified via email.");
      setShowModal(false); setForm(initForm()); loadData();
    } catch (err) { showToast(err.response?.data?.error || "Failed", "error"); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await axios.delete(`${API}/api/payroll/${deleteId}`, { headers });
      showToast("Record deleted"); setDeleteId(null); loadData();
    } catch { showToast("Delete failed", "error"); }
    finally { setDeleting(false); }
  };

  const handleDownload = async payrollId => {
    try {
      const res = await axios.get(`${API}/api/payroll/download/${payrollId}`, { headers });
      await generatePayslipPDF(res.data.data, logoBase64);
    } catch { showToast("Download failed", "error"); }
  };

  const netSalary   = r => parseFloat(r.last_net_salary || r.net_salary || 0);
  const totalPayout = payrollData.reduce((s, p) => s + netSalary(p), 0);
  const paidCount   = payrollData.filter(p => p.payment_status === "Paid").length;

  const StatusBadge = ({ status }) => (
    <span style={{ background:status==="Paid"?"#dcfce7":"#fef9c3", color:status==="Paid"?"#16a34a":"#a16207", padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:600, display:"inline-flex", alignItems:"center", gap:4 }}>
      {status==="Paid" ? <CheckCircle2 size={11}/> : <Clock size={11}/>} {status}
    </span>
  );

  return (
    <>
      <style>{css}</style>
      <div className="pr-layout">
        <Sidebar />
        <div className="pr-main">

          {toast && (
            <div style={{ position:"fixed", top:16, right:16, zIndex:9999, background:toast.type==="error"?"#ef4444":"#10b981", color:"#fff", padding:"12px 20px", borderRadius:8, fontWeight:500, boxShadow:"0 4px 12px rgba(0,0,0,.15)", maxWidth:"calc(100vw - 32px)" }}>
              {toast.message}
            </div>
          )}

          {deleteId && (
            <div className="modal-overlay">
              <div style={{ background:"#fff", borderRadius:14, padding:28, width:"100%", maxWidth:360, textAlign:"center", boxShadow:"0 20px 60px rgba(0,0,0,.2)" }}>
                <div style={{ width:52, height:52, background:"#fee2e2", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 14px", color:"#ef4444", fontSize:22, fontWeight:700 }}>!</div>
                <div style={{ fontWeight:700, fontSize:16, marginBottom:8 }}>Delete Payroll Record?</div>
                <div style={{ fontSize:13, color:"#64748b", marginBottom:20 }}>This action cannot be undone.</div>
                <div style={{ display:"flex", gap:10 }}>
                  <button onClick={() => setDeleteId(null)} style={{ flex:1, padding:10, background:"#f1f5f9", color:"#64748b", border:"none", borderRadius:8, fontWeight:600, cursor:"pointer" }}>Cancel</button>
                  <button onClick={handleDelete} disabled={deleting} style={{ flex:1, padding:10, background:"#ef4444", color:"#fff", border:"none", borderRadius:8, fontWeight:600, cursor:"pointer" }}>
                    {deleting ? "Deleting…" : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {showModal && (
            <div className="modal-overlay">
              <div className="modal-box">
                <div className="modal-head">
                  <div>
                    <div style={{ fontWeight:700, fontSize:16 }}>Process Payroll</div>
                    <div style={{ fontSize:12, color:"#94a3b8", marginTop:2 }}>Employee receives email notification automatically</div>
                  </div>
                  <button onClick={() => { setShowModal(false); setForm(initForm()); }} style={{ background:"transparent", border:"none", cursor:"pointer", color:"#94a3b8" }}>
                    <X size={20}/>
                  </button>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="modal-body">

                    <div style={{ marginBottom:14 }}>
                      <label className="fl">Employee *</label>
                      <div style={{ position:"relative" }}>
                        <select className="fi fi-sel" value={form.employee_id} onChange={e => handleFormChange("employee_id", e.target.value)} required>
                          <option value="">Select employee…</option>
                          {payrollData.map(e => <option key={e.employee_id} value={e.employee_id}>{e.name}</option>)}
                        </select>
                        <ChevronDown size={13} style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", color:"#94a3b8", pointerEvents:"none" }}/>
                      </div>
                    </div>

                    <div className="two-col" style={{ marginBottom:14 }}>
                      <div>
                        <label className="fl">Pay Date</label>
                        <input type="date" className="fi" value={form.pay_date} onChange={e => handleFormChange("pay_date", e.target.value)}/>
                      </div>
                      <div>
                        <label className="fl">Pay Period</label>
                        <input className="fi" placeholder="e.g. March 2025" value={form.pay_period} onChange={e => handleFormChange("pay_period", e.target.value)}/>
                      </div>
                    </div>

                    <div className="section-box section-earn">
                      <div className="section-ttl" style={{ color:"#166534" }}> Earnings</div>
                      <div style={{ marginBottom:14 }}>
                        <label className="fl">Basic Salary (₹) *</label>
                        <input type="number" className="fi" placeholder="0.00" min="0" required
                          value={form.salary} onChange={e => handleFormChange("salary", e.target.value)}/>
                      </div>
                      <div className="two-col">
                        <LineItemsSection label="Bonus"      arrayKey="bonus_items"     options={BONUS_OPTIONS}
                          items={form.bonus_items}     onUpdate={updateItem} onAdd={addItem} onRemove={removeItem}/>
                        <LineItemsSection label="Allowances" arrayKey="allowance_items" options={ALLOWANCE_OPTIONS}
                          items={form.allowance_items} onUpdate={updateItem} onAdd={addItem} onRemove={removeItem}/>
                      </div>
                    </div>

                    <div className="section-box section-ded">
                      <div className="section-ttl" style={{ color:"#991b1b" }}>📉 Deductions</div>
                      <div className="two-col">
                        <LineItemsSection label="Deductions" arrayKey="deduction_items" options={DEDUCTION_OPTIONS}
                          items={form.deduction_items} onUpdate={updateItem} onAdd={addItem} onRemove={removeItem}/>
                        <LineItemsSection label="Tax / TDS"  arrayKey="tax_items"       options={TAX_OPTIONS}
                          items={form.tax_items}       onUpdate={updateItem} onAdd={addItem} onRemove={removeItem}/>
                      </div>
                    </div>

                    <div style={{ marginBottom:4 }}>
                      <label className="fl">General Notes (optional)</label>
                      <textarea className="fi" rows={2} placeholder="Any additional notes…" style={{ resize:"none" }}
                        value={form.notes} onChange={e => handleFormChange("notes", e.target.value)}/>
                    </div>

                    <div className="net-preview">
                      <div style={{ fontSize:11, color:"rgba(255,255,255,.8)", fontWeight:600, textTransform:"uppercase", letterSpacing:".06em" }}>Net Salary Preview</div>
                      <div style={{ fontSize:30, fontWeight:800, color:"#fff", letterSpacing:"-1px", margin:"4px 0" }}>{fmt(netPreview)}</div>
                      <div style={{ fontSize:11, color:"rgba(255,255,255,.7)" }}>Earnings {fmt(totalEarnings)} − Deductions {fmt(totalDeductions)}</div>
                    </div>
                  </div>

                  <div className="modal-foot">
                    <button type="button" onClick={() => { setShowModal(false); setForm(initForm()); }}
                      style={{ padding:"9px 20px", background:"#f1f5f9", color:"#64748b", border:"none", borderRadius:8, fontWeight:600, cursor:"pointer" }}>Cancel</button>
                    <button type="submit" disabled={submitting}
                      style={{ padding:"9px 22px", background:"#4f46e5", color:"#fff", border:"none", borderRadius:8, fontWeight:600, cursor:"pointer", display:"flex", alignItems:"center", gap:6 }}>
                      <DollarSign size={14}/> {submitting ? "Processing…" : "Generate Payslip"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:24, flexWrap:"wrap", gap:12 }}>
            <div>
              <h2 style={{ fontWeight:700, fontSize:22, margin:0 }}>Payroll Management</h2>
              <p style={{ color:"#64748b", fontSize:13, margin:"4px 0 0" }}>Process and manage employee salary records</p>
            </div>
            <button onClick={() => setShowModal(true)}
              style={{ display:"flex", alignItems:"center", gap:7, padding:"10px 18px", background:"#4f46e5", color:"#fff", border:"none", borderRadius:10, fontSize:13, fontWeight:600, cursor:"pointer", boxShadow:"0 4px 12px rgba(79,70,229,.3)", whiteSpace:"nowrap" }}>
              <Plus size={15}/> Process Payment
            </button>
          </div>

          <div className="pr-stats">
            {[
              { icon:<Wallet size={20} color="#4f46e5"/>,       bg:"#eef2ff", label:"Total Payout",    value:fmt(totalPayout) },
              { icon:<Users size={20} color="#0891b2"/>,         bg:"#e0f2fe", label:"Total Employees", value:payrollData.length },
              { icon:<CheckCircle2 size={20} color="#16a34a"/>,  bg:"#dcfce7", label:"Paid This Month", value:paidCount },
              { icon:<Clock size={20} color="#ca8a04"/>,          bg:"#fef9c3", label:"Pending",         value:payrollData.length - paidCount },
            ].map(s => (
              <div key={s.label} className="pr-stat">
                <div style={{ width:42, height:42, borderRadius:10, background:s.bg, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>{s.icon}</div>
                <div>
                  <div style={{ fontSize:11, color:"#64748b", fontWeight:600, marginBottom:3 }}>{s.label}</div>
                  <div style={{ fontSize:17, fontWeight:700, color:"#1e293b" }}>{s.value}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="pr-toolbar">
            <div className="pr-left-tools">
              <div className="pr-tabs">
               
                <button className={`pr-tab ${tab==="history"?"active":""}`} onClick={() => { setTab("history"); setSearch(""); }}>
                  <History size={12} style={{ marginRight:4, verticalAlign:"middle" }}/>History
                </button>
              </div>
              <div className="pr-search">
                <Search size={14}/>
                <input placeholder="Search by name or email…" value={search} onChange={e => setSearch(e.target.value)}/>
              </div>
            </div>
            <div style={{ fontSize:12, color:"#94a3b8", whiteSpace:"nowrap" }}>{filtered.length} record{filtered.length !== 1 ? "s" : ""}</div>
          </div>

          {loading ? (
            <div style={{ textAlign:"center", padding:40, color:"#94a3b8" }}>Loading…</div>
          ) : filtered.length === 0 ? (
            <div style={{ background:"#fff", borderRadius:14, padding:50, textAlign:"center" }}>
              <div style={{ fontSize:36, marginBottom:10 }}>.</div>
              <div style={{ fontWeight:600, color:"#1e293b", marginBottom:4 }}>{search ? "No results matching your search" : "No payroll records yet"}</div>
              {search && <div style={{ fontSize:13, color:"#94a3b8" }}>Try a different name or email</div>}
            </div>
          ) : (
            <>
              <div className="pr-table-card">
                <table className="pr-table">
                  <thead>
                    <tr>
                      <th>Employee</th><th>Period</th><th>Basic</th><th>Bonus</th><th>Allow.</th>
                      <th>Deductions</th><th>Tax</th><th>Net Salary</th><th>Status</th><th>Date</th>
                      <th style={{ textAlign:"right" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((row, i) => (
                      <tr key={row.payroll_id || ("emp-"+i)}>
                        <td><div style={{ fontWeight:600, color:"#1e293b" }}>{row.name}</div><div style={{ fontSize:11, color:"#94a3b8" }}>{row.email}</div></td>
                        <td style={{ fontSize:12, color:"#64748b" }}>{row.pay_period || "—"}</td>
                        <td>{fmt(row.salary)}</td>
                        <td>{parseFloat(row.bonus||0)>0?<><div style={{color:"#16a34a",fontWeight:600}}>{fmt(row.bonus)}</div>{row.bonus_reason&&<div className="rsub">{row.bonus_reason}</div>}</>:"—"}</td>
                        <td>{parseFloat(row.allowances||0)>0?<><div style={{color:"#0891b2",fontWeight:600}}>{fmt(row.allowances)}</div>{row.allowance_reason&&<div className="rsub">{row.allowance_reason}</div>}</>:"—"}</td>
                        <td>{parseFloat(row.deductions||0)>0?<><div style={{color:"#ef4444",fontWeight:600}}>{fmt(row.deductions)}</div>{row.deduction_reason&&<div className="rsub">{row.deduction_reason}</div>}</>:"—"}</td>
                        <td>{parseFloat(row.tax||0)>0?<><div style={{color:"#ef4444",fontWeight:600}}>{fmt(row.tax)}</div>{row.tax_reason&&<div className="rsub">{row.tax_reason}</div>}</>:"—"}</td>
                        <td style={{ fontWeight:700, color:"#1e293b" }}>{fmt(netSalary(row))}</td>
                        <td><StatusBadge status={row.payment_status||"Paid"}/></td>
                        <td style={{ fontSize:12, color:"#64748b" }}>{fmtD(row.pay_date)}</td>
                        <td style={{ textAlign:"right" }}>
                          <div style={{ display:"flex", gap:6, justifyContent:"flex-end" }}>
                            {row.payroll_id && (
                              <button onClick={() => handleDownload(row.payroll_id)}
                                style={{ padding:"5px 10px", background:"#fffbeb", color:"#92400e", border:"1px solid #fde68a", borderRadius:7, cursor:"pointer", display:"flex", alignItems:"center", gap:4, fontSize:12, fontWeight:600 }}>
                                <Download size={13}/> PDF
                              </button>
                            )}
                            {row.payroll_id && (
                              <button onClick={() => setDeleteId(row.payroll_id)}
                                style={{ padding:"5px 8px", background:"#fff1f2", color:"#ef4444", border:"1px solid #fecaca", borderRadius:7, cursor:"pointer", display:"flex", alignItems:"center" }}>
                                <Trash2 size={13}/>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="pr-cards">
                {filtered.map((row, i) => (
                  <div key={row.payroll_id || ("m-"+i)} className="pr-card">
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
                      <div>
                        <div style={{ fontWeight:700, fontSize:15, color:"#1e293b" }}>{row.name}</div>
                        <div style={{ fontSize:11, color:"#94a3b8", marginTop:2 }}>{row.email}</div>
                        <div style={{ fontSize:11, color:"#64748b", marginTop:2 }}>{row.pay_period || fmtD(row.pay_date)}</div>
                      </div>
                      <StatusBadge status={row.payment_status||"Paid"}/>
                    </div>
                    <div style={{ fontSize:22, fontWeight:800, color:"#1e293b", marginBottom:12 }}>{fmt(netSalary(row))}</div>
                    <div style={{ display:"flex", gap:8 }}>
                      {row.payroll_id && (
                        <button onClick={() => handleDownload(row.payroll_id)}
                          style={{ flex:1, padding:"9px", background:"#fffbeb", color:"#92400e", border:"1px solid #fde68a", borderRadius:8, fontSize:12, fontWeight:600, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:5 }}>
                          <Download size={13}/> Download PDF
                        </button>
                      )}
                      {row.payroll_id && (
                        <button onClick={() => setDeleteId(row.payroll_id)}
                          style={{ padding:"9px 14px", background:"#fff1f2", color:"#ef4444", border:"1px solid #fecaca", borderRadius:8, cursor:"pointer" }}>
                          <Trash2 size={14}/>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}