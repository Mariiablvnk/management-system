import { defineStore } from 'pinia';
import { ref } from 'vue';
import { customAlphabet } from 'nanoid';
import type { Project } from '@/types/project';
import api from '@/api/index';

const generateNumericId = customAlphabet('1234567890', 10);

export const useProjectStore = defineStore('projectStore', () => {
  const projects = ref<Project[]>([]);

  const sortKey = ref<keyof Project>('id');
  const sortOrder = ref<number>(1);


  const initSortPreferences = () => {
    const storedKey = localStorage.getItem('project-sort-key');
    const storedOrder = localStorage.getItem('project-sort-order');

    if (storedKey && ['id', 'name', 'status', 'taskCount'].includes(storedKey)) {
      sortKey.value = storedKey as keyof Project;
    }
    if (storedOrder && ['1', '-1'].includes(storedOrder)) {
      sortOrder.value = parseInt(storedOrder, 10);
    }
  };

  initSortPreferences();

  const fetchProjects = async () => {
    try {
      const response = await api.get('/projects');
      projects.value = response.data
        .filter((project: Partial<Project>) =>
          project.id && project.name && project.status && project.created_at
        )
        .map((project: Partial<Project>) => ({
          id: project.id,
          name: project.name,
          description: project.description || '',
          status: project.status,
          taskCount: project.taskCount || 0,
          created_at: project.created_at || new Date().toISOString(),
        }));

        sortProjects(sortKey.value, true);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const addProject = async (projectData: Omit<Project, 'id' | 'taskCount'>) => {
    const newProject: Project = {
      ...projectData,
      id: generateNumericId(),
      taskCount: 0,
    };

    try {
      const response = await api.post('/projects', newProject);
      await fetchProjects();
    } catch (error) {
      console.error('Error adding project:', error);
    }
    sortProjects(sortKey.value, true);
  };

  const editProject = async (updatedProject: Project) => {
    try {
      await api.put(`/projects/${updatedProject.id}`, updatedProject);
      const index = projects.value.findIndex((project) => project.id === updatedProject.id);
      if (index !== -1) {
        projects.value[index] = updatedProject;
      }
      sortProjects(sortKey.value, true);
    } catch (error) {
      console.error('Error editing project:', error);
    }
  };

  const deleteProject = async (projectId: string) => {
    try {
      await api.delete(`/projects/${projectId}`);
      projects.value = projects.value.filter((project) => project.id !== projectId);

      sortProjects(sortKey.value, true);
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const updateTaskCount = async (projectId: string, delta: number) => {
    const project = projects.value.find((project) => project.id === projectId);
    if (project) {
      project.taskCount = Math.max(0, project.taskCount + delta);

      try {
        await api.put(`/projects/${projectId}`, { ...project, taskCount: project.taskCount });
      } catch (error) {
        console.error('Failed to update task count:', error);
        project.taskCount -= delta; 
      }
    }
  };

  const sortProjects = (key: keyof Project, preserveOrder = false) => {
    if (sortKey.value === key && !preserveOrder) {
      sortOrder.value *= -1; 
    } else if (!preserveOrder) {
      sortKey.value = key;
      sortOrder.value = 1; 
    }
  
    localStorage.setItem('project-sort-key', sortKey.value);
    localStorage.setItem('project-sort-order', sortOrder.value.toString());
  
    projects.value.sort((a, b) => {
      let aValue = a[key];
      let bValue = b[key];
  
      if (key === 'status') {
        const statusOrder = { active: 1, complete: 2 };
        aValue = statusOrder[a[key] as keyof typeof statusOrder] || 0;
        bValue = statusOrder[b[key] as keyof typeof statusOrder] || 0;
      }
  
      if (key === 'taskCount') {
        aValue = a[key] || 0;
        bValue = b[key] || 0;
      }
  
      if (aValue < bValue) return -1 * sortOrder.value;
      if (aValue > bValue) return 1 * sortOrder.value;
      return 0;
    });
  };
  

  return {
    projects,
    sortKey,
    sortOrder,
    fetchProjects,
    addProject,
    editProject,
    deleteProject,
    updateTaskCount,
    sortProjects,
  };
});
