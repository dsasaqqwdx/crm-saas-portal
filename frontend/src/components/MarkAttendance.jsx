import React,{useState} from "react";
import axios from "axios";

function MarkAttendance(){

 const [employeeId,setEmployeeId] = useState("");

 const markAttendance = async () => {

  const token = localStorage.getItem("token");

  await axios.post(
   "http://localhost:5000/api/employees/attendance",
   {
    employee_id:employeeId,
    status:"present"
   },
   {
    headers:{
     "x-auth-token":token
    }
   }
  );

  alert("Attendance Marked");

 };

 return(

  <div className="mt-4">

   <h4>Mark Attendance</h4>

   <input
    className="form-control"
    placeholder="Employee ID"
    onChange={(e)=>setEmployeeId(e.target.value)}
   />

   <button
    className="btn btn-warning mt-2"
    onClick={markAttendance}
   >
    Mark Attendance
   </button>

  </div>

 );

}

export default MarkAttendance;