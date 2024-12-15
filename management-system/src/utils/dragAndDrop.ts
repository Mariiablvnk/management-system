import type { Task } from '@/types/task';

/**
 * Handles the drag-and-drop logic for reordering tasks.
 * @param draggedTask - The task being dragged.
 * @param targetTask - The task where the dragged task is dropped.
 * @param tasks - Array of tasks from the task store.
 * @param projectId - ID of the current project.
 * @param updateTaskOrder - Function to persist the new order (localStorage/server).
 */
export const handleDrop = (
    draggedTask: Task | null,
    targetTask: Task,
    tasks: Task[],
    projectId: string,
    updateTaskOrder: (projectId: string, reorderedTaskIds: string[]) => void
  ) => {
    if (!draggedTask || draggedTask.id === targetTask.id) return;
  
    const draggedIndex = tasks.findIndex((task) => task.id === draggedTask.id);
    const targetIndex = tasks.findIndex((task) => task.id === targetTask.id);
  
    if (draggedIndex !== -1 && targetIndex !== -1) {
      const updatedTasks = [...tasks];
      const [movedTask] = updatedTasks.splice(draggedIndex, 1);
      updatedTasks.splice(targetIndex, 0, movedTask);
      const reorderedTaskIds = updatedTasks
        .filter((task) => task.project_id === projectId)
        .map((task) => task.id);

      updateTaskOrder(projectId, reorderedTaskIds);
    }
  };
  
