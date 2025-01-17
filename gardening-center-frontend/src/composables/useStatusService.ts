import { io, Socket } from "socket.io-client";
import Config from "@/config";
import type { WarningMessage } from "@/model/WarningMessage";

export function useStatusService() {

  let socket: Socket | null = null;

  async function init() {
    socket = io(Config.statusBackendUrl);

    socket.on("disconnect", () => {
      console.log('Socket.io: disconnected');
    });

    socket.on('warning', (data: WarningMessage) => {
      console.log('Socket.io: received warning', data);
      alert('Warning: ' + data.message);
    });

    return new Promise<void>(resolve => {
      socket?.on("connect", () => {
        console.log('Socket.io: connected');
        resolve();
      });
    });
  }

  function send(message: string) {
    console.log('Socket.io: Sending message', message);
    socket?.emit('message', message);
  }

  function subscribeToStockStatus(itemId: string, callback: (status: any) => void) {
    console.log('Socket.io: Subscribing to stock status for item ' + itemId);
    socket?.on('stock', callback);
    socket?.emit('subscribeToStock', itemId);
  }

  function disconnect() {
    socket?.disconnect();
  }

  return {
    init,
    send,
    subscribeToStockStatus,
    disconnect,
  };
}
