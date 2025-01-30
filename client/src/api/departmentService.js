import axios from 'axios';

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
  }

  // Creating department
  async createDepartment(data) {//data required: id, name, code, hod
    try {
      const response = await this.api.post(`/create/${data?.id}`,data);

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
  async getAllDepartments() {
    try {
      const response = await this.api.get('/all');

      console.log(response);
      //may use response.status to verify success 201
      return response.data?.data?.data;
      //getting all departments
    } catch (error) {
      console.error('Error departmentService: getAllDepartments: ', error);
      throw error;
    }
  }

  // deleting department
  async deleteDepartment(data) {//data required: _id
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
  async updateDepartment(data) {//data required: _id
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
