import { useEffect } from "react";
import { useSelector } from "react-redux";
import { socketService } from "../services/socketService";
import type { RootState } from "../store";

export const useSocket = () => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const token = useSelector((state: RootState) => state.auth.token);

  useEffect(() => {
    if (isAuthenticated && token) {
      socketService.connect();
    } else {
      socketService.disconnect();
    }

    return () => {
      // Don't disconnect on unmount - keep connection alive
      // socketService.disconnect();
    };
  }, [isAuthenticated, token]);

  return {
    socket: socketService.getSocket(),
    isConnected: socketService.isConnected(),
    emit: socketService.emit.bind(socketService),
    on: socketService.on.bind(socketService),
    off: socketService.off.bind(socketService),
  };
};

