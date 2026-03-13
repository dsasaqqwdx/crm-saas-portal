import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, Lock, ShieldCheck } from "lucide-react";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const registerUser = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", {
        name,
        email,
        password,
        role: "company_admin",
        company_id: 1, // Defaulting to 1 for now based on your previous code
      });

      alert("User Registered Successfully!");
      navigate("/login"); // Move user to login after success
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert(
        error.response?.data?.error ||
        error.response?.data?.msg ||
        "Registration failed"
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#f8fafc]">
      {/* Left Side: Register Form */}
      <div className="w-full lg:w-1/3 flex flex-col justify-center px-12 py-12 bg-white shadow-xl z-10">
        <div className="mb-8 flex flex-col items-center lg:items-start">
          <div className="w-16 h-16 bg-[#1a1c23] rounded-full flex items-center justify-center mb-4">
            <span className="text-white font-bold text-2xl">S</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 uppercase tracking-tighter">
            Join Shnoor International
          </h2>
          <p className="text-gray-500 text-sm mt-1">Create your admin account to get started.</p>
        </div>

        <form onSubmit={registerUser} className="space-y-5">
          {/* Full Name */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <User size={18} />
              </span>
              <input
                type="text"
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                placeholder="Abhi"
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <Mail size={18} />
              </span>
              <input
                type="email"
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                placeholder="abhi543it@gmail.com"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <Lock size={18} />
              </span>
              <input
                type="password"
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#10b981] hover:bg-emerald-600 text-white font-bold py-3 rounded-lg transition-colors shadow-lg shadow-emerald-100 mt-2"
          >
            Register
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link to="/login" className="text-emerald-600 font-semibold hover:underline">
            Login here
          </Link>
        </p>
      </div>

      {/* Right Side: Visual Banner (Consistent with Login) */}
      <div className="hidden lg:flex lg:w-2/3 bg-white items-center justify-center p-12">
        <div className="relative w-full max-w-4xl h-[500px] rounded-3xl overflow-hidden shadow-2xl flex items-center bg-[#0a214d]">
          <div className="w-1/2 p-12 z-10">
            <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
              Start Your <br />
              <span className="text-emerald-400">HR Transformation</span>
            </h2>
            <p className="text-blue-100 text-xl font-light mb-6">
              Empower your company with automated payroll, leave tracking, and employee management.
            </p>
            <div className="flex items-center text-gray-300 text-sm space-x-4">
              <div className="flex items-center">
                <ShieldCheck size={16} className="text-emerald-400 mr-2" /> Secure Data
              </div>
              <div className="flex items-center">
                <ShieldCheck size={16} className="text-emerald-400 mr-2" /> Cloud Storage
              </div>
            </div>
          </div>
          
          {/* Circular Graphic Section */}
          <div className="w-1/2 relative h-full flex items-center justify-center">
             <div className="w-72 h-72 border-8 border-emerald-400/20 rounded-full flex items-center justify-center">
                <div className="w-56 h-56 bg-white rounded-full flex flex-col items-center justify-center shadow-2xl">
                   <span className="text-4xl font-black text-[#0a214d]">SaaS</span>
                   <span className="text-[10px] text-gray-400 tracking-widest uppercase">Shnoor International</span>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;