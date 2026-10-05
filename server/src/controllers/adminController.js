import Order from "../models/Order.js";
import Driver from "../models/Driver.js";
import User from "../models/User.js";
import Coupon from "../models/Coupon.js";
import FareConfig from "../models/FareConfig.js";
import mongoose from "mongoose"; // ✅ ADD THIS IMPORT

// ---------------- Dashboard ----------------
export const getDashboard = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const activeOrders = await Order.countDocuments({
      status: { $ne: "delivered" },
    });
    const drivers = await Driver.countDocuments();
    const customers = await User.countDocuments({ role: "customer" });

    res.json({
      totalOrders,
      activeOrders,
      totalDrivers: drivers,
      totalCustomers: customers,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching dashboard", error: error.message });
  }
};

// ---------------- Orders ----------------
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate(
      "customer assignedDriver",
      "name email"
    );
    res.json(orders);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching orders", error: error.message });
  }
};

export const assignDriver = async (req, res) => {
  try {
    const { driverId } = req.body;
    const io = req.app.get("io");

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { assignedDriver: driverId, status: "assigned" },
      { new: true }
    ).populate("customer assignedDriver", "name email phone");

    if (!order) return res.status(404).json({ message: "Order not found" });

    // Notify driver
    io.to(driverId).emit("new-assignment", order);

    // Notify customer
    io.to(order.customer._id.toString()).emit("driver-assigned", order);

    res.json({ success: true, message: "Driver assigned", order });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error assigning driver", error: error.message });
  }
};

export const cancelOrderByAdmin = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: "cancelled" },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json({ success: true, message: "Order cancelled", order });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error cancelling order", error: error.message });
  }
};

// ---------------- Drivers ----------------
export const getDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find().populate("user", "name email role");
    res.json(drivers);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching drivers", error: error.message });
  }
};

// ✅ NEW: Pending KYC requests
export const getPendingKycDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find({ kycStatus: "PENDING" }).populate(
      "user",
      "name email role"
    );
    res.json(drivers);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching pending KYC drivers",
      error: error.message,
    });
  }
};

// Approve driver KYC
export const approveDriver = async (req, res) => {
  try {
    const io = req.app.get("io");

    const driver = await Driver.findByIdAndUpdate(
      req.params.id,
      { kycStatus: "APPROVED", availability: true },
      { new: true }
    ).populate("user", "name email");

    if (!driver) return res.status(404).json({ message: "Driver not found" });

    // Notify driver of approval
    io.to(driver._id.toString()).emit("kyc-approved", driver);

    res.json({ success: true, message: "Driver approved", driver });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error approving driver", error: error.message });
  }
};

// Reject driver KYC
export const rejectDriver = async (req, res) => {
  try {
    const driver = await Driver.findByIdAndUpdate(
      req.params.id,
      { kycStatus: "REJECTED", kycDocs: [] },
      { new: true }
    );
    if (!driver) return res.status(404).json({ message: "Driver not found" });
    res.json({ success: true, message: "Driver KYC rejected", driver });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error rejecting driver", error: error.message });
  }
};

// Block/unblock driver
export const blockDriver = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || user.role !== "driver")
      return res.status(404).json({ message: "Driver not found" });

    user.isBlocked = !user.isBlocked;
    await user.save();
    res.json({
      success: true,
      message: `Driver ${user.isBlocked ? "blocked" : "unblocked"}`,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error blocking driver", error: error.message });
  }
};

// ---------------- Customers ----------------
export const getAllCustomers = async (req, res) => {
  try {
    const customers = await User.find({ role: "customer" });
    res.json(customers);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching customers", error: error.message });
  }
};

export const suspendCustomer = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || user.role !== "customer")
      return res.status(404).json({ message: "Customer not found" });

    user.isBlocked = !user.isBlocked;
    await user.save();
    res.json({
      success: true,
      message: `Customer ${user.isBlocked ? "suspended" : "activated"}`,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating customer", error: error.message });
  }
};

// ---------------- Coupons ----------------
export const createCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.json({ success: true, coupon });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating coupon", error: error.message });
  }
};

export const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find();
    res.json(coupons);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching coupons", error: error.message });
  }
};

export const updateCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json({ success: true, coupon });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating coupon", error: error.message });
  }
};

export const deleteCoupon = async (req, res) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Coupon deleted" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting coupon", error: error.message });
  }
};

// ---------------- Fare Config ----------------
export const getFareConfig = async (req, res) => {
  try {
    const config = await FareConfig.findOne();
    res.json(config);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching fare config", error: error.message });
  }
};

export const updateFareConfig = async (req, res) => {
  try {
    let config = await FareConfig.findOne();
    if (!config) config = await FareConfig.create(req.body);
    else {
      Object.assign(config, req.body);
      await config.save();
    }
    res.json({ success: true, config });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating fare config", error: error.message });
  }
};

// ---------------- Fare Calculation ----------------
export const calculateFareWithConfig = async (
  distance,
  weight,
  deliveryType
) => {
  const config = (await FareConfig.findOne()) || {};
  let total =
    (config.baseFare || 50) +
    distance * (config.perKmRate || 8) +
    weight * (config.perKgRate || 10);

  if (deliveryType === "instant") total += config.instantDeliveryFee || 50;
  if (deliveryType === "same-day") total += config.sameDayDeliveryFee || 30;

  total = total * (config.peakHourMultiplier || 1.0);
  return Math.round(total);
};

