<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import type { Task } from '@/types/task';

export default defineComponent({
  name: 'AddTaskModal',
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    task: {
      type: Object as () => Task | null, 
      default: null,
    },
  },
  emits: ['close', 'submit'],
  setup(props, { emit }) {
    const formData = ref<Omit<Task, 'id' | 'project_id'>>({
      name: '',
      executor: '',
      status: 'to-do',
      due_date: '',
    });

    watch(
      () => props.task,
      (newTask) => {
        if (newTask) {
          formData.value = {
            name: newTask.name,
            executor: newTask.executor,
            status: newTask.status,
            due_date: newTask.due_date,
          };
        }
      },
      { immediate: true }
    );

    const closeModal = () => {
      emit('close');
    };

    const handleSubmit = () => {
      emit('submit', { ...formData.value });
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
      <h2>{{ task ? 'Edit task' : 'Add new task' }}</h2>
      <form @submit.prevent="handleSubmit">
        <div>
          <input
            id="name"
            v-model="formData.name"
            type="text"
            required
            placeholder="Enter name..."
          />
        </div>
        <div>

          <input
            id="executor"
            v-model="formData.executor"
            type="text"
            placeholder="Enter executor name..."
          />
        </div>
        <div>

          <select id="status" v-model="formData.status" required>
            <option value="to-do">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>
        <div>
          <input
            id="due_date"
            v-model="formData.due_date"
            type="date"
            required
          />
        </div>
        <div class="actions">
          <button type="submit">{{ task ? 'Update' : 'Add' }}</button>
          <button type="button" @click="closeModal">Cancel</button>
        </div>
      </form>
    </div>
  </div>
</template>

  
 