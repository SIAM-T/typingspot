import { Server } from 'socket.io';
import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url!, true);
    handle(req, res, parsedUrl);
  });

  // Create Socket.IO instance
  const io = new Server(server, {
    cors: {
      origin: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  });

  // Middleware for authentication
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error'));
    }
    // Verify token here
    socket.data.userId = token; // Store user ID in socket data
    next();
  });

  // Handle connections
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Handle race room events
    socket.on('race:join_room', async (roomId: string) => {
      await socket.join(roomId);
      io.to(roomId).emit('race:room_update', {
        type: 'player_joined',
        playerId: socket.data.userId,
      });
    });

    socket.on('race:leave_room', async (roomId: string) => {
      await socket.leave(roomId);
      io.to(roomId).emit('race:room_update', {
        type: 'player_left',
        playerId: socket.data.userId,
      });
    });

    socket.on('race:player_ready', (roomId: string) => {
      io.to(roomId).emit('race:room_update', {
        type: 'player_ready',
        playerId: socket.data.userId,
      });
    });

    socket.on('race:progress_update', (data: { roomId: string; progress: number; wpm: number }) => {
      io.to(data.roomId).emit('race:progress_update', {
        playerId: socket.data.userId,
        progress: data.progress,
        wpm: data.wpm,
      });
    });

    socket.on('race:player_finished', (roomId: string) => {
      io.to(roomId).emit('race:room_update', {
        type: 'player_finished',
        playerId: socket.data.userId,
      });
    });

    // Handle chat messages
    socket.on('race:send_message', (data: { roomId: string; message: string }) => {
      io.to(data.roomId).emit('race:receive_message', {
        playerId: socket.data.userId,
        message: data.message,
        timestamp: new Date(),
      });
    });

    // Handle user presence
    socket.on('user:typing', (data: { roomId: string; isTyping: boolean }) => {
      socket.to(data.roomId).emit('user:typing', {
        playerId: socket.data.userId,
        isTyping: data.isTyping,
      });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  const PORT = parseInt(process.env.SOCKET_PORT || '3001', 10);
  server.listen(PORT, () => {
    console.log(`Socket.IO server running on port ${PORT}`);
  });
}); 