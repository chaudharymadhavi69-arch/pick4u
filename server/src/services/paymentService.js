// Later integrate Stripe or Razorpay
export const createOnlinePayment = async (order) => {
  // abhi fake response de dete hai
  return {
    id: "txn_" + new Date().getTime(),
    amount: order.fare,
    currency: "INR",
    status: "created",
  };
};
