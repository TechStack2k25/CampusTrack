import axios from 'axios';
import store  from '../store/store.js';
import { logout } from '../store/slices/userSlice.js';

class CollegeService {
  constructor() {
    this.api = axios.create({
      baseURL: '/api/college', // Vite Proxy will handle this or will allow cors policies
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
      }
      return Promise.reject(error); // Reject error for further handling
    }
  );
}

  // creating college
  createCollege=async (data)=> {//data required: name, id(college), degree
    try {
      const response = await this.api.post('/create',data);

      console.log(response);
      //may use response.status to verify success 201
      return response.data?.data?.data;
      //getting new college data
    } catch (error) {
      console.error('Error collegeService: createCollege: ', error);
      throw error;
    }
  }

  // deleting a college
  deleteCollege=async (data)=> {//data required: _id,
    try {
      const response = await this.api.delete(`/del/${data?._id}`,data);

      console.log(response);
      
      return response.status===201;
    } catch (error) {
      console.error('Error collegeService: deleteCollege: ', error);
      throw error;
    }
  }

  // updating college
  updateCollege=async (data)=> {//data required: _id, id, name, degree
    try {
      const response = await this.api.patch(`/update/${data?._id}`,data);

      console.log(response);
      
      return response.data?.data;
      //getting updated college
    } catch (error) {
      console.error('Error collegeService: updateCollege: ', error);
      throw error;
    }
  }
}

export const collegeService = new CollegeService();

// export default CollegeService;
