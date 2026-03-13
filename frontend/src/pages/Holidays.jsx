import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import {
  CalendarDays,
  Plus,
  ChevronRight,
  Palmtree,
  PartyPopper,
  Moon
} from "lucide-react";

function Holidays() {

  const [holidays] = useState([
    { id: 1, name: "New Year's Day", date: "Jan 01, 2026", day: "Thursday", type: "National", icon: <PartyPopper /> },
    { id: 2, name: "Republic Day", date: "Jan 26, 2026", day: "Monday", type: "National", icon: <CalendarDays /> },
    { id: 3, name: "Eid-ul-Fitr", date: "March 20, 2026", day: "Friday", type: "Religious", icon: <Moon /> },
    { id: 4, name: "Good Friday", date: "April 03, 2026", day: "Friday", type: "Religious", icon: <Palmtree /> },
    { id: 5, name: "Independence Day", date: "Aug 15, 2026", day: "Saturday", type: "National", icon: <CalendarDays /> }
  ]);

  return (

    <div className="d-flex bg-light min-vh-100">

      <Sidebar />

      <div className="container-fluid p-4">

        {/* Header */}

        <div className="d-flex justify-content-between align-items-center mb-4">

          <div>
            <h2 className="fw-bold">Holiday Calendar 2026</h2>
            <p className="text-muted">View upcoming public and company holidays</p>
          </div>

          <button className="btn btn-outline-secondary d-flex align-items-center">
            <Plus size={16} className="me-2" />
            Add Holiday
          </button>

        </div>


        {/* Featured Holiday */}

        <div className="card bg-primary text-white mb-4 shadow">

          <div className="card-body d-flex justify-content-between align-items-center">

            <div>

              <span className="badge bg-light text-primary mb-2">
                Upcoming Next
              </span>

              <h3 className="fw-bold">
                Eid-ul-Fitr
              </h3>

              <p className="mb-0">
                Friday, March 20, 2026
              </p>

            </div>

            <div className="text-center">

              <p className="small mb-1">
                Days To Go
              </p>

              <h2 className="fw-bold">
                07
              </h2>

            </div>

          </div>

        </div>


        {/* Holiday Cards */}

        <div className="row g-3">

          {holidays.map((holiday) => (

            <div key={holiday.id} className="col-md-6">

              <div className="card shadow-sm">

                <div className="card-body d-flex align-items-center">

                  <div className="me-3 text-primary">
                    {holiday.icon}
                  </div>

                  <div className="flex-grow-1">

                    <h6 className="fw-bold mb-1">
                      {holiday.name}
                    </h6>

                    <p className="text-muted small mb-0">
                      {holiday.date} • {holiday.day}
                    </p>

                  </div>

                  <div className="text-end">

                    <span className={`badge ${
                      holiday.type === "National"
                        ? "bg-warning text-dark"
                        : "bg-info"
                    }`}>
                      {holiday.type}
                    </span>

                    <ChevronRight size={16} className="ms-2 text-muted" />

                  </div>

                </div>

              </div>

            </div>

          ))}

        </div>


        {/* Footer Note */}

        <div className="alert alert-info mt-4 d-flex align-items-center">

          <CalendarDays size={18} className="me-2" />

          Regional holidays may vary based on your branch location.

        </div>

      </div>

    </div>

  );
}

export default Holidays;