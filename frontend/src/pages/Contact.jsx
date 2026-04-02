
// import React, { useState } from "react";
// import Navbar from "../layouts/Navbar";
// import { Mail, Phone, MapPin, Send } from "lucide-react";
// import { useWebsiteSettings } from "../hooks/useWebsiteSettings";
// import Footer from "../layouts/Footer";

// const Contact = () => {
//   const { data: s = {} } = useWebsiteSettings("contact");

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     message: "",
//   });

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     // ✅ FIXED ALERT
//     alert(`Thank you, ${formData.name}! Your message has been received.`);

//     setFormData({ name: "", email: "", message: "" });
//   };

//   const cardHover = {
//     transition: "all 0.35s ease",
//     background: "var(--surface)",
//     border: "1px solid rgba(255,255,255,0.08)",
//   };

//   return (
//     <div
//       className="min-vh-100"
//       style={{
//         background: "var(--bg)",
//         color: "var(--text)",
//         fontFamily: "'Ubuntu', sans-serif",
//       }}
//     >
//       <Navbar />

//       <section
//         className="container"
//         style={{ paddingTop: "140px", paddingBottom: "120px" }}
//       >
//         <div className="row align-items-center g-5">
          
//           {/* LEFT SIDE */}
//           <div className="col-lg-5 col-md-12">
//             <h1
//               className="fw-bold mb-4"
//               style={{ fontSize: "clamp(2rem,4vw,3rem)" }}
//             >
//               {s.title
//                 ? s.title.split(" ").slice(0, -1).join(" ")
//                 : "Get in"}{" "}
//               <span style={{ color: "var(--primary)" }}>
//                 {s.title ? s.title.split(" ").slice(-1)[0] : "Touch"}
//               </span>
//             </h1>

//             <p
//               className="mb-5"
//               style={{ color: "var(--textSecondary)", fontSize: "17px" }}
//             >
//               {s.subtitle ||
//                 "Have questions about our platform? Our team is ready to help your business grow."}
//             </p>

//             <div className="d-flex flex-column gap-4">
              
//               {/* PHONE */}
//               <div
//                 className="p-4 rounded-4 d-flex align-items-center"
//                 style={cardHover}
//                 onMouseEnter={(e) => {
//                   e.currentTarget.style.transform = "translateY(-8px)";
//                   e.currentTarget.style.boxShadow =
//                     "0 15px 35px rgba(0,0,0,0.35)";
//                 }}
//                 onMouseLeave={(e) => {
//                   e.currentTarget.style.transform = "translateY(0)";
//                   e.currentTarget.style.boxShadow = "none";
//                 }}
//               >
//                 <div
//                   className="me-3 d-flex align-items-center justify-content-center"
//                   style={{
//                     width: 50,
//                     height: 50,
//                     borderRadius: "12px",
//                     background: "rgba(99,102,241,0.15)",
//                     color: "var(--primary)",
//                   }}
//                 >
//                   <Phone size={22} />
//                 </div>

//                 <div>
//                   <div className="fw-semibold">Call Support</div>
//                   <div style={{ color: "var(--textSecondary)" }}>
//                     {s.phone || "+91 98765 43210"}
//                   </div>
//                 </div>
//               </div>

//               {/* EMAIL */}
//               <div
//                 className="p-4 rounded-4 d-flex align-items-center"
//                 style={cardHover}
//                 onMouseEnter={(e) => {
//                   e.currentTarget.style.transform = "translateY(-8px)";
//                   e.currentTarget.style.boxShadow =
//                     "0 15px 35px rgba(0,0,0,0.35)";
//                 }}
//                 onMouseLeave={(e) => {
//                   e.currentTarget.style.transform = "translateY(0)";
//                   e.currentTarget.style.boxShadow = "none";
//                 }}
//               >
//                 <div
//                   className="me-3 d-flex align-items-center justify-content-center"
//                   style={{
//                     width: 50,
//                     height: 50,
//                     borderRadius: "12px",
//                     background: "rgba(99,102,241,0.15)",
//                     color: "var(--primary)",
//                   }}
//                 >
//                   <Mail size={22} />
//                 </div>

//                 <div>
//                   <div className="fw-semibold">Email Us</div>
//                   <div style={{ color: "var(--textSecondary)" }}>
//                     {s.email || "support@company.com"}
//                   </div>
//                 </div>
//               </div>

//               {/* ADDRESS */}
//               <div
//                 className="p-4 rounded-4 d-flex align-items-center"
//                 style={cardHover}
//                 onMouseEnter={(e) => {
//                   e.currentTarget.style.transform = "translateY(-8px)";
//                   e.currentTarget.style.boxShadow =
//                     "0 15px 35px rgba(0,0,0,0.35)";
//                 }}
//                 onMouseLeave={(e) => {
//                   e.currentTarget.style.transform = "translateY(0)";
//                   e.currentTarget.style.boxShadow = "none";
//                 }}
//               >
//                 <div
//                   className="me-3 d-flex align-items-center justify-content-center"
//                   style={{
//                     width: 50,
//                     height: 50,
//                     borderRadius: "12px",
//                     background: "rgba(99,102,241,0.15)",
//                     color: "var(--primary)",
//                   }}
//                 >
//                   <MapPin size={22} />
//                 </div>

