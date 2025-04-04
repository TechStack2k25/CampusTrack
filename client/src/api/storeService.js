import axios from 'axios';
import store from '../store/store.js';
import { logout } from '../store/slices/userSlice.js';
import { socketService } from './socketService.js';

class StoreService {
  constructor() {
    this.api = axios.create({
      baseURL: '/api/store', // Vite Proxy will handle this or will allow cors policies
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

  // get all study material for a course
  getAll=async (data)=> {//data required: course_id
    try {
      const response = await this.api.get(`/getall/${data?._id}`);
      console.log(response);
      return response?.data?.data;
      //getting allresources, course
    } catch (error) {
      console.error('Error StoreService: getAll: ', error);
      throw error;
    }
  }

  deleteMaterial=async (data)=> {//data required: material_id
    try {
      const response = await this.api.delete(`/delete/${data?._id}`);
      console.log(response);
      return response.status===201;
    } catch (error) {
      console.error('Error StoreService: deleteMaterial: ', error);
      throw error;
    }
  }
   
  addMaterial=async (data)=> {//data required: _id:course,
    try {
        const formData = new FormData();
      formData.append("file", data?.file); 
      formData.append("lecture", data?.lecture); 
      formData.append("part", data?.part); 
      console.log((formData));
      
      const response = await this.api.post(`/addresource/${data?._id}`,formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 60000, // Increase timeout for file uploads
        // onUploadProgress: (progressEvent) => {
        //   const percentCompleted = Math.round(
        //     (progressEvent.loaded / progressEvent.total) * 100
        //   );
        //   toast.info(`Uploading: ${percentCompleted}%`); // Show Toastify notification
        // },
      });

      console.log(response);
      return response.data?.data?.uploadedresource;
    } catch (error) {
      console.error('Error StoreService: addMaterial: ', error);
      throw error;
    }
  }
}

export const storeService = new StoreService();

// export default StoreService;
