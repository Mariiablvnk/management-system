import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Task } from '@/types/task';
import { useProjectStore } from '@/stores/projectsStore';
import api from '@/api/index';

export const useTaskStore = defineStore('taskStore', () => {
  const tasks = ref<Task[]>([]);
  const sortKey = ref<keyof Task>('id'); 
  const sortOrder = ref<number>(1); 
  const projectStore = useProjectStore();
 
  const initSortPreferences = () => {
    const storedKey = localStorage.getItem('tasks-sort-key');
    const storedOrder = localStorage.getItem('tasks-sort-order');

    if (storedKey) {
      sortKey.value = storedKey as keyof Task;
    }
    if (storedOrder) {
      sortOrder.value = parseInt(storedOrder, 10);
    }
  };

  initSortPreferences();


  const fetchTasksByProject = async (projectId: string) => {
    const response = await api.get(`/tasks?project_id=${projectId}`);
    const fetchedTasks = response.data.map((task: Task) => ({
      ...task,
      id: String(task.id),
      project_id: String(task.project_id),
    }));
  
    const savedOrder = localStorage.getItem(`tasks-order-${projectId}`);
    if (savedOrder) {
      const taskOrder = JSON.parse(savedOrder) as string[];

      const reorderedTasks = taskOrder
        .map((id) => fetchedTasks.find((task: { id: string; }) => task.id === id))
        .filter((task): task is Task => task !== undefined);
  
      const remainingTasks = fetchedTasks.filter(
        (task: { id: string; }) => !taskOrder.includes(task.id)
      );
  
      tasks.value = [...reorderedTasks, ...remainingTasks];
    } else {
      tasks.value = fetchedTasks; // Default order
    }
  };

  const addTask = async (taskData: Omit<Task, 'id'>) => {
    const response = await api.post('/tasks', taskData);
    const newTask = {
      ...response.data,
      id: String(response.data.id),
      project_id: String(response.data.project_id),
    };
    tasks.value.push(newTask);
    await projectStore.updateTaskCount(newTask.project_id, 1);
    sortTasks(sortKey.value, true); 
    return newTask;
  };


  const editTask = async (updatedTask: Task) => {
    const index = tasks.value.findIndex((task) => task.id === updatedTask.id);
    if (index !== -1) {
      tasks.value[index] = { ...updatedTask };
    }
    await api.put(`/tasks/${updatedTask.id}`, updatedTask);
    sortTasks(sortKey.value, true); 
  };


  const deleteTask = async (taskId: string) => {
    const task = tasks.value.find((task) => task.id === taskId);
    if (task) {
      await api.delete(`/tasks/${taskId}`);
      tasks.value = tasks.value.filter((task) => task.id !== taskId);
      await projectStore.updateTaskCount(task.project_id, -1);
      sortTasks(sortKey.value, true); 
    }
  };


  const sortTasks = (key: keyof Task, preserveOrder = false) => {
    if (!preserveOrder && sortKey.value === key) {
      sortOrder.value *= -1; 
    } else if (!preserveOrder) {
      sortKey.value = key;
      sortOrder.value = 1; 
    }


    localStorage.setItem('tasks-sort-key', sortKey.value);
    localStorage.setItem('tasks-sort-order', sortOrder.value.toString());

    tasks.value.sort((a, b) => {
      let aValue: string | number = a[key];
      let bValue: string | number = b[key];

      if (key === 'status') {
        const statusOrder = { 'to-do': 1, 'in-progress': 2, done: 3 };
        aValue = statusOrder[a[key] as keyof typeof statusOrder] || 0;
        bValue = statusOrder[b[key] as keyof typeof statusOrder] || 0;
      }

      if (key === 'due_date') {
        aValue = new Date(a[key] as string).getTime();
        bValue = new Date(b[key] as string).getTime();
      }

      if (aValue < bValue) return -1 * sortOrder.value;
      if (aValue > bValue) return 1 * sortOrder.value;
      return 0;
    });
  };

  const updateTaskOrder = async (projectId: string, taskOrder: string[]) => {
    const projectTasks = tasks.value.filter((task) => task.project_id === projectId);
    const reorderedTasks = taskOrder
      .map((id) => projectTasks.find((task) => task.id === id))
      .filter((task): task is Task => task !== undefined);
  
    if (reorderedTasks.length === projectTasks.length) {
      const otherTasks = tasks.value.filter((task) => task.project_id !== projectId);
      tasks.value = [...otherTasks, ...reorderedTasks];
  

      localStorage.setItem(`tasks-order-${projectId}`, JSON.stringify(taskOrder));
    }
  };
  
  
  

  return {
    tasks,
    sortKey,
    sortOrder,
    fetchTasksByProject,
    addTask,
    editTask,
    deleteTask,
    sortTasks,
    updateTaskOrder,
  };
});
