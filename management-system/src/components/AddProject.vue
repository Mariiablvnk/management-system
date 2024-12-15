<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import type { Project } from '@/types/project';

export default defineComponent({
  name: 'AddProjectModal',
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    project: {
      type: Object as () => Project | null,
      default: null,
    },
  },
  emits: ['close', 'submit'],
  setup(props, { emit }) {
    const formData = ref<Omit<Project, 'id' | 'taskCount' | 'created_at'>>({
      name: '',
      description: '',
      status: 'active',
    });
  
    watch(
      () => props.project,
      (newProject) => {
        if (newProject) {
          formData.value = {
            name: newProject.name,
            description: newProject.description,
            status: newProject.status,
          };
        } else {
          formData.value = {
            name: '',
            description: '',
            status: 'active',
          };
        }
      },
      { immediate: true }
    );

    const closeModal = () => {
      emit('close');
    };


    const handleSubmit = () => {
  const projectData = {
    ...formData.value,
    id: props.project?.id || undefined, 
    created_at: props.project?.created_at || new Date().toISOString(), 
  };

  emit('submit', projectData); 
  closeModal();
};


    return {
      formData,
      closeModal,
      handleSubmit,
    };
  },
});
</script>

<template>
  <div v-if="visible" class="modal-backdrop">
    <div class="modal">
      <h2>{{ project ? 'Edit project' : 'Add project' }}</h2>
      <form @submit.prevent="handleSubmit">

        <div>
          <input
            id="name"
            v-model="formData.name"
            type="text"
            required
            placeholder="Enter project name.."
          />
        </div>

        <div>
          <textarea
            id="description"
            v-model="formData.description"
            placeholder="Enter description..."
          ></textarea>
        </div>
        <div>
          <select id="status" v-model="formData.status" required>
            <option value="active">Active</option>
            <option value="complete">Complete</option>
          </select>
        </div>
        <div class="actions">
          <button type="submit">{{ project ? 'Update' : 'Add' }}</button>
          <button type="button" @click="closeModal">Cancel</button>
        </div>
      </form>
    </div>
  </div>
</template>

