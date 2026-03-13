import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
<<<<<<< HEAD
import { 
  CalendarDays, 
  Plus, 
  ChevronRight, 
  Palmtree, 
=======
import {
  CalendarDays,
  Plus,
  ChevronRight,
  Palmtree,
>>>>>>> 9c5a8010b4b016477788cc1b54819ccbe65ae531
  PartyPopper,
  Moon
} from "lucide-react";

function Holidays() {
<<<<<<< HEAD
  // Mock data for the 2026 holiday calendar
  const [holidays] = useState([
    { id: 1, name: "New Year's Day", date: "Jan 01, 2026", day: "Thursday", type: "National", icon: <PartyPopper className="text-orange-500" /> },
    { id: 2, name: "Republic Day", date: "Jan 26, 2026", day: "Monday", type: "National", icon: <CalendarDays className="text-blue-500" /> },
    { id: 3, name: "Eid-ul-Fitr", date: "March 20, 2026", day: "Friday", type: "Religious", icon: <Moon className="text-emerald-500" /> },
    { id: 4, name: "Good Friday", date: "April 03, 2026", day: "Friday", type: "Religious", icon: <Palmtree className="text-blue-400" /> },
    { id: 5, name: "Independence Day", date: "Aug 15, 2026", day: "Saturday", type: "National", icon: <CalendarDays className="text-red-500" /> },
  ]);

  return (
    <div className="flex bg-[#f8fafc] min-h-screen">
      <Sidebar />

      <div className="flex-1 ml-64 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Holiday Calendar 2026</h1>
            <p className="text-gray-500 text-sm">View upcoming public and company holidays</p>
          </div>
          <button className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold flex items-center hover:bg-gray-50 transition-all shadow-sm">
            <Plus size={16} className="mr-2" /> Add Holiday
          </button>
        </div>

        {/* Featured Next Holiday Card */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 mb-10 text-white shadow-xl flex justify-between items-center relative overflow-hidden">
          <div className="z-10">
            <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Upcoming Next</span>
            <h2 className="text-3xl font-bold mt-4">Eid-ul-Fitr</h2>
            <p className="text-blue-100 mt-1">Friday, March 20, 2026</p>
          </div>
          <Moon size={100} className="text-white/10 absolute -right-4 -bottom-4 rotate-12" />
          <div className="z-10 bg-white/10 backdrop-blur-md p-4 rounded-xl text-center border border-white/20">
            <p className="text-xs uppercase font-bold text-blue-200">Days To Go</p>
            <p className="text-3xl font-black">07</p>
          </div>
        </div>

        {/* Holiday List Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {holidays.map((holiday) => (
            <div 
              key={holiday.id} 
              className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all group flex items-center"
            >
              <div className="bg-gray-50 p-4 rounded-xl group-hover:bg-blue-50 transition-colors">
                {holiday.icon}
              </div>
              <div className="ml-5 flex-1">
                <h4 className="font-bold text-gray-800">{holiday.name}</h4>
                <p className="text-sm text-gray-500">{holiday.date} • {holiday.day}</p>
              </div>
              <div className="text-right">
                <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase ${
                  holiday.type === 'National' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'
                }`}>
                  {holiday.type}
                </span>
                <ChevronRight size={18} className="text-gray-300 mt-2 ml-auto" />
              </div>
            </div>
          ))}
        </div>

        {/* Calendar Footer Note */}
        <div className="mt-10 p-4 bg-blue-50 rounded-lg border border-blue-100 flex items-center text-blue-700 text-sm">
          <CalendarDays size={18} className="mr-3" />
          <span>Note: Regional holidays may vary based on your branch location.</span>
        </div>
      </div>
    </div>
=======

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

>>>>>>> 9c5a8010b4b016477788cc1b54819ccbe65ae531
  );
}

export default Holidays;