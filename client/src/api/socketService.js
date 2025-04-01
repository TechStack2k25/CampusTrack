import { io } from 'socket.io-client';
import store from '../store/store';
import { logout } from '../store/slices/userSlice';

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect() {
    if(this.socket?.connected) return;
    this.socket = io('http://localhost:3000');//backend server
    
    this.socket.on('connect', () => {
      console.log('Connected to socket server', this.socket.id);
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from socket server');
    });
  }

  joinRooms(rooms) {
    if (this.socket) {
      this.socket.emit('joinRooms', rooms);
    }
  }

  onMessageReceived(callback) {
    if (this.socket) {
      this.socket.on('newMessage', (message) => {
        callback(message);
      });
    }
  }

  onGetDashboard(callback) {
    if (this.socket) {
      this.socket.on('getdashboard', (message) => {
        callback(message);
      });
    }
  }

  disconnect() {
    if (this.socket?.connected) {
      this.socket.disconnect();
    }
  }
}

export const socketService = new SocketService();