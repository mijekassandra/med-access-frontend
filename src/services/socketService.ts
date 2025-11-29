import { io, Socket } from "socket.io-client";
import { store } from "../store";

class SocketService {
  private socket: Socket | null = null;
  private isConnecting: boolean = false;

  connect(): void {
    if (this.socket?.connected || this.isConnecting) {
      return;
    }

    const state = store.getState();
    const token = state.auth.token || localStorage.getItem("token");

    if (!token) {
      console.error("No authentication token available");
      return;
    }

    this.isConnecting = true;

    // Get base URL (remove /api if present)
    let baseUrl =
      import.meta.env.VITE_APP_BE_URL?.replace(/\/api$/, "") ||
      "http://localhost:3001";

    // Ensure URL doesn't have trailing slash
    baseUrl = baseUrl.replace(/\/$/, "");

    console.log("Connecting to Socket.io server:", baseUrl);
    console.log("Token available:", !!token);

    this.socket = io(baseUrl, {
      auth: {
        token: token,
      },
      // Also send token in headers as fallback (backend checks both)
      extraHeaders: {
        Authorization: `Bearer ${token}`,
      },
      // Try polling first, then upgrade to websocket (more reliable for CORS)
      transports: ["polling", "websocket"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
      // Add timeout for connection
      timeout: 20000,
      // Force new connection
      forceNew: false,
      // Enable upgrade (polling -> websocket)
      upgrade: true,
    });

    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    if (!this.socket) return;

    this.socket.on("connect", () => {
      console.log("✅ Socket.io connected:", this.socket?.id);
      if (this.socket?.io?.engine?.transport) {
        console.log("Transport:", this.socket.io.engine.transport.name);
      }
      this.isConnecting = false;
    });

    this.socket.on("disconnect", (reason) => {
      console.log("❌ Socket.io disconnected:", reason);
      this.isConnecting = false;
    });

    this.socket.on("connect_error", (error: Error & { type?: string; description?: string }) => {
      console.error("❌ Socket.io connection error:", error.message);
      console.error("Error details:", {
        message: error.message,
        type: error.type || "unknown",
        description: error.description || "No description",
      });
      this.isConnecting = false;
    });

    this.socket.on("reconnect_attempt", (attemptNumber) => {
      console.log(`🔄 Socket.io reconnection attempt ${attemptNumber}`);
    });

    this.socket.on("reconnect", (attemptNumber) => {
      console.log(`✅ Socket.io reconnected after ${attemptNumber} attempts`);
      this.isConnecting = false;
    });

    this.socket.on("reconnect_error", (error) => {
      console.error("❌ Socket.io reconnection error:", error.message);
    });

    this.socket.on("reconnect_failed", () => {
      console.error("❌ Socket.io reconnection failed - giving up");
      this.isConnecting = false;
    });
  }

  emit(event: string, data: any): void {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    } else {
      console.warn("Socket not connected, cannot emit:", event);
    }
  }

  on(event: string, callback: (...args: any[]) => void): void {
    this.socket?.on(event, callback);
  }

  off(event: string, callback?: (...args: any[]) => void): void {
    if (callback) {
      this.socket?.off(event, callback);
    } else {
      this.socket?.off(event);
    }
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnecting = false;
    }
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  getSocket(): Socket | null {
    return this.socket;
  }
}

export const socketService = new SocketService();

