import axios from "axios";
import store from '../store/store.js';
import { logout } from '../store/slices/userSlice.js';

class EventService {
    constructor() {
      this.api = axios.create({
        baseURL: '/api/event', // Vite Proxy will handle this or will allow cors policies
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
          console.warn('Unauthorized! Logging out user...');
          store.dispatch(logout()); // Dispatch logout action
          localStorage.removeItem('persist:CTroot');//optional
        }
        return Promise.reject(error); // Reject error for further handling
      }
    );
  }
    // get all events for a user
  getAll=async ()=> {//data required: tokens alongwith
    try {
      const response = await this.api.get('/all');
      console.log(response);

      return response?.data?.data?.events;
      
      //   getting all events 
    } catch (error) {
      console.error('Error eventService: getAll: ', error);
      throw error;
    }
  }

  // create an event
  createEvent=async (data)=> {//data required: description, title, date
    try {
      const response = await this.api.post('/create',data);
      console.log(response);

      return response?.data?.data?.event;
      //received created one
      
    } catch (error) {
      console.error('Error eventService: createEvent: ', error);
      throw error;
    }
  }

}

export const eventService = new EventService();

// export default EventService;
