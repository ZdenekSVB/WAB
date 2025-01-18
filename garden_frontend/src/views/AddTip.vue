<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card>
          <v-card-title>Přidat nový tip</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="addTip">
              <v-text-field
                  v-model="title"
                  label="Titulek"
                  required
                  outlined
                  :rules="titleRules"
              />
              <v-textarea
                  v-model="content"
                  label="Obsah"
                  required
                  outlined
                  :rules="contentRules"
              />
              <v-btn type="submit" color="primary" :disabled="loading">
                {{ loading ? "Odesílání..." : "Přidat" }}
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useRouter } from "vue-router"; // Importuje funkci useRouter

export default defineComponent({
  name: "AddTip",
  setup() {
    const router = useRouter(); // Získá instanci routeru
    return { router };
  },
  data() {
    return {
      title: "", // Název tipu
      content: "", // Obsah tipu
      loading: false, // Stav odesílání
      titleRules: [
        (v: string) => (v && v.length > 0) || "Titulek je povinný",
      ],
      contentRules: [
        (v: string) => (v && v.length > 0) || "Obsah je povinný",
      ],
    };
  },
  methods: {
    async addTip() {
      if (!this.title || !this.content) {
        console.error("Vyplňte všechna pole!");
        return;
      }

      this.loading = true;
      try {
        // Simulace odeslání tipu na backend
        console.log("Odesílání tipu", { title: this.title, content: this.content });

        // Reset formuláře
        this.title = "";
        this.content = "";

        // Přesměrování zpět na stránku s tipy
        this.router.push("/tips"); // Použití routeru pro přesměrování
      } catch (error) {
        console.error("Chyba při přidávání tipu:", error);
      } finally {
        this.loading = false;
      }
    },
  },
});
</script>

<style scoped>
/* Stylování karty */
.v-card {
  margin-top: 20px;
}
</style>
