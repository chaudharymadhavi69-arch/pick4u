import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white text-gray-900 p-4 shadow-lg border-b-4 border-[#0500FF]">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo Section */}
        <Link to="/" className="hover:opacity-90 transition-opacity">
          <img src="/Pick4u2.png" alt="Pick4U" className="h-10" />
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center space-x-6">
          {!user && (
            <>
              <Link
                to="/login"
                className="font-semibold text-gray-700 hover:text-[#0500FF] transition-colors"
                style={{ fontFamily: "'Poppins', 'Inter', sans-serif" }}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-[#0500FF] hover:bg-[#0400cc] text-white px-5 py-2 rounded-lg font-semibold transition-colors shadow-md"
                style={{ fontFamily: "'Poppins', 'Inter', sans-serif" }}
              >
                Register
              </Link>
            </>
          )}

          {user?.role === "customer" && (
            <>
              <Link
                to="/customer/dashboard"
                className="font-medium text-gray-700 hover:text-[#0500FF] transition-colors"
                style={{ fontFamily: "'Poppins', 'Inter', sans-serif" }}
              >
                Dashboard
              </Link>
              <Link
                to="/customer/new-order"
                className="font-medium text-gray-700 hover:text-[#0500FF] transition-colors"
                style={{ fontFamily: "'Poppins', 'Inter', sans-serif" }}
              >
                Book Order
              </Link>
              <Link
                to="/customer/orders"
                className="font-medium text-gray-700 hover:text-[#0500FF] transition-colors"
                style={{ fontFamily: "'Poppins', 'Inter', sans-serif" }}
              >
                My Orders
              </Link>
              <Link
                to="/customer/profile"
                className="font-medium text-gray-700 hover:text-[#0500FF] transition-colors"
                style={{ fontFamily: "'Poppins', 'Inter', sans-serif" }}
              >
                Profile
              </Link>
            </>
          )}

          {user?.role === "driver" && (
            <>
              <Link
                to="/driver/dashboard"
                className="font-medium text-gray-700 hover:text-[#0500FF] transition-colors"
                style={{ fontFamily: "'Poppins', 'Inter', sans-serif" }}
              >
                Dashboard
              </Link>
              <Link
                to="/driver/jobs"
                className="font-medium text-gray-700 hover:text-[#0500FF] transition-colors"
                style={{ fontFamily: "'Poppins', 'Inter', sans-serif" }}
              >
                Jobs
              </Link>
              <Link
                to="/driver/my-jobs"
                className="font-medium text-gray-700 hover:text-[#0500FF] transition-colors"
                style={{ fontFamily: "'Poppins', 'Inter', sans-serif" }}
              >
                My-Jobs
              </Link>
              <Link
                to="/driver/orders"
                className="font-medium text-gray-700 hover:text-[#0500FF] transition-colors"
                style={{ fontFamily: "'Poppins', 'Inter', sans-serif" }}
              >
                History
              </Link>
              <Link
                to="/driver/earnings"
                className="font-medium text-gray-700 hover:text-[#0500FF] transition-colors"
                style={{ fontFamily: "'Poppins', 'Inter', sans-serif" }}
              >
                Earnings
              </Link>
              <Link
                to="/driver/reports"
                className="font-medium text-gray-700 hover:text-[#0500FF] transition-colors"
                style={{ fontFamily: "'Poppins', 'Inter', sans-serif" }}
              >
                Reports
              </Link>
              <Link
                to="/driver/profile"
                className="font-medium text-gray-700 hover:text-[#0500FF] transition-colors"
                style={{ fontFamily: "'Poppins', 'Inter', sans-serif" }}
              >
                Profile
              </Link>
            </>
          )}

          {user?.role === "admin" && (
            <>
              <Link
                to="/admin/dashboard"
                className="font-medium text-gray-700 hover:text-[#0500FF] transition-colors"
                style={{ fontFamily: "'Poppins', 'Inter', sans-serif" }}
              >
                Dashboard
              </Link>
              <Link
                to="/admin/orders"
                className="font-medium text-gray-700 hover:text-[#0500FF] transition-colors"
                style={{ fontFamily: "'Poppins', 'Inter', sans-serif" }}
              >
                Orders
              </Link>
              <Link
                to="/admin/drivers"
                className="font-medium text-gray-700 hover:text-[#0500FF] transition-colors"
                style={{ fontFamily: "'Poppins', 'Inter', sans-serif" }}
              >
                Drivers
              </Link>
              <Link
                to="/admin/customers"
                className="font-medium text-gray-700 hover:text-[#0500FF] transition-colors"
                style={{ fontFamily: "'Poppins', 'Inter', sans-serif" }}
              >
                Customers
              </Link>
              <Link
                to="/admin/reports"
                className="font-medium text-gray-700 hover:text-[#0500FF] transition-colors"
                style={{ fontFamily: "'Poppins', 'Inter', sans-serif" }}
              >
                Reports
              </Link>
            </>
          )}

          {user && (
            <button
              onClick={handleLogout}
              className="bg-[#FF3318] hover:bg-[#cc2913] text-white px-5 py-2 rounded-lg font-semibold transition-colors shadow-md"
              style={{ fontFamily: "'Poppins', 'Inter', sans-serif" }}
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
