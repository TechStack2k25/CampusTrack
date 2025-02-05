import axios from 'axios';
import store from '../store/store.js';
import { logout } from '../store/slices/userSlice.js';

class CourseService {
  constructor() {
    this.api = axios.create({
      baseURL: '/api/course', // Vite Proxy will handle this or will allow cors policies
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
        localStorage.removeItem('persist:CTroot');
      }
      return Promise.reject(error); // Reject error for further handling
    }
  );
}

  
  // requesting to admit in a courses
  requestCourse= async (data)=> {//data required: course_id(db)
    try {
      const response = await this.api.post(`/add_course/${data?._id}`,data);

      console.log(response);
      
      return response.status==201;
      //getting status with message
    } catch (error) {
      console.error('Error courseService: requestCourse: ', error);
      throw error;
    }
  }

  
  // all department courses
  getCourses=async (data)=> {//data required: department_id(db)
    try {
      
      const response = await this.api.get(`/all/${data?._id}`);

      // console.log(response);
      
      return response.data?.data?.data;
      //getting all department courses
    } catch (error) {
      console.error('Error courseService: getCourses: ', error);
      throw error;
    }
  }

  // all user courses
  getUserCourses= async ()=> {
    try {
      const response = await this.api.get(`/all/Hk`);

      console.log(response);
      
      return response.data?.data?.data;
      //getting all user Courses
    } catch (error) {
      console.error('Error courseService: getUserCourses: ', error);
      throw error;
    }
  }

  
  // create a course by-HOD
  createCourse=async (data)=> {//data required: department-id
    try {
      const response = await this.api.post(`/create/${data?.id}`,data);

      console.log(response);
      
      return response.data?.data?.data;
      //getting newcourse
    } catch (error) {
      console.error('Error courseService: createCourse: ', error);
      throw error;
    }
  }

  
  // deleting course
  deleteCourse=async (data)=> {//data required: course_id
    try {
      const response = await this.api.delete(`/del/${data?.id}`);

      console.log(response);
      
      return response.status===201;
      //getting 201 with message
    } catch (error) {
      console.error('Error courseService: deleteCourse: ', error);
      throw error;
    }
  }

  
  // updating Course
  updateCourse=async (data)=> {//data required: course_id
    try {
      const response = await this.api.patch(`/update/${data?._id}`,data);

      console.log(response);
      
      return response.data?.data?.data;
      //getting updatedcourse
    } catch (error) {
      console.error('Error courseService: updateCourse: ', error);
      throw error;
    }
  }
  
}

export const courseService = new CourseService();

// export default CourseService;
