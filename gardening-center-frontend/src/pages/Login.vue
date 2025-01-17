<template>
  <div>
    <h2>Login</h2>
    <form @submit.prevent="login">
      <input type="email" v-model="email" placeholder="Email" />
      <input type="password" v-model="password" placeholder="Password" />
      <button type="submit">Login</button>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import axios from "axios";

export default defineComponent({
  setup() {
    const email = ref("");
    const password = ref("");

    const login = async () => {
      try {
        await axios.post("/auth/login", { email: email.value, password: password.value });
        alert("Login successful!");
      } catch (error) {
        alert("Login failed!");
      }
    };

    return { email, password, login };
  },
});
</script>
