import React, { createContext, useContext, useEffect } from "react";
import { chatWebSocketClient } from "@/lib/websocket";

interface WebSocketContextProps {
  sendMessage: (destination: string, body: any) => void;
  subscribeToTopic: (destination: string, callback: (message: any) => void) => void;
}

const WebSocketContext = createContext<WebSocketContextProps | null>(null);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    chatWebSocketClient.connect(
      () => {
        console.log("WebSocket connected!");
      },
      (error) => {
        console.error("WebSocket connection error:", error);
      }
    );

    return () => {
      chatWebSocketClient.disconnect();
    };
  }, []);

  const sendMessage = (destination: string, body: any) => {
    chatWebSocketClient.send(destination, body);
  };

  const subscribeToTopic = (destination: string, callback: (message: any) => void) => {
    chatWebSocketClient.subscribe(destination, callback);
  };

  return (
    <WebSocketContext.Provider value={{ sendMessage, subscribeToTopic }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
};