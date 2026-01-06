// Api/ToDoApi.js
import axiosClient from '../utils/axiosClient';
import { ToDoDto } from '../Dto/ToDoDto';

const ToDoApi = {
  getAll: async () => {
    try {
      const data = await axiosClient.get('/ToDo');
      return data.map(item => ToDoDto.fromJson(item));
    } catch (error) {
      console.error('Error fetching todos:', error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const data = await axiosClient.get(`/ToDo/${id}`);
      return ToDoDto.fromJson(data);
    } catch (error) {
      console.error(`Error fetching todo with id ${id}:`, error);
      throw error;
    }
  },
  
  create: async (todoDto) => {
    try {
      const data = await axiosClient.post('/ToDo', todoDto.toJson());
      return ToDoDto.fromJson(data);
    } catch (error) {
      console.error('Error creating todo:', error);
      throw error;
    }
  },

  update: async (id, todoDto) => {
    try {
      // Chỉ gửi name và isComplete, không gửi id vì đã có trong URL
      const payload = {
        name: todoDto.name,
        isComplete: todoDto.isComplete
      };
      const data = await axiosClient.put(`/ToDo/${id}`, payload);
      return ToDoDto.fromJson(data);
    } catch (error) {
      console.error(`Error updating todo with id ${id}:`, error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      await axiosClient.delete(`/ToDo/${id}`);
      return true;
    } catch (error) {
      console.error(`Error deleting todo with id ${id}:`, error);
      throw error;
    }
  }
};

export default ToDoApi;