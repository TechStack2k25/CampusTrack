import axios from 'axios';
import store from '../store/store.js';
import { logout } from '../store/slices/userSlice.js';
import { socketService } from './socketService.js';

class UserService {
  constructor() {
    this.api = axios.create({
      baseURL: '/api/user', // Vite Proxy will handle this or will allow cors policies
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

  // get all user
  getUsers = async (data) => {
    // Ids of course, department, college
    try {
      const query = Object.fromEntries(
        Object.entries(data).filter(([_, v]) => v !== '')
      );
      // console.log(query);

      const response = await this.api.get('/all', { params: query });

      // console.log(response);

      return response?.data?.data;
    } catch (error) {
      // console.error('Error userService: getUsers: ', error);
      throw error;
    }
  };

  // deleteUser=async ()=> {}

  updateUser = async (data) => {
    //required data: _id,name,surname,sem,year,currentdegree,degree,qualification,role,email,
    try {
      const response = await this.api.patch('/update', data);

      // console.log(response);
      //may use response.status to verify success 201
      return response.data?.data?.user;
      //getting updated user
    } catch (error) {
      // console.error('Error userService: updateUser: ', error);
      throw error;
    }
  };

  //get current user
  currentUser = async () => {
    try {
      const response = await this.api.get('/me');

      // console.log(response);

      return response.data?.data?.user;
      //current user data
    } catch (error) {
      // console.error('Error userService: currentUser: ', error);
      throw error;
    }
  };

  //get current user populated
  currentUserData = async () => {
    try {
      const response = await this.api.get('/mydata');

      // console.log(response);

      return response.data?.data?.user;
      //current user data
    } catch (error) {
      // console.error('Error userService: currentUserData: ', error);
      throw error;
    }
  };

  //dashboard data
  userDashData = async () => {
    try {
      const response = await this.api.get('/dashboard');

      // console.log(response);

      return response.data;
    } catch (error) {
      // console.error('Error userService: userDashData: ', error);
      throw error;
    }
  };

  // password update
  passwordUpdate = async (data) => {
    //required: current_password, new_password, confirmpassword
    try {
      const response = await this.api.post('/updatepassword', data);

      // console.log(response);

      return response.data?.data?.user;
    } catch (error) {
      // console.error('Error userService: passwordUpdate: ', error);
      throw error;
    }
  };

  callToVerify = async () => {
    try {
      const response = await this.api.get('/sendmail');

      // console.log(response);

      return response.status === 200;
    } catch (error) {
      // console.error('Error userService: callToVerify: ', error);
      throw error;
    }
  };

  verifyUser = async (data) => {
    // emailToken
    try {
      const response = await this.api.post('/verifyemail', data);

      // console.log(response);

      return response.status === 201;
    } catch (error) {
      // console.error('Error userService: verifyUser: ', error);
      throw error;
    }
  };

  updateSem = async (data) => {
    //  message='Individual' || 'remove_student', sem, year, student_id
    try {
      const response = await this.api.post('/update_sem', data);

      // console.log(response);

      return response.data?.data;
      //updated_users,updated_colleges,updated_course,
    } catch (error) {
      // console.error('Error userService: updateSem: ', error);
      throw error;
    }
  };

  removeFaculty = async (data) => {
    //  remove_id(faculty)
    try {
      const response = await this.api.post('/remove_faculty', data);

      // console.log(response);

      return response.status === 201;
      // success
    } catch (error) {
      // console.error('Error userService: removeFaculty: ', error);
      throw error;
    }
  };
}

export const userService = new UserService();

// export default UserService;
