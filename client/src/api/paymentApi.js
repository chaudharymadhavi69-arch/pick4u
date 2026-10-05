import API from "./axios";

// Customer Payments
export const makePayment = (data) => API.post("/customer/pay", data);
export const verifyPayment = (data) =>
  API.post("/customer/verify-payment", data);

// Core Refunds (Admin side mostly)
// export const refundPayment = (data) => API.post("/core/payment/refund", data);
