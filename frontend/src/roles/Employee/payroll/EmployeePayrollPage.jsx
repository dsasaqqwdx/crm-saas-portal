import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../../../layouts/Sidebar";
import Logo from "../../../assets/logo.png";
import { Download, CheckCircle2, Wallet, FileText, TrendingUp } from "lucide-react";

const API = process.env.REACT_APP_API_URL || "http://localhost:5001";

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
  const W = 210, margin = 15;
  const contentW = W - margin * 2;

  const TEAL    = [0, 128, 128];
  const TEAL_LT = [224, 242, 242];
  const GRAY    = [100, 100, 100];
  const DGRAY   = [50, 50, 50];
  const LGRAY   = [245, 245, 245];
  const WHITE   = [255, 255, 255];
  const BLACK   = [20, 20, 20];
  const BORDER  = [200, 200, 200];

  const money = (n) => "Rs." + parseFloat(n || 0).toLocaleString("en-GB", { minimumFractionDigits: 2 });
  const fmtD  = (v) => v ? new Date(v).toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" }) : "-";

  doc.setFillColor(...TEAL);
  doc.rect(0, 0, W, 18, "F");
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

  doc.setFillColor(...TEAL_LT);
  doc.rect(margin, y, contentW, 12, "F");
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

  const colW = contentW / 2;
  const cellH = 8;
  doc.setLineWidth(0.3); doc.setDrawColor(...BORDER);

  infoData.forEach((item, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const cx = margin + col * colW;
    const cy = y + row * cellH;

    if (Math.floor(i / 2) % 2 === 0) {
      doc.setFillColor(...LGRAY); doc.rect(cx, cy, colW, cellH, "F");
    } else {
      doc.setFillColor(...WHITE); doc.rect(cx, cy, colW, cellH, "F");
    }
    doc.rect(cx, cy, colW, cellH, "S");

    doc.setFontSize(7.5); doc.setFont("helvetica", "bold"); doc.setTextColor(...GRAY);
    doc.text(item[0], cx + 3, cy + 4.5);
    doc.setFontSize(8); doc.setFont("helvetica", "normal"); doc.setTextColor(...BLACK);
    doc.text(String(item[1]), cx + colW - 3, cy + 4.5, { align: "right" });
  });

  y += Math.ceil(infoData.length / 2) * cellH + 8;

  const earnings_items = Array.isArray(d.earnings_items) && d.earnings_items.length > 0
    ? d.earnings_items
    : [
        { description: "Basic Gross Pay", amount: d.salary || 0 },
        ...(parseFloat(d.bonus || 0) > 0 ? [{ description: d.bonus_reason || "Bonus", amount: d.bonus }] : []),
        ...(parseFloat(d.allowances || 0) > 0 ? [{ description: d.allowance_reason || "Allowances", amount: d.allowances }] : []),
      ];

  const deductions_items = Array.isArray(d.deductions_items) && d.deductions_items.length > 0
    ? d.deductions_items
    : [
        ...(parseFloat(d.deductions || 0) > 0 ? [{ description: d.deduction_reason || "Deductions", amount: d.deductions }] : [{ description: "National Insurance", amount: 0 }]),
        ...(parseFloat(d.tax || 0) > 0 ? [{ description: d.tax_reason || "Income Tax", amount: d.tax }] : []),
      ];

  const maxRows = Math.max(earnings_items.length, deductions_items.length);
  const halfW = contentW / 2;
  const rowH = 8;

  doc.setFillColor(...TEAL);
  doc.rect(margin, y, halfW, 9, "F");
  doc.rect(margin + halfW, y, halfW, 9, "F");
  doc.setFontSize(8.5); doc.setFont("helvetica", "bold"); doc.setTextColor(...WHITE);
  doc.text("Earnings", margin + halfW / 2, y + 6, { align: "center" });
  doc.text("Deductions", margin + halfW + halfW / 2, y + 6, { align: "center" });

  
  let ry = y + 9;
  doc.setFillColor(220, 240, 240);
  doc.rect(margin, ry, halfW, 7, "F");
  doc.rect(margin + halfW, ry, halfW, 7, "F");
  doc.setDrawColor(...BORDER); doc.setLineWidth(0.25);
  doc.rect(margin, ry, halfW, 7, "S");
  doc.rect(margin + halfW, ry, halfW, 7, "S");
  doc.setFontSize(7); doc.setFont("helvetica", "bold"); doc.setTextColor(...TEAL);
  doc.text("Description", margin + 3, ry + 4.5);
  doc.text("Amount", margin + halfW - 3, ry + 4.5, { align: "right" });
  doc.text("Description", margin + halfW + 3, ry + 4.5);
  doc.text("Amount", margin + contentW - 3, ry + 4.5, { align: "right" });
  ry += 7;

  for (let i = 0; i < maxRows; i++) {
    const earnItem = earnings_items[i];
    const dedItem  = deductions_items[i];
    const bg = i % 2 === 0 ? WHITE : LGRAY;
    doc.setFillColor(...bg); doc.rect(margin, ry, halfW, rowH, "F");
    doc.setFillColor(...bg); doc.rect(margin + halfW, ry, halfW, rowH, "F");
    doc.setDrawColor(...BORDER); doc.setLineWidth(0.25);
    doc.rect(margin, ry, halfW, rowH, "S");
    doc.rect(margin + halfW, ry, halfW, rowH, "S");

    doc.setFontSize(8); doc.setFont("helvetica", "normal"); doc.setTextColor(...DGRAY);
    if (earnItem) {
      doc.text(String(earnItem.description || ""), margin + 3, ry + 5.5);
      doc.text(money(earnItem.amount), margin + halfW - 3, ry + 5.5, { align: "right" });
    }
    if (dedItem) {
      doc.text(String(dedItem.description || ""), margin + halfW + 3, ry + 5.5);
      doc.text(money(dedItem.amount), margin + contentW - 3, ry + 5.5, { align: "right" });
    }
    ry += rowH;
  }

  const totalEarnings   = earnings_items.reduce((s, i) => s + parseFloat(i.amount || 0), 0);
  const totalDeductions = deductions_items.reduce((s, i) => s + parseFloat(i.amount || 0), 0);

  doc.setFillColor(220, 240, 240);
  doc.rect(margin, ry, halfW, 9, "F");
  doc.rect(margin + halfW, ry, halfW, 9, "F");
  doc.setDrawColor(...TEAL); doc.setLineWidth(0.5);
  doc.rect(margin, ry, halfW, 9, "S");
  doc.rect(margin + halfW, ry, halfW, 9, "S");
  doc.setFontSize(8.5); doc.setFont("helvetica", "bold"); doc.setTextColor(...TEAL);
  doc.text("Total Earnings", margin + 3, ry + 6);
  doc.text(money(totalEarnings), margin + halfW - 3, ry + 6, { align: "right" });
  doc.text("Total Deductions", margin + halfW + 3, ry + 6);
  doc.text(money(totalDeductions), margin + contentW - 3, ry + 6, { align: "right" });
  ry += 14;

  const net = parseFloat(d.net_salary || 0);
  doc.setFillColor(...TEAL);
  doc.roundedRect(margin, ry, contentW, 14, 3, 3, "F");
  doc.setFontSize(10); doc.setFont("helvetica", "bold"); doc.setTextColor(...WHITE);
  doc.text("Net Pay = " + money(net), W / 2, ry + 9, { align: "center" });
  ry += 22;

  

  if (d.notes) {
    doc.setFontSize(8); doc.setFont("helvetica", "italic"); doc.setTextColor(...GRAY);
    const wrapped = doc.splitTextToSize(d.notes, contentW);
    doc.text(wrapped, margin, ry);
  }

  doc.setFillColor(...TEAL);
  doc.rect(0, 283, W, 14, "F");
  doc.setFontSize(7.5); doc.setFont("helvetica", "normal"); doc.setTextColor(...WHITE);
  doc.text("If you have any questions about your payslip, please contact:", W / 2, 289, { align: "center" });
  doc.text(d.company_email || "shnoorinfo@company.com", W / 2, 294, { align: "center" });

  doc.save("Payslip_" + (d.name || "Employee").replace(/\s+/g, "_") + "_" + fmtD(d.pay_date) + ".pdf");
}

