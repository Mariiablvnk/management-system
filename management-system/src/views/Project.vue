<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useTaskStore } from '@/stores/tasksStore';
import AddTaskModal from '@/components/AddTask.vue';
import PushNotification from '@/components/PushNotification.vue';
import { handleDrop } from '@/utils/dragAndDrop';
import { useNotification } from '@/utils/useNotification';
import type { Task } from '@/types/task';

export default defineComponent({
  name: 'ProjectDetails',
  components: { AddTaskModal, PushNotification },
  setup() {
    const route = useRoute();
    const taskStore = useTaskStore();
    const { showNotification, notificationMessage, notificationType, triggerNotification } = useNotification();

    const projectId = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id;

    const showAddTaskModal = ref(false);
    const showEditTaskModal = ref(false);
    const taskToEdit = ref<Task | null>(null);

    const filters = ref({
      executor: '',
      status: '',
    });

    const draggedTask = ref<Task | null>(null);

    onMounted(() => {
      taskStore.fetchTasksByProject(projectId);
    });

    const filteredAndSortedTasks = computed(() => {
      let tasks = [...taskStore.tasks].filter((task) => task.project_id === projectId);

      if (filters.value.executor) {
        tasks = tasks.filter((task) =>
          task.executor.toLowerCase().includes(filters.value.executor.toLowerCase())
        );
      }
      if (filters.value.status) {
        tasks = tasks.filter((task) => task.status === filters.value.status);
      }

      return tasks;
    });

    const sortBy = (key: keyof Task) => {
      taskStore.sortTasks(key);
    };

    const handleDragStart = (task: Task) => {
      draggedTask.value = task;
    };

    const handleDropWrapper = (targetTask: Task) => {
      handleDrop(
        draggedTask.value,
        targetTask,
        taskStore.tasks,
        projectId,
        taskStore.updateTaskOrder
      );
      draggedTask.value = null;
    };

    const handleAddTask = async (taskData: Omit<Task, 'id' | 'project_id'>) => {
      try {
        await taskStore.addTask({ ...taskData, project_id: projectId });
        triggerNotification('Task added successfully!', 'success');
      } catch {
        triggerNotification('Failed to add task.', 'error');
      }
      showAddTaskModal.value = false;
    };

    const openEditTaskModal = (task: Task) => {
      taskToEdit.value = task;
      showEditTaskModal.value = true;
    };

    const handleEditTask = async (updatedTaskData: Omit<Task, 'id' | 'project_id'>) => {
      if (taskToEdit.value) {
        try {
          await taskStore.editTask({ ...taskToEdit.value, ...updatedTaskData });
          triggerNotification('Task updated successfully!', 'success');
        } catch {
          triggerNotification('Failed to update task.', 'error');
        }
        showEditTaskModal.value = false;
      }
    };

    const deleteTask = async (taskId: string) => {
      if (confirm('Are you sure you want to delete this task?')) {
        try {
          await taskStore.deleteTask(taskId);
          triggerNotification('Task deleted successfully!', 'success');
        } catch {
          triggerNotification('Failed to delete task.', 'error');
        }
      }
    };

    return {
      projectId,
      showAddTaskModal,
      showEditTaskModal,
      taskToEdit,
      filters,
      filteredAndSortedTasks,
      sortBy,
      handleAddTask,
      openEditTaskModal,
      handleEditTask,
      deleteTask,
      handleDragStart,
      handleDropWrapper,
      showNotification,
      notificationMessage,
      notificationType,
    };
  },
});
</script>

<template>
  <div class="home">
    <h1>Project {{ projectId }}</h1>
    <button class="primary-btn" @click="showAddTaskModal = true">Add Task</button>

    <!-- Filters -->
    <div class="filters">
      <input
        id="executor-filter"
        v-model="filters.executor"
        placeholder="Enter executor name"
        class="filter-input"
      />
      <select id="status-filter" v-model="filters.status" class="filter-select">
        <option value="">All</option>
        <option value="to-do">To Do</option>
        <option value="in-progress">In Progress</option>
        <option value="done">Done</option>
      </select>
    </div>

    <!-- Table -->
    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Executor</th>
            <th>
              Status
              <button class="sort-btn" @click="sortBy('status')">Sort</button>
            </th>
            <th>
              Due Date
              <button class="sort-btn" @click="sortBy('due_date')">Sort</button>
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="task in filteredAndSortedTasks"
            :key="task.id"
            draggable="true"
            @dragstart="handleDragStart(task)"
            @dragover.prevent
            @drop="handleDropWrapper(task)"
            class="task-row"
          >
            <td>{{ task.id }}</td>
            <td>{{ task.name }}</td>
            <td>{{ task.executor }}</td>
            <td>{{ task.status }}</td>
            <td>{{ task.due_date }}</td>
            <td>
              <button class="sort-btn" style="margin-right: 5px;" @click="openEditTaskModal(task)">Edit</button>
              <button class="sort-btn" @click="deleteTask(task.id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add Task Modal -->
    <AddTaskModal
      :visible="showAddTaskModal"
      @close="showAddTaskModal = false"
      @submit="handleAddTask"
    />

    <!-- Edit Task Modal -->
    <AddTaskModal
      :visible="showEditTaskModal"
      :task="taskToEdit"
      @close="showEditTaskModal = false"
      @submit="handleEditTask"
    />

    <!-- Push Notification -->
    <PushNotification
      :visible="showNotification"
      :message="notificationMessage"
      :type="notificationType"
      @close="showNotification = false"
    />
  </div>
</template>