// ------------------- Get Single Order for Admin -------------------
// ------------------- Get Single Order for Admin -------------------
// ------------------- Get Single Order for Admin -------------------
export const getOrderDetails = async (req, res) => {
  try {
    const { orderId } = req.params;

    console.log("🔍 Admin fetching order details for:", orderId);
    console.log("👤 Admin user:", req.user);

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      console.log("❌ Invalid ObjectId:", orderId);
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    console.log("✅ Valid ObjectId, searching in database...");

    const order = await Order.findById(orderId)
      .populate("customer", "name email phone")
      .populate("assignedDriver", "name email phone vehicleType");

    console.log("📦 Order found:", order ? "Yes" : "No");
    console.log("📊 Order details:", order);

    if (!order) {
      console.log("❌ Order not found in database");
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    console.log("✅ Sending order data to admin");

    res.json({
      success: true,
      order: {
        _id: order._id,
        orderId: order.orderId || `ORD-${order._id.toString().slice(-6)}`,
        status: order.status,
        pickupAddress: order.pickupAddress,
        dropAddress: order.dropAddress,
        packageWeight: order.packageWeight,
        deliveryType: order.deliveryType,
        fare: order.fare,
        customer: order.customer,
        assignedDriver: order.assignedDriver,
        // Timestamps
        createdAt: order.createdAt,
        acceptedAt: order.acceptedAt,
        arrivedAt: order.arrivedAt,
        pickedUpAt: order.pickedUpAt,
        onTheWayAt: order.onTheWayAt,
        deliveredAt: order.deliveredAt,
        // Additional info
        paymentStatus: order.paymentStatus,
        proofPhoto: order.proofPhoto,
        cancelledBy: order.cancelledBy,
        cancellationReason: order.cancellationReason,
      },
    });
  } catch (error) {
    console.error("❌ Error in getOrderDetails:", error);
    console.error("❌ Error stack:", error.stack);
    res.status(500).json({
      success: false,
      message: "Error fetching order details",
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

// ------------------- Assign Driver to Order -------------------
// ------------------- Assign Driver to Order -------------------
export const assignDriverToOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { driverId } = req.body;

    console.log("🚗 Admin assigning driver:", { orderId, driverId });

    if (
      !mongoose.Types.ObjectId.isValid(orderId) ||
      !mongoose.Types.ObjectId.isValid(driverId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID or driver ID",
      });
    }

    const order = await Order.findById(orderId);
    const driver = await Driver.findOne({ user: driverId }).populate("user");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: "Driver not found",
      });
    }

    if (driver.kycStatus !== "APPROVED") {
      return res.status(400).json({
        success: false,
        message: "Driver KYC is not approved",
      });
    }

    // ✅ Update order status to "assigned" (not "accepted")
    order.assignedDriver = driver.user._id;
    order.status = "assigned"; // Driver hasn't accepted yet
    order.assignedAt = new Date();
    await order.save();

    // Populate for response
    await order.populate("customer assignedDriver", "name email phone");

    const io = req.app.get("io");

    // ✅ Notify driver about new assignment (they need to accept)
    io.to(driver.user._id.toString()).emit("order-assigned", {
      order: order,
      message: "New order assigned to you - Please accept or reject",
      requiresAcceptance: true,
    });

    // ✅ Notify customer that driver is assigned (but not accepted yet)
    io.to(order.customer._id.toString()).emit("driver-assigned", {
      order: order,
      driver: {
        name: driver.user.name,
        phone: driver.user.phone,
      },
      status: "assigned", // Make it clear driver hasn't accepted yet
    });

    // Notify admin room
    io.to("admin").emit("order-updated", {
      order: order,
      action: "driver_assigned",
      driver: driver.user.name,
      status: "assigned",
    });

    console.log("✅ Driver assigned successfully (pending acceptance)");

    res.json({
      success: true,
      message: "Driver assigned successfully - Waiting for driver acceptance",
      order: order,
    });
  } catch (error) {
    console.error("❌ Error assigning driver:", error);
    res.status(500).json({
      success: false,
      message: "Error assigning driver",
      error: error.message,
    });
  }
};

// ------------------- Cancel Order (Admin) -------------------
export const cancelOrderAdmin = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { reason } = req.body;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    const order = await Order.findById(orderId).populate(
      "customer assignedDriver",
      "name email phone"
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.status === "delivered") {
      return res.status(400).json({
        success: false,
        message: "Cannot cancel delivered order",
      });
    }

    // Update order
    order.status = "cancelled";
    order.cancelledBy = "admin";
    order.cancellationReason = reason;
    await order.save();

    const io = req.app.get("io");

    // Notify customer
    if (order.customer) {
      io.to(order.customer._id.toString()).emit("order-cancelled", {
        order: order,
        cancelledBy: "admin",
        reason: reason,
      });
    }

    // Notify driver if assigned
    if (order.assignedDriver) {
      io.to(order.assignedDriver._id.toString()).emit("order-cancelled", {
        order: order,
        cancelledBy: "admin",
        reason: reason,
      });
    }

    // Notify admin room
    io.to("admin").emit("order-cancelled", {
      order: order,
      cancelledBy: "admin",
      reason: reason,
    });

    res.json({
      success: true,
      message: "Order cancelled successfully",
      order: order,
    });
  } catch (error) {
    console.error("❌ Error cancelling order:", error);
    res.status(500).json({
      success: false,
      message: "Error cancelling order",
      error: error.message,
    });
  }
};
