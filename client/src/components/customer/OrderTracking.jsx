import React from "react";
import { useSocket } from "../../contexts/SocketContext";

const OrderTracking = ({ order }) => {
  const socket = useSocket();

  const statusSteps = [
    {
      status: "pending",
      label: "Order Placed",
      description: "Your order has been placed",
    },
    {
      status: "assigned",
      label: "Driver Assigned",
      description: "Driver is assigned to your order",
    },
    {
      status: "accepted",
      label: "Order Accepted",
      description: "Driver has accepted your order",
    },
    {
      status: "arrived",
      label: "Arrived at Pickup",
      description: "Driver arrived at pickup location",
    },
    {
      status: "picked-up",
      label: "Package Picked",
      description: "Driver picked up your package",
    },
    {
      status: "on-the-way",
      label: "On the Way",
      description: "Driver is on the way to delivery",
    },
    {
      status: "delivered",
      label: "Delivered",
      description: "Package delivered successfully",
    },
  ];

  const currentStepIndex = statusSteps.findIndex(
    (step) => step.status === order.status
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-6 text-gray-800">
        Order Tracking
      </h3>

      <div className="space-y-4">
        {statusSteps.map((step, index) => (
          <div key={step.status} className="flex items-start">
            {/* Step indicator */}
            <div
              className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                index < currentStepIndex
                  ? "bg-green-500 text-white"
                  : index === currentStepIndex
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 text-gray-600"
              }`}
            >
              {index < currentStepIndex ? "✓" : index + 1}
            </div>

            {/* Step content */}
            <div className="ml-4 flex-1">
              <p
                className={`font-medium ${
                  index <= currentStepIndex ? "text-gray-800" : "text-gray-500"
                }`}
              >
                {step.label}
              </p>
              <p className="text-sm text-gray-600">{step.description}</p>

              {/* Connector line */}
              {index < statusSteps.length - 1 && (
                <div
                  className={`h-6 border-l-2 ml-3 mt-2 ${
                    index < currentStepIndex
                      ? "border-green-500"
                      : "border-gray-300"
                  }`}
                ></div>
              )}
            </div>
          </div>
        ))}
      </div>

      {order.assignedDriver && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2">
            Driver Information
          </h4>
          <p className="text-blue-700">Name: {order.assignedDriver.name}</p>
          <p className="text-blue-700">Phone: {order.assignedDriver.phone}</p>
        </div>
      )}
    </div>
  );
};

export default OrderTracking;
