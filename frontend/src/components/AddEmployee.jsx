import React,{useState} from "react";
import axios from "axios";

function AddEmployee(){

 const [name,setName] = useState("");
 const [email,setEmail] = useState("");
 const [phone,setPhone] = useState("");

 const addEmployee = async () => {

  const token = localStorage.getItem("token");

  await axios.post(
   "http://localhost:5000/api/employees/add",
   {
    name,
    email,
    phone,
    department_id:1,
    designation_id:1,
    joining_date:"2025-03-13"
   },
   {
    headers:{
     "x-auth-token":token
    }
   }
  );

  alert("Employee Added");

 };

 return(

  <div className="mt-4">

   <h4>Add Employee</h4>

   <input
    className="form-control"
    placeholder="Name"
    onChange={(e)=>setName(e.target.value)}
   />

   <input
    className="form-control mt-2"
    placeholder="Email"
    onChange={(e)=>setEmail(e.target.value)}
   />

   <input
    className="form-control mt-2"
    placeholder="Phone"
    onChange={(e)=>setPhone(e.target.value)}
   />

   <button
    className="btn btn-primary mt-2"
    onClick={addEmployee}
   >
    Add Employee
   </button>

  </div>

 );

}

export default AddEmployee;