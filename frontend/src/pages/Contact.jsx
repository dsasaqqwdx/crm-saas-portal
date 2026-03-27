
import React, { useState } from "react";
import Navbar from "../layouts/Navbar";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { useWebsiteSettings } from "../hooks/useWebsiteSettings";
import Footer from "../layouts/Footer";

const Contact = () => {
  const { data: s } = useWebsiteSettings("contact");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Thank you, ${formData.name}! Your message has been received.`);
    setFormData({ name: "", email: "", message: "" });
  };

  const cardHover = {
    transition: "all 0.35s ease",
    background: "#1E293B",
    border: "1px solid rgba(255,255,255,0.08)",
  };

  return (
    <div
      className="min-vh-100"
      style={{
        background: "#0F172A",
        color: "#E2E8F0",
        fontFamily: "'Ubuntu', sans-serif",
      }}
    >
      <Navbar />

      <section
        className="container"
        style={{ paddingTop: "140px", paddingBottom: "120px" }}
      >
        <div className="row align-items-center g-5">
          <div className="col-lg-5 col-md-12">
            <h1 className="fw-bold mb-4" style={{ fontSize: "clamp(2rem,4vw,3rem)" }}>
              {s.title
                ? s.title.split(" ").slice(0, -1).join(" ")
                : "Get in"}{" "}
              <span style={{ color: "#6366F1" }}>
                {s.title ? s.title.split(" ").slice(-1)[0] : "Touch"}
              </span>
            </h1>

            <p className="mb-5" style={{ color: "#94A3B8", fontSize: "17px" }}>
              {s.subtitle ||
                "Have questions about our platform? Our team is ready to help your business grow."}
            </p>

            <div className="d-flex flex-column gap-4">
              <div
                className="p-4 rounded-4 d-flex align-items-center"
                style={cardHover}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-8px)";
                  e.currentTarget.style.boxShadow =
                    "0 15px 35px rgba(0,0,0,0.35)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div
                  className="me-3 d-flex align-items-center justify-content-center"
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: "12px",
                    background: "rgba(99,102,241,0.15)",
                    color: "#6366F1",
                  }}
                >
                  <Phone size={22} />
                </div>

                <div>
                  <div className="fw-semibold">Call Support</div>
                  <div style={{ color: "#22C55E" }}>
                    {s.phone || "+91 98765 43210"}
                  </div>
                </div>
              </div>
              <div
                className="p-4 rounded-4 d-flex align-items-center"
                style={cardHover}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-8px)";
                  e.currentTarget.style.boxShadow =
                    "0 15px 35px rgba(0,0,0,0.35)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div
                  className="me-3 d-flex align-items-center justify-content-center"
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: "12px",
                    background: "rgba(99,102,241,0.15)",
                    color: "#6366F1",
                  }}
                >
                  <Mail size={22} />
                </div>

                <div>
                  <div className="fw-semibold">Email Us</div>
                  <div style={{ color: "#22C55E" }}>
                    {s.email || "support@company.com"}
                  </div>
                </div>
              </div>
              <div
                className="p-4 rounded-4 d-flex align-items-center"
                style={cardHover}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-8px)";
                  e.currentTarget.style.boxShadow =
                    "0 15px 35px rgba(0,0,0,0.35)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div
                  className="me-3 d-flex align-items-center justify-content-center"
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: "12px",
                    background: "rgba(99,102,241,0.15)",
                    color: "#6366F1",
                  }}
                >
                  <MapPin size={22} />
                </div>

                <div>
                  <div className="fw-semibold">Head Office</div>
                  <div style={{ color: "#94A3B8" }}>
                    {s.address || "Business Bay, Dubai / India"}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-7 col-md-12">
            <div
              className="p-4 p-md-5 rounded-4"
              style={{
                background: "#1E293B",
                border: "1px solid rgba(255,255,255,0.08)",
                transition: "all 0.35s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-8px)";
                e.currentTarget.style.boxShadow =
                  "0 15px 35px rgba(0,0,0,0.35)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <h3 className="mb-4 fw-bold" style={{ color: "#6366F1" }}>
                Send us a message
              </h3>

              <form onSubmit={handleSubmit}>
                <div className="row g-4">

                  <div className="col-md-6">
                    <label className="form-label small">Full Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                      style={{
                        background: "#0F172A",
                        border: "1px solid #334155",
                        color: "#E2E8F0",
                        padding: "12px",
                      }}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="you@email.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                      style={{
                        background: "#0F172A",
                        border: "1px solid #334155",
                        color: "#E2E8F0",
                        padding: "12px",
                      }}
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label small">Message</label>
                    <textarea
                      rows="5"
                      className="form-control"
                      placeholder="Tell us about your project..."
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      required
                      style={{
                        background: "#0F172A",
                        border: "1px solid #334155",
                        color: "#E2E8F0",
                        padding: "12px",
                      }}
                    />
                  </div>

                  <div className="col-12">
                    <button
                      type="submit"
                      className="btn w-100 d-flex align-items-center justify-content-center gap-2"
                      style={{
                        background: "#6366F1",
                        color: "white",
                        padding: "14px",
                        borderRadius: "999px",
                        fontWeight: "600",
                        border: "none",
                        transition: "0.3s",
                      }}
                    >
                      <Send size={18} />
                      Send Message
                    </button>
                  </div>

                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
       <Footer/>
    </div>
  );
};

export default Contact;