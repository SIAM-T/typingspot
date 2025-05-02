import { io } from 'socket.io-client';

// Create Socket.IO client instance
const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001', {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

// Socket event listeners
socket.on('connect', () => {
  console.log('Connected to Socket.IO server');
});

socket.on('disconnect', () => {
  console.log('Disconnected from Socket.IO server');
});

socket.on('error', (error) => {
  console.error('Socket.IO error:', error);
});

// Race events
export const raceEvents = {
  // Room events
  JOIN_ROOM: 'race:join_room',
  LEAVE_ROOM: 'race:leave_room',
  ROOM_UPDATE: 'race:room_update',
  PLAYER_READY: 'race:player_ready',
  RACE_START: 'race:start',
  RACE_END: 'race:end',
  
  // Progress events
  PROGRESS_UPDATE: 'race:progress_update',
  WPM_UPDATE: 'race:wpm_update',
  PLAYER_FINISHED: 'race:player_finished',
  
  // Chat events
  SEND_MESSAGE: 'race:send_message',
  RECEIVE_MESSAGE: 'race:receive_message',
};

// Typing events
export const typingEvents = {
  START_TEST: 'typing:start_test',
  END_TEST: 'typing:end_test',
  PROGRESS_UPDATE: 'typing:progress_update',
};

// User events
export const userEvents = {
  USER_ONLINE: 'user:online',
  USER_OFFLINE: 'user:offline',
  USER_TYPING: 'user:typing',
};

export default socket; 