import React from "react";
import Navbar from "../layouts/Navbar";
import { Check, Zap, Shield, Crown } from "lucide-react";
import { useWebsiteSettings } from "../hooks/useWebsiteSettings";

const planIcons = [
  <Shield size={30} className="text-secondary" />,
  <Zap size={30} className="text-info" />,
  <Crown size={30} className="text-warning" />,
];

const planFeatures = [
  ["Employee Management", "Basic Attendance", "Email Support", "Single Location"],
  ["Payroll Processing", "Attendance + GPS", "Leave Management", "Priority Support"],
  ["Full Analytics", "Multi-Location Support", "Custom Letterheads", "24/7 Phone Support"],
];

const Pricing = () => {
  const { data: s } = useWebsiteSettings("pricing");

  const plans = [
    { name: s.plan1Name || "Basic",      price: s.plan1Price || "10",  popular: false },
    { name: s.plan2Name || "Pro",        price: s.plan2Price || "25",  popular: true  },
    { name: s.plan3Name || "Enterprise", price: s.plan3Price || "50",  popular: false },
  ];

  return (
    <div className="bg-dark text-white min-vh-100">
      <Navbar />
      <div className="container py-5 mt-5">
        <div className="text-center mb-5">
          <h1 className="display-4 fw-bold">
            {s.title
              ? s.title.split(" ").slice(0, -1).join(" ") + " "
              : "Simple, Scalable "}
            <span className="text-info">
              {s.title ? s.title.split(" ").slice(-1)[0] : "Pricing"}
            </span>
          </h1>
          <p className="text-secondary lead">
            {s.subtitle || "Choose the plan that fits your company's growth."}
          </p>
        </div>

        <div className="row g-4 justify-content-center align-items-stretch">
          {plans.map((plan, i) => (
            <div key={i} className="col-md-4">
              <div
                className={`card h-100 border-0 p-4 shadow-lg ${plan.popular ? "bg-info text-dark" : "bg-secondary bg-opacity-10 text-white"}`}
                style={{
                  border: plan.popular ? "none" : "1px solid rgba(255,255,255,0.1)",
                  transform: plan.popular ? "scale(1.05)" : "scale(1)",
                  transition: "transform 0.3s ease",
                  boxShadow: plan.popular ? "0 0 20px rgba(13, 202, 240, 0.2)" : "none",
                }}
              >
                <div className="card-body d-flex flex-column">
                  <div className="mb-3">{planIcons[i]}</div>
                  <h3 className="fw-bold">{plan.name}</h3>
                  <h2 className="display-5 fw-bold mb-4">
                    ${plan.price}
                    <small className={`fs-6 ${plan.popular ? "text-dark text-opacity-75" : "text-muted"}`}>/mo</small>
                  </h2>
                  <ul className="list-unstyled mb-5 text-start flex-grow-1">
                    {planFeatures[i].map((feature, idx) => (
                      <li key={idx} className="mb-3 d-flex align-items-center small">
                        <Check size={16} className="me-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button className={`btn mt-auto fw-bold py-3 rounded-pill ${plan.popular ? "btn-dark" : "btn-outline-info"}`}>
                    {plan.name}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pricing;