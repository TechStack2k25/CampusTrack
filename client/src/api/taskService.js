import axios from 'axios';

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
  }
  
}

export const taskService = new TaskService();

// export default TaskService;
