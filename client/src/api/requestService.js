import axios from 'axios';

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
  }

  // get all requests for a user
  async getAll() {//data required: tokens alongwith
    try {
      const response = await this.api.get('/getall');

      console.log(response);
      //may use response.status to verify success 201
      return response.data?.data?.data;
      //getting all requests made 
    } catch (error) {
      console.error('Error requestService: getAll: ', error);
      throw error;
    }
  }
   
  // updating request
  async updateRequest(data) {//data required: _id, new_status
    try {
      const response = await this.api.patch(`/update/${data?._id}`,data);

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
