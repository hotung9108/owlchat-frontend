import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { chatWebSocketClient } from "@/lib/websocket";

interface WebSocketContextProps {
  sendMessage: (destination: string, body: any) => void;
  subscribeToTopic: (destination: string, callback: (message: any) => void) => any;
  isConnected: boolean;
}

const WebSocketContext = createContext<WebSocketContextProps | null>(null);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    chatWebSocketClient.connect(
      () => {
        console.log("WebSocket connected!");
        setIsConnected(true);
      },
      (error) => {
        console.error("WebSocket connection error:", error);
        setIsConnected(false);
      }
    );

    return () => {
      chatWebSocketClient.disconnect();
      setIsConnected(false);
    };
  }, []);

  const sendMessage = useCallback((destination: string, body: any) => {
    chatWebSocketClient.send(destination, body);
  }, []);

  const subscribeToTopic = useCallback((destination: string, callback: (message: any) => void) => {
    return chatWebSocketClient.subscribe(destination, callback);
  }, []);

  return (
    <WebSocketContext.Provider value={{ sendMessage, subscribeToTopic, isConnected }}>
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