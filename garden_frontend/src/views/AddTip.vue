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
                :rules="[titleRule]"
              />
              <v-textarea
                v-model="content"
                label="Obsah"
                required
                outlined
                :rules="[contentRule]"
              />
              <v-btn type="submit" color="primary">Přidat</v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
export default {
  name: 'AddTip',
  data() {
    return {
      title: '',
      content: '',
      titleRule: [(v: string) => !!v || 'Titulek je povinný'],
      contentRule: [(v: string) => !!v || 'Obsah je povinný'],
    };
  },
  methods: {
    addTip() {
      console.log('Přidávám nový tip:', this.title);
    },
  },
};
</script>
