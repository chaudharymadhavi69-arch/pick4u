import React, { useEffect, useState } from "react";
import { getAllOrders } from "../../api/adminApi";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const res = await getAllOrders(token);
      setOrders(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Orders</h1>
      <table className="w-full border">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Driver</th>
            <th>Status</th>
            <th>Pickup</th>
            <th>Drop</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td>{order._id}</td>
              <td>{order.customer?.name}</td>
              <td>{order.driver?.name || "Not Assigned"}</td>
              <td>{order.status}</td>
              <td>{order.pickupAddress}</td>
              <td>{order.dropAddress}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
