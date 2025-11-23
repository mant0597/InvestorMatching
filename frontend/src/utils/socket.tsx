import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export function getSocket(token?: string) {
  if (!socket) {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
    
    console.log('🔌 Initializing socket connection to:', apiUrl);
    
    socket = io(apiUrl, {
      path: '/socket.io',
      transports: ['websocket', 'polling'],
      auth: { 
        token: token || localStorage.getItem('innova_token') || '' 
      },
      autoConnect: false,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    // Add connection event listeners for debugging
    socket.on('connect', () => {
      console.log('✅ Socket connected:', socket?.id);
      console.log('   Transport:', socket?.io.engine.transport.name);
    });

    socket.on('connect_error', (error) => {
      console.error('🚨 Socket connection error:', error.message);
    });

    socket.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected:', reason);
    });

    socket.on('reconnect', (attemptNumber) => {
      console.log('🔄 Socket reconnected after', attemptNumber, 'attempts');
    });
  }
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    console.log('👋 Disconnecting socket');
    socket.disconnect();
    socket = null;
  }
}