const css = `
  .ep-layout { display:flex; min-height:100vh; background:#f8fafc; }
  .ep-main   { margin-left:250px; flex:1; padding:32px 28px; }
  .ep-stats  { display:grid; grid-template-columns:repeat(3,1fr); gap:14px; margin-bottom:24px; }
  .ep-stat   { background:#fff; border-radius:12px; padding:18px; box-shadow:0 2px 8px rgba(0,0,0,.05); display:flex; align-items:center; gap:14px; }
  .ep-table-wrap { background:#fff; border-radius:14px; box-shadow:0 4px 20px rgba(0,0,0,.06); overflow:hidden; }
  .ep-table { width:100%; border-collapse:collapse; }
  .ep-table th { padding:12px 16px; font-size:11px; font-weight:700; color:#64748b; text-transform:uppercase; letter-spacing:.05em; background:#f8fafc; text-align:left; white-space:nowrap; }
  .ep-table td { padding:13px 16px; font-size:13px; border-top:1px solid #f1f5f9; vertical-align:middle; }
  .ep-table tr:hover td { background:#fafbff; }
  .ep-cards { display:none; }
  .ep-card  { background:#fff; border-radius:12px; margin-bottom:12px; box-shadow:0 2px 8px rgba(0,0,0,.05); overflow:hidden; }
  .ep-empty { background:#fff; border-radius:14px; padding:60px 20px; text-align:center; box-shadow:0 2px 8px rgba(0,0,0,.05); }
  .rsn-badge { font-size:10px; color:#94a3b8; font-style:italic; margin-top:2px; }

  @media (max-width:768px) {
    .ep-main       { margin-left:70px; padding:20px 14px; }
    .ep-stats      { grid-template-columns:1fr 1fr; gap:10px; }
    .ep-table-wrap { display:none; }
    .ep-cards      { display:block; }
  }
  @media (max-width:480px) {
    .ep-main  { margin-left:70px; padding:14px 10px; }
    .ep-stats { grid-template-columns:1fr; }
  }
`;

