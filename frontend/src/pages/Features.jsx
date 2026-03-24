import React from "react";
import Navbar from "../layouts/Navbar";
import Footer from "../layouts/Footer";
import { CheckCircle, Zap, Shield, BarChart3, Users, Smartphone } from "lucide-react";
import { useWebsiteSettings } from "../hooks/useWebsiteSettings";const featureList = [
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
    <div className="bg-dark text-white min-vh-100">
      <Navbar />
      <div className="container py-5 mt-5">
        <div className="text-center mb-5">
          <h1 className="display-4 fw-bold">
            {s.title
              ? s.title.split(" ").slice(0, -1).join(" ") + " "
              : "Platform "}
            <span className="text-info">
              {s.title ? s.title.split(" ").slice(-1)[0] : "Capabilities"}
            </span>
          </h1>
          <p className="text-secondary lead">
            {s.subtitle || "Everything you need to manage a modern workforce efficiently."}
          </p>
        </div>

        <div className="row g-4">
          {featureList.map((f, i) => (
            <div key={i} className="col-md-4">
<div className="card bg-secondary bg-opacity-10 border-0 p-4 h-100 shadow-sm"
                style={{ border: "1px solid rgba(255,255,255,0.05)" }}>
 <div className="mb-3">{f.icon}</div>
<h5 className="fw-bold text-white">{f.title}</h5>
<p className="text-secondary small mb-0">{f.desc}</p>
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