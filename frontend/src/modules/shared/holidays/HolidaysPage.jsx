import React, { useState, useEffect } from "react";
import Sidebar from "../../../layouts/Sidebar";
import { PageContent } from "../../../layouts/usePageLayout";
import { Plus, CalendarDays, X, Clock, MapPin } from "lucide-react";
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

      setShowModal(false);
      setDescription("");
      setHolidayDate("");
      fetchHolidays();
    } catch (err) {
      alert(err.response?.data?.error || "Error adding holiday");
    }
  };

  const nextHoliday = holidays
    .filter(h => new Date(h.holiday_date) >= new Date().setHours(0, 0, 0, 0))
    .sort((a, b) => new Date(a.holiday_date) - new Date(b.holiday_date))[0];

  return (
    <div className="d-flex bg-light min-vh-100">
      <Sidebar />
      <PageContent>
        <div className="container-fluid px-3 px-md-4 py-4">
          
          {/* Header Section */}
          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center mb-4 gap-3">
            <div>
              <h2 className="fw-bold fs-3 mb-1" style={{ color: "#0f172a", letterSpacing: "-0.5px" }}>
                Holiday Calendar
              </h2>
              <p className="text-muted small mb-0">Organization-wide public and observed holidays.</p>
            </div>
            {isAdmin && (
              <button
                className="btn d-flex align-items-center justify-content-center gap-2 px-4 py-2 text-white shadow-sm"
                style={{ background: "#4f46e5", borderRadius: "12px", fontWeight: "600", border: "none" }}
                onClick={() => setShowModal(true)}
              >
                <Plus size={18} /> Add Holiday
              </button>
            )}
          </div>

          {/* Featured Upcoming Holiday Card */}
          {nextHoliday && (
            <div className="position-relative overflow-hidden mb-4 p-4 p-md-5 rounded-4 shadow-sm text-white" 
                 style={{ background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)" }}>
              <div className="position-relative" style={{ zIndex: 2 }}>
                <span className="badge mb-3 px-3 py-2" style={{ background: "rgba(255,255,255,0.2)", fontSize: "11px", textTransform: "uppercase" }}>
                  Upcoming Celebration
                </span>
                <h2 className="display-6 fw-bold mb-3">{nextHoliday.description}</h2>
                <div className="d-flex flex-wrap align-items-center gap-3 gap-md-4 opacity-90">
                  <div className="d-flex align-items-center gap-2">
                    <Clock size={18} />
                    {new Date(nextHoliday.holiday_date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                  </div>
                  <div className="vr d-none d-md-block" style={{ opacity: 0.3 }}></div>
                  <div className="fw-bold">
                    {Math.ceil((new Date(nextHoliday.holiday_date) - new Date()) / (1000 * 60 * 60 * 24))} Days Left
                  </div>
                </div>
              </div>
              <CalendarDays size={180} className="position-absolute opacity-10" 
                            style={{ right: "-20px", bottom: "-40px", transform: "rotate(-15deg)" }} />
            </div>
          )}

          {/* Holiday Grid */}
          <div className="row g-3 g-md-4">
            {loading ? (
              <div className="col-12 text-center py-5">
                <div className="spinner-border text-primary"></div>
              </div>
            ) : holidays.length > 0 ? (
              holidays.map((holiday) => (
                <div key={holiday.holiday_id} className="col-12 col-md-6 col-lg-4 col-xl-3">
                  <div className="bg-white p-3 rounded-4 border shadow-sm d-flex align-items-center gap-3 transition-hover">
                    <div className="flex-shrink-0 d-flex align-items-center justify-content-center rounded-3" 
                         style={{ width: "48px", height: "48px", background: "#f5f3ff", color: "#4f46e5" }}>
                      <CalendarDays size={24} />
                    </div>
                    <div>
                      <div className="fw-bold text-dark" style={{ fontSize: "15px" }}>{holiday.description || "Holiday"}</div>
                      <div className="text-muted small">
                        {new Date(holiday.holiday_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12 text-center py-5 text-muted">No holiday data synchronized.</div>
            )}
          </div>

          {/* Footer Info */}
          <div className="mt-5 p-3 p-md-4 bg-white rounded-4 border d-flex align-items-center gap-3 shadow-sm">
            <div className="p-2 bg-light rounded-circle"><MapPin size={20} color="#6366f1" /></div>
            <p className="mb-0 small text-muted">
              <strong>Note:</strong> These are corporate-level holidays. Regional or branch-specific observances may be managed by local administrators.
            </p>
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="modal d-block show" tabIndex="-1" style={{ background: "rgba(15, 23, 42, 0.6)", backdropFilter: "blur(4px)" }}>
            <div className="modal-dialog modal-dialog-centered px-3">
              <div className="modal-content border-0 rounded-4 shadow-lg overflow-hidden">
                <div className="modal-header border-0 p-4 pb-0">
                  <h5 className="modal-title fw-bold">Add New Holiday</h5>
                  <button type="button" className="btn-close shadow-none" onClick={() => setShowModal(false)}></button>
                </div>
                <form onSubmit={handleAddHoliday}>
                  <div className="modal-body p-4">
                    <div className="mb-3">
                      <label className="form-label small fw-bold text-muted text-uppercase">Holiday Description</label>
                      <input type="text" className="form-control rounded-3 shadow-none" placeholder="e.g. Annual Company Retreat" value={description} onChange={(e) => setDescription(e.target.value)} required />
                    </div>
                    <div className="mb-3">
                      <label className="form-label small fw-bold text-muted text-uppercase">Observation Date</label>
                      <input type="date" className="form-control rounded-3 shadow-none" value={holidayDate} onChange={(e) => setHolidayDate(e.target.value)} required />
                    </div>
                  </div>
                  <div className="modal-footer border-0 p-4 pt-0 gap-2">
                    <button type="button" className="btn btn-light rounded-3 px-4 flex-grow-1" onClick={() => setShowModal(false)}>Cancel</button>
                    <button type="submit" className="btn text-white rounded-3 px-4 flex-grow-2" style={{ background: "#4f46e5" }}>Save to Calendar</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        <style>{`
          .transition-hover { transition: all 0.2s ease; cursor: default; }
          .transition-hover:hover { transform: translateY(-3px); border-color: #4f46e5 !important; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1) !important; }
        `}</style>
      </PageContent>
    </div>
  );
}

export default Holidays;