import API from "./axios";

// ---------------- Profile ----------------
export const getDriverProfile = () => API.get("/driver/profile");
export const updateDriverProfile = (data) => API.put("/driver/profile", data);

// ---------------- KYC ----------------
export const uploadDriverKYC = (formData) =>
  API.post("/driver/kyc", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// ---------------- Jobs ----------------
export const getAssignedJobs = () => API.get("/driver/jobs");
export const acceptJob = (id) => API.post(`/driver/jobs/${id}/accept`);
export const rejectJob = (id) => API.post(`/driver/jobs/${id}/reject`);
export const updateJobStatus = (id, data) =>
  API.put(`/driver/jobs/${id}/status`, data);
export const uploadProof = (id, data) =>
  API.post(`/driver/jobs/${id}/proof`, data);

// ---------------- Earnings ----------------
export const getDriverEarnings = () => API.get("/driver/earnings");
export const getReports = () => API.get("/driver/reports");
export const getEarnings = () => API.get("/driver/my-earnings");

// ---------------- Real-time Orders (New) ----------------
// 📦 Fetch all available (unassigned) orders for the driver
export const getDriverOrders = () => API.get("/driver/orders");

// ✅ Accept an available order
export const acceptOrder = (orderId) =>
  API.post(`/driver/orders/${orderId}/accept`);

// ❌ Reject an available order
export const rejectOrder = (orderId) =>
  API.post(`/driver/orders/${orderId}/reject`);
