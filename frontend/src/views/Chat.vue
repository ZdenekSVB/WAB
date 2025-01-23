<template>
  <v-container>
    <h2 class="text-h4 mb-4">Chat</h2>
    <div class="chat-container">
      <div v-for="(message, index) in sortedMessages" :key="index" class="message">
        <strong>{{ message.user }}:</strong> {{ message.text }}
        <span class="timestamp">{{ formatTimestamp(message.createdAt) }}</span>
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
import { defineComponent, ref, onMounted, computed } from 'vue';
import { io } from 'socket.io-client';
import { useAuthStore } from '../stores/authStore';
import axios from 'axios';
import { format } from 'date-fns';

export default defineComponent({
  name: 'Chat',
  setup() {
    const authStore = useAuthStore();
    const socket = io('http://localhost:4000');
    const messages = ref<{ user: string; text: string; createdAt: Date }[]>([]);
    const newMessage = ref('');

    // Seřazené zprávy (nejstarší nahoře, nejnovější dole)
    const sortedMessages = computed(() => {
      return [...messages.value].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    });

    onMounted(async () => {
      // Načtení historie zpráv
      try {
        console.log('Fetching messages...');
        const response = await axios.get('/api/messages');
        console.log('Messages loaded:', response.data);
        messages.value = response.data;
      } catch (error) {
        console.error('Error loading messages:', error);
      }

      // Poslouchání nových zpráv
      socket.on('receiveMessage', (message: { user: string; text: string; createdAt: Date }) => {
        console.log('New message received:', message);
        messages.value.push(message);
      });
    });

    const formatTimestamp = (timestamp: Date) => {
      return format(new Date(timestamp), 'HH:mm'); // Formát času (např. 14:30)
    };

    const sendMessage = () => {
      if (newMessage.value.trim()) {
        const message = {
          user: authStore.user?.email || 'Anonymous',
          text: newMessage.value,
          createdAt: new Date(), // Přidej čas odeslání
        };
        socket.emit('sendMessage', message); // Odeslání zprávy na server
        newMessage.value = ''; // Vyčištění vstupního pole
      }
    };

    return {
      sortedMessages, // Vrať seřazené zprávy
      newMessage,
      sendMessage,
      formatTimestamp,
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
  display: flex;
  flex-direction: column;
}

.message {
  margin-bottom: 10px;
}

.timestamp {
  font-size: 0.8em;
  color: #666;
  margin-left: 10px;
}
</style>