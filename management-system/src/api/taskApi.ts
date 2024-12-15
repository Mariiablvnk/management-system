import type { Task } from '@/types/task';
import api from './index';

// Отримати всі завдання
export const fetchTasks = async () => {
  const response = await api.get('/tasks');
  return response.data;
};

// Отримати завдання для конкретного проекту
export const fetchTasksByProject = async (projectId: number) => {
  const response = await api.get(`/tasks?project_id=${projectId}`);
  return response.data;
};

// Додати нове завдання
export const createTask = async (task: any) => {
  const response = await api.post('/tasks', task);
  return response.data;
};

// Оновити завдання
export const updateTask = async (id: number, task: any) => {
  const response = await api.put(`/tasks/${id}`, task);
  return response.data;
};

// Видалити завдання
export const deleteTask = async (id: number) => {
  const response = await api.delete(`/tasks/${id}`);
  return response.data;
};


// Оновлення статусу завдання
export const updateTaskStatus = async (id: number, status: string): Promise<Task> => {
  const response = await api.patch(`/tasks/${id}`, { status });
  return response.data;
};

