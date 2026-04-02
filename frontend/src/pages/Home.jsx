
// // import React from "react";
// // import { Link } from "react-router-dom";
// // import Navbar from "../layouts/Navbar";
// // import Footer from "../layouts/Footer";
// // import { CreditCard, Clock, MapPin, FileText, Globe, ArrowRight, ShieldCheck,Star  } from "lucide-react";
// // import { useWebsiteSettings } from "../hooks/useWebsiteSettings";
// // import photo from "../assets/photo-1531538606174-0f90ff5dce83.avif";
// // import clientPhoto from "../assets/photo-1573165850883-9b0e18c44bd2.jpg"

// // const featureCards = [
// //   { title: "Payroll Processing",  desc: "One-click automated payroll generation.",    icon: <CreditCard size={24} /> },
// //   { title: "Global Locations",    desc: "Manage staff across multiple branches.",      icon: <MapPin size={24} /> },
// //   { title: "Letterheads",         desc: "Generate professional dynamic documents.",    icon: <FileText size={24} /> },
// //   { title: "Leave Management",    desc: "Track and approve employee time off.",        icon: <ShieldCheck size={24} /> },
// //   { title: "Attendance",          desc: "Real-time employee clock-in tracking.",       icon: <Clock size={24} /> },
// //   { title: "Multi-Language",      desc: "Localized support for global teams.",         icon: <Globe size={24} /> },
// // ];

// // const Home = () => {
// //   const { data: s } = useWebsiteSettings("header");

// //   const btn1Show = s.showBtn1 !== "false";
// //   const btn2Show = s.showBtn2 !== "false";

// //   return (
// // <div
// //   className="min-vh-100 overflow-hidden pt-5"
// //   style={{ background: "#0F172A", color: "#E2E8F0" }}
// // >
// //   <Navbar />
// //   <section className="container py-5 mt-md-5 mt-5" >
// //     <div className="row  g-4">
// //       <div className="col-lg-6 ">
// //         <p
// //           className="text-uppercase fw-bold small mb-3"
// //           style={{ color: "#6366F1", letterSpacing: "1px", fontFamily: "'Ubuntu', sans-serif", }}
// //         >
// //           {s.subtitle || "Grow Your Business With SHNOOR INTERNATIONAL LLC"}
// //         </p>

// //         <h1 className="display-2 fw-bold mb-4" style={{ fontFamily: "'Ubuntu', sans-serif",}}>
// //           {s.title
// //             ? s.title.split(" ").slice(0, 3).join(" ")
// //             : "Next Generation HR"}
// //           <br />
// //           <span style={{ color: "#6366F1", fontFamily: "'Ubuntu', sans-serif", }}>
// //             {s.title
// //               ? s.title.split(" ").slice(3).join(" ")
// //               : "Management System"}
// //           </span>
// //         </h1>

// //         <p className="lead mb-4" style={{ color: "#94A3B8" , fontFamily: "'Ubuntu', sans-serif",}}>
// //           {s.description ||
// //             "Streamline your workflow with automated payroll, real-time attendance tracking, and centralized employee management."}
// //         </p>

// //         <div className="d-flex flex-wrap gap-3 mb-4">
// //           {btn1Show && (
// //             <Link
// //               to={s.btn1Url || "/register"}
// //               className="btn btn-lg fw-bold d-flex align-items-center px-4"
// //               style={{
// //                 background: "#6366F1",
// //                 border: "none",
// //                 color: "#fff",
// //                 borderRadius: "10px",
// //                  fontFamily: "'Ubuntu', sans-serif",
// //               }}
// //             >
// //               {s.btn1Text || "Get Started"}
// //               <ArrowRight size={18} className="ms-2" />
// //             </Link>
// //           )}

// //           {btn2Show && (
// //             <Link
// //               to={s.btn2Url || "/features"}
// //               className="btn btn-lg px-4"
// //               style={{
// //                 border: "1px solid #6366F1",
// //                 color: "#6366F1",
// //                 borderRadius: "10px",
// //                  fontFamily: "'Ubuntu', sans-serif",
// //               }}
// //             >
// //               {s.btn2Text || "View Features"}
// //             </Link>
// //           )}
// //         </div>
// //       </div>

// // <div className="col-lg-6">
// //   <div className="row g-4">{featureCards.map((feature, index) => (
// //       <div key={index} className="col-md-6">
// //         <div
// //           className="card border-0 h-100"
// //           style={{
// //             background: "#1E293B",
// //             borderRadius: "18px",
// //             transition: "all 0.35s ease",
// //             fontFamily: "'Ubuntu', sans-serif",
// //             border: "1px solid rgba(255,255,255,0.05)",
// //             cursor: "pointer"
// //           }}
// //           onMouseEnter={(e) => {
// //             e.currentTarget.style.transform = "translateY(-8px)";
// //             e.currentTarget.style.boxShadow = "0 15px 35px rgba(0,0,0,0.35)";
// //           }}
// //           onMouseLeave={(e) => {
// //             e.currentTarget.style.transform = "translateY(0)";
// //             e.currentTarget.style.boxShadow = "none";
// //           }}
// //         >
// //           <div className="card-body p-4 text-center">
// //             <div
// //               className="mb-4 mx-auto d-flex align-items-center justify-content-center"
// //               style={{
// //                 width: "60px",
// //                 height: "60px",
// //                 borderRadius: "100%",
// //                 background: "rgba(99,102,241,0.15)",
// //                 color: "#6366F1",
// //               }}
// //             >
// //               {feature.icon}
// //             </div>
// //             <h5
// //               className="fw-bold mb-2"
// //               style={{
// //                 color: "#E2E8F0",
// //                 fontFamily: "'Ubuntu', sans-serif",
// //               }}
// //             >
// //               {feature.title}
// //             </h5>
// //             <p
// //               className="small fw-semibold"
// //               style={{
// //                 color: "#94A3B8",
// //                 lineHeight: "1.6",
// //               }}
// //             >
// //               {feature.desc}
// //             </p>
// //           </div>
// //         </div>
// //       </div>
// //     ))}
// //   </div>
// // </div>

