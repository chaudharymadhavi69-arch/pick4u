import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const newSocket = io("http://localhost:5000", {
        auth: {
          token: localStorage.getItem("token"),
        },
      });

      setSocket(newSocket);

      // Join role-based room
      if (user.role === "customer") {
        newSocket.emit("join-customer-room", user._id);
      } else if (user.role === "driver") {
        newSocket.emit("join-driver-room", user._id);
      } else if (user.role === "admin") {
        newSocket.emit("join-admin-room");
      }

      return () => {
        newSocket.disconnect();
      };
    } else {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
    }
  }, [user]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
