import axios from 'axios';

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
  async userSignUp(data) {//data required: email, password, confirmpassword
    try {
      const response = await this.api.post('/signup',data);

      console.log(response);
      //may use response.status to verify success 201
      return response.data?.data;
      //getting tokens with userEmail

    } catch (error) {
      console.error('Error authService: userSignUp: ', error);
      throw error;
    }
  }

  // Login the user
  async userLogin(data) {//data required: email, password
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
  // async userForgotPassword() {}
  
}

export const authService = new AuthService();

// export default AuthService;
