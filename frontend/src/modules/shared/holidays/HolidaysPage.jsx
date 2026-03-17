import React, { useState, useEffect } from "react";
import Sidebar from "../../../layouts/Sidebar";
import { Plus, CalendarDays } from "lucide-react";
import axios from "axios";

function Holidays() {
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [description, setDescription] = useState("");
  const [holidayDate, setHolidayDate] = useState("");

  const role = localStorage.getItem("role");
  const isAdmin = role === "company_admin" || role === "super_admin";

  const fetchHolidays = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5001/api/holidays", {
        headers: { "x-auth-token": token }
      });
      setHolidays(res.data.data);
    } catch (err) {
      console.error("Error fetching holidays:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHolidays();
  }, []);

  const handleAddHoliday = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5001/api/holidays/add", {
        description,
        holiday_date: holidayDate
      }, { headers: { "x-auth-token": token } });

      alert("Holiday Added Successfully!");
      setShowModal(false);
      setDescription("");
      setHolidayDate("");
      fetchHolidays();
    } catch (err) {
      alert(err.response?.data?.error || "Error adding holiday");
    }
  };

  const nextHoliday = holidays.find(h => new Date(h.holiday_date) >= new Date());

  return (
    <div className="d-flex bg-light min-vh-100">
      <Sidebar />
      <div className="container-fluid p-4" style={{ marginLeft: "250px" }}>

        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold">Holiday Calendar 2026</h2>
            <p className="text-muted">View upcoming public and company holidays</p>
          </div>
          {isAdmin && (
            <button className="btn btn-primary d-flex align-items-center shadow-sm" onClick={() => setShowModal(true)}>
              <Plus size={18} className="me-2" />
              Add Holiday
            </button>
          )}
        </div>

        {nextHoliday && (
          <div className="card bg-primary text-white mb-4 shadow border-0 overflow-hidden">
            <div className="card-body p-4 d-flex justify-content-between align-items-center">
              <div>
                <span className="badge bg-white text-primary mb-2 px-3 py-2 rounded-pill fw-bold">
                  Next Holiday
                </span>
                <h2 className="fw-bold mb-1">{nextHoliday.description}</h2>
                <p className="mb-0 opacity-75 fs-5">
                  {new Date(nextHoliday.holiday_date).toLocaleDateString(undefined, {
                    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                  })}
                </p>
              </div>
              <div className="text-center bg-white bg-opacity-25 p-3 rounded-3" style={{ minWidth: '120px' }}>
                <p className="small mb-1 text-uppercase tracking-wider opacity-75">Days Away</p>
                <h1 className="fw-bold mb-0">
                  {Math.ceil((new Date(nextHoliday.holiday_date) - new Date()) / (1000 * 60 * 60 * 24))}
                </h1>
              </div>
            </div>
          </div>
        )}

        <div className="row g-4">
          {loading ? (
            <div className="col-12 text-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
            </div>
          ) : holidays.length > 0 ? holidays.map((holiday) => (
            <div key={holiday.holiday_id} className="col-md-6 col-xl-4">
              <div className="card shadow-sm border-0 h-100 hover-shadow transition">
                <div className="card-body d-flex align-items-center p-3">
                  <div className="bg-primary bg-opacity-10 text-primary p-3 rounded-3 me-3">
                    <CalendarDays size={24} />
                  </div>
                  <div className="flex-grow-1">
                    <h6 className="fw-bold mb-1 text-dark">
                      {holiday.description || "Company Holiday"}
                    </h6>
                    <p className="text-muted small mb-0 fw-semibold">
                      {new Date(holiday.holiday_date).toLocaleDateString(undefined, {
                        month: 'short', day: 'numeric', year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )) : (
            <div className="col-12 text-center py-5">
              <p className="text-muted">No holidays marked for this company yet.</p>
            </div>
          )}
        </div>

        <div className="alert border-0 shadow-sm bg-white mt-5 p-4 rounded-3">
          <div className="d-flex align-items-center text-info mb-2">
            <CalendarDays size={20} className="me-2" />
            <h6 className="mb-0 fw-bold">Branch Specific Holidays</h6>
          </div>
          <p className="text-muted small mb-0">
            Holidays listed here apply to all employees in your organization. Regional public holidays may be added by local admins.
          </p>
        </div>
      </div>

      {/* ADD HOLIDAY MODAL */}
      {showModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content shadow border-0">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold">Add Company Holiday</h5>
                <button className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleAddHoliday}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label small fw-bold">Holiday Description</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Independence Day"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-bold">Holiday Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={holidayDate}
                      onChange={(e) => setHolidayDate(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer border-0">
                  <button type="button" className="btn btn-light rounded-pill px-4" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary rounded-pill px-4 fw-bold">Save Holiday</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Holidays;