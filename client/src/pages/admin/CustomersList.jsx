import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";

const CustomersList = () => {
  const { user } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "https://pick4u-yyco.onrender.com/api/admin/customers",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCustomers(response.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSuspendCustomer = async (customer) => {
    const action = customer.isBlocked ? "activate" : "suspend";
    const confirmMessage = `Are you sure you want to ${action} ${customer.name}?`;

    if (!window.confirm(confirmMessage)) return;

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `https://pick4u-yyco.onrender.com/api/admin/customers/${customer._id}/suspend`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert(`Customer ${action}ed successfully!`);
      fetchCustomers(); // Refresh customers list
    } catch (error) {
      alert(
        `Error ${action}ing customer: ` +
          (error.response?.data?.message || "Something went wrong")
      );
    }
  };

  const handleViewDetails = (customer) => {
    // Navigate to customer details page
    alert(`View details for customer ${customer.name}`);
  };

  const filteredCustomers = customers.filter((customer) => {
    if (filter === "all") return true;
    if (filter === "active") return !customer.isBlocked;
    if (filter === "suspended") return customer.isBlocked;
    return true;
  });

  const getFilterCount = (filterType) => {
    switch (filterType) {
      case "active":
        return customers.filter((c) => !c.isBlocked).length;
      case "suspended":
        return customers.filter((c) => c.isBlocked).length;
      default:
        return customers.length;
    }
  };

  const getTotalOrders = (customer) => {
    // This would typically come from API
    return Math.floor(Math.random() * 20); // Mock data
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              Customers Management
            </h1>
            <p className="text-gray-600">
              Manage customer accounts and monitor activity
            </p>
          </div>

          {/* Stats and Filters */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {filteredCustomers.length}{" "}
                  {filter === "all" ? "Total" : filter} Customers
                </h3>
                <p className="text-gray-600">
                  Manage customer accounts and monitor activities
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilter("all")}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    filter === "all"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  All ({getFilterCount("all")})
                </button>
                <button
                  onClick={() => setFilter("active")}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    filter === "active"
                      ? "bg-green-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Active ({getFilterCount("active")})
                </button>
                <button
                  onClick={() => setFilter("suspended")}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    filter === "suspended"
                      ? "bg-red-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Suspended ({getFilterCount("suspended")})
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">
                  {customers.length}
                </p>
                <p className="text-sm text-blue-700">Total Customers</p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">
                  {getFilterCount("active")}
                </p>
                <p className="text-sm text-green-700">Active</p>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <p className="text-2xl font-bold text-red-600">
                  {getFilterCount("suspended")}
                </p>
                <p className="text-sm text-red-700">Suspended</p>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <p className="text-2xl font-bold text-purple-600">
                  {customers.reduce(
                    (total, customer) => total + getTotalOrders(customer),
                    0
                  )}
                </p>
                <p className="text-sm text-purple-700">Total Orders</p>
              </div>
            </div>
          </div>

          {/* Customers Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Orders
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Member Since
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCustomers.map((customer) => (
                    <tr key={customer._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-semibold">
                              {customer.name?.charAt(0)}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {customer.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {customer._id?.slice(-6)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {customer.email}
                        </div>
                        <div className="text-sm text-gray-500">
                          {customer.phone}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {getTotalOrders(customer)} orders
                        </div>
                        <div className="text-sm text-gray-500">
                          Last order: {new Date().toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(customer.createdAt).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          {Math.floor(
                            (new Date() - new Date(customer.createdAt)) /
                              (1000 * 60 * 60 * 24)
                          )}{" "}
                          days
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            customer.isBlocked
                              ? "bg-red-100 text-red-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {customer.isBlocked ? "Suspended" : "Active"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleViewDetails(customer)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleSuspendCustomer(customer)}
                            className={
                              customer.isBlocked
                                ? "text-green-600 hover:text-green-900"
                                : "text-red-600 hover:text-red-900"
                            }
                          >
                            {customer.isBlocked ? "Activate" : "Suspend"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredCustomers.length === 0 && (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">👥</div>
                <p className="text-gray-500">No customers found</p>
              </div>
            )}
          </div>

          {/* Customer Management Info */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h4 className="font-semibold text-blue-800 mb-3">
                Customer Support Guidelines
              </h4>
              <ul className="text-blue-700 space-y-2 text-sm">
                <li>• Respond to customer queries within 24 hours</li>
                <li>• Monitor customer feedback and ratings</li>
                <li>• Address delivery issues promptly</li>
                <li>• Provide order status updates</li>
                <li>• Handle refunds and cancellations fairly</li>
              </ul>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h4 className="font-semibold text-green-800 mb-3">
                Customer Retention Tips
              </h4>
              <ul className="text-green-700 space-y-2 text-sm">
                <li>• Offer loyalty rewards and discounts</li>
                <li>• Send personalized recommendations</li>
                <li>• Provide excellent customer service</li>
                <li>• Gather and act on feedback</li>
                <li>• Create referral programs</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CustomersList;
