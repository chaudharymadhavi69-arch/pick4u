import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./contexts/AuthContext";
import { SocketProvider } from "./contexts/SocketContext";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import CustomerDashboard from "./pages/customer/CustomerDashboard";
// import BookOrder from "./pages/customer/BookOrder";
import Profile from "./pages/customer/Profile";
// import JobsAssigned from "./pages/driver/JobsAssigned";
import Earnings from "./pages/driver/Earnings";
import DriverReports from "./pages/driver/DriverReports";
import AdminDashboard from "./pages/admin/AdminDashboard";
// import AdminOrders from "./pages/admin/AdminOrder";
// import AdminDrivers from "./pages/admin/AdminDriver";
// import AdminCustomers from "./pages/admin/AdminCustomers";
// import AdminReports from "./pages/admin/AdminReports";
import DistanceCalculator from "./pages/core/DistanceCalculator";
import FareCalculator from "./pages/core/FareCalculator";
import Notifications from "./pages/core/Notifications";
import Refund from "./pages/core/Refund";
import DriverDashboard from "./pages/driver/DriverDashboard";
import Home from "./pages/Home";
// import KYCUpload from "./pages/driver/KYCUpload";
// import DriverKYCUpload from "./pages/driver/KYCUpload";
import DriverProfile from "./pages/driver/DriverProfile";
import DriverOrders from "./pages/driver/DriverOrder";
import OrderDetails from "./pages/customer/OrderDetails";
import OrderHistory from "./pages/customer/OrderHistory";
import NewOrder from "./pages/customer/NewOrder";
import TrackOrder from "./pages/customer/TrackOrder";
import KycUpload from "./pages/driver/KYCUpload";
import AvailableJobs from "./pages/driver/AvailableJobs";
import MyJobs from "./pages/driver/MyJobs";
import AllOrders from "./pages/admin/AllOrders";
import DriversList from "./pages/admin/DriverList";
import PendingKyc from "./pages/admin/PendingKyc";
import CustomersList from "./pages/admin/CustomersList";
import CouponManagement from "./pages/admin/CouponManagement";
import CustomerOrderTracking from "./pages/customer/CustomerOrderTracking";
import DriverJobManagement from "./pages/driver/DriverJobManagement";
import AdminOrderTracking from "./pages/admin/AdminOrderTracking";

export default function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <Router>
          <Navbar />
          <Routes>
            {/* ✅ Public Routes */}
            <Route path="/" element={<PublicHome />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* ✅ Customer Protected */}
            <Route element={<ProtectedRoute allowedRoles={["customer"]} />}>
              <Route
                path="/customer/dashboard"
                element={<CustomerDashboard />}
              />
              <Route path="/customer/new-order" element={<NewOrder />} />
              <Route path="/customer/orders" element={<OrderHistory />} />
              <Route path="/customer/orders/:id" element={<OrderDetails />} />
              <Route path="/customer/track/:id" element={<TrackOrder />} />
              <Route
                path="/customer/orders/:orderId/tracking"
                element={<CustomerOrderTracking />}
              />
              <Route path="/customer/profile" element={<Profile />} />

              <Route
                path="/customer/fare-calculator"
                element={<FareCalculator />}
              />
              <Route
                path="/customer/notifications"
                element={<Notifications />}
              />
              <Route path="/customer/refund" element={<Refund />} />
            </Route>

            {/* ✅ Driver Protected */}
            <Route element={<ProtectedRoute allowedRoles={["driver"]} />}>
              <Route path="/driver/dashboard" element={<DriverDashboard />} />
              <Route path="/driver/kyc" element={<KycUpload />} />
              <Route path="/driver/jobs" element={<AvailableJobs />} />
              {/* <Route path="/driver/jobs" element={<JobsAssigned />} /> */}
              <Route path="/driver/my-jobs" element={<MyJobs />} />
              <Route path="/driver/earnings" element={<Earnings />} />
              <Route path="/driver/reports" element={<DriverReports />} />

              <Route path="/driver/profile" element={<DriverProfile />} />
              <Route
                path="/driver/current-job"
                element={<DriverJobManagement />}
              />

              <Route path="/driver/orders" element={<DriverOrders />} />
            </Route>

            {/* ✅ Admin Protected */}
            <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/orders" element={<AllOrders />} />

              <Route
                path="/admin/orders/:orderId/tracking"
                element={<AdminOrderTracking />}
              />
              {/* <Route path="/admin/orders" element={<AdminOrders />} /> */}
              {/* <Route path="/admin/drivers" element={<AdminDrivers />} /> */}
              <Route path="/admin/drivers" element={<DriversList />} />
              <Route path="/admin/pending-kyc" element={<PendingKyc />} />

              {/* <Route path="/admin/customers" element={<AdminCustomers />} /> */}
              <Route path="/admin/customers" element={<CustomersList />} />
              <Route path="/admin/coupons" element={<CouponManagement />} />

              {/* <Route path="/admin/reports" element={<AdminReports />} /> */}
            </Route>

            {/* ✅ Core Routes (for all logged-in users) */}
            <Route
              element={
                <ProtectedRoute
                  allowedRoles={["customer", "driver", "admin"]}
                />
              }
            >
              <Route path="/core/distance" element={<DistanceCalculator />} />
              <Route path="/core/fare" element={<FareCalculator />} />
              <Route path="/core/notifications" element={<Notifications />} />
              <Route path="/core/refund" element={<Refund />} />
            </Route>

            {/* Default */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </SocketProvider>
    </AuthProvider>
  );
}

// ✅ Handle / route based on login status
function PublicHome() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (token && user.role) {
    if (user.role === "customer")
      return <Navigate to="/customer/dashboard" replace />;
    if (user.role === "driver")
      return <Navigate to="/driver/dashboard" replace />;
    if (user.role === "admin")
      return <Navigate to="/admin/dashboard" replace />;
  }

  // Not logged in → show Home
  return <Home />;
}
