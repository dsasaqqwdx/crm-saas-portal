import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import {
  ShieldCheck,
  CreditCard,
  Clock,
  MapPin,
  FileText,
  Globe,
  ArrowRight
} from "lucide-react";

const Home = () => {

  const features = [
    { title: "Payroll Processing", desc: "One Click Payroll", icon: <CreditCard /> },
    { title: "Assets", desc: "Manage Company Assets", icon: <ShieldCheck /> },
    { title: "Locations", desc: "Multiple Locations", icon: <MapPin /> },
    { title: "Letter Heads", desc: "Dynamic Letter Heads", icon: <FileText /> },
    { title: "Leaves", desc: "Manage Employee Leaves", icon: <Globe /> },
    { title: "Attendance Tracking", desc: "Employee Attendance", icon: <Clock /> },
    { title: "Multi Languages", desc: "Multi Languages Support", icon: <Globe /> }
  ];

  return (

    <div className="bg-dark text-white min-vh-100">

      <Navbar />

      {/* Hero Section */}

      <section className="container py-5">

        <div className="row align-items-center">

          <div className="col-lg-6">

            <p className="text-uppercase text-secondary small">
              Grow Your Business With SHNOOR INTERNATIONAL LLC
            </p>

            <h1 className="display-4 fw-bold mb-4">
              Next Generation HR
              <br />
              <span className="text-info">
                Management System
              </span>
            </h1>

            <p className="text-secondary mb-4">
              The ultimate HR management application for modern businesses.
              Streamline your workflow with automated payroll, attendance,
              and asset tracking.
            </p>

            <div className="d-flex gap-3 mb-4">

              <Link
                to="/register"
                className="btn btn-light fw-bold d-flex align-items-center"
              >
                Get Started
                <ArrowRight size={16} className="ms-2" />
              </Link>

              <Link
                to="/features"
                className="btn btn-outline-light"
              >
                View Features
              </Link>

            </div>

          </div>


          {/* Features Grid */}

          <div className="col-lg-6">

            <div className="row g-3">

              {features.map((feature, index) => (

                <div key={index} className="col-md-6">

                  <div className="card bg-secondary text-white border-0 shadow">

                    <div className="card-body">

                      <div className="mb-2 text-info">
                        {feature.icon}
                      </div>

                      <h5 className="card-title">
                        {feature.title}
                      </h5>

                      <p className="card-text text-light small">
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


      {/* Stats Section */}

      <section className="bg-black py-5">

        <div className="container">

          <div className="row text-center">

            <div className="col-md-3">

              <h2 className="fw-bold text-info">
                10k+
              </h2>

              <p className="text-secondary small">
                Active Users
              </p>

            </div>

            <div className="col-md-3">

              <h2 className="fw-bold text-success">
                500+
              </h2>

              <p className="text-secondary small">
                Companies
              </p>

            </div>

            <div className="col-md-3">

              <h2 className="fw-bold text-warning">
                24/7
              </h2>

              <p className="text-secondary small">
                Support
              </p>

            </div>

            <div className="col-md-3">

              <h2 className="fw-bold text-danger">
                99.9%
              </h2>

              <p className="text-secondary small">
                Uptime
              </p>

            </div>

          </div>

        </div>

      </section>

    </div>

  );

};

export default Home;