import api from './index';

// Отримати всі проекти
export const fetchProjects = async () => {
  const response = await api.get('/projects');
  return response.data;
};

// Додати новий проект
export const addProject = async (project: any) => {
  const response = await api.post('/projects', project);
  return response.data;
};

// Оновити проект
export const editProject = async (id: number, project: any) => {
  const response = await api.put(`/projects/${id}`, project);
  return response.data;
};

// Видалити проект
export const deleteProject = async (id: number) => {
  const response = await api.delete(`/projects/${id}`);
  return response.data;
};
