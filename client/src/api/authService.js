import axios from 'axios';
import { socketService } from './socketService';

class AuthService {
  constructor() {
    // client axios instance setup
    this.api = axios.create({
      baseURL: '/api/auth', // Vite Proxy will handle this or will allow cors policies
      timeout: 5000,
      withCredentials: true, // Ensuring cookies are sent
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
  // Sign up the user
  userSignUp=async (data)=> {//data required: email, password, confirmpassword
    try {
      const response = await this.api.post('/signup',data);

      console.log(response);
      //may use response.status to verify success 201
      return response.data?.data?.user;
      //getting tokens with userEmail

    } catch (error) {
      console.error('Error authService: userSignUp: ', error);
      throw error;
    }
  }

  // Login the user
  userLogin=async (data)=> {//data required: email, password
    try {
      const response = await this.api.post('/login',data);

      console.log(response);
      //may use response.status to verify success 201
      return response.data?.data?.user;
      //getting tokens with user in response.data.data
    } catch (error) {
      console.error('Error authService: userLogin: ', error);
      throw error;
    }
  }

  // forgot password call
  userForgotPassword= async (data) =>{//email
    try {
      const response = await this.api.post('/forgotpassword',data,{
        timeout: 60000,
      });

      console.log(response);
      return response.status===200;
    } catch (error) {
      console.error('Error authService: userForgotPassword: ', error);
      throw error;
    }
  }

  // reset password call
  userResetPassword= async (data) =>{// resetToken, password, confirmpassword
    try {
      const response = await this.api.post('/resetpassword',data);

      console.log(response);
      return response.data?.data?.user;
    } catch (error) {
      console.error('Error authService: userResetPassword: ', error);
      throw error;
    }
  }

  //Logout the user
  userLogout=async ()=>{
    try {
      const response = await this.api.get('/logout');

      console.log(response);
      //may use response.status to verify success 201
      if(response.status===200) socketService.disconnect();
      return response.status===200;
      //getting tokens with user in response.data.data
    } catch (error) {
      console.error('Error authService: userLogin: ', error);
      throw error;
    }
  }
  
}

export const authService = new AuthService();

// export default AuthService;
