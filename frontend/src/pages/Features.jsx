
import React from "react";
import Navbar from "../layouts/Navbar";
import { CheckCircle, Zap, Shield, BarChart3, Users, Smartphone } from "lucide-react";
import { useWebsiteSettings } from "../hooks/useWebsiteSettings";
import Footer from "../layouts/Footer";

const featureList = [
  { title: "Smart Payroll",          desc: "Automated tax calculations and direct deposits.",     icon: <Zap className="text-warning" size={30} /> },
  { title: "Advanced Security",      desc: "Enterprise-grade encryption for all employee data.",  icon: <Shield className="text-success" size={30} /> },
  { title: "Real-time Analytics",    desc: "Visual insights into turnover and attendance.",        icon: <BarChart3 className="text-info" size={30} /> },
  { title: "Employee Self-Service",  desc: "Staff can manage their own leaves and profiles.",     icon: <Users className="text-primary" size={30} /> },
  { title: "Mobile Ready",           desc: "Clock-in and clock-out from any mobile device.",      icon: <Smartphone className="text-danger" size={30} /> },
  { title: "Compliance",             desc: "Stay updated with local labor laws automatically.",   icon: <CheckCircle className="text-info" size={30} /> },
];

const Features = () => {
  const { data: s } = useWebsiteSettings("features");

  return (
    <div className="  min-vh-100 " style={{ background: "#0F172A", color: "#E2E8F0" }}>
      <Navbar />
      <div className="container  mt-5" style={{ paddingTop: "100px", paddingBottom: "100px" }}>
        <div className="text-center mb-5">
          <h1 className="display-4 fw-bold" style={{ fontFamily: "'Ubuntu', sans-serif", }}>
            {s.title
              ? s.title.split(" ").slice(0, -1).join(" ") + " "
              : "Platform "}
            <span className="text-info" style={{ color: "#6366F1", fontFamily: "'Ubuntu', sans-serif", }}>
              {s.title ? s.title.split(" ").slice(-1)[0] : "Capabilities"}
            </span>
          </h1>
          <p className=" lead" style={{ fontFamily: "'Ubuntu', sans-serif", color: "#94A3B8" }}>
            {s.subtitle || "Everything you need to manage a modern workforce efficiently."}
          </p>
        </div>

        <div className="p-lg-5 p-md-5 row g-lg-5 g-md-5 g-3">
          {featureList.map((f, i) => (
            <div key={i} className="col-12 col-sm-4 col-md-4 col-lg-4 ">
              <div className="card bg-secondary bg-opacity-10 border-0 p-4 h-100 shadow-sm"
              style={{background: "#1E293B",
              borderRadius: "18px",
              transition: "all 0.35s ease",
              fontFamily: "'Ubuntu', sans-serif",
              border: "1px solid rgba(255,255,255,0.05)",
              cursor: "pointer"}}
                        onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-8px)";
            e.currentTarget.style.boxShadow = "0 15px 35px rgba(0,0,0,0.35)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "none";
          }}>
                <div className="mb-3" style={{fontFamily: "'Ubuntu', sans-serif",}}>{f.icon}</div>
                <h5 className="fw-bold" style={{fontFamily: "'Ubuntu', sans-serif",color:"#E2E8F0"}}>{f.title}</h5>
                <p className=" small mb-0" style={{fontFamily: "'Ubuntu', sans-serif",color: "#94A3B8"}}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
        <Footer />
    </div>
  );
};

export default Features;