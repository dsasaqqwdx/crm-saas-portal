import React, { useEffect, useState } from "react";
import axios from "axios";

function PricingPage() {
  const [plans, setPlans] = useState([]);
  const [form, setForm] = useState({
    plan_name: "",
    price: "",
    billing_cycle: "monthly",
    max_employees: "",
    features: ""
  });

  const fetchPlans = async () => {
    const res = await axios.get("http://localhost:5001/api/plans");
    setPlans(res.data);
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:5001/api/plans", form);
    setForm({
      plan_name: "",
      price: "",
      billing_cycle: "monthly",
      max_employees: "",
      features: ""
    });
    fetchPlans();
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5001/api/plans/${id}`);
    fetchPlans();
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4 fw-bold text-primary">Pricing Plans</h2>

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h5 className="card-title mb-3">Add New Plan</h5>

          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              
              <div className="col-md-3">
                <input
                  className="form-control"
                  placeholder="Plan Name"
                  value={form.plan_name}
                  onChange={e => setForm({ ...form, plan_name: e.target.value })}
                  required
                />
              </div>

              <div className="col-md-2">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Price"
                  value={form.price}
                  onChange={e => setForm({ ...form, price: e.target.value })}
                  required
                />
              </div>

              <div className="col-md-2">
                <select
                  className="form-select"
                  value={form.billing_cycle}
                  onChange={e => setForm({ ...form, billing_cycle: e.target.value })}
                >
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>

              <div className="col-md-2">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Employees"
                  value={form.max_employees}
                  onChange={e => setForm({ ...form, max_employees: e.target.value })}
                />
              </div>

              <div className="col-md-3">
                <input
                  className="form-control"
                  placeholder="Features"
                  value={form.features}
                  onChange={e => setForm({ ...form, features: e.target.value })}
                />
              </div>

              <div className="col-12 text-end">
                <button className="btn btn-primary px-4">
                  Add Plan
                </button>
              </div>

            </div>
          </form>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          <h5 className="card-title mb-3">All Plans</h5>

          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-dark">
                <tr>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Billing</th>
                  <th>Employees</th>
                  <th>Features</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {plans.length > 0 ? (
                  plans.map(plan => (
                    <tr key={plan.plan_id}>
                      <td className="fw-semibold">{plan.plan_name}</td>
                      <td>₹ {plan.price}</td>
                      <td>
                        <span className="badge bg-info text-dark">
                          {plan.billing_cycle}
                        </span>
                      </td>
                      <td>{plan.max_employees}</td>
                      <td>{plan.features}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(plan.plan_id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center text-muted">
                      No plans available
                    </td>
                  </tr>
                )}
              </tbody>

            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PricingPage;