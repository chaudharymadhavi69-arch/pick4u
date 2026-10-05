import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import OrderCard from "../../components/customer/OrderCard";
import axios from "axios";
import {
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  Filter,
  Plus,
  Search,
} from "lucide-react";

const OrderHistory = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "https://pick4u-yyco.onrender.com/api/customer/orders",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesFilter = filter === "all" || order.status === filter;
    const matchesSearch =
      searchTerm === "" ||
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.pickupAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.dropAddress.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusCount = (status) => {
    return orders.filter((order) => order.status === status).length;
  };

  const filterOptions = [
    {
      id: "all",
      label: "All Orders",
      icon: Package,
      color: "#0500FF",
      bgColor: "#0500FF",
      count: orders.length,
    },
    {
      id: "pending",
      label: "Pending",
      icon: Clock,
      color: "#FF7000",
      bgColor: "#FF7000",
      count: getStatusCount("pending"),
    },
    {
      id: "accepted",
      label: "Accepted",
      icon: Truck,
      color: "#18CFFF",
      bgColor: "#18CFFF",
      count: getStatusCount("accepted"),
    },
    {
      id: "delivered",
      label: "Delivered",
      icon: CheckCircle,
      color: "#00C853",
      bgColor: "#00C853",
      count: getStatusCount("delivered"),
    },
    {
      id: "cancelled",
      label: "Cancelled",
      icon: XCircle,
      color: "#FF0420",
      bgColor: "#FF0420",
      count: getStatusCount("cancelled"),
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="relative w-20 h-20 mx-auto mb-6">
              <div className="absolute inset-0 border-4 border-[#E3E3E3] rounded-full"></div>
              <div className="absolute inset-0 border-4 border-[#0500FF] rounded-full border-t-transparent animate-spin"></div>
            </div>
            <p className="text-[#929292] font-semibold">
              Loading your orders...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Header with Gradient */}
      <div className="relative bg-gradient-to-br from-[#0500FF] to-black text-white py-16 px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-40 h-40 bg-[#18CFFF] rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-32 h-32 bg-[#FF7000] rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6" />
                </div>
                <h1 className="text-4xl font-bold">My Orders</h1>
              </div>
              <p className="text-white/80 text-lg">
                Track and manage all your deliveries
              </p>
            </div>
            <a
              href="/customer/new-order"
              className="hidden md:flex items-center gap-2 bg-white text-[#0500FF] px-6 py-3 rounded-xl font-bold hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              <Plus className="w-5 h-5" />
              New Order
            </a>
          </div>
        </div>
      </div>

      <main className="flex-1 py-8 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8 -mt-16 relative z-10">
            {filterOptions.map((option) => {
              const Icon = option.icon;
              const isActive = filter === option.id;
              return (
                <button
                  key={option.id}
                  onClick={() => setFilter(option.id)}
                  className={`relative overflow-hidden rounded-2xl p-5 transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-br from-[#0500FF] to-black text-white shadow-2xl scale-105"
                      : "bg-white border-2 border-[#E3E3E3] hover:border-[#0500FF]"
                  }`}
                >
                  {isActive && (
                    <div className="absolute inset-0 opacity-20">
                      <div className="absolute top-0 right-0 w-20 h-20 bg-[#18CFFF] rounded-full blur-2xl"></div>
                    </div>
                  )}
                  <div className="relative">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${
                        isActive ? "bg-white/20" : ""
                      }`}
                      style={{
                        backgroundColor: isActive
                          ? "rgba(255,255,255,0.2)"
                          : `${option.color}15`,
                      }}
                    >
                      <Icon
                        className="w-5 h-5"
                        style={{ color: isActive ? "white" : option.color }}
                      />
                    </div>
                    <div className="text-left">
                      <p
                        className={`text-2xl font-bold mb-1 ${
                          isActive ? "text-white" : "text-black"
                        }`}
                      >
                        {option.count}
                      </p>
                      <p
                        className={`text-xs font-semibold ${
                          isActive ? "text-white/80" : "text-[#929292]"
                        }`}
                      >
                        {option.label}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Search Bar */}
          <div className="bg-white border-2 border-[#E3E3E3] rounded-2xl p-4 mb-6 hover:border-[#0500FF] transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gradient-to-br from-[#0500FF] to-[#18CFFF] rounded-lg flex items-center justify-center">
                  <Search className="w-5 h-5 text-white" />
                </div>
              </div>
              <input
                type="text"
                placeholder="Search by order ID, pickup or delivery address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-4 py-2 text-black font-medium focus:outline-none placeholder-[#929292]"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="px-4 py-2 text-[#929292] hover:text-[#FF0420] font-semibold transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Orders List */}
          <div>
            {filteredOrders.length > 0 ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-[#929292] font-semibold">
                    Showing {filteredOrders.length}{" "}
                    {filteredOrders.length === 1 ? "order" : "orders"}
                  </p>
                </div>
                <div className="space-y-4">
                  {filteredOrders.map((order) => (
                    <OrderCard key={order._id} order={order} />
                  ))}
                </div>
              </>
            ) : (
              <div className="bg-gradient-to-br from-[#E3E3E3]/30 to-white border-2 border-[#E3E3E3] rounded-2xl p-16 text-center">
                <div className="max-w-md mx-auto">
                  {/* Empty State Icon */}
                  <div className="relative w-32 h-32 mx-auto mb-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#0500FF]/10 to-[#18CFFF]/10 rounded-full"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Package className="w-16 h-16 text-[#929292]" />
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-black mb-3">
                    {searchTerm ? "No matching orders" : "No orders found"}
                  </h3>
                  <p className="text-[#929292] mb-8 leading-relaxed">
                    {searchTerm
                      ? `We couldn't find any orders matching "${searchTerm}". Try adjusting your search.`
                      : filter === "all"
                      ? "You haven't placed any orders yet. Start by creating your first delivery order."
                      : `No ${filter} orders found. Try selecting a different filter.`}
                  </p>

                  {filter === "all" && !searchTerm && (
                    <a
                      href="/customer/new-order"
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-[#0500FF] to-black text-white px-8 py-4 rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 font-bold"
                    >
                      <Plus className="w-5 h-5" />
                      Create Your First Order
                    </a>
                  )}

                  {(filter !== "all" || searchTerm) && (
                    <button
                      onClick={() => {
                        setFilter("all");
                        setSearchTerm("");
                      }}
                      className="inline-flex items-center gap-2 bg-white border-2 border-[#0500FF] text-[#0500FF] px-8 py-4 rounded-xl hover:bg-[#0500FF] hover:text-white transition-all duration-300 font-bold"
                    >
                      <Filter className="w-5 h-5" />
                      Show All Orders
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Mobile New Order Button */}
          <div className="md:hidden fixed bottom-6 right-6 z-50">
            <a
              href="/customer/new-order"
              className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-[#0500FF] to-black text-white rounded-full shadow-2xl hover:scale-110 transition-all duration-300"
            >
              <Plus className="w-6 h-6" />
            </a>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrderHistory;
