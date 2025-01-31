import axios from 'axios';

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
  }
  
  // get all user
  // getUsers=async ()=> {}

  // deleteUser=async ()=> {}

  updateUser=async (data)=> {
    //required data: _id,name,surname,sem,year,currentdegree,degree,qualification,role,email,
    try {
      const response = await this.api.patch('/update',data);

      console.log(response);
      //may use response.status to verify success 201
      return response.data?.data?.user;
      //getting updated user
    } catch (error) {
      console.error('Error userService: updateUser: ', error);
      throw error;
    }
  }
}

export const userService = new UserService();

// export default UserService;
