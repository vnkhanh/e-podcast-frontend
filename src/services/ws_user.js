export const connectUserWebSocket = (token, onMessage) => {
  if (!token) return null;

  const baseUrl =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";
  const cleanBaseUrl = baseUrl.endsWith("/api")
    ? baseUrl.slice(0, -4)
    : baseUrl;
  const wsUrl = cleanBaseUrl.replace("http", "ws");

  const ws = new WebSocket(`${wsUrl}/ws/user?token=${token}`);

  ws.onopen = () => console.log("WebSocket connected");
  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      onMessage(data);
    } catch (err) {
      console.warn("WS parse error:", err);
    }
  };
  ws.onclose = () => console.log("WebSocket closed");
  ws.onerror = (e) => console.log("WS error", e);

  return ws;
};