//                 <div>
//                   <div className="fw-semibold">Head Office</div>
//                   <div style={{ color: "var(--textSecondary)" }}>
//                     {s.address || "Business Bay, Dubai / India"}
//                   </div>
//                 </div>
//               </div>

//             </div>
//           </div>

//           {/* RIGHT SIDE FORM */}
//           <div className="col-lg-7 col-md-12">
//             <div
//               className="p-4 p-md-5 rounded-4"
//               style={{
//                 background: "var(--surface)",
//                 border: "1px solid rgba(255,255,255,0.08)",
//                 transition: "all 0.35s ease",
//               }}
//             >
//               <h3 className="mb-4 fw-bold" style={{ color: "var(--primary)" }}>
//                 Send us a message
//               </h3>

//               <form onSubmit={handleSubmit}>
//                 <div className="row g-4">

//                   <div className="col-md-6">
//                     <label className="form-label small">Full Name</label>
//                     <input
//                       type="text"
//                       className="form-control"
//                       placeholder="Your name"
//                       value={formData.name}
//                       onChange={(e) =>
//                         setFormData({ ...formData, name: e.target.value })
//                       }
//                       required
//                       style={{
//                         background: "var(--bg)",
//                         border: "1px solid #334155",
//                         color: "var(--text)",
//                         padding: "12px",
//                       }}
//                     />
//                   </div>

//                   <div className="col-md-6">
//                     <label className="form-label small">Email</label>
//                     <input
//                       type="email"
//                       className="form-control"
//                       placeholder="you@email.com"
//                       value={formData.email}
//                       onChange={(e) =>
//                         setFormData({ ...formData, email: e.target.value })
//                       }
//                       required
//                       style={{
//                         background: "var(--bg)",
//                         border: "1px solid #334155",
//                         color: "var(--text)",
//                         padding: "12px",
//                       }}
//                     />
//                   </div>

//                   <div className="col-12">
//                     <label className="form-label small">Message</label>
//                     <textarea
//                       rows="5"
//                       className="form-control"
//                       placeholder="Tell us about your project..."
//                       value={formData.message}
//                       onChange={(e) =>
//                         setFormData({ ...formData, message: e.target.value })
//                       }
//                       required
//                       style={{
//                         background: "var(--bg)",
//                         border: "1px solid #334155",
//                         color: "var(--text)",
//                         padding: "12px",
//                       }}
//                     />
//                   </div>

//                   <div className="col-12">
//                     <button
//                       type="submit"
//                       className="btn w-100 d-flex align-items-center justify-content-center gap-2"
//                       style={{
//                         background: "var(--primary)",
//                         color: "white",
//                         padding: "14px",
//                         borderRadius: "999px",
//                         fontWeight: "600",
//                         border: "none",
//                       }}
//                     >
//                       <Send size={18} />
//                       Send Message
//                     </button>
//                   </div>

//                 </div>
//               </form>
//             </div>
//           </div>

//         </div>
//       </section>

//       <Footer />
//     </div>
//   );
// };

// export default Contact;
import React, { useState } from "react";
import Navbar from "../layouts/Navbar";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { useWebsiteSettings } from "../hooks/useWebsiteSettings";
import Footer from "../layouts/Footer";

const API = process.env.REACT_APP_API_URL || "http://localhost:5001";

