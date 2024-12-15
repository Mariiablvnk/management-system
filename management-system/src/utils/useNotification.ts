import { ref } from 'vue';

export function useNotification() {
  const showNotification = ref(false);
  const notificationMessage = ref('');
  const notificationType = ref<'success' | 'error'>('success');

  const triggerNotification = (message: string, type: 'success' | 'error' = 'success') => {
    notificationMessage.value = message;
    notificationType.value = type;
    showNotification.value = true;

    // Automatically hide notification after 3 seconds
    setTimeout(() => {
      showNotification.value = false;
    }, 3000);
  };

  return {
    showNotification,
    notificationMessage,
    notificationType,
    triggerNotification,
  };
}