// //     </div>
// //   </section>




// // <section style={{ background: "#0F172A", padding: "80px 0" }}>
// //   <div className="container">
// //     <div className="row align-items-center g-5">
// //       <div className="col-lg-7">
// //         <h2
// //           className="fw-bold mb-4"
// //           style={{ color: "#FFFFFF", fontSize: "38px" }}
// //         >
// //           About SHNOOR INTERNATIONAL LLC
// //         </h2>

// //         <p style={{ color: "#94A3B8", lineHeight: "1.8", fontSize: "16px" }}>
// //           SHNOOR INTERNATIONAL LLC has been formed to work progressively in the
// //           field of various IT needs focusing primarily on IT Consulting &
// //           Staffing, IT Product Development, Application Designing & Development,
// //           SAP Outsourcing, Import & Exports of various products from India to
// //           United Arab Emirates, Bahrain, Qatar, Oman & Malaysia.
// //         </p>

// //         <p style={{ color: "#94A3B8", lineHeight: "1.8", fontSize: "16px" }}>
// //           We deal reasonably with producers, farmers, wholesalers, importers,
// //           and other stakeholders to establish a strong global presence in
// //           international trade. Our goal is to close the gap between buyers and
// //           sellers in the foreign market while ensuring high-quality products and
// //           customer satisfaction.
// //         </p>

// //         <p style={{ color: "#94A3B8", lineHeight: "1.8", fontSize: "16px" }}>
// //           Headquartered in <span style={{ color: "#6366F1" }}>MUSCAT - Oman</span>,
// //           beyond technology, we specialize in import and export of quality
// //           products from India to the UAE, Bahrain, Qatar, Oman, and Malaysia —
// //           building strong global trade partnerships.
// //         </p>
// //       </div>

// //       <div className="col-lg-5">
// //         <img
// //           src={photo}
// //           alt="Company"
// //           style={{
// //             width: "100%",
// //             maxWidth: "420px",
// //             borderRadius: "16px",
// //             boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
// //           }}
// //         />
// //       </div>

// //     </div>
// //   </div>
// // </section>

// //   <section
// //     className="py-5 mt-2"
// //   >
// //     <div className="container">
// //   <div className="row g-4 text-center">
    
// //     <div className="col-12 col-sm-6 col-lg-3">
// //       <div
// //         style={{
// //           background: "#1E293B",
// //           border: "1px solid #334155",
// //           padding: "35px 20px",
// //           borderRadius: "12px",
// //           height: "100%",
// //           transition: "all 0.35s ease",
// //           cursor: "pointer"
// //         }}
// //           onMouseEnter={(e) => {
// //             e.currentTarget.style.transform = "translateY(-8px)";
// //             e.currentTarget.style.boxShadow = "0 15px 35px rgba(0,0,0,0.35)";
// //           }}
// //           onMouseLeave={(e) => {
// //             e.currentTarget.style.transform = "translateY(0)";
// //             e.currentTarget.style.boxShadow = "none";
// //           }}
// //       >
// //         <h2 className="fw-bold display-6" style={{ color: "#6366F1" }}>
// //           10k+
// //         </h2>
// //         <p className="text-uppercase small mb-0" style={{ color: "#94A3B8" }}>
// //           Active Users
// //         </p>
// //       </div>
// //     </div>

// //     <div className="col-12 col-sm-6 col-lg-3">
// //       <div
// //         style={{
// //           background: "#1E293B",
// //           border: "1px solid #334155",
// //           padding: "35px 20px",
// //           borderRadius: "12px",
// //           height: "100%",
// //           transition: "all 0.35s ease",
// //           cursor: "pointer"
// //         }}
// //           onMouseEnter={(e) => {
// //             e.currentTarget.style.transform = "translateY(-8px)";
// //             e.currentTarget.style.boxShadow = "0 15px 35px rgba(0,0,0,0.35)";
// //           }}
// //           onMouseLeave={(e) => {
// //             e.currentTarget.style.transform = "translateY(0)";
// //             e.currentTarget.style.boxShadow = "none";
// //           }}

// //       >
// //         <h2 className="fw-bold display-6" style={{ color: "#22C55E" }}>
// //           500+
// //         </h2>
// //         <p className="text-uppercase small mb-0" style={{ color: "#94A3B8" }}>
// //           Companies
// //         </p>
// //       </div>
// //     </div>

// //     <div className="col-12 col-sm-6 col-lg-3">
// //       <div
// //         style={{
// //           background: "#1E293B",
// //           border: "1px solid #334155",
// //           padding: "35px 20px",
// //           borderRadius: "12px",
// //           height: "100%",
// //           transition: "all 0.35s ease",
// //           cursor: "pointer"
// //         }}
// //           onMouseEnter={(e) => {
// //             e.currentTarget.style.transform = "translateY(-8px)";
// //             e.currentTarget.style.boxShadow = "0 15px 35px rgba(0,0,0,0.35)";
// //           }}
// //           onMouseLeave={(e) => {
// //             e.currentTarget.style.transform = "translateY(0)";
// //             e.currentTarget.style.boxShadow = "none";
// //           }}
// //       >
// //         <h2 className="fw-bold display-6" style={{ color: "#6366F1" }}>
// //           24/7
// //         </h2>
// //         <p className="text-uppercase small mb-0" style={{ color: "#94A3B8" }}>
// //           Support
// //         </p>
// //       </div>
// //     </div>

