import React, { useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import { UserPlus, Mail, Phone, Calendar, Briefcase } from "lucide-react";

function AddEmployee() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department_id: 1,
    designation_id: 1,
    joining_date: new Date().toISOString().split("T")[0], 
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      await axios.post(
        "http://localhost:5000/api/employees/add",
        formData,
        {
          headers: { "x-auth-token": token },
        }
      );
      alert("Employee Added Successfully!");
      
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.error || "Failed to add employee");
    }
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      
      <div className="flex-1 ml-64 p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center">
              <UserPlus className="mr-2 text-blue-600" size={28} />
              Add New Employee
            </h1>
            <p className="text-gray-500">Enter the details to onboard a new team member.</p>
          </div>

          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <form onSubmit={handleSubmit} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                <div className="relative">
                  <UserPlus className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="John Doe"
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
              </div>

              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input
                    type="email"
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="john@company.com"
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>
              </div>

              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="+91 9876543210"
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    required
                  />
                </div>
              </div>

              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Joining Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input
                    type="date"
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.joining_date}
                    onChange={(e) => setFormData({...formData, joining_date: e.target.value})}
                    required
                  />
                </div>
              </div>

              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Department</label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-3 text-gray-400" size={18} />
                  <select 
                    className="w-full pl-10 pr-4 py-2 border rounded-lg appearance-none bg-white outline-none"
                    onChange={(e) => setFormData({...formData, department_id: e.target.value})}
                  >
                    <option value="1">IT Department</option>
                    <option value="2">Human Resources</option>
                    <option value="3">Sales</option>
                  </select>
                </div>
              </div>

              <div className="md:col-span-2 mt-4">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-all shadow-md"
                >
                  Confirm Registration
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddEmployee;