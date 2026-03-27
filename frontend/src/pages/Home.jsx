
import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../layouts/Navbar";
import Footer from "../layouts/Footer";
import { CreditCard, Clock, MapPin, FileText, Globe, ArrowRight, ShieldCheck,Star  } from "lucide-react";
import { useWebsiteSettings } from "../hooks/useWebsiteSettings";
import photo from "../assets/photo-1531538606174-0f90ff5dce83.avif";
import clientPhoto from "../assets/photo-1573165850883-9b0e18c44bd2.jpg"

const featureCards = [
  { title: "Payroll Processing",  desc: "One-click automated payroll generation.",    icon: <CreditCard size={24} /> },
  { title: "Global Locations",    desc: "Manage staff across multiple branches.",      icon: <MapPin size={24} /> },
  { title: "Letterheads",         desc: "Generate professional dynamic documents.",    icon: <FileText size={24} /> },
  { title: "Leave Management",    desc: "Track and approve employee time off.",        icon: <ShieldCheck size={24} /> },
  { title: "Attendance",          desc: "Real-time employee clock-in tracking.",       icon: <Clock size={24} /> },
  { title: "Multi-Language",      desc: "Localized support for global teams.",         icon: <Globe size={24} /> },
];

const Home = () => {
  const { data: s } = useWebsiteSettings("header");

  const btn1Show = s.showBtn1 !== "false";
  const btn2Show = s.showBtn2 !== "false";

  return (
<div
  className="min-vh-100 overflow-hidden pt-5"
  style={{ background: "#0F172A", color: "#E2E8F0" }}
>
  <Navbar />
  <section className="container py-5 mt-md-5 mt-5" >
    <div className="row  g-4">
      <div className="col-lg-6 ">
        <p
          className="text-uppercase fw-bold small mb-3"
          style={{ color: "#6366F1", letterSpacing: "1px", fontFamily: "'Ubuntu', sans-serif", }}
        >
          {s.subtitle || "Grow Your Business With SHNOOR INTERNATIONAL LLC"}
        </p>

        <h1 className="display-2 fw-bold mb-4" style={{ fontFamily: "'Ubuntu', sans-serif",}}>
          {s.title
            ? s.title.split(" ").slice(0, 3).join(" ")
            : "Next Generation HR"}
          <br />
          <span style={{ color: "#6366F1", fontFamily: "'Ubuntu', sans-serif", }}>
            {s.title
              ? s.title.split(" ").slice(3).join(" ")
              : "Management System"}
          </span>
        </h1>

        <p className="lead mb-4" style={{ color: "#94A3B8" , fontFamily: "'Ubuntu', sans-serif",}}>
          {s.description ||
            "Streamline your workflow with automated payroll, real-time attendance tracking, and centralized employee management."}
        </p>

        <div className="d-flex flex-wrap gap-3 mb-4">
          {btn1Show && (
            <Link
              to={s.btn1Url || "/register"}
              className="btn btn-lg fw-bold d-flex align-items-center px-4"
              style={{
                background: "#6366F1",
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
                color: "#6366F1",
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
            background: "#1E293B",
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
                color: "#6366F1",
              }}
            >
              {feature.icon}
            </div>
            <h5
              className="fw-bold mb-2"
              style={{
                color: "#E2E8F0",
                fontFamily: "'Ubuntu', sans-serif",
              }}
            >
              {feature.title}
            </h5>
            <p
              className="small fw-semibold"
              style={{
                color: "#94A3B8",
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




<section style={{ background: "#0F172A", padding: "80px 0" }}>
  <div className="container">
    <div className="row align-items-center g-5">
      <div className="col-lg-7">
        <h2
          className="fw-bold mb-4"
          style={{ color: "#FFFFFF", fontSize: "38px" }}
        >
          About SHNOOR INTERNATIONAL LLC
        </h2>

        <p style={{ color: "#94A3B8", lineHeight: "1.8", fontSize: "16px" }}>
          SHNOOR INTERNATIONAL LLC has been formed to work progressively in the
          field of various IT needs focusing primarily on IT Consulting &
          Staffing, IT Product Development, Application Designing & Development,
          SAP Outsourcing, Import & Exports of various products from India to
          United Arab Emirates, Bahrain, Qatar, Oman & Malaysia.
        </p>

        <p style={{ color: "#94A3B8", lineHeight: "1.8", fontSize: "16px" }}>
          We deal reasonably with producers, farmers, wholesalers, importers,
          and other stakeholders to establish a strong global presence in
          international trade. Our goal is to close the gap between buyers and
          sellers in the foreign market while ensuring high-quality products and
          customer satisfaction.
        </p>

        <p style={{ color: "#94A3B8", lineHeight: "1.8", fontSize: "16px" }}>
          Headquartered in <span style={{ color: "#6366F1" }}>MUSCAT - Oman</span>,
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
          background: "#1E293B",
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
        <h2 className="fw-bold display-6" style={{ color: "#6366F1" }}>
          10k+
        </h2>
        <p className="text-uppercase small mb-0" style={{ color: "#94A3B8" }}>
          Active Users
        </p>
      </div>
    </div>

    <div className="col-12 col-sm-6 col-lg-3">
      <div
        style={{
          background: "#1E293B",
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
        <p className="text-uppercase small mb-0" style={{ color: "#94A3B8" }}>
          Companies
        </p>
      </div>
    </div>

    <div className="col-12 col-sm-6 col-lg-3">
      <div
        style={{
          background: "#1E293B",
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
        <h2 className="fw-bold display-6" style={{ color: "#6366F1" }}>
          24/7
        </h2>
        <p className="text-uppercase small mb-0" style={{ color: "#94A3B8" }}>
          Support
        </p>
      </div>
    </div>

    <div className="col-12 col-sm-6 col-lg-3">
      <div
        style={{
          background: "#1E293B",
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
        <p className="text-uppercase small mb-0" style={{ color: "#94A3B8" }}>
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
            <p className=" mt-4" style={{fontFamily: "'Ubuntu', sans-serif",color:"#94A3B8"}}>At SHNOOR International LLC, we believe innovation should have no borders. Our unique approach combines cutting-edge IT solutions with seamless global trade services, helping businesses thrive in both the digital space and the global marketplace.</p>
            <p className=" mt-4" style={{fontFamily: "'Ubuntu', sans-serif",color:"#94A3B8"}}>From IT Consulting, Product Development, Application Design, and SAP Outsourcing to the import and export of premium products between India and the UAE, Bahrain, Qatar, Oman, and Malaysia—we are your single partner for growth.</p>
            <p className=" mt-4" style={{fontFamily: "'Ubuntu', sans-serif",color:"#94A3B8"}}>By blending technological expertise with international trade experience, we empower organizations to innovate faster, operate smarter, and reach new markets with confidence.</p>
          </div>

  </section>


  <section className="container py-5 mt-md-5 mt-5 text-center"
  style={{
    background: "#1E293B",
    borderRadius: "16px",
    color: "#E2E8F0",
  }}>
    <div className="mb-3" style={{ color: "#6366F1", fontSize: "22px" }}>
    <Star size={24} color="#E2E8F0" fill="#E2E8F0" />
    <Star size={24} color="#E2E8F0" fill="#E2E8F0" />
    <Star size={24} color="#E2E8F0" fill="#E2E8F0" />
    <Star size={24} color="#E2E8F0" fill="#E2E8F0" />
    <Star size={24} color="#E2E8F0" fill="#E2E8F0" />
  </div>

    <p className="mx-auto"
    style={{
      maxWidth: "900px",
      lineHeight: "1.8",
      fontSize: "18px",
      color: "#E2E8F0",
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
    <p style={{ color: "#E2E8F0", marginBottom: 0 }}>
    SF Technologies - Singapore
  </p>




</section>







  <Footer />
</div>

  );
};

export default Home;