// //     <div className="col-12 col-sm-6 col-lg-3">
// //       <div
// //         style={{
// //           background: "#1E293B",
// //           border: "1px solid #334155",
// //           padding: "35px 20px",
// //           borderRadius: "12px",
// //           height: "100%",
// //           transition: "all 0.35s ease",
// //            cursor: "pointer"
// //         }}
// //                   onMouseEnter={(e) => {
// //             e.currentTarget.style.transform = "translateY(-8px)";
// //             e.currentTarget.style.boxShadow = "0 15px 35px rgba(0,0,0,0.35)";
// //           }}
// //           onMouseLeave={(e) => {
// //             e.currentTarget.style.transform = "translateY(0)";
// //             e.currentTarget.style.boxShadow = "none";
// //           }}
// //       >
// //         <h2 className="fw-bold display-6" style={{ color: "#22C55E" }}>
// //           99.9%
// //         </h2>
// //         <p className="text-uppercase small mb-0" style={{ color: "#94A3B8" }}>
// //           Uptime
// //         </p>
// //       </div>
// //     </div>

// //   </div>
// // </div>
// //   </section>

// //   <section className="container py-5 mt-md-5 mt-5">
// //           <div>
// //             <h1 className=" mb-5 fs-1 " style={{fontFamily: "'Ubuntu', sans-serif"}}>Connecting Technology & Trade Together</h1>
// //             <p className=" mt-4" style={{fontFamily: "'Ubuntu', sans-serif",color:"#94A3B8"}}>At SHNOOR International LLC, we believe innovation should have no borders. Our unique approach combines cutting-edge IT solutions with seamless global trade services, helping businesses thrive in both the digital space and the global marketplace.</p>
// //             <p className=" mt-4" style={{fontFamily: "'Ubuntu', sans-serif",color:"#94A3B8"}}>From IT Consulting, Product Development, Application Design, and SAP Outsourcing to the import and export of premium products between India and the UAE, Bahrain, Qatar, Oman, and Malaysia—we are your single partner for growth.</p>
// //             <p className=" mt-4" style={{fontFamily: "'Ubuntu', sans-serif",color:"#94A3B8"}}>By blending technological expertise with international trade experience, we empower organizations to innovate faster, operate smarter, and reach new markets with confidence.</p>
// //           </div>

// //   </section>


// //   <section className="container py-5 mt-md-5 mt-5 text-center"
// //   style={{
// //     background: "#1E293B",
// //     borderRadius: "16px",
// //     color: "#E2E8F0",
// //   }}>
// //     <div className="mb-3" style={{ color: "#6366F1", fontSize: "22px" }}>
// //     <Star size={24} color="#E2E8F0" fill="#E2E8F0" />
// //     <Star size={24} color="#E2E8F0" fill="#E2E8F0" />
// //     <Star size={24} color="#E2E8F0" fill="#E2E8F0" />
// //     <Star size={24} color="#E2E8F0" fill="#E2E8F0" />
// //     <Star size={24} color="#E2E8F0" fill="#E2E8F0" />
// //   </div>

// //     <p className="mx-auto"
// //     style={{
// //       maxWidth: "900px",
// //       lineHeight: "1.8",
// //       fontSize: "18px",
// //       color: "#E2E8F0",
// //     }}>
// //     "Working with SHNOOR International LLC has been a game-changer for ourbusiness. Their IT consulting team understood our requirements perfectlyand delivered a custom solution that improved our efficiency by leaps and
// //     bounds. On top of that, their import services were smooth, reliable, and hassle-free. It’s rare to find a partner who excels in both technology
// //     and trade—SHNOOR does it effortlessly."
// //   </p>

// //     <div className="mt-4">
// //     <img
// //       src={clientPhoto}
// //       alt="client"
// //       style={{
// //         width: "70px",
// //         height: "70px",
// //         borderRadius: "50%",
// //       }}
// //     />
// //   </div>
// //     <h5 className="mt-3 mb-1">
// //     Amita Khanna - Delivery Head
// //   </h5>
// //     <p style={{ color: "#E2E8F0", marginBottom: 0 }}>
// //     SF Technologies - Singapore
// //   </p>




// // </section>







// //   <Footer />
// // </div>

// //   );
// // };

// // export default Home;
// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import Navbar from "../layouts/Navbar";
// import Footer from "../layouts/Footer";
// import { CreditCard, Clock, MapPin, FileText, Globe, ArrowRight, ShieldCheck, Star, Palette } from "lucide-react";
// import { useWebsiteSettings } from "../hooks/useWebsiteSettings";
// import photo from "../assets/photo-1531538606174-0f90ff5dce83.avif";
// import clientPhoto from "../assets/photo-1573165850883-9b0e18c44bd2.jpg";

// // ─── Theme Definitions ──────────────────────────────────────────────────────
// const THEMES = {
//   midnight: {
//     name: "Midnight",
//     swatch: "#6366F1",
//     bg: "#0F172A",
//     surface: "#1E293B",
//     border: "#334155",
//     text: "#E2E8F0",
//     muted: "#94A3B8",
//     accent: "#6366F1",
//     accentAlt: "#22C55E",
//     accentBg: "rgba(99,102,241,0.15)",
//   },
//   crimson: {
//     name: "Crimson",
//     swatch: "#EF4444",
//     bg: "#0D0A0A",
//     surface: "#1C1010",
//     border: "#3D1515",
//     text: "#FAE8E8",
//     muted: "#B07070",
//     accent: "#EF4444",
//     accentAlt: "#F97316",
//     accentBg: "rgba(239,68,68,0.15)",
//   },
//   emerald: {
//     name: "Emerald",
//     swatch: "#10B981",
//     bg: "#071412",
//     surface: "#0D2420",
//     border: "#134E3A",
//     text: "#D1FAE5",
//     muted: "#6EE7B7",
//     accent: "#10B981",
//     accentAlt: "#06B6D4",
//     accentBg: "rgba(16,185,129,0.15)",
//   },
//   aurora: {
//     name: "Aurora",
//     swatch: "#A855F7",
//     bg: "#0A0A14",
//     surface: "#13102A",
//     border: "#2E1B5E",
//     text: "#EDE9FE",
//     muted: "#A78BFA",
//     accent: "#A855F7",
//     accentAlt: "#EC4899",
//     accentBg: "rgba(168,85,247,0.15)",
//   },
//   solar: {
//     name: "Solar",
//     swatch: "#F59E0B",
//     bg: "#0D0900",
//     surface: "#1C1400",
//     border: "#3D2E00",
//     text: "#FEF3C7",
//     muted: "#D4A847",
//     accent: "#F59E0B",
//     accentAlt: "#FB923C",
//     accentBg: "rgba(245,158,11,0.15)",
//   },
// };

