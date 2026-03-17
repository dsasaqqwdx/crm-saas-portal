import React from "react";
import Navbar from "../layouts/Navbar";
import { Check, Zap, Shield, Crown } from "lucide-react";

const Pricing = () => {
    const plans = [
        {
            name: "Basic",
            price: "10",
            icon: <Shield size={30} className="text-secondary" />,
            features: ["Employee Management", "Basic Attendance", "Email Support", "Single Location"],
            popular: false
        },
        {
            name: "Pro",
            price: "25",
            icon: <Zap size={30} className="text-info" />,
            features: ["Payroll Processing", "Attendance + GPS", "Leave Management", "Priority Support"],
            popular: true
        },
        {
            name: "Enterprise",
            price: "50",
            icon: <Crown size={30} className="text-warning" />,
            features: ["Full Analytics", "Multi-Location Support", "Custom Letterheads", "24/7 Phone Support"],
            popular: false
        }
    ];

    return (
        <div className="bg-dark text-white min-vh-100">
            <Navbar />
            <div className="container py-5 mt-5">
                {/* Header Section */}
                <div className="text-center mb-5">
                    <h1 className="display-4 fw-bold">
                        Simple, Scalable <span className="text-info">Pricing</span>
                    </h1>
                    <p className="text-secondary lead">Choose the plan that fits your company's growth.</p>
                </div>

                {/* Pricing Cards Grid */}
                <div className="row g-4 justify-content-center align-items-stretch">
                    {plans.map((plan, i) => (
                        <div key={i} className="col-md-4">
                            <div
                                className={`card h-100 border-0 p-4 shadow-lg ${plan.popular
                                        ? "bg-info text-dark"
                                        : "bg-secondary bg-opacity-10 text-white"
                                    }`}
                                style={{
                                    border: plan.popular ? "none" : "1px solid rgba(255,255,255,0.1)",
                                    transform: plan.popular ? "scale(1.05)" : "scale(1)",
                                    transition: "transform 0.3s ease",
                                    boxShadow: plan.popular ? "0 0 20px rgba(13, 202, 240, 0.2)" : "none"
                                }}
                            >
                                <div className="card-body d-flex flex-column">
                                    <div className="mb-3">{plan.icon}</div>
                                    <h3 className="fw-bold">{plan.name}</h3>
                                    <h2 className="display-5 fw-bold mb-4">
                                        ${plan.price}
                                        <small
                                            className={`fs-6 ${plan.popular ? "text-dark text-opacity-75" : "text-muted"
                                                }`}
                                        >
                                            /mo
                                        </small>
                                    </h2>

                                    <ul className="list-unstyled mb-5 text-start flex-grow-1">
                                        {plan.features.map((feature, idx) => (
                                            <li key={idx} className="mb-3 d-flex align-items-center small">
                                                <Check size={16} className="me-2 flex-shrink-0" />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>

                                    <button
                                        className={`btn mt-auto fw-bold py-3 rounded-pill transition-all ${plan.popular ? "btn-dark" : "btn-outline-info"
                                            }`}
                                    >
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