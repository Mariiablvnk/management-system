<template>
    <div  v-if="visible" :class="['notification', type]">
      <p>{{ message }}</p>
      <button @click="closeNotification" class="close-btn">✖</button>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  
  export default defineComponent({
    name: 'PushNotification',
    props: {
      visible: {
        type: Boolean,
        required: true,
      },
      message: {
        type: String,
        required: true,
      },
      type: {
        type: String,
        default: 'success', 
        validator: (value: string) => ['success', 'error'].includes(value),
      },
    },
    emits: ['close'],
    setup(_, { emit }) {
      const closeNotification = () => {
        emit('close');
      };
  
      return { closeNotification };
    },
  });
  </script>
  
