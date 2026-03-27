
import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../../layouts/Sidebar";
import { PageContent } from "../../../layouts/usePageLayout";

function PricingPage() {
  const [plans, setPlans] = useState([]);
  const [form, setForm] = useState({ plan_name: "", price: "", billing_cycle: "monthly", max_employees: "", features: "" });

  const fetchPlans = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/plans");
      setPlans(Array.isArray(res.data) ? res.data : res.data.data || []);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchPlans(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5001/api/plans", form);
      setForm({ plan_name: "", price: "", billing_cycle: "monthly", max_employees: "", features: "" });
      fetchPlans();
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/api/plans/${id}`);
      fetchPlans();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="d-flex">
      <Sidebar />
      <PageContent style={{ backgroundColor: "#f8f9fa" }}>
        <div className="container-fluid p-3 p-md-4">
          <h2 className="mb-4 fw-bold fs-4">Pricing Plans</h2>

          
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-body p-3 p-md-4">
              <h5 className="card-title mb-3 fw-semibold" style={{ fontSize: "1rem" }}>Add New Plan</h5>
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-12 col-sm-6 col-md-3">
                    <label className="form-label small text-muted">Plan Name</label>
                    <input className="form-control" placeholder="e.g. Basic"
                      value={form.plan_name} onChange={e => setForm({ ...form, plan_name: e.target.value })} required />
                  </div>
                  <div className="col-6 col-sm-6 col-md-2">
                    <label className="form-label small text-muted">Price (₹)</label>
                    <input type="number" className="form-control" placeholder="0"
                      value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required />
                  </div>
                  <div className="col-6 col-sm-6 col-md-2">
                    <label className="form-label small text-muted">Billing</label>
                    <select className="form-select" value={form.billing_cycle}
                      onChange={e => setForm({ ...form, billing_cycle: e.target.value })}>
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>
                  <div className="col-6 col-sm-6 col-md-2">
                    <label className="form-label small text-muted">Max Employees</label>
                    <input type="number" className="form-control" placeholder="100"
                      value={form.max_employees} onChange={e => setForm({ ...form, max_employees: e.target.value })} />
                  </div>
                  <div className="col-12 col-sm-12 col-md-3">
                    <label className="form-label small text-muted">Features (comma separated)</label>
                    <input className="form-control" placeholder="Support, CRM, Analytics"
                      value={form.features} onChange={e => setForm({ ...form, features: e.target.value })} />
                  </div>
                  <div className="col-12 text-end mt-2">
                    <button type="submit" className="btn btn-primary px-4 shadow-sm w-100 w-sm-auto" style={{ maxWidth: "200px" }}>
                      Create Plan
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          
          <div className="card shadow-sm border-0">
            <div className="card-body p-0">
              <div className="p-3 p-md-4 border-bottom">
                <h5 className="card-title mb-0 fw-semibold" style={{ fontSize: "1rem" }}>Active Plans</h5>
              </div>
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0" style={{ minWidth: "550px" }}>
                  <thead className="bg-light">
                    <tr>
                      <th className="ps-3 ps-md-4">Plan Name</th>
                      <th>Price</th>
                      <th>Billing</th>
                      <th className="d-none d-md-table-cell">Max Employees</th>
                      <th className="d-none d-lg-table-cell">Features</th>
                      <th className="text-center pe-3 pe-md-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {plans.length > 0 ? plans.map(plan => (
                      <tr key={plan.plan_id}>
                        <td className="ps-3 ps-md-4 fw-bold text-dark" style={{ fontSize: "0.9rem" }}>{plan.plan_name}</td>
                        <td style={{ fontSize: "0.9rem" }}>₹{plan.price}</td>
                        <td>
                          <span className={`badge ${plan.billing_cycle === "yearly" ? "bg-success" : "bg-info"} text-white`}>
                            {plan.billing_cycle}
                          </span>
                        </td>
                        <td className="d-none d-md-table-cell" style={{ fontSize: "0.85rem" }}>{plan.max_employees || "Unlimited"}</td>
                        <td className="d-none d-lg-table-cell text-muted" style={{ fontSize: "0.8rem" }}>{plan.features}</td>
                        <td className="text-center pe-3 pe-md-4">
                          <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(plan.plan_id)}>Delete</button>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="6" className="text-center py-5 text-muted">No pricing plans found. Create one above.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </PageContent>
    </div>
  );
}

export default PricingPage;
