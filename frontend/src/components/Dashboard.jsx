import React from "react";
import Sidebar from "../components/Sidebar";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Users, Building2, CheckCircle, CreditCard } from "lucide-react";

const Dashboard = () => {
  // Sample data for the circular charts in your screenshot
  const data = [
    { name: "Active", value: 400 },
    { name: "Inactive", value: 300 },
  ];
  const COLORS = ["#3b82f6", "#e2e8f0"];

  const stats = [
    { title: "Total Companies", count: "148", icon: <Building2 />, color: "bg-blue-500" },
    { title: "Active Plans", count: "92", icon: <CheckCircle />, color: "bg-emerald-500" },
    { title: "Total Users", count: "1,240", icon: <Users />, color: "bg-purple-500" },
    { title: "Revenue", count: "$12,450", icon: <CreditCard />, color: "bg-yellow-500" },
  ];

  return (
    <div className="flex bg-[#f8fafc] min-h-screen">
      <Sidebar />

      <div className="flex-1 ml-64 p-8">
        {/* Top Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-gray-500">Overview of Shnoor International SaaS metrics</p>
          </div>
          <div className="flex space-x-3">
            <button className="bg-white border px-4 py-2 rounded-lg text-sm font-semibold shadow-sm">Export Report</button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md">Add Company</button>
          </div>
        </div>

        {/* Stats Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center">
              <div className={`${stat.color} p-4 rounded-xl text-white mr-4`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">{stat.title}</p>
                <h3 className="text-2xl font-bold text-gray-800">{stat.count}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section (Matches your circular UI screenshot) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((item) => (
            <div key={item} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
              <h4 className="text-gray-700 font-bold mb-4">Storage Usage {item}</h4>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="text-center mt-2">
                <span className="text-2xl font-bold text-blue-600">75%</span>
                <p className="text-xs text-gray-400 uppercase tracking-widest">Efficiency</p>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activity Table placeholder */}
        <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h4 className="text-gray-800 font-bold mb-4">Recent Company Registrations</h4>
            <div className="border-t pt-4 text-gray-400 text-sm italic">
                Connect your backend to map company list here...
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;