// const featureCards = [
//   { title: "Payroll Processing", desc: "One-click automated payroll generation.", icon: <CreditCard size={24} /> },
//   { title: "Global Locations", desc: "Manage staff across multiple branches.", icon: <MapPin size={24} /> },
//   { title: "Letterheads", desc: "Generate professional dynamic documents.", icon: <FileText size={24} /> },
//   { title: "Leave Management", desc: "Track and approve employee time off.", icon: <ShieldCheck size={24} /> },
//   { title: "Attendance", desc: "Real-time employee clock-in tracking.", icon: <Clock size={24} /> },
//   { title: "Multi-Language", desc: "Localized support for global teams.", icon: <Globe size={24} /> },
// ];

// const Home = () => {
//   const { data: s } = useWebsiteSettings("header");
//   const [themeKey, setThemeKey] = useState(() => localStorage.getItem("shnoor_theme") || "midnight");
//   const [pickerOpen, setPickerOpen] = useState(false);

//   const t = THEMES[themeKey];

//   useEffect(() => {
//     localStorage.setItem("shnoor_theme", themeKey);
//   }, [themeKey]);

//   const btn1Show = s.showBtn1 !== "false";
//   const btn2Show = s.showBtn2 !== "false";

//   // ── Shared hover handlers ──
//   const hoverIn = (e) => {
//     e.currentTarget.style.transform = "translateY(-8px)";
//     e.currentTarget.style.boxShadow = `0 15px 35px rgba(0,0,0,0.45)`;
//   };
//   const hoverOut = (e) => {
//     e.currentTarget.style.transform = "translateY(0)";
//     e.currentTarget.style.boxShadow = "none";
//   };

//   return (
//     <div
//       className="min-vh-100 overflow-hidden pt-5"
//       style={{
//         background: t.bg,
//         color: t.text,
//         transition: "background 0.4s ease, color 0.4s ease",
//         fontFamily: "'Ubuntu', sans-serif",
//       }}
//     >
//       <Navbar />

//       {/* ── FLOATING THEME SWITCHER ── */}
//       <div
//         style={{
//           position: "fixed",
//           bottom: "32px",
//           right: "28px",
//           zIndex: 9999,
//           display: "flex",
//           flexDirection: "column",
//           alignItems: "flex-end",
//           gap: "10px",
//         }}
//       >
//         {/* Swatches panel */}
//         <div
//           style={{
//             background: t.surface,
//             border: `1px solid ${t.border}`,
//             borderRadius: "16px",
//             padding: "14px 16px",
//             display: "flex",
//             flexDirection: "column",
//             gap: "10px",
//             boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
//             opacity: pickerOpen ? 1 : 0,
//             transform: pickerOpen ? "translateY(0) scale(1)" : "translateY(12px) scale(0.95)",
//             pointerEvents: pickerOpen ? "auto" : "none",
//             transition: "all 0.25s cubic-bezier(0.34,1.56,0.64,1)",
//           }}
//         >
//           <p
//             style={{
//               color: t.muted,
//               fontSize: "11px",
//               textTransform: "uppercase",
//               letterSpacing: "1.5px",
//               margin: 0,
//               fontWeight: 700,
//             }}
//           >
//             Choose Theme
//           </p>
//           {Object.entries(THEMES).map(([key, theme]) => (
//             <button
//               key={key}
//               onClick={() => { setThemeKey(key); setPickerOpen(false); }}
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: "12px",
//                 background: key === themeKey ? t.accentBg : "transparent",
//                 border: key === themeKey ? `1px solid ${t.accent}` : "1px solid transparent",
//                 borderRadius: "10px",
//                 padding: "8px 12px",
//                 cursor: "pointer",
//                 transition: "all 0.2s ease",
//                 width: "160px",
//               }}
//             >
//               <span
//                 style={{
//                   width: "20px",
//                   height: "20px",
//                   borderRadius: "50%",
//                   background: theme.accent,
//                   flexShrink: 0,
//                   boxShadow: key === themeKey ? `0 0 10px ${theme.accent}` : "none",
//                   transition: "box-shadow 0.2s",
//                 }}
//               />
//               <span
//                 style={{
//                   color: key === themeKey ? t.text : t.muted,
//                   fontSize: "14px",
//                   fontWeight: key === themeKey ? 700 : 400,
//                 }}
//               >
//                 {theme.name}
//               </span>
//               {key === themeKey && (
//                 <span style={{ marginLeft: "auto", color: t.accent, fontSize: "12px" }}>✓</span>
//               )}
//             </button>
//           ))}
//         </div>

//         {/* Toggle button */}
//         <button
//           onClick={() => setPickerOpen(!pickerOpen)}
//           style={{
//             width: "52px",
//             height: "52px",
//             borderRadius: "50%",
//             background: t.accent,
//             border: "none",
//             cursor: "pointer",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             boxShadow: `0 4px 20px ${t.accent}66`,
//             color: "#fff",
//             transition: "all 0.25s ease",
//             transform: pickerOpen ? "rotate(20deg)" : "rotate(0deg)",
//           }}
//           title="Change Theme"
//         >
//           <Palette size={22} />
//         </button>
//       </div>

//       {/* ── HERO SECTION ── */}
//       <section className="container py-5 mt-md-5 mt-5">
//         <div className="row g-4">
//           <div className="col-lg-6">
//             <p
//               className="text-uppercase fw-bold small mb-3"
//               style={{ color: t.accent, letterSpacing: "1px" }}
//             >
//               {s.subtitle || "Grow Your Business With SHNOOR INTERNATIONAL LLC"}
//             </p>

//             <h1 className="display-2 fw-bold mb-4">
//               {s.title ? s.title.split(" ").slice(0, 3).join(" ") : "Next Generation HR"}
//               <br />
//               <span style={{ color: t.accent }}>
//                 {s.title ? s.title.split(" ").slice(3).join(" ") : "Management System"}
//               </span>
//             </h1>

//             <p className="lead mb-4" style={{ color: t.muted }}>
//               {s.description ||
//                 "Streamline your workflow with automated payroll, real-time attendance tracking, and centralized employee management."}
//             </p>

//             <div className="d-flex flex-wrap gap-3 mb-4">
//               {btn1Show && (
//                 <Link
//                   to={s.btn1Url || "/register"}
//                   className="btn btn-lg fw-bold d-flex align-items-center px-4"
//                   style={{
//                     background: t.accent,
//                     border: "none",
//                     color: "#fff",
//                     borderRadius: "10px",
//                     transition: "opacity 0.2s",
//                   }}
//                   onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
//                   onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
//                 >
//                   {s.btn1Text || "Get Started"}
//                   <ArrowRight size={18} className="ms-2" />
//                 </Link>
//               )}
//               {btn2Show && (
//                 <Link
//                   to={s.btn2Url || "/features"}
//                   className="btn btn-lg px-4"
//                   style={{
//                     border: `1px solid ${t.accent}`,
//                     color: t.accent,
//                     borderRadius: "10px",
//                     transition: "background 0.2s",
//                   }}
//                   onMouseEnter={(e) => (e.currentTarget.style.background = t.accentBg)}
//                   onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
//                 >
//                   {s.btn2Text || "View Features"}
//                 </Link>
//               )}
//             </div>
//           </div>

//           {/* Feature Cards */}
//           <div className="col-lg-6">
//             <div className="row g-4">
//               {featureCards.map((feature, index) => (
//                 <div key={index} className="col-md-6">
//                   <div
//                     className="card border-0 h-100"
//                     style={{
//                       background: t.surface,
//                       borderRadius: "18px",
//                       transition: "all 0.35s ease",
//                       border: `1px solid ${t.border}`,
//                       cursor: "pointer",
//                     }}
//                     onMouseEnter={hoverIn}
//                     onMouseLeave={hoverOut}
//                   >
//                     <div className="card-body p-4 text-center">
//                       <div
//                         className="mb-4 mx-auto d-flex align-items-center justify-content-center"
//                         style={{
//                           width: "60px",
//                           height: "60px",
//                           borderRadius: "100%",
//                           background: t.accentBg,
//                           color: t.accent,
//                         }}
//                       >
//                         {feature.icon}
//                       </div>
//                       <h5 className="fw-bold mb-2" style={{ color: t.text }}>
//                         {feature.title}
//                       </h5>
//                       <p className="small fw-semibold" style={{ color: t.muted, lineHeight: "1.6" }}>
//                         {feature.desc}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* ── ABOUT SECTION ── */}
//       <section style={{ background: t.bg, padding: "80px 0", transition: "background 0.4s ease" }}>
//         <div className="container">
//           <div className="row align-items-center g-5">
//             <div className="col-lg-7">
//               <h2 className="fw-bold mb-4" style={{ color: t.text, fontSize: "38px" }}>
//                 About SHNOOR INTERNATIONAL LLC
//               </h2>
//               <p style={{ color: t.muted, lineHeight: "1.8", fontSize: "16px" }}>
//                 SHNOOR INTERNATIONAL LLC has been formed to work progressively in the field of various IT needs
//                 focusing primarily on IT Consulting & Staffing, IT Product Development, Application Designing &
//                 Development, SAP Outsourcing, Import & Exports of various products from India to United Arab Emirates,
//                 Bahrain, Qatar, Oman & Malaysia.
//               </p>
//               <p style={{ color: t.muted, lineHeight: "1.8", fontSize: "16px" }}>
//                 We deal reasonably with producers, farmers, wholesalers, importers, and other stakeholders to establish
//                 a strong global presence in international trade. Our goal is to close the gap between buyers and sellers
//                 in the foreign market while ensuring high-quality products and customer satisfaction.
//               </p>
//               <p style={{ color: t.muted, lineHeight: "1.8", fontSize: "16px" }}>
//                 Headquartered in{" "}
//                 <span style={{ color: t.accent }}>MUSCAT - Oman</span>, beyond technology, we specialize in import and
//                 export of quality products from India to the UAE, Bahrain, Qatar, Oman, and Malaysia — building strong
//                 global trade partnerships.
//               </p>
//             </div>
//             <div className="col-lg-5">
//               <img
//                 src={photo}
//                 alt="Company"
//                 style={{
//                   width: "100%",
//                   maxWidth: "420px",
//                   borderRadius: "16px",
//                   boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
//                   border: `1px solid ${t.border}`,
//                 }}
//               />
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* ── STATS SECTION ── */}
//       <section className="py-5 mt-2">
//         <div className="container">
//           <div className="row g-4 text-center">
//             {[
//               { val: "10k+", label: "Active Users", color: t.accent },
//               { val: "500+", label: "Companies", color: t.accentAlt },
//               { val: "24/7", label: "Support", color: t.accent },
//               { val: "99.9%", label: "Uptime", color: t.accentAlt },
//             ].map((stat, i) => (
//               <div key={i} className="col-12 col-sm-6 col-lg-3">
//                 <div
//                   style={{
//                     background: t.surface,
//                     border: `1px solid ${t.border}`,
//                     padding: "35px 20px",
//                     borderRadius: "12px",
//                     height: "100%",
//                     transition: "all 0.35s ease",
//                     cursor: "pointer",
//                   }}
//                   onMouseEnter={hoverIn}
//                   onMouseLeave={hoverOut}
//                 >
//                   <h2 className="fw-bold display-6" style={{ color: stat.color }}>
//                     {stat.val}
//                   </h2>
//                   <p className="text-uppercase small mb-0" style={{ color: t.muted }}>
//                     {stat.label}
//                   </p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ── CONNECTING SECTION ── */}
//       <section className="container py-5 mt-md-5 mt-5">
//         <div>
//           <h1 className="mb-5 fs-1">Connecting Technology & Trade Together</h1>
//           <p className="mt-4" style={{ color: t.muted }}>
//             At SHNOOR International LLC, we believe innovation should have no borders. Our unique approach combines
//             cutting-edge IT solutions with seamless global trade services, helping businesses thrive in both the digital
//             space and the global marketplace.
//           </p>
//           <p className="mt-4" style={{ color: t.muted }}>
//             From IT Consulting, Product Development, Application Design, and SAP Outsourcing to the import and export of
//             premium products between India and the UAE, Bahrain, Qatar, Oman, and Malaysia—we are your single partner
//             for growth.
//           </p>
//           <p className="mt-4" style={{ color: t.muted }}>
//             By blending technological expertise with international trade experience, we empower organizations to innovate
//             faster, operate smarter, and reach new markets with confidence.
//           </p>
//         </div>
//       </section>

