import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Server } from "socket.io";
import connectDB from "./config/db.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import customerRoutes from "./routes/customer.js";
import driverRoutes from "./routes/driverRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
// import coreRoutes from "./routes/coreRoutes.js";

// Sockets
import driverSocket from "./sockets/driverSocket.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Connect MongoDB
connectDB();

// ✅ Test Route
app.get("/", (req, res) => {
  res.send("🚀 Pick4U Backend Server is running...");
});

// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api/customer", customerRoutes);
app.use("/api/driver", driverRoutes);
app.use("/api/admin", adminRoutes);
// app.use("/api/core", coreRoutes);

// ✅ Start Server + Attach Socket.IO
const server = app.listen(PORT, () => {
  console.log(`✅ Server started on http://localhost:${PORT}`);
});

const io = new Server(server, {
  cors: { origin: "*" },
});

// ✅ Save io in app instance (so controllers can use req.app.get("io"))
app.set("io", io);

// ✅ Initialize driver sockets
driverSocket(io);
