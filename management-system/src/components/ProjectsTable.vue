<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useProjectStore } from '@/stores/projectsStore';
import AddProjectModal from '@/components/AddProject.vue';
import PushNotification from '@/components/PushNotification.vue';
import { useNotification } from '@/utils/useNotification';
import { setupResizableColumns } from '@/utils/setUpResizableColumns';
import type { Project } from '@/types/project';

export default defineComponent({
  name: 'ProjectsTable',
  components: { AddProjectModal, PushNotification },
  setup() {
    const router = useRouter();
    const projectStore = useProjectStore();
    const { showNotification, notificationMessage, notificationType, triggerNotification } = useNotification();

    const isModalVisible = ref(false);
    const selectedProject = ref<Project | null>(null);
    const tableRef = ref<HTMLTableElement | null>(null);

    const filters = ref({
      id: '',
      name: '',
      description: '',
      status: '',
      created_at: '',
    });

    onMounted(async () => {
      await projectStore.fetchProjects();
      setupResizableColumns(tableRef.value);
    });

    const filteredAndSortedProjects = computed(() => {
      return projectStore.projects.filter((project) =>
        Object.entries(filters.value).every(
          ([key, value]) =>
            !value ||
            project[key as keyof Project]?.toString().toLowerCase().includes(value.toLowerCase())
        )
      );
    });

    const sortBy = (key: keyof Project) => {
      projectStore.sortProjects(key);
    };

    const openAddProjectModal = () => {
      selectedProject.value = null;
      isModalVisible.value = true;
    };

    const openEditProjectModal = (project: Project) => {
      selectedProject.value = { ...project };
      isModalVisible.value = true;
    };

    const handleProjectSubmit = async (projectData: Project) => {
      try {
        if (selectedProject.value) {
          await projectStore.editProject(projectData);
          triggerNotification('Project updated successfully!', 'success');
        } else {
          await projectStore.addProject(projectData);
          triggerNotification('Project created successfully!', 'success');
        }
        isModalVisible.value = false;
      } catch {
        triggerNotification('Failed to save project.', 'error');
      }
    };

    const deleteProject = async (projectId: string) => {
      if (confirm('Are you sure you want to delete this project?')) {
        try {
          await projectStore.deleteProject(projectId);
          triggerNotification('Project deleted successfully!', 'success');
        } catch {
          triggerNotification('Failed to delete project.', 'error');
        }
      }
    };

    const navigateToProject = (projectId: string) => {
      router.push(`/project/${projectId}`);
    };

    const closeModal = () => {
      isModalVisible.value = false;
      selectedProject.value = null;
    };

    const formatDate = (date: string): string => {
      return new Date(date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
    };

    return {
      filters,
      filteredAndSortedProjects,
      sortBy,
      openAddProjectModal,
      openEditProjectModal,
      handleProjectSubmit,
      deleteProject,
      closeModal,
      navigateToProject,
      formatDate,
      isModalVisible,
      selectedProject,
      tableRef,
      showNotification,
      notificationMessage,
      notificationType,
    };
  },
});
</script>

<template>
  <div class="projects-container">
    <h1>Projects</h1>
    <button class="primary-btn" @click="openAddProjectModal">Add Project</button>

    <div class="filters">
      <input v-model="filters.id" class="filter-input" type="text" placeholder="Filter by ID" />
      <input v-model="filters.name" class="filter-input" type="text" placeholder="Filter by Name" />
      <input
        v-model="filters.description"
        class="filter-input"
        type="text"
        placeholder="Filter by Description"
      />
      <select v-model="filters.status" class="filter-select">
        <option value="">All</option>
        <option value="active">Active</option>
        <option value="complete">Complete</option>
      </select>
      <input v-model="filters.created_at" class="filter-input" type="date" />
    </div>

    <!-- Table -->
    <div class="table-wrapper" ref="tableRef">
      <table>
        <thead>
          <tr>
            <th class="resizable">ID <button class="sort-btn" @click="sortBy('id')">Sort</button></th>
            <th class="resizable">Name <button class="sort-btn" @click="sortBy('name')">Sort</button></th>
            <th class="resizable">Description</th>
            <th class="resizable">Status <button class="sort-btn" @click="sortBy('status')">Sort</button></th>
            <th class="resizable">Task Count <button class="sort-btn" @click="sortBy('taskCount')">Sort</button></th>
            <th class="resizable">Created At <button class="sort-btn" @click="sortBy('created_at')">Sort</button></th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="project in filteredAndSortedProjects"
            :key="project.id"
            class="table-row"
            @click="navigateToProject(project.id)"
          >
            <td>{{ project.id }}</td>
            <td>{{ project.name }}</td>
            <td>{{ project.description }}</td>
            <td>{{ project.status }}</td>
            <td>{{ project.taskCount }}</td>
            <td>{{ formatDate(project.created_at) }}</td>
            <td>
              <button style="margin-right: 5px;" class="sort-btn" @click.stop="openEditProjectModal(project)">Edit</button>
              <button class="sort-btn" @click.stop="deleteProject(project.id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <AddProjectModal
      :visible="isModalVisible"
      :project="selectedProject"
      @close="closeModal"
      @submit="handleProjectSubmit"
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
