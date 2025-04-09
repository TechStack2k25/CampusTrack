import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL, // Vite dev server URL
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
  },
});

const groupRoomMap = {};

io.on('connection', (socket) => {
  // console.log('connected');

  socket.on('joinRooms', (rooms) => {
    rooms.forEach((groupId) => {
      let roomId;
      if (groupRoomMap[groupId]) {
        roomId = groupRoomMap[groupId];
      } else {
        roomId = `room_${groupId}`;
        groupRoomMap[groupId] = roomId;
      }
      socket.join(roomId);
    });
  });

  socket.on('disconnect', () => {
    // console.log('A user Disconnected', socket.id);
  });
});

export function getroomSocketId(groupId) {
  return groupRoomMap[groupId];
}
export { io, app, server };
