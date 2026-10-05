// src/api/adminApi.js
import API from "./axios";

// ---------------- Dashboard ----------------
export const getDashboard = () => API.get("/admin/dashboard");

// ---------------- Orders ----------------
export const getAllOrders = () => API.get("/admin/orders");
export const assignDriver = (id, data) =>
  API.put(`/admin/orders/${id}/assign`, data);
export const cancelAdminOrder = (id) => API.put(`/admin/orders/${id}/cancel`);

// ---------------- Drivers ----------------
export const getDrivers = () => API.get("/admin/drivers"); // all drivers
export const getPendingKycDrivers = () => API.get("/admin/drivers/pending-kyc"); // pending KYC
export const approveDriver = (id) => API.put(`/admin/drivers/${id}/approve`);
export const rejectDriver = (id) => API.put(`/admin/drivers/${id}/reject`);
export const blockDriver = (id) => API.put(`/admin/drivers/${id}/block`);

// ---------------- Customers ----------------
export const getCustomers = () => API.get("/admin/customers");
export const suspendCustomer = (id) =>
  API.put(`/admin/customers/${id}/suspend`);

// ---------------- Coupons ----------------
export const createCoupon = (data) => API.post("/admin/coupons", data);
export const getCoupons = () => API.get("/admin/coupons");
export const updateCoupon = (id, data) => API.put(`/admin/coupons/${id}`, data);
export const deleteCoupon = (id) => API.delete(`/admin/coupons/${id}`);

// ---------------- Fare Config ----------------
export const getFareConfig = () => API.get("/admin/fare-config");
export const updateFareConfig = (data) => API.put("/admin/fare-config", data);
