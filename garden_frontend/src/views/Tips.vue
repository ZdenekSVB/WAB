<template>
  <v-container>
    <v-row>
      <!-- Iterace přes dynamicky načtené tipy -->
      <v-col v-for="tip in tips" :key="tip._id" cols="12" md="4">
        <v-card>
          <v-card-title>{{ tip.title }}</v-card-title>
          <v-card-text>{{ tip.content }}</v-card-text>
          <v-card-actions>
            <v-btn :to="`/tips/${tip._id}`" color="primary">Detail</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Tlačítko pro přidání nového tipu -->
    <v-btn to="/tips/add" color="primary">Přidat tip</v-btn>
  </v-container>
</template>

<script lang="ts">
import { io, Socket } from "socket.io-client";
import axios from "axios";
import { defineComponent } from "vue";

// Definice typů pro Tip a Socket
interface Tip {
  _id: string;
  title: string;
  content: string;
}

export default defineComponent({
  name: "Tips",
  data() {
    return {
      tips: [] as Tip[], // Typujeme seznam tipů
      socket: null as Socket | null, // Typujeme socket a povolujeme null
    };
  },
  async mounted() {
    // Inicializace Socket.IO připojení
    this.socket = io("http://localhost:5000");

    // Poslouchání na nové tipy z backendu
    this.socket.on("tipUpdate", (newTip: Tip) => {
      if (newTip) {
        this.tips.push(newTip);
      }
    });

    // Načtení existujících tipů při načtení komponenty
    await this.fetchTips();
  },
  methods: {
    async fetchTips() {
      try {
        const response = await axios.get("http://localhost:5000/tips");
        this.tips = response.data;
      } catch (error) {
        console.error("Chyba při načítání tipů:", error);
      }
    },
  },
  beforeUnmount() {
    // Odpojení Socket.IO při zničení komponenty
    if (this.socket) {
      this.socket.disconnect();
    }
  },
});
</script>

<style scoped>
/* Přidání základního stylování */
.v-card {
  margin-bottom: 20px;
}
</style>
