// sockets/driverSocket.js
export default function driverSocket(io) {
  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    // Driver joins personal room
    socket.on("join-driver-room", (driverId) => {
      socket.join(driverId);
      console.log(`Driver ${driverId} joined room`);
    });

    // Admin joins global admin room
    socket.on("join-admin-room", () => {
      socket.join("admin");
      console.log("Admin joined admin room");
    });

    // Customer joins personal room
    socket.on("join-customer-room", (customerId) => {
      socket.join(customerId);
      console.log(`Customer ${customerId} joined room`);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });
}
