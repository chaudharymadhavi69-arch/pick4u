import API from "./axios";

// Distance & Fare
export const getDistance = (data) => API.post("/core/distance", data);
export const getFare = (data) => API.post("/core/fare", data);

// Notifications
export const sendSms = (data) => API.post("/core/notify/sms", data);
export const sendEmail = (data) => API.post("/core/notify/email", data);
export const sendPush = (data) => API.post("/core/notify/push", data);

// Payment Refund
export const refundPayment = (data) => API.post("/core/payment/refund", data);
