import axios from 'axios';
import store  from '../store/store.js';
import { logout } from '../store/slices/userSlice.js';
import { socketService } from './socketService.js';

class DegreeService {
  constructor() {
    this.api = axios.create({
      baseURL: '/api/degree', // Vite Proxy will handle this or will allow cors policies
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
        socketService.disconnect();
        store.dispatch(logout()); // Dispatch logout action
      }
      return Promise.reject(error); // Reject error for further handling
    }
  );
}

  addDegree=async (data)=> {//data required: _id(college), name , totalYears, totalSemesters 
    try {
      const response = await this.api.post(`/add/${data?._id}`,data);

      console.log(response);
      return response.data?.data?.newdegree;
      //getting new degree data
    } catch (error) {
      console.error('Error DegreeService: addDegree: ', error);
      throw error;
    }
  }

  getAll=async (data)=> {//data required: _id(college)
    try {
      const response = await this.api.get(`/all/${data?._id}`);

      console.log(response);
      return response.data?.data?.alldegree;
    } catch (error) {
      console.error('Error DegreeService: getAll: ', error);
      throw error;
    }
  }

  // deleting a degree
  deleteDegree=async (data)=> {//data required: _id,
    try {
      const response = await this.api.delete(`/del/${data?._id}`);

      console.log(response);
      
      return response.status===201;
    } catch (error) {
      console.error('Error DegreeService: deleteDegree: ', error);
      throw error;
    }
  }

  // updating
  updateDegree=async (data)=> {//data required: _id, name, totalYears, totalSemesters
    try {
      const response = await this.api.patch(`/update/${data?._id}`,data);

      console.log(response);
      
      return response.data?.data?.updateddegree;
      //getting updated degree
    } catch (error) {
      console.error('Error DegreeService: updateDegree: ', error);
      throw error;
    }
  }
}

export const degreeService = new DegreeService();

// export default DegreeService;