//       {/* ── TESTIMONIAL ── */}
//       <section
//         className="container py-5 mt-md-5 mt-5 text-center"
//         style={{
//           background: t.surface,
//           borderRadius: "16px",
//           color: t.text,
//           border: `1px solid ${t.border}`,
//           transition: "background 0.4s ease",
//         }}
//       >
//         <div className="mb-3">
//           {[...Array(5)].map((_, i) => (
//             <Star key={i} size={24} color={t.accent} fill={t.accent} />
//           ))}
//         </div>
//         <p
//           className="mx-auto"
//           style={{ maxWidth: "900px", lineHeight: "1.8", fontSize: "18px", color: t.text }}
//         >
//           "Working with SHNOOR International LLC has been a game-changer for our business. Their IT consulting team
//           understood our requirements perfectly and delivered a custom solution that improved our efficiency by leaps and
//           bounds. On top of that, their import services were smooth, reliable, and hassle-free. It's rare to find a
//           partner who excels in both technology and trade—SHNOOR does it effortlessly."
//         </p>
//         <div className="mt-4">
//           <img
//             src={clientPhoto}
//             alt="client"
//             style={{
//               width: "70px",
//               height: "70px",
//               borderRadius: "50%",
//               border: `3px solid ${t.accent}`,
//             }}
//           />
//         </div>
//         <h5 className="mt-3 mb-1" style={{ color: t.text }}>
//           Amita Khanna - Delivery Head
//         </h5>
//         <p style={{ color: t.muted, marginBottom: 0 }}>SF Technologies - Singapore</p>
//       </section>

//       <Footer />
//     </div>
//   );
// };

// export default Home;

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../layouts/Navbar";
import Footer from "../layouts/Footer";
import { CreditCard, Clock, MapPin, FileText, Globe, ArrowRight, ShieldCheck,Star  } from "lucide-react";
import { useWebsiteSettings } from "../hooks/useWebsiteSettings";
import photo from "../assets/photo-1531538606174-0f90ff5dce83.avif";
import clientPhoto from "../assets/photo-1573165850883-9b0e18c44bd2.jpg";
import { themes } from "../theam/theam";

const featureCards = [
  { title: "Payroll Processing",  desc: "One-click automated payroll generation.",    icon: <CreditCard size={24} /> },
  { title: "Global Locations",    desc: "Manage staff across multiple branches.",      icon: <MapPin size={24} /> },
  { title: "Letterheads",         desc: "Generate professional dynamic documents.",    icon: <FileText size={24} /> },
  { title: "Leave Management",    desc: "Track and approve employee time off.",        icon: <ShieldCheck size={24} /> },
  { title: "Attendance",          desc: "Real-time employee clock-in tracking.",       icon: <Clock size={24} /> },
  { title: "Multi-Language",      desc: "Localized support for global teams.",         icon: <Globe size={24} /> },
];


const themeList = [
  { name: "Default", key: "default" },
  { name: "Pink", key: "pink" },
  { name: "Sunset", key: "sunset" },
  { name: "Mono", key: "mono" },
];

