import axios from 'axios';

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
  }
  
}

export const courseService = new CourseService();

// export default CourseService;
