import Order from "../models/Order.js";
import Driver from "../models/Driver.js";
import mongoose from "mongoose";

// ------------------- Get Order Status for Customer -------------------
export const getOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    const order = await Order.findById(orderId)
      .populate("customer", "name phone email")
      .populate("assignedDriver", "name phone vehicleType");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Check if customer owns this order
    if (order.customer._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    // Define status steps with timestamps
    const statusSteps = [
      {
        step: 1,
        status: "placed",
        title: "Order Placed",
        description: "Your order has been placed",
        completed: true,
        timestamp: order.createdAt,
        icon: "📦",
      },
      {
        step: 2,
        status: "assigned",
        title: "Driver Assigned",
        description: "Driver is assigned to your order",
        completed: !!order.assignedDriver,
        timestamp: order.assignedAt,
        icon: "👨‍💼",
      },
      {
        step: 3,
        status: "accepted",
        title: "Order Accepted",
        description: "Driver has accepted your order",
        completed:
          order.status === "accepted" ||
          order.status === "arrived" ||
          order.status === "picked-up" ||
          order.status === "on-the-way" ||
          order.status === "delivered",
        timestamp: order.acceptedAt,
        icon: "✅",
      },
      {
        step: 4,
        status: "arrived",
        title: "Arrived at Pickup",
        description: "Driver arrived at pickup location",
        completed:
          order.status === "arrived" ||
          order.status === "picked-up" ||
          order.status === "on-the-way" ||
          order.status === "delivered",
        timestamp: order.arrivedAt,
        icon: "📍",
      },
      {
        step: 5,
        status: "picked-up",
        title: "Package Picked",
        description: "Driver picked up your package",
        completed:
          order.status === "picked-up" ||
          order.status === "on-the-way" ||
          order.status === "delivered",
        timestamp: order.pickedUpAt,
        icon: "📬",
      },
      {
        step: 6,
        status: "on-the-way",
        title: "On the Way",
        description: "Driver is on the way to delivery",
        completed:
          order.status === "on-the-way" || order.status === "delivered",
        timestamp: order.onTheWayAt,
        icon: "🚗",
      },
      {
        step: 7,
        status: "delivered",
        title: "Delivered",
        description: "Package delivered successfully",
        completed: order.status === "delivered",
        timestamp: order.deliveredAt,
        icon: "🎉",
      },
    ];

    // Find current active step
    const currentStep =
      statusSteps.find(
        (step) =>
          step.status === order.status ||
          (!step.completed && step.status === "delivered")
      ) || statusSteps[0];

    res.json({
      success: true,
      order: {
        _id: order._id,
        orderId: order.orderId,
        status: order.status,
        currentStep: currentStep.step,
        pickupAddress: order.pickupAddress,
        deliveryAddress: order.deliveryAddress,
        fare: order.fare,
        estimatedTime: order.estimatedTime,
        customer: order.customer,
        assignedDriver: order.assignedDriver,
        proofPhoto: order.proofPhoto,
      },
      statusSteps,
      tracking: {
        currentStatus: order.status,
        currentStep: currentStep.step,
        isDelivered: order.status === "delivered",
        estimatedDelivery: order.estimatedDelivery,
        lastUpdated: order.updatedAt,
      },
    });
  } catch (error) {
    console.error("❌ Error fetching order status:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching order status",
      error: error.message,
    });
  }
};

// ------------------- Get Driver's Current Job Status -------------------
export const getDriverCurrentJob = async (req, res) => {
  try {
    const driver = await Driver.findOne({ user: req.user._id });

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: "Driver profile not found",
      });
    }

    // Get current active job
    const currentJob = await Order.findOne({
      assignedDriver: req.user._id,
      status: { $in: ["accepted", "arrived", "picked-up", "on-the-way"] },
    })
      .populate("customer", "name phone email")
      .sort({ acceptedAt: -1 });

    if (!currentJob) {
      return res.json({
        success: true,
        hasActiveJob: false,
        message: "No active job found",
      });
    }

    // Get next available action based on current status
    const nextActions = getNextActions(currentJob.status);

    res.json({
      success: true,
      hasActiveJob: true,
      job: {
        _id: currentJob._id,
        status: currentJob.status,
        pickupAddress: currentJob.pickupAddress,
        deliveryAddress: currentJob.deliveryAddress,
        fare: currentJob.fare,
        customer: currentJob.customer,
        acceptedAt: currentJob.acceptedAt,
        arrivedAt: currentJob.arrivedAt,
        pickedUpAt: currentJob.pickedUpAt,
        onTheWayAt: currentJob.onTheWayAt,
      },
      nextActions,
      tracking: {
        canMarkArrived: currentJob.status === "accepted",
        canMarkPickedUp: currentJob.status === "arrived",
        canMarkOnTheWay: currentJob.status === "picked-up",
        canMarkDelivered: currentJob.status === "on-the-way",
      },
    });
  } catch (error) {
    console.error("❌ Error fetching driver current job:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching current job",
      error: error.message,
    });
  }
};

// Helper function to determine next available actions
const getNextActions = (currentStatus) => {
  const actions = [];

  switch (currentStatus) {
    case "accepted":
      actions.push({
        action: "mark-arrived",
        title: "Mark Arrived at Pickup",
        description: "Notify customer you've reached pickup location",
        endpoint: "/arrived",
        icon: "📍",
      });
      break;

    case "arrived":
      actions.push({
        action: "mark-picked-up",
        title: "Mark Package Picked",
        description: "Confirm you've collected the package",
        endpoint: "/picked-up",
        icon: "📦",
      });
      break;

    case "picked-up":
      actions.push({
        action: "mark-on-the-way",
        title: "Mark On the Way",
        description: "Start delivery to destination",
        endpoint: "/on-the-way",
        icon: "🚗",
      });
      break;

    case "on-the-way":
      actions.push({
        action: "mark-delivered",
        title: "Mark Delivered",
        description: "Complete the delivery",
        endpoint: "/delivered",
        icon: "🎉",
      });
      actions.push({
        action: "upload-proof",
        title: "Upload Proof",
        description: "Add delivery confirmation photo",
        endpoint: "/proof",
        icon: "📸",
      });
      break;
  }

  return actions;
};

// ------------------- Update Order Model with Timestamps -------------------
// Add these fields to your Order model if not already present:
/*
arrivedAt: { type: Date },
pickedUpAt: { type: Date },
onTheWayAt: { type: Date },
acceptedAt: { type: Date },
assignedAt: { type: Date },
estimatedDelivery: { type: Date },
*/
