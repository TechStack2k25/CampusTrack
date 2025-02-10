import axios from 'axios';
import store from '../store/store.js';
import { logout } from '../store/slices/userSlice.js';

class RequestService {
  constructor() {
    this.api = axios.create({
      baseURL: '/api/request', // Vite Proxy will handle this or will allow cors policies
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

  // get all requests for a user
  getAll=async ()=> {//data required: tokens alongwith
    try {
      const response = await this.api.get('/getall');
      console.log(response);
      //may use response.status to verify success 201
      const obj=response.data?.data?.data;
      let res=[];
      if(obj?.faculty){
        res=res.concat(obj.faculty);
      }
      if(obj?.hod){
        res=res.concat(obj.hod);
      }
      if(obj?.user){
        res=res.concat(obj.user);
      }
      if(obj?.student){
        res=res.concat(obj.student);
      }
      return res;
      //getting all requests made 
    } catch (error) {
      console.error('Error requestService: getAll: ', error);
      throw error;
    }
  }

  // get all submissions
  getAllSubmissions=async ()=> {//data required: tokens alongwith
    try {
      const response = await this.api.get('/getall');
      console.log(response);
      //may use response.status to verify success 201
      return response.data?.data?.data?.submit;
    } catch (error) {
      console.error('Error requestService: getAllSubmissions: ', error);
      throw error;
    }
  }
   
  // updating request
  updateRequest=async (data)=> {//data required: _id, new_status
    try {
      const response = await this.api.patch(`/update/${data?.id}`,data);

      console.log(response);
      //may use response.status to verify success 201
      return response.data;
      //getting tokens with user in response.data.data
    } catch (error) {
      console.error('Error requestService: updateRequest: ', error);
      throw error;
    }
  }
}

export const requestService = new RequestService();

// export default RequestService;
