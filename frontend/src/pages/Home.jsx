import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../layouts/Navbar";
import Footer from "../layouts/Footer";
import { CreditCard, Clock, MapPin, FileText, Globe, ArrowRight, ShieldCheck } from "lucide-react";
import { useWebsiteSettings } from "../hooks/useWebsiteSettings";

const featureCards = [
  { title: "Payroll Processing",  desc: "One-click automated payroll generation.",    icon: <CreditCard size={24} /> },
{ title: "Global Locations",    desc: "Manage staff across multiple branches.", icon: <MapPin size={24} /> },
 { title: "Letterheads",   desc: "Generate professional dynamic documents.",  icon: <FileText size={24} /> },
 { title: "Leave Management",    desc: "Track and approve employee time off.", icon: <ShieldCheck size={24} /> },
  { title: "Attendance",     desc: "Real-time employee clock-in tracking.",   icon: <Clock size={24} /> },
  { title: "Multi-Language", desc: "Localized support for global teams.",         icon: <Globe size={24} /> },
];

const Home = () => {
  const { data: s } = useWebsiteSettings("header");

  const btn1Show = s.showBtn1 !== "false";
  const btn2Show = s.showBtn2 !== "false";

  return (
    <div className="bg-dark text-white min-vh-100 overflow-hidden">
      <Navbar />

      <section className="container py-5 mt-md-5">
        <div className="row align-items-center g-5">
          <div className="col-lg-6">
            <p className="text-uppercase text-info fw-bold small mb-2">
      {s.subtitle || "Grow Your Business With SHNOOR INTERNATIONAL LLC"}
     </p>
   <h1 className="display-3 fw-bold mb-4">
     {s.title ? s.title.split(" ").slice(0, 3).join(" ") : "Next Generation HR"}
     <br />
              <span className="text-info">
                {s.title ? s.title.split(" ").slice(3).join(" ") : "Management System"}
              </span>
 </h1>
 <p className="lead text-secondary mb-4">
              {s.description || "Streamline your workflow with automated payroll, real-time attendance tracking, and centralized employee management."}
            </p>
    <div className="d-flex gap-3 mb-5">
              {btn1Show && (
                <Link to={s.btn1Url || "/register"} className="btn btn-info btn-lg fw-bold d-flex align-items-center px-4">
                  {s.btn1Text || "Get Started"} <ArrowRight size={18} className="ms-2" />
      </Link>
              )}
              {btn2Show && (
                <Link to={s.btn2Url || "/features"} className="btn btn-outline-light btn-lg px-4">
                  {s.btn2Text || "View Features"}
        </Link>
      )}
            </div>
          </div>
          <div className="col-lg-6">
            <div className="row g-3">
              {featureCards.map((feature, index) => (
                <div key={index} className="col-md-6">
     <div className="card bg-secondary bg-opacity-10 text-white border-0 shadow-sm h-100"
    style={{ border: "1px solid rgba(255,255,255,0.1) !important" }}>
     <div className="card-body p-4">
       <div className="mb-3 text-info">{feature.icon}</div>
       <h5 className="card-title fw-bold">{feature.title}</h5>
           <p className="card-text text-secondary small">{feature.desc}</p>
           </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="bg-black py-5 mt-5">
        <div className="container">
  <div className="row text-center g-4">
   <div className="col-md-3">
  <h2 className="fw-bold text-info display-6">10k+</h2>
              <p className="text-secondary text-uppercase small">Active Users</p>
 </div>
            <div className="col-md-3">
              <h2 className="fw-bold text-success display-6">500+</h2>
              <p className="text-secondary text-uppercase small">Companies</p>
  </div>
            <div className="col-md-3">
              <h2 className="fw-bold text-warning display-6">24/7</h2>
              <p className="text-secondary text-uppercase small">Support</p>
            </div>
            <div className="col-md-3">
        <h2 className="fw-bold text-danger display-6">99.9%</h2>
         <p className="text-secondary text-uppercase small">Uptime</p>
            </div>
      </div>
    </div>
      </section> <Footer />
    </div>
  );
};

export default Home;