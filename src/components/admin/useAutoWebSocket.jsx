import { useEffect, useRef } from "react";

const useAutoWebSocket = (url, onMessage) => {
  const socketRef = useRef(null);
  const reconnectRef = useRef(null);

  const connect = () => {
    const socket = new WebSocket(url);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("WS connected");
      if (reconnectRef.current) {
        clearTimeout(reconnectRef.current);
        reconnectRef.current = null;
      }
    };

    socket.onmessage = (event) => {
      if (onMessage) onMessage(event);
    };

    socket.onclose = () => {
      console.log("WS closed, reconnect in 2s...");
      reconnectRef.current = setTimeout(connect, 2000); // tự reconnect sau 2s
    };

    socket.onerror = (err) => {
      console.error("WS error", err);
      socket.close(); // trigger onclose để reconnect
    };
  };

  useEffect(() => {
    connect();
    return () => {
      if (socketRef.current) socketRef.current.close();
      if (reconnectRef.current) clearTimeout(reconnectRef.current);
    };
  }, [url]);

  return socketRef;
};

export default useAutoWebSocket;
