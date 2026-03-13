import React from "react";
import AddEmployee from "./AddEmployee";
import MarkAttendance from "./MarkAttendance";

function Dashboard(){

 return(

  <div className="container mt-5">

   <h2>Dashboard</h2>

   <AddEmployee />

   <MarkAttendance />

  </div>

 );

}

export default Dashboard;