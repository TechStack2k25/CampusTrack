import axios from 'axios';
import store from '../store/store.js';
import { logout } from '../store/slices/userSlice.js';
import { socketService } from './socketService.js';

class MessageService {
  constructor() {
    this.api = axios.create({
      baseURL: '/api/message', // Vite Proxy will handle this or will allow cors policies
      timeout: 5000,
      withCredentials: true, // Ensuring cookies are sent
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add Response Interceptor
    this.api.interceptors.response.use(
      (response) => response, // Pass successful responses
      (error) => {
        if (error.response && error.response.status === 401) {
          // console.warn('Unauthorized! Logging out user...');
          socketService.disconnect();
          store.dispatch(logout()); // Dispatch logout action
        }
        return Promise.reject(error); // Reject error for further handling
      }
    );
  }

  getAllSenders = async () => {
    try {
      const response = await this.api.get(`/dashboard_message`);

      // console.log(response);

      return response.data?.data?.allmessages;
      //messages array
    } catch (error) {
      // console.error('Error messageService: getAllSenders: ', error);
      throw error;
    }
  };

  getUserMessages = async (data) => {
    //data required: _id
    try {
      const response = await this.api.get(`/getmessage/${data?._id}`);

      // console.log(response);

      return response.data?.data?.allmessages;
      //messages array
    } catch (error) {
      // console.error('Error messageService: getUserMessages: ', error);
      throw error;
    }
  };

  // all courses student
  sendMessage = async (data) => {
    //_id, text
    try {
      const response = await this.api.post(`/send/${data?._id}`, data);

      // console.log(response);

      return response.data?.data?.newmessage;
      //new message
    } catch (error) {
      // console.error('Error messageService: sendMessage: ', error);
      throw error;
    }
  };
}

export const messageService = new MessageService();

// export default MessageService;
