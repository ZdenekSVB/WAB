<template>
  <v-container>
    <h2 class="text-h4 mb-4">Chat</h2>
    <div class="chat-container">
      <div v-for="(message, index) in messages" :key="index" class="message">
        <strong>{{ message.user }}:</strong> {{ message.text }}
      </div>
    </div>
    <v-text-field
        v-model="newMessage"
        label="Type a message..."
        @keyup.enter="sendMessage"
        outlined
    ></v-text-field>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { io } from 'socket.io-client';
import { useAuthStore } from '../stores/authStore';
import axios from 'axios';

export default defineComponent({
  name: 'Chat',
  setup() {
    const authStore = useAuthStore();
    const socket = io('http://localhost:4000');
    const messages = ref<{ user: string; text: string }[]>([]);
    const newMessage = ref('');

    onMounted(async () => {
      // Načtení historie zpráv
      try {
        const response = await axios.get('/api/messages');
        messages.value = response.data;
      } catch (error) {
        console.error('Error loading messages:', error);
      }

      // Poslouchání nových zpráv
      socket.on('receiveMessage', (message: { user: string; text: string }) => {
        messages.value.push(message);
      });
    });

    const sendMessage = () => {
      if (newMessage.value.trim()) {
        const message = {
          user: authStore.user?.email || 'Anonymous',
          text: newMessage.value,
        };
        socket.emit('sendMessage', message); // Odeslání zprávy na server
        newMessage.value = ''; // Vyčištění vstupního pole
      }
    };

    return {
      messages,
      newMessage,
      sendMessage,
    };
  },
});
</script>

<style scoped>
.chat-container {
  max-height: 400px;
  overflow-y: auto;
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 20px;
}

.message {
  margin-bottom: 10px;
}
</style>