const Home = () => {
  const { data: s } = useWebsiteSettings("header");

  const btn1Show = s.showBtn1 !== "false";
  const btn2Show = s.showBtn2 !== "false";
const [currentThemeKey, setCurrentThemeKey] = useState("default");
  const applyTheme = (theme, key) => {
    setCurrentThemeKey(key);
    const root = document.documentElement;
    root.style.setProperty("--primary", theme.primary);
    root.style.setProperty("--secondary", theme.secondary);
    root.style.setProperty("--bg", theme.bg);
    root.style.setProperty("--surface", theme.surface);
    root.style.setProperty("--text", theme.text);
    localStorage.setItem("app-theme", JSON.stringify({ theme, key }));
  };
  useEffect(() => {
    const saved = localStorage.getItem("app-theme");
    if (saved) {
      const { theme, key } = JSON.parse(saved);
      applyTheme(theme, key);
    }
  }, []);

  return (
<div
  className="min-vh-100 overflow-hidden pt-5"
  style={{  background: "var(--bg)", color: "var(--text)" }}
>
  <Navbar />
  <section className="container py-5 mt-md-5 mt-5" >
    <div className="row  g-4">
      <div className="col-lg-6 ">
        <p
          className="text-uppercase fw-bold small mb-3"
          style={{ color: "var(--primary)", letterSpacing: "1px", fontFamily: "'Ubuntu', sans-serif", }}
        >
          {s.subtitle || "Grow Your Business With SHNOOR INTERNATIONAL LLC"}
        </p>

        <h1 className="display-2 fw-bold mb-4" style={{ fontFamily: "'Ubuntu', sans-serif",}}>
          {s.title
            ? s.title.split(" ").slice(0, 3).join(" ")
            : "Next Generation HR"}
          <br />
          <span style={{ color: "var(--primary)", fontFamily: "'Ubuntu', sans-serif", }}>
            {s.title
              ? s.title.split(" ").slice(3).join(" ")
              : "Management System"}
          </span>
        </h1>

        <p className="lead mb-4" style={{ color: "var(--textSecondary)" , fontFamily: "'Ubuntu', sans-serif",}}>
          {s.description ||
            "Streamline your workflow with automated payroll, real-time attendance tracking, and centralized employee management."}
        </p>

        <div className="d-flex flex-wrap gap-3 mb-4">
          {btn1Show && (
            <Link
              to={s.btn1Url || "/register"}
              className="btn btn-lg fw-bold d-flex align-items-center px-4"
              style={{
                background: "var(--primary)",
                border: "none",
                color: "#fff",
                borderRadius: "10px",
                 fontFamily: "'Ubuntu', sans-serif",
              }}
            >
              {s.btn1Text || "Get Started"}
              <ArrowRight size={18} className="ms-2" />
            </Link>
          )}

          {btn2Show && (
            <Link
              to={s.btn2Url || "/features"}
              className="btn btn-lg px-4"
              style={{
                border: "1px solid #6366F1",
                color: "var(--primary)",
                borderRadius: "10px",
                 fontFamily: "'Ubuntu', sans-serif",
              }}
            >
              {s.btn2Text || "View Features"}
            </Link>
          )}
        </div>
      </div>

<div className="col-lg-6">
  <div className="row g-4">{featureCards.map((feature, index) => (
      <div key={index} className="col-md-6">
        <div
          className="card border-0 h-100"
          style={{
            background: "var(--surface)",
            borderRadius: "18px",
            transition: "all 0.35s ease",
            fontFamily: "'Ubuntu', sans-serif",
            border: "1px solid rgba(255,255,255,0.05)",
            cursor: "pointer"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-8px)";
            e.currentTarget.style.boxShadow = "0 15px 35px rgba(0,0,0,0.35)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <div className="card-body p-4 text-center">
            <div
              className="mb-4 mx-auto d-flex align-items-center justify-content-center"
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "100%",
                background: "rgba(99,102,241,0.15)",
                color: "var(--primary)",
              }}
            >
              {feature.icon}
            </div>
            <h5
              className="fw-bold mb-2"
              style={{
                color: "var(--text)",
                fontFamily: "'Ubuntu', sans-serif",
              }}
            >
              {feature.title}
            </h5>
            <p
              className="small fw-semibold"
              style={{
                color: "var(--text)",
                lineHeight: "1.6",
              }}
            >
              {feature.desc}
            </p>
          </div>
        </div>
      </div>
    ))}
  </div>
</div>

    </div>
  </section>

<div className="container py-4">
        <h4 className="text-center mb-4">Choose Theme</h4>

        <div className="row g-3">
          {themeList.map((t) => {
            const isActive = currentThemeKey === t.key;

            return (
              <div key={t.key} className="col-md-3">
                <div
                  onClick={() => applyTheme(themes[t.key], t.key)}
                  style={{
                    background: "var(--surface)",
                    padding: "40px",
                    borderRadius: "12px",
                    cursor: "pointer",
                    textAlign: "center",
                    border: isActive ? "2px solid var(--primary)" : "none",
                  }}
                >
                  
                    {isActive && (
                      <span style={{ color: "var(--primary)", fontWeight: "bold",fontFamily: "'Ubuntu', sans-serif"}}>
                        Active
                      </span>
                    )}
                  <h6 className="fs-5">{t.name}</h6>

                  <div className="d-flex justify-content-center align-items-center gap-2 mt-2">
                    <div
                      style={{
                        width: 30,
                        height: 30,
                        background: themes[t.key].primary,
                        borderRadius: "50%",
                      }}
                    />
                    <div
                      style={{
                        width: 30,
                        height: 30,
                        background: themes[t.key].secondary,
                        borderRadius: "50%",
                      }}
                    />

                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>





<section style={{  background: "var(--bg)", padding: "80px 0" }}>
  <div className="container">
    <div className="row align-items-center g-5">
      <div className="col-lg-7">
        <h2
          className="fw-bold mb-4"
          style={{ color: "#FFFFFF", fontSize: "38px" }}
        >
          About SHNOOR INTERNATIONAL LLC
        </h2>

        <p style={{ color: "var(--textSecondary)", lineHeight: "1.8", fontSize: "16px" }}>
          SHNOOR INTERNATIONAL LLC has been formed to work progressively in the
          field of various IT needs focusing primarily on IT Consulting &
          Staffing, IT Product Development, Application Designing & Development,
          SAP Outsourcing, Import & Exports of various products from India to
          United Arab Emirates, Bahrain, Qatar, Oman & Malaysia.
        </p>

        <p style={{ color: "var(--textSecondary)", lineHeight: "1.8", fontSize: "16px" }}>
          We deal reasonably with producers, farmers, wholesalers, importers,
          and other stakeholders to establish a strong global presence in
          international trade. Our goal is to close the gap between buyers and
          sellers in the foreign market while ensuring high-quality products and
          customer satisfaction.
        </p>

        <p style={{ color: "var(--textSecondary)", lineHeight: "1.8", fontSize: "16px" }}>
          Headquartered in <span style={{ color: "var(--primary)" }}>MUSCAT - Oman</span>,
          beyond technology, we specialize in import and export of quality
          products from India to the UAE, Bahrain, Qatar, Oman, and Malaysia —
          building strong global trade partnerships.
        </p>
      </div>

      <div className="col-lg-5">
        <img
          src={photo}
          alt="Company"
          style={{
            width: "100%",
            maxWidth: "420px",
            borderRadius: "16px",
            boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
          }}
        />
      </div>

    </div>
  </div>
</section>

  <section
    className="py-5 mt-2"
  >
    <div className="container">
  <div className="row g-4 text-center">
    
    <div className="col-12 col-sm-6 col-lg-3">
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid #334155",
          padding: "35px 20px",
          borderRadius: "12px",
          height: "100%",
          transition: "all 0.35s ease",
          cursor: "pointer"
        }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-8px)";
            e.currentTarget.style.boxShadow = "0 15px 35px rgba(0,0,0,0.35)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "none";
          }}
      >
        <h2 className="fw-bold display-6" style={{ color: "var(--primary)" }}>
          10k+
        </h2>
        <p className="text-uppercase small mb-0" style={{ color: "var(--textSecondary)" }}>
          Active Users
        </p>
      </div>
    </div>

    <div className="col-12 col-sm-6 col-lg-3">
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid #334155",
          padding: "35px 20px",
          borderRadius: "12px",
          height: "100%",
          transition: "all 0.35s ease",
          cursor: "pointer"
        }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-8px)";
            e.currentTarget.style.boxShadow = "0 15px 35px rgba(0,0,0,0.35)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "none";
          }}

      >
        <h2 className="fw-bold display-6" style={{ color: "#22C55E" }}>
          500+
        </h2>
        <p className="text-uppercase small mb-0" style={{ color: "var(--textSecondary)" }}>
          Companies
        </p>
      </div>
    </div>

    <div className="col-12 col-sm-6 col-lg-3">
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid #334155",
          padding: "35px 20px",
          borderRadius: "12px",
          height: "100%",
          transition: "all 0.35s ease",
          cursor: "pointer"
        }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-8px)";
            e.currentTarget.style.boxShadow = "0 15px 35px rgba(0,0,0,0.35)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "none";
          }}
      >
        <h2 className="fw-bold display-6" style={{ color: "var(--primary)" }}>
          24/7
        </h2>
        <p className="text-uppercase small mb-0" style={{ color: "var(--textSecondary)" }}>
          Support
        </p>
      </div>
    </div>

    <div className="col-12 col-sm-6 col-lg-3">
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid #334155",
          padding: "35px 20px",
          borderRadius: "12px",
          height: "100%",
          transition: "all 0.35s ease",
           cursor: "pointer"
        }}
                  onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-8px)";
            e.currentTarget.style.boxShadow = "0 15px 35px rgba(0,0,0,0.35)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "none";
          }}
      >
        <h2 className="fw-bold display-6" style={{ color: "#22C55E" }}>
          99.9%
        </h2>
        <p className="text-uppercase small mb-0" style={{ color: "var(--textSecondary)" }}>
          Uptime
        </p>
      </div>
    </div>

  </div>
