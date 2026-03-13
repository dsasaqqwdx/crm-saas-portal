<<<<<<< HEAD
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { 
  ShieldCheck, 
  Users, 
  CreditCard, 
  Clock, 
  MapPin, 
  FileText, 
  Globe,
  ArrowRight
} from 'lucide-react';

const Home = () => {
  const features = [
    { title: "Payroll Processing", desc: "One Click Payroll", icon: <CreditCard className="text-purple-400" /> },
    { title: "Assets", desc: "Manage Company Assets", icon: <ShieldCheck className="text-cyan-400" /> },
    { title: "Locations", desc: "Multiple Locations", icon: <MapPin className="text-red-400" /> },
    { title: "Letter Heads", desc: "Dynamic Letter Heads", icon: <FileText className="text-yellow-400" /> },
    { title: "Leaves", desc: "Manage Employee Leaves", icon: <Globe className="text-blue-400" /> },
    { title: "Attendance Tracking", desc: "Employee Attendance", icon: <Clock className="text-purple-400" /> },
    { title: "Multi Languages", desc: "Multi Languages Support", icon: <Globe className="text-yellow-400" /> },
  ];

  return (
    <div className="min-h-screen bg-[#0a0b10] text-white font-sans overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="container mx-auto px-6 pt-32 lg:pt-48 pb-20 flex flex-col lg:flex-row items-center gap-12">
        <div className="lg:w-1/2 text-center lg:text-left">
          <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full mb-6">
            <span className="text-blue-400 text-xs font-bold uppercase tracking-widest">Software As A Service</span>
          </div>
          
          <p className="text-gray-400 uppercase tracking-[0.2em] text-xs mb-4 font-semibold">
            Grow Your Business With SHNOOR INTERNATIONAL LLC
          </p>
          
          <h1 className="text-5xl lg:text-7xl font-extrabold leading-[1.1] mb-6">
            Next Generation HR <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-emerald-400 to-cyan-400">
              Management System
            </span>
          </h1>
          
          <p className="text-gray-400 text-lg mb-10 max-w-lg mx-auto lg:mx-0 leading-relaxed">
            The ultimate HR management application for modern businesses. 
            Streamline your workflow with automated payroll, attendance, and asset tracking.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-12">
            <Link to="/register" className="w-full sm:w-auto px-8 py-4 bg-white text-black rounded-xl font-bold hover:bg-gray-200 transition-all flex items-center justify-center group">
              Get Started Now
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
            </Link>
            <Link to="/features" className="w-full sm:w-auto px-8 py-4 bg-[#161b22] border border-gray-800 rounded-xl font-bold hover:bg-gray-800 transition-all text-center">
              View Features
            </Link>
          </div>
          
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto lg:mx-0">
            {['No hidden fees', 'Start with a free account', 'Edit online instantly', 'Cloud security'].map((item, idx) => (
              <li key={idx} className="flex items-center text-gray-400 text-sm">
                <div className="w-2 h-2 rounded-full bg-emerald-500 mr-3 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></div>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Features Floating Grid (Right Side) */}
        <div className="lg:w-1/2 relative">
          <div className="absolute -inset-4 bg-blue-500/10 blur-3xl rounded-full"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
            {features.map((feature, idx) => (
              <div 
                key={idx} 
                className={`bg-[#161b22]/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-800 hover:border-blue-500/50 transition-all cursor-default group hover:-translate-y-1 shadow-xl ${idx === 1 ? 'md:mt-8' : ''}`}
              >
                <div className="mb-4 p-3 w-fit rounded-xl bg-gray-900 group-hover:scale-110 transition-transform shadow-inner">
                  {feature.icon}
                </div>
                <h3 className="font-bold text-lg mb-1 group-hover:text-blue-400 transition-colors">{feature.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <div className="bg-[#11141b] py-16 border-y border-gray-800 relative">
        <div className="container mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
          {[
            { label: 'Active Users', value: '10k+', color: 'text-blue-400' },
            { label: 'Companies', value: '500+', color: 'text-emerald-400' },
            { label: 'Support', value: '24/7', color: 'text-purple-400' },
            { label: 'Uptime', value: '99.9%', color: 'text-yellow-400' }
          ].map((stat, i) => (
            <div key={i} className="group">
              <h2 className={`text-4xl lg:text-5xl font-black mb-2 transition-transform group-hover:scale-110 ${stat.color}`}>
                {stat.value}
              </h2>
              <p className="text-gray-500 uppercase tracking-widest text-xs font-bold">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
=======
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

>>>>>>> 9c5a8010b4b016477788cc1b54819ccbe65ae531
};

export default Home;