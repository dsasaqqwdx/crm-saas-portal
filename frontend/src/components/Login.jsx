import React,{useState} from "react";
import axios from "axios";

function Login(){

 const [email,setEmail] = useState("");
 const [password,setPassword] = useState("");

 const loginUser = async () => {

  const res = await axios.post(
   "http://localhost:5000/api/auth/login",
   { email,password }
  );

  localStorage.setItem("token",res.data.token);

  alert("Login Successful");

 };

 return(

  <div className="container mt-4">

   <h3>Login</h3>

   <input
    className="form-control"
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
    className="btn btn-primary mt-2"
    onClick={loginUser}
   >
    Login
   </button>

  </div>

 );

}

export default Login;