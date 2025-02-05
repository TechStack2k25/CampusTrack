import axios from 'axios';
import store from '../store/store.js';
import { logout } from '../store/slices/userSlice.js';

class TaskService {
  constructor() {
    this.api = axios.create({
      baseURL: '/api/task', // Vite Proxy will handle this or will allow cors policies
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
  // submisssion of task
  submitTask=async (data)=> {//data required: task_Id
    try {
      const response = await this.api.post(`/submit/${data?.id}`,data);

      console.log(response);
      return response.status===201;

    } catch (error) {
      console.error('Error taskService: submitTask: ', error);
      throw error;
    }
  }
  // creating a task
  createTask=async (data)=> {//data required: course_id, title, description, tasktype, reward_point, deadline
    try {
      const response = await this.api.post(`/create/${data?.id}`,data);

      console.log(response);
      return response.data?.data?.data;

    } catch (error) {
      console.error('Error taskService: createTask: ', error);
      throw error;
    }
  }
  // getting all task
  getAll=async (data)=> {//data required: course_id/user_id
    try {
      const response = await this.api.get(`/all/${data?.id}`);

      console.log(response);
      
      return response.data?.data?.data;

    } catch (error) {
      console.error('Error taskService: getAll: ', error);
      throw error;
    }
  }
  // deleting a task
  deleteTask=async (data)=> {//data required: task_id
    try {
      const response = await this.api.delete(`/del/${data?.id}`);

      console.log(response);
      
      return response.status===201;

    } catch (error) {
      console.error('Error taskService: deleteTask: ', error);
      throw error;
    }
  }
  // uodating task
  updatingTask=async (data)=> {//data required: task_id, title, description, tasktype,deadline, reward_point
    try {
      const response = await this.api.patch(`/update/${data?.id}`,data);

      console.log(response);
      
      return response.data?.data?.data;
      //updated task

    } catch (error) {
      console.error('Error taskService: updatingTask: ', error);
      throw error;
    }
  }
  
  
}

export const taskService = new TaskService();

// export default TaskService;
