import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute({ allowedRoles }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Not logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Role not allowed
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="p-6 text-center text-red-600 font-semibold">
        🚫 Unauthorized - You are not allowed to access this page
      </div>
    );
  }

  // If everything is fine → render child route
  return <Outlet />;
}