const Contact = () => {
  const { data: s = {} } = useWebsiteSettings("contact");

  const [formData,   setFormData  ] = useState({ name: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg,   setErrorMsg  ] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const res  = await fetch(`${API}/api/contact`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success) {
        setSuccessMsg("Thank you! Your message has been received.");
        setFormData({ name: "", email: "", message: "" });
      } else {
        setErrorMsg(data.msg || "Something went wrong. Please try again.");
      }
    } catch (err) {
      setErrorMsg("Failed to send. Please check your connection.");
    } finally {
      setSubmitting(false);
    }
  };

  const cardHover = {
    transition: "all 0.35s ease",
    background: "var(--surface)",
    border: "1px solid rgba(255,255,255,0.08)",
  };

  const inputStyle = {
    background: "var(--bg)",
    border: "1px solid #334155",
    color: "var(--text)",
    padding: "12px",
  };

  return (
    <div
      className="min-vh-100"
      style={{
        background: "var(--bg)",
        color: "var(--text)",
        fontFamily: "'Ubuntu', sans-serif",
      }}
    >
      <Navbar />

      <section
        className="container"
        style={{ paddingTop: "140px", paddingBottom: "120px" }}
      >
        <div className="row align-items-center g-5">

          {/* ── LEFT: contact info cards ── */}
          <div className="col-lg-5 col-md-12">
            <h1
              className="fw-bold mb-4"
              style={{ fontSize: "clamp(2rem,4vw,3rem)" }}
            >
              {s.title
                ? s.title.split(" ").slice(0, -1).join(" ")
                : "Get in"}{" "}
              <span style={{ color: "var(--primary)" }}>
                {s.title ? s.title.split(" ").slice(-1)[0] : "Touch"}
              </span>
            </h1>

            <p
              className="mb-5"
              style={{ color: "var(--textSecondary)", fontSize: "17px" }}
            >
              {s.subtitle ||
                "Have questions about our platform? Our team is ready to help your business grow."}
            </p>

            <div className="d-flex flex-column gap-4">

              {/* Phone */}
              <div
                className="p-4 rounded-4 d-flex align-items-center"
                style={cardHover}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-8px)";
                  e.currentTarget.style.boxShadow = "0 15px 35px rgba(0,0,0,0.35)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div
                  className="me-3 d-flex align-items-center justify-content-center"
                  style={{
                    width: 50, height: 50, borderRadius: "12px",
                    background: "rgba(99,102,241,0.15)", color: "var(--primary)",
                  }}
                >
                  <Phone size={22} />
                </div>
                <div>
                  <div className="fw-semibold">Call Support</div>
                  <div style={{ color: "var(--textSecondary)" }}>
                    {s.phone || "+91 98765 43210"}
                  </div>
                </div>
              </div>

              {/* Email */}
              <div
                className="p-4 rounded-4 d-flex align-items-center"
                style={cardHover}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-8px)";
                  e.currentTarget.style.boxShadow = "0 15px 35px rgba(0,0,0,0.35)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div
                  className="me-3 d-flex align-items-center justify-content-center"
                  style={{
                    width: 50, height: 50, borderRadius: "12px",
                    background: "rgba(99,102,241,0.15)", color: "var(--primary)",
                  }}
                >
                  <Mail size={22} />
                </div>
                <div>
                  <div className="fw-semibold">Email Us</div>
                  <div style={{ color: "var(--textSecondary)" }}>
                    {s.email || "support@company.com"}
                  </div>
                </div>
              </div>

              {/* Address */}
              <div
                className="p-4 rounded-4 d-flex align-items-center"
                style={cardHover}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-8px)";
                  e.currentTarget.style.boxShadow = "0 15px 35px rgba(0,0,0,0.35)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div
                  className="me-3 d-flex align-items-center justify-content-center"
                  style={{
                    width: 50, height: 50, borderRadius: "12px",
                    background: "rgba(99,102,241,0.15)", color: "var(--primary)",
                  }}
                >
                  <MapPin size={22} />
                </div>
                <div>
                  <div className="fw-semibold">Head Office</div>
                  <div style={{ color: "var(--textSecondary)" }}>
                    {s.address || "Business Bay, Dubai / India"}
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* ── RIGHT: contact form ── */}
          <div className="col-lg-7 col-md-12">
            <div
              className="p-4 p-md-5 rounded-4"
              style={{
                background: "var(--surface)",
                border: "1px solid rgba(255,255,255,0.08)",
                transition: "all 0.35s ease",
              }}
            >
              <h3 className="mb-4 fw-bold" style={{ color: "var(--primary)" }}>
                Send us a message
              </h3>

              <form onSubmit={handleSubmit}>
                <div className="row g-4">

                  {/* Name */}
                  <div className="col-md-6">
                    <label className="form-label small">Full Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      style={inputStyle}
                    />
                  </div>

                  {/* Email */}
                  <div className="col-md-6">
                    <label className="form-label small">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="you@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      style={inputStyle}
                    />
                  </div>

                  {/* Message */}
                  <div className="col-12">
                    <label className="form-label small">Message</label>
                    <textarea
                      rows="5"
                      className="form-control"
                      placeholder="Tell us about your project..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                      style={{ ...inputStyle, resize: "none" }}
                    />
                  </div>

                  {/* Success message */}
                  {successMsg && (
                    <div className="col-12">
                      <div style={{
                        background: "#f0fdf4", border: "1px solid #bbf7d0",
                        borderRadius: 10, padding: "12px 16px",
                        color: "#15803d", fontSize: 14, fontWeight: 500,
                      }}>
                        ✓ {successMsg}
                      </div>
                    </div>
                  )}

                  {/* Error message */}
                  {errorMsg && (
                    <div className="col-12">
                      <div style={{
                        background: "#fef2f2", border: "1px solid #fecaca",
                        borderRadius: 10, padding: "12px 16px",
                        color: "#dc2626", fontSize: 14, fontWeight: 500,
                      }}>
                        ✕ {errorMsg}
                      </div>
                    </div>
                  )}

                  {/* Submit button */}
                  <div className="col-12">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="btn w-100 d-flex align-items-center justify-content-center gap-2"
                      style={{
                        background: "var(--primary)",
                        color: "white",
                        padding: "14px",
                        borderRadius: "999px",
                        fontWeight: "600",
                        border: "none",
                        opacity: submitting ? 0.7 : 1,
                        cursor: submitting ? "not-allowed" : "pointer",
                        transition: "opacity 0.2s",
                      }}
                    >
                      <Send size={18} />
                      {submitting ? "Sending…" : "Send Message"}
                    </button>
                  </div>

                </div>
              </form>
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
