import axios from 'axios';
import store from '../store/store.js';
import { logout } from '../store/slices/userSlice.js';

class DepartmentService {
  constructor() {
    this.api = axios.create({
      baseURL: '/api/department', // Vite Proxy will handle this or will allow cors policies
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

  // Creating department
  createDepartment=async (data)=> {//data required: name, code, hod
    try {
      const response = await this.api.post(`/create`,data);

      console.log(response);
      //may use response.status to verify success 201
      return response.data?.data?.data;
      //getting new department
    } catch (error) {
      console.error('Error departmentService: createDepartment: ', error);
      throw error;
    }
  }

  // getting all department
  getAllDepartments=async (data)=> {//college id
    try {
      const response = await this.api.get(`/all/${data?.id}`);

      // console.log(response);
      //may use response.status to verify success 201
      return response.data?.data?.data;
      //getting all departments
    } catch (error) {
      console.error('Error departmentService: getAllDepartments: ', error);
      throw error;
    }
  }

  // deleting department
  deleteDepartment=async (data)=> {//data required: _id
    try {
      const response = await this.api.delete(`/del/${data?._id}`);

      console.log(response);
      
      return response.status===201;
      //getting message
    } catch (error) {
      console.error('Error departmentService: deleteDepartment: ', error);
      throw error;
    }
  }

  // updating Department
  updateDepartment=async (data)=> {//data required: _id
    try {
      const response = await this.api.patch(`/update/${data?._id}`,data);

      console.log(response);
      //may use response.status to verify success 201
      return response.data?.data?.data;
      //getting new data about department
    } catch (error) {
      console.error('Error departmentService: updateDepartment: ', error);
      throw error;
    }
  }
}

export const departmentService = new DepartmentService();

// export default DepartmentService;
