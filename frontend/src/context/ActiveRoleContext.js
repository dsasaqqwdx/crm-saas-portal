import React, { createContext, useContext, useState } from "react";
const ActiveRoleContext = createContext();

export const ActiveRoleProvider = ({ children }) => {
  const [activeRole, setActiveRole] = useState(
 localStorage.getItem("activeRole") || "manager"
  );
const switchRole = (role) => {
setActiveRole(role);
localStorage.setItem("activeRole", role);
  };
  return (
<ActiveRoleContext.Provider value={{ activeRole, switchRole }}>
      {children}
</ActiveRoleContext.Provider>
  );
};export const useActiveRole = () => useContext(ActiveRoleContext);