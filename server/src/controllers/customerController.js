// src/controllers/customerController.js
import Order from "../models/Order.js";
import User from "../models/User.js";
import Driver from "../models/Driver.js";
import Coupon from "../models/Coupon.js";
import { calculateFare } from "../utils/fareCalc.js";

// ---------------- Profile ----------------
export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const user = await User.findById(userId).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const updates = {};
    if (req.body.name) updates.name = req.body.name;
    if (req.body.email) updates.email = req.body.email;
    if (req.body.phone) updates.phone = req.body.phone;

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
    }).select("-password");
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ---------------- Orders ----------------
export const createOrder = async (req, res) => {
  try {
    const { pickupAddress, dropAddress, packageWeight, deliveryType, fare } =
      req.body;

    const newOrder = await Order.create({
      customer: req.user._id,
      pickupAddress,
      dropAddress,
      packageWeight,
      deliveryType,
      fare,
      status: "pending",
    });

    const io = req.app.get("io");

    // Notify all available drivers
    const availableDrivers = await Driver.find({ availability: true });
    availableDrivers.forEach((driver) => {
      io.to(driver._id.toString()).emit("new-order", newOrder);
    });

    // Notify all admins
    io.to("admin").emit("new-order", newOrder);

    // Customer can optionally see "pending"
    io.to(req.user._id.toString()).emit("order-created", newOrder);

    res.status(201).json(newOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user._id })
      .sort({ createdAt: -1 })
      .populate("assignedDriver", "name phone"); // corrected field
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      customer: req.user._id,
    }).populate("assignedDriver", "name phone");

    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      customer: req.user._id,
    });
    if (!order) return res.status(404).json({ error: "Order not found" });

    if (["picked", "in-transit", "delivered"].includes(order.status)) {
      return res.status(400).json({ error: "Cannot cancel this order" });
    }

    order.status = "cancelled";
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ---------------- Fare Estimate ----------------
export const fareEstimate = async (req, res) => {
  try {
    const { pickupAddress, dropAddress, packageWeight, deliveryType } =
      req.body;

    if (!pickupAddress || !dropAddress || !packageWeight) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    let distance = 10; // fallback
    try {
      distance = await getDistanceInKm(pickupAddress, dropAddress);
    } catch (err) {
      console.warn("Google Maps API failed, fallback to 10km");
    }

    const weightNum = parseFloat(packageWeight);
    const fare = calculateFare(distance, weightNum, deliveryType);

    res.json({ success: true, fare, distance, deliveryType });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error calculating fare", error: err.message });
  }
};

// ---------------- Coupons ----------------
export const applyCoupon = async (req, res) => {
  try {
    const { couponCode, fare } = req.body;

    const coupon = await Coupon.findOne({ code: couponCode, isActive: true });
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found or expired" });
    }

    if (coupon.expiry && coupon.expiry < new Date()) {
      return res.status(400).json({ message: "Coupon expired" });
    }

    let discount = 0;
    if (coupon.type === "percentage") discount = (fare * coupon.value) / 100;
    else if (coupon.type === "fixed") discount = coupon.value;

    const finalFare = Math.max(fare - discount, 0);

    res.json({ success: true, coupon: coupon.code, discount, finalFare });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error applying coupon", error: err.message });
  }
};

export const removeCoupon = async (req, res) => {
  try {
    const { fare } = req.body;
    res.json({ success: true, message: "Coupon removed", finalFare: fare });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error removing coupon", error: err.message });
  }
};

// export const fareEstimate = async (req, res) => {
//   try {
//     const { pickupAddress, dropAddress, packageWeight, deliveryType } = req.body;

//     if (!pickupAddress || !dropAddress || !packageWeight) {
//       return res.status(400).json({ message: "Missing required fields" });
//     }

//     // Get real distance using Google Maps API
//     let distance = await getDistanceInKm(pickupAddress, dropAddress);

//     const weightNum = parseFloat(packageWeight);
//     const fare = calculateFare(distance, weightNum, deliveryType);

//     res.json({
//       success: true,
//       fare,
//       distance: distance.toFixed(2),
//       deliveryType,
//       breakdown: {
//         baseFare: 50,
//         distanceCharge: distance * 8,
//         weightCharge: Math.max(0, (weightNum - 5) * 10),
//         deliverySurcharge: getDeliverySurcharge(deliveryType)
//       }
//     });
//   } catch (err) {
//     console.error("Fare calculation error:", err);
//     res.status(500).json({
//       message: "Error calculating fare",
//       error: err.message
//     });
//   }
// };

// // Real distance calculation using Google Maps API
// const getDistanceInKm = async (origin, destination) => {
//   try {
//     const apiKey = process.env.GOOGLE_MAPS_API_KEY;

//     const response = await axios.get('https://maps.googleapis.com/maps/api/distancematrix/json', {
//       params: {
//         origins: origin,
//         destinations: destination,
//         key: apiKey,
//         units: 'metric'
//       }
//     });

//     if (response.data.status === 'OK') {
//       const element = response.data.rows[0].elements[0];

//       if (element.status === 'OK') {
//         // Convert meters to kilometers
//         const distanceInKm = element.distance.value / 1000;
//         return distanceInKm;
//       } else {
//         throw new Error(`Google Maps API error: ${element.status}`);
//       }
//     } else {
//       throw new Error(`Google Maps API error: ${response.data.status}`);
//     }
//   } catch (error) {
//     console.error('Google Maps API Error:', error);
//     throw new Error('Failed to calculate distance between locations');
//   }
// };

// // Enhanced fare calculation
// const calculateFare = (distance, weight, deliveryType) => {
//   const BASE_FARE = 50;
//   const PER_KM_RATE = 8;
//   const WEIGHT_SURCHARGE_RATE = 10; // ₹10 per kg above 5kg

//   // Calculate base charges
//   let totalFare = BASE_FARE + (distance * PER_KM_RATE);

//   // Weight surcharge (free for first 5kg)
//   if (weight > 5) {
//     totalFare += (weight - 5) * WEIGHT_SURCHARGE_RATE;
//   }

//   // Delivery type multiplier
//   const deliveryMultipliers = {
//     'standard': 1.0,
//     'express': 1.5,
//     'same-day': 2.0
//   };

//   totalFare *= deliveryMultipliers[deliveryType] || 1.0;

//   return Math.round(totalFare);
// };

// // Get delivery type surcharge
// const getDeliverySurcharge = (deliveryType) => {
//   const surcharges = {
//     'standard': 0,
//     'express': 100,
//     'same-day': 200
//   };
//   return surcharges[deliveryType] || 0;
// };
