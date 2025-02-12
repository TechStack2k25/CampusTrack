import axios from 'axios';
import store from '../store/store.js';
import { logout } from '../store/slices/userSlice.js';

class AttendanceService {
  constructor() {
    this.api = axios.create({
      baseURL: '/api/attendance', // Vite Proxy will handle this or will allow cors policies
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

  
  // marking students attendance
  markAttendance= async (data)=> {//data required: courseId, presentStudentIds
    try {
      const response = await this.api.post(`/mark`,data);

      console.log(response);
      
      return response.data?.message;
      //getting status with message
    } catch (error) {
      console.error('Error AttendanceService: markAttendance: ', error);
      throw error;
    }
  }

  
  // all courses student
  studentCoursesAttendance=async ()=> {//cookies required
    try {
      
      const response = await this.api.get(`/get_student`);

      console.log(response);
      
      return response.data?.data;
      //getting all courses student attendance
    } catch (error) {
      console.error('Error AttendanceService: studentCoursesAttendance: ', error);
      throw error;
    }
  }
  
}

export const attendanceService = new AttendanceService();

// export default AttendanceService;
