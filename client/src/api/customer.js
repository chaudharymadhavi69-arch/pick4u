import API from "./axios";

// ---------------- Profile ----------------
export const getCustomerProfile = () => API.get("/customer/profile");
export const updateCustomerProfile = (data) =>
  API.put("/customer/profile", data);

// ---------------- Orders ----------------
export const createOrder = (data) => API.post("/customer/orders", data);
export const getMyOrders = () => API.get("/customer/orders");
export const getOrderById = (id) => API.get(`/customer/orders/${id}`);

// 👇 renamed to avoid clash with admin API
export const cancelCustomerOrder = (id) =>
  API.put(`/customer/orders/${id}/cancel`);

// ---------------- Fare & Coupons ----------------
export const getFareEstimate = (data) =>
  API.post("/customer/fare-estimate", data);
export const applyCoupon = (data) => API.post("/customer/apply-coupon", data);
export const removeCoupon = (data) => API.post("/customer/remove-coupon", data);
