// import Payment from "../models/Payment.js";
// import Order from "../models/Order.js";
// import crypto from "crypto";
// // Example: Razorpay integration
// import Razorpay from "razorpay";

// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY,
//   key_secret: process.env.RAZORPAY_SECRET,
// });

// // ------------------- Create Payment -------------------
// export const createPayment = async (req, res) => {
//   try {
//     const { orderId } = req.body;

//     const order = await Order.findById(orderId);
//     if (!order) return res.status(404).json({ message: "Order not found" });

//     // Create order in Razorpay
//     const options = {
//       amount: order.fare * 100, // amount in paisa
//       currency: "INR",
//       receipt: `order_rcpt_${order._id}`,
//     };

//     const razorOrder = await razorpay.orders.create(options);

//     // Save payment record
//     const payment = await Payment.create({
//       customer: req.user.id,
//       order: order._id,
//       provider: "razorpay",
//       providerOrderId: razorOrder.id,
//       amount: order.fare,
//       status: "created",
//     });

//     res.json({
//       success: true,
//       orderId: order._id,
//       paymentId: payment._id,
//       providerOrderId: razorOrder.id,
//       amount: order.fare,
//       currency: "INR",
//       key: process.env.RAZORPAY_KEY,
//     });
//   } catch (error) {
//     console.error("createPayment:", error);
//     res
//       .status(500)
//       .json({ message: "Error creating payment", error: error.message });
//   }
// };

// // ------------------- Verify Payment -------------------
// export const verifyPayment = async (req, res) => {
//   try {
//     const { paymentId, providerOrderId, signature } = req.body;

//     // Validate Razorpay signature
//     const generatedSignature = crypto
//       .createHmac("sha256", process.env.RAZORPAY_SECRET)
//       .update(providerOrderId + "|" + paymentId)
//       .digest("hex");

//     if (generatedSignature !== signature) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Invalid signature" });
//     }

//     // Update payment status
//     const payment = await Payment.findOneAndUpdate(
//       { providerOrderId },
//       { status: "paid", providerPaymentId: paymentId },
//       { new: true }
//     );

//     if (!payment) {
//       return res.status(404).json({ message: "Payment record not found" });
//     }

//     // Mark order as paid
//     await Order.findByIdAndUpdate(payment.order, { paymentStatus: "paid" });

//     res.json({ success: true, message: "Payment verified", payment });
//   } catch (error) {
//     console.error("verifyPayment:", error);
//     res
//       .status(500)
//       .json({ message: "Payment verification failed", error: error.message });
//   }
// };

// // ------------------- Get My Payments -------------------
// export const getMyPayments = async (req, res) => {
//   try {
//     const payments = await Payment.find({ customer: req.user.id })
//       .populate("order") // order details bhi chahiye toh
//       .sort({ createdAt: -1 });

//     res.json({ success: true, payments });
//   } catch (error) {
//     console.error("getMyPayments:", error);
//     res
//       .status(500)
//       .json({ message: "Error fetching payments", error: error.message });
//   }
// };
