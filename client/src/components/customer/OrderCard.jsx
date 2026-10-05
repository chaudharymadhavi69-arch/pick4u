import React from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Package, Calendar, ArrowRight } from "lucide-react";

const OrderCard = ({ order }) => {
  const navigate = useNavigate();

  const getStatusConfig = (status) => {
    switch (status) {
      case "pending":
        return {
          color: "#FF7000",
          bgColor: "#FF700015",
          text: "PENDING",
          icon: Clock,
        };
      case "accepted":
        return {
          color: "#18CFFF",
          bgColor: "#18CFFF15",
          text: "ACCEPTED",
          icon: Truck,
        };
      case "picked":
        return {
          color: "#0500FF",
          bgColor: "#0500FF15",
          text: "PICKED UP",
          icon: Package,
        };
      case "delivered":
        return {
          color: "#00C853",
          bgColor: "#00C85315",
          text: "DELIVERED",
          icon: CheckCircle,
        };
      case "cancelled":
        return {
          color: "#FF0420",
          bgColor: "#FF042015",
          text: "CANCELLED",
          icon: XCircle,
        };
      default:
        return {
          color: "#929292",
          bgColor: "#92929215",
          text: "UNKNOWN",
          icon: Package,
        };
    }
  };

  const handleTrackOrder = () => {
    navigate(`/customer/track/${order._id}`);
  };

  const handleViewDetails = () => {
    navigate(`/customer/orders/${order._id}`);
  };

  const statusConfig = getStatusConfig(order.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="bg-white border-2 border-[#E3E3E3] rounded-2xl p-6 mb-4 hover:border-[#0500FF] transition-all duration-300 hover:shadow-lg">
      {/* Header Section */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-xl font-bold text-black mb-2">
            Order #{order._id?.slice(-8).toUpperCase()}
          </h3>
          <div className="flex items-center gap-2 text-[#929292]">
            <Calendar className="w-4 h-4" />
            <span className="text-sm font-medium">
              {new Date(order.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>
        <div
          className="px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2"
          style={{
            backgroundColor: statusConfig.bgColor,
            color: statusConfig.color,
            border: `1px solid ${statusConfig.color}20`,
          }}
        >
          <StatusIcon className="w-4 h-4" />
          {statusConfig.text}
        </div>
      </div>

      {/* Address Section */}
      <div className="mb-6">
        <div className="flex items-start gap-4 mb-4">
          <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-[#0500FF] to-black rounded-lg flex items-center justify-center">
            <MapPin className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-[#929292] font-semibold mb-1">
              Pickup Location
            </p>
            <p className="text-black font-medium leading-relaxed">
              {order.pickupAddress}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-[#00C853] to-[#18CFFF] rounded-lg flex items-center justify-center">
            <MapPin className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-[#929292] font-semibold mb-1">
              Delivery Location
            </p>
            <p className="text-black font-medium leading-relaxed">
              {order.dropAddress}
            </p>
          </div>
        </div>
      </div>

      {/* Order Details & Actions */}
      <div className="flex justify-between items-center pt-4 border-t border-[#E3E3E3]">
        <div className="flex items-center gap-6">
          <div>
            <p className="text-2xl font-bold text-black mb-1">₹{order.fare}</p>
            <div className="flex items-center gap-2 text-[#929292]">
              <Package className="w-4 h-4" />
              <span className="text-sm font-medium">
                {order.packageWeight} kg • {order.deliveryType}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleViewDetails}
            className="flex items-center gap-2 bg-white border-2 border-[#0500FF] text-[#0500FF] px-6 py-3 rounded-xl font-bold hover:bg-[#0500FF] hover:text-white transition-all duration-300"
          >
            View Details
            <ArrowRight className="w-4 h-4" />
          </button>

          {!["delivered", "cancelled"].includes(order.status) && (
            <button
              onClick={handleTrackOrder}
              className="flex items-center gap-2 bg-gradient-to-r from-[#0500FF] to-black text-white px-6 py-3 rounded-xl font-bold hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              Track Order
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar for Active Orders */}
      {!["delivered", "cancelled"].includes(order.status) && (
        <div className="mt-4 pt-4 border-t border-[#E3E3E3]">
          <div className="flex items-center justify-between text-xs text-[#929292] font-semibold mb-2">
            <span>Order Placed</span>
            <span>Picked Up</span>
            <span>On the Way</span>
            <span>Delivered</span>
          </div>
          <div className="w-full bg-[#E3E3E3] rounded-full h-2">
            <div
              className="bg-gradient-to-r from-[#0500FF] to-black h-2 rounded-full transition-all duration-500"
              style={{
                width:
                  order.status === "pending"
                    ? "25%"
                    : order.status === "accepted"
                    ? "50%"
                    : order.status === "picked"
                    ? "75%"
                    : "100%",
              }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

// Import the required icons
const Clock = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
  </svg>
);

const Truck = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
  </svg>
);

const CheckCircle = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
  </svg>
);

const XCircle = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z" />
  </svg>
);

export default OrderCard;
