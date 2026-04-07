import { Client } from "@stomp/stompjs";
import { WS_ENDPOINTS } from "@/config/api";

class WebSocketClient {
    private client: Client;
    private isConnected: boolean = false;

    constructor(wsUrl: string) {
        this.client = new Client({
            webSocketFactory: () => {
                const token = localStorage.getItem("accessToken");
                if (!token) {
                    console.error("No access token found in localStorage.");
                    throw new Error("No access token found.");
                }
                // Append the token as a query parameter to the WebSocket URL
                const wsUrlWithToken = `${wsUrl}?token=Bearer%20${encodeURIComponent(token)}`;
                console.log("Connecting to WebSocket URL:", wsUrlWithToken);

                // Use native WebSocket
                const socket = new WebSocket(wsUrlWithToken);
                socket.onopen = () => {
                    console.log("WebSocket connection established.");
                };
                return socket;
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            debug: (msg: string) => console.log(msg),
        });
    }

    connect(onConnect: () => void, onError: (error: any) => void) {
        this.client.onConnect = () => {
            console.log("WebSocket connected!");
            this.isConnected = true;
            onConnect();
        };
        this.client.onStompError = (frame) => {
            console.error("STOMP error:", frame);
            this.isConnected = false;
            onError(frame);
        };
        this.client.onWebSocketClose = (event) => {
            console.warn("WebSocket connection closed:", event);
            this.isConnected = false;
        };
        this.client.activate();
    }

    disconnect() {
        if (this.client.active) {
            this.client.deactivate();
            this.isConnected = false;
        }
    }

    subscribe(destination: string, callback: (message: any) => void) {
        if (this.isConnected) {
            return this.client.subscribe(destination, (message) => {
                callback(JSON.parse(message.body));
            });
        } else {
            console.error("WebSocket is not connected.");
        }
    }

    send(destination: string, body: any) {
        if (this.isConnected) {
            this.client.publish({
                destination,
                body: JSON.stringify(body),
            });
        } else {
            console.error("WebSocket is not connected.");
        }
    }
}

export const chatWebSocketClient = new WebSocketClient(WS_ENDPOINTS.CHAT_WS);