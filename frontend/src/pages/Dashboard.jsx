import React from "react";
import Sidebar from "../components/Sidebar";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Users, Building2, CheckCircle, CreditCard } from "lucide-react";

const Dashboard = () => {

  const data = [
    { name: "Active", value: 400 },
    { name: "Inactive", value: 300 },
  ];

  const COLORS = ["#3b82f6", "#e2e8f0"];

  const stats = [
    { title: "Total Companies", count: "148", icon: <Building2 />, color: "primary" },
    { title: "Active Plans", count: "92", icon: <CheckCircle />, color: "success" },
    { title: "Total Users", count: "1,240", icon: <Users />, color: "purple" },
    { title: "Revenue", count: "$12,450", icon: <CreditCard />, color: "warning" },
  ];

  return (

    <div className="d-flex bg-light min-vh-100">

      <Sidebar />

      <div className="container-fluid p-4">

        {/* Header */}

        <div className="d-flex justify-content-between align-items-center mb-4">

          <div>
            <h2 className="fw-bold">Admin Dashboard</h2>
            <p className="text-muted">
              Overview of Shnoor International SaaS metrics
            </p>
          </div>

          <div className="d-flex gap-2">

            <button className="btn btn-outline-secondary">
              Export Report
            </button>

            <button className="btn btn-primary">
              Add Company
            </button>

          </div>

        </div>


        {/* Stats Cards */}

        <div className="row g-3 mb-4">

          {stats.map((stat, idx) => (

            <div key={idx} className="col-md-6 col-lg-3">

              <div className="card shadow-sm border-0">

                <div className="card-body d-flex align-items-center">

                  <div className={`bg-${stat.color} text-white p-3 rounded me-3`}>
                    {stat.icon}
                  </div>

                  <div>
                    <p className="text-muted small mb-1">
                      {stat.title}
                    </p>

                    <h4 className="fw-bold mb-0">
                      {stat.count}
                    </h4>
                  </div>

                </div>

              </div>

            </div>

          ))}

        </div>


        {/* Charts Section */}

        <div className="row g-3">

          {[1,2,3].map((item) => (

            <div key={item} className="col-lg-4">

              <div className="card shadow-sm text-center">

                <div className="card-body">

                  <h6 className="fw-bold mb-3">
                    Storage Usage {item}
                  </h6>

                  <div style={{ height: "180px" }}>

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
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}

                        </Pie>

                      </PieChart>

                    </ResponsiveContainer>

                  </div>

                  <div className="mt-2">

                    <h4 className="text-primary fw-bold">
                      75%
                    </h4>

                    <small className="text-muted">
                      Efficiency
                    </small>

                  </div>

                </div>

              </div>

            </div>

          ))}

        </div>


        {/* Recent Activity */}

        <div className="card shadow-sm mt-4">

          <div className="card-body">

            <h5 className="fw-bold mb-3">
              Recent Company Registrations
            </h5>

            <p className="text-muted fst-italic">
              Connect your backend to map company list here...
            </p>

          </div>

        </div>

      </div>

    </div>

  );

};

export default Dashboard;