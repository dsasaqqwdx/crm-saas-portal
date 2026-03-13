import React from "react";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";

function App() {

  return (
    <div>
      <Navbar />
      <Login />
      <Register />
      <Dashboard />
    </div>
  );

}

export default App;