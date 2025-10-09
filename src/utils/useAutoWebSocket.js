import { useEffect, useRef } from "react";

export default function useAutoWebSocket(url, onMessage) {
  const wsRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    function connect() {
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log("WS connected");
      };

      ws.onmessage = (event) => {
        onMessage(event);
      };

      ws.onclose = () => {
        console.log("WS closed, reconnect in 2s...");
        timerRef.current = setTimeout(connect, 2000);
      };

      ws.onerror = (err) => {
        console.error("WS error", err);
        ws.close();
      };
    }

    connect();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (wsRef.current) wsRef.current.close();
    };
  }, [url, onMessage]);
}
