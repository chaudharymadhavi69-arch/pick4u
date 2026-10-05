export default function orderSocket(io) {
  io.on("connection", (socket) => {
    console.log("⚡ New client connected:", socket.id);

    // Join user/driver room
    socket.on("joinRoom", (roomId) => {
      socket.join(roomId);
      console.log(`✅ ${socket.id} joined room ${roomId}`);
    });

    // Disconnect
    socket.on("disconnect", () => {
      console.log("❌ Client disconnected:", socket.id);
    });
  });
}
