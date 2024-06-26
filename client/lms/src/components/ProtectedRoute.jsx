import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const ProtectedRoute = ({ role }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("user");
  const {user}=useContext(AuthContext)
  console.log("authcontext user", user);

  if (!token || !userRole) {
    return <Navigate to="/" replace />;
  }

  if (role == user && role == userRole) {
    return <Outlet />;
}
 else if (role == user && role==userRole) {
    return <Outlet />;
}

// return <Navigate to={`$/{role}`} />
 
};

export default ProtectedRoute;
