import React,{useState} from "react";
import axios from "axios";

function Register(){

 const [name,setName] = useState("");
 const [email,setEmail] = useState("");
 const [password,setPassword] = useState("");

 const registerUser = async () => {

  try{

   const res = await axios.post(
    "http://localhost:5000/api/auth/register",
    {
     name,
     email,
     password,
     role:"company_admin",
     company_id:1
    }
   );

   console.log(res.data);

   alert("User Registered Successfully");

  }catch(error){

   console.error(error.response?.data || error.message);

   alert(
    error.response?.data?.error ||
    error.response?.data?.msg ||
    "Registration failed"
   );

  }

 };

 return(

  <div className="container mt-4">

   <h3>Register</h3>

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
    type="password"
    placeholder="Password"
    onChange={(e)=>setPassword(e.target.value)}
   />

   <button
    className="btn btn-success mt-2"
    onClick={registerUser}
   >
    Register
   </button>

  </div>

 );

}

export default Register;