// backend/socket.js
import { Server } from "socket.io";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    // 🔹 Drivers join their private room
    socket.on("join-driver", (driverId) => {
      socket.join(driverId);
      console.log(`Driver ${driverId} joined their room`);
    });

    // 🔹 Admin assigns an order to driver
    socket.on("assign-order", ({ orderId, driverId }) => {
      console.log(`Admin assigned order ${orderId} to driver ${driverId}`);
      io.to(driverId).emit("new-order-assigned", { orderId });
    });

    // 🔹 Broadcast order status updates to all clients
    socket.on("order-status-update", (data) => {
      io.emit("order-status", data);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });

  return io;
};

export const getIo = () => io;
