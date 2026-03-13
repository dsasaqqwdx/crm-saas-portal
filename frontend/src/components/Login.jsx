import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const loginUser = async (e) => {
    e.preventDefault(); // Prevents page refresh
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);
      
      alert("Login Successful");
      navigate("/dashboard"); // Redirects to dashboard
    } catch (err) {
      alert(err.response?.data?.message || "Invalid Credentials");
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#f8fafc]">
      {/* Left Side: Login Form */}
      <div className="w-full lg:w-1/3 flex flex-col justify-center px-12 py-12 bg-white shadow-xl z-10">
        <div className="mb-10 flex flex-col items-center lg:items-start">
          <div className="w-16 h-16 bg-[#1a1c23] rounded-full flex items-center justify-center mb-4">
            <span className="text-white font-bold text-2xl">S</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 uppercase tracking-tighter">
            Shnoor International LLC
          </h2>
        </div>

        <form onSubmit={loginUser} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email or Phone</label>
            <input
              type="email"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="lakshman.b@shnoor.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-[#3b82f6] hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors shadow-lg shadow-blue-200"
          >
            Login
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-600 font-semibold hover:underline">
            Register here
          </Link>
        </p>
      </div>

      {/* Right Side: Visual Banner (Matches your Screenshot) */}
      <div className="hidden lg:flex lg:w-2/3 bg-white items-center justify-center p-12">
        <div className="relative w-full max-w-4xl h-[400px] rounded-3xl overflow-hidden shadow-2xl flex items-center bg-[#0a214d]">
          {/* Blue Text Section */}
          <div className="w-1/2 p-12 z-10">
            <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
              Software As A Service <br />
              <span className="text-blue-300">in Cloud Computing</span>
            </h2>
            <p className="text-blue-100 text-2xl font-light mb-6">
              The Revolution of Technology
            </p>
            <p className="text-gray-400 text-sm italic">
              Stay ahead of the curve with our innovative software as a service solutions.
            </p>
          </div>
          
          {/* Circular Graphic Section (Stylized placeholder for the SaaS circle) */}
          <div className="w-1/2 relative h-full flex items-center justify-center overflow-hidden">
             <div className="w-64 h-64 border-8 border-blue-400/30 rounded-full flex items-center justify-center relative">
                <div className="w-48 h-48 bg-white rounded-full flex items-center justify-center shadow-inner">
                   <span className="text-4xl font-black text-[#0a214d]">SaaS</span>
                </div>
                {/* Decorative floating nodes */}
                <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] p-2 rounded-full px-3">Document Management</div>
                <div className="absolute bottom-0 right-0 bg-blue-500 text-white text-[10px] p-2 rounded-full px-3">Mail Services</div>
                <div className="absolute top-0 left-0 bg-yellow-600 text-white text-[10px] p-2 rounded-full px-3">Business Services</div>
                <div className="absolute bottom-0 left-0 bg-emerald-500 text-white text-[10px] p-2 rounded-full px-3">Social Networks</div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;