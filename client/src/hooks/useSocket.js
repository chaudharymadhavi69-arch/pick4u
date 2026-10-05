import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

export default function useSocket(orderId, onLocationUpdate) {
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io("http://localhost:5000"); // backend URL

    socketRef.current.on(`order-${orderId}-location`, (data) => {
      onLocationUpdate(data);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [orderId, onLocationUpdate]);

  return socketRef.current;
}