const fmt  = (n) => "₹" + parseFloat(n || 0).toLocaleString("en-IN");
const fmtD = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";

export default function EmployeePayrollPage() {
  const [payslips,   setPayslips  ] = useState([]);
  const [loading,    setLoading   ] = useState(true);
  const [logoBase64, setLogoBase64] = useState(null);

  const headers = { "x-auth-token": localStorage.getItem("token") };

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      canvas.getContext("2d").drawImage(img, 0, 0);
      setLogoBase64(canvas.toDataURL("image/png"));
    };
    img.src = Logo;
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${API}/api/payroll/my-payslips`, { headers });
        setPayslips(res.data.data || []);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    })();
  }, []); // eslint-disable-line

  const totalEarned = payslips.reduce((s, p) => s + parseFloat(p.net_salary || 0), 0);
  const latest      = payslips[0];

  return (
    <>
      <style>{css}</style>
      <div className="ep-layout">
        <Sidebar />
        <div className="ep-main">

          <div style={{ marginBottom:24 }}>
            <h2 style={{ fontWeight:700, fontSize:22, margin:0 }}>My Payslips</h2>
            <p style={{ color:"#64748b", fontSize:13, margin:"4px 0 0" }}>View and download your salary records</p>
          </div>

          <div className="ep-stats">
            {[
              { icon:<Wallet size={20} color="#4f46e5"/>,     bg:"#eef2ff", label:"Total Earned",   value:fmt(totalEarned) },
              { icon:<FileText size={20} color="#16a34a"/>,   bg:"#dcfce7", label:"Total Payslips", value:payslips.length },
              { icon:<TrendingUp size={20} color="#ea580c"/>, bg:"#fff7ed", label:"Latest Pay",     value:latest ? fmt(latest.net_salary) : "—" },
            ].map(s => (
              <div key={s.label} className="ep-stat">
                <div style={{ width:42, height:42, borderRadius:10, background:s.bg, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>{s.icon}</div>
                <div>
                  <div style={{ fontSize:11, color:"#64748b", fontWeight:600, marginBottom:3 }}>{s.label}</div>
                  <div style={{ fontSize:18, fontWeight:700, color:"#1e293b" }}>{s.value}</div>
                </div>
              </div>
            ))}
          </div>

          {loading ? (
            <div style={{ textAlign:"center", padding:40, color:"#94a3b8" }}>Loading payslips...</div>
          ) : payslips.length === 0 ? (
            <div className="ep-empty">
              <div style={{ fontSize:42, marginBottom:12 }}>💰</div>
              <div style={{ fontWeight:600, color:"#1e293b", marginBottom:4 }}>No payslips yet</div>
              <div style={{ fontSize:13, color:"#94a3b8" }}>Your payslips will appear here once salary is processed</div>
            </div>
          ) : (
            <>
              <div className="ep-table-wrap">
                <table className="ep-table">
                  <thead>
                    <tr>
                      <th>#</th><th>Pay Period</th><th>Basic</th><th>Bonus</th>
                      <th>Allowances</th><th>Deductions</th><th>Tax</th>
                      <th>Net Salary</th><th>Download</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payslips.map((slip, i) => (
                      <tr key={slip.payroll_id}>
                        <td style={{ color:"#94a3b8" }}>{i + 1}</td>
                        <td>
                          <div style={{ fontWeight:500 }}>{slip.pay_period || fmtD(slip.pay_date)}</div>
                          {slip.pay_period && <div style={{ fontSize:11, color:"#94a3b8" }}>{fmtD(slip.pay_date)}</div>}
                        </td>
                        <td>{fmt(slip.salary)}</td>
                        <td>{parseFloat(slip.bonus||0)>0 ? <><div style={{color:"#16a34a",fontWeight:600}}>{fmt(slip.bonus)}</div>{slip.bonus_reason&&<div className="rsn-badge">{slip.bonus_reason}</div>}</> : "—"}</td>
                        <td>{parseFloat(slip.allowances||0)>0 ? <><div style={{color:"#0891b2",fontWeight:600}}>{fmt(slip.allowances)}</div>{slip.allowance_reason&&<div className="rsn-badge">{slip.allowance_reason}</div>}</> : "—"}</td>
                        <td>{parseFloat(slip.deductions||0)>0 ? <><div style={{color:"#ef4444",fontWeight:600}}>{fmt(slip.deductions)}</div>{slip.deduction_reason&&<div className="rsn-badge">{slip.deduction_reason}</div>}</> : "—"}</td>
                        <td>{parseFloat(slip.tax||0)>0 ? <><div style={{color:"#ef4444",fontWeight:600}}>{fmt(slip.tax)}</div>{slip.tax_reason&&<div className="rsn-badge">{slip.tax_reason}</div>}</> : "—"}</td>
                        <td>
                          <div style={{ fontWeight:700, color:"#1e293b", fontSize:14 }}>{fmt(slip.net_salary)}</div>
                          <span style={{ background:"#dcfce7", color:"#16a34a", padding:"2px 8px", borderRadius:20, fontSize:10, fontWeight:600, display:"inline-flex", alignItems:"center", gap:3, marginTop:3 }}>
                            <CheckCircle2 size={9}/> Paid
                          </span>
                        </td>
                        <td>
                          <button onClick={() => generatePayslipPDF(slip, logoBase64)}
                            style={{ padding:"6px 12px", background:"#fffbeb", color:"#92400e", border:"1px solid #fde68a", borderRadius:8, fontSize:12, fontWeight:600, cursor:"pointer", display:"inline-flex", alignItems:"center", gap:5 }}>
                            <Download size={13}/> PDF
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="ep-cards">
                {payslips.map(slip => (
                  <div key={slip.payroll_id} className="ep-card">
                    <div style={{ background:"linear-gradient(135deg,#008080,#00b3b3)", padding:"14px 16px" }}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                        <div>
                          <div style={{ fontSize:10, color:"rgba(255,255,255,0.7)", fontWeight:700, textTransform:"uppercase" }}>Net Salary</div>
                          <div style={{ fontSize:22, fontWeight:800, color:"#fff", letterSpacing:"-0.5px" }}>{fmt(slip.net_salary)}</div>
                        </div>
                        <span style={{ background:"rgba(255,255,255,0.3)", color:"#fff", padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:700 }}>Paid</span>
                      </div>
                      <div style={{ fontSize:11, color:"rgba(255,255,255,0.85)", marginTop:4 }}>{slip.pay_period || fmtD(slip.pay_date)}</div>
                    </div>
                    <div style={{ padding:14 }}>
                      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:12 }}>
                        <div style={{ background:"#f8fafc", borderRadius:8, padding:"8px 10px" }}>
                          <div style={{ fontSize:10, color:"#94a3b8", fontWeight:600 }}>Basic</div>
                          <div style={{ fontSize:13, fontWeight:600, color:"#1e293b" }}>{fmt(slip.salary)}</div>
                        </div>
                        {parseFloat(slip.bonus||0)>0 && (
                          <div style={{ background:"#f0fdf4", borderRadius:8, padding:"8px 10px" }}>
                            <div style={{ fontSize:10, color:"#94a3b8", fontWeight:600 }}>Bonus</div>
                            <div style={{ fontSize:13, fontWeight:600, color:"#16a34a" }}>{fmt(slip.bonus)}</div>
                            {slip.bonus_reason && <div style={{ fontSize:10, color:"#94a3b8" }}>{slip.bonus_reason}</div>}
                          </div>
                        )}
                        {parseFloat(slip.allowances||0)>0 && (
                          <div style={{ background:"#eff6ff", borderRadius:8, padding:"8px 10px" }}>
                            <div style={{ fontSize:10, color:"#94a3b8", fontWeight:600 }}>Allowances</div>
                            <div style={{ fontSize:13, fontWeight:600, color:"#0891b2" }}>{fmt(slip.allowances)}</div>
                          </div>
                        )}
                        {(parseFloat(slip.deductions||0)+parseFloat(slip.tax||0))>0 && (
                          <div style={{ background:"#fff1f2", borderRadius:8, padding:"8px 10px" }}>
                            <div style={{ fontSize:10, color:"#94a3b8", fontWeight:600 }}>Deducted</div>
                            <div style={{ fontSize:13, fontWeight:600, color:"#ef4444" }}>-{fmt(parseFloat(slip.deductions||0)+parseFloat(slip.tax||0))}</div>
                          </div>
                        )}
                      </div>
                      <button onClick={() => generatePayslipPDF(slip, logoBase64)}
                        style={{ width:"100%", padding:10, background:"#e0f2f2", color:"#005f5f", border:"1px solid #99d6d6", borderRadius:8, fontSize:13, fontWeight:600, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
                        <Download size={14}/> Download PDF Payslip
                      </button>
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