</div>
  </section>

  <section className="container py-5 mt-md-5 mt-5">
          <div>
            <h1 className=" mb-5 fs-1 " style={{fontFamily: "'Ubuntu', sans-serif"}}>Connecting Technology & Trade Together</h1>
            <p className=" mt-4" style={{fontFamily: "'Ubuntu', sans-serif",color:"var(--textSecondary)"}}>At SHNOOR International LLC, we believe innovation should have no borders. Our unique approach combines cutting-edge IT solutions with seamless global trade services, helping businesses thrive in both the digital space and the global marketplace.</p>
            <p className=" mt-4" style={{fontFamily: "'Ubuntu', sans-serif",color:"var(--textSecondary)"}}>From IT Consulting, Product Development, Application Design, and SAP Outsourcing to the import and export of premium products between India and the UAE, Bahrain, Qatar, Oman, and Malaysia—we are your single partner for growth.</p>
            <p className=" mt-4" style={{fontFamily: "'Ubuntu', sans-serif",color:"var(--textSecondary)"}}>By blending technological expertise with international trade experience, we empower organizations to innovate faster, operate smarter, and reach new markets with confidence.</p>
          </div>

  </section>


  <section className="container py-5 mt-md-5 mt-5 text-center"
  style={{
    background: "var(--surface)",
    borderRadius: "16px",
    color: "var(--text)",
  }}>
    <div className="mb-3" style={{ color: "var(--primary)", fontSize: "22px" }}>
    <Star size={24} color="var(--text)" fill="var(--text)" />
    <Star size={24} color="var(--text)" fill="var(--text)" />
    <Star size={24} color="var(--text)" fill="var(--text)" />
    <Star size={24} color="var(--text)" fill="var(--text)" />
    <Star size={24} color="var(--text)" fill="var(--text)" />
  </div>

    <p className="mx-auto"
    style={{
      maxWidth: "900px",
      lineHeight: "1.8",
      fontSize: "18px",
      color: "var(--text)",
    }}>
    "Working with SHNOOR International LLC has been a game-changer for ourbusiness. Their IT consulting team understood our requirements perfectlyand delivered a custom solution that improved our efficiency by leaps and
    bounds. On top of that, their import services were smooth, reliable, and hassle-free. It’s rare to find a partner who excels in both technology
    and trade—SHNOOR does it effortlessly."
  </p>

    <div className="mt-4">
    <img
      src={clientPhoto}
      alt="client"
      style={{
        width: "70px",
        height: "70px",
        borderRadius: "50%",
      }}
    />
  </div>
    <h5 className="mt-3 mb-1">
    Amita Khanna - Delivery Head
  </h5>
    <p style={{ color: "var(--text)", marginBottom: 0 }}>
    SF Technologies - Singapore
  </p>




</section>







  <Footer />
</div>

  );
};

export default Home;