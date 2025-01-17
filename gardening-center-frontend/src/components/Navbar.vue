<template>
  <nav>
    <router-link to="/">Home</router-link>
    <router-link to="/products">Products</router-link>
    <router-link to="/orders">Orders</router-link>
    <router-link to="/login">Login</router-link>
    <router-link to="/register">Register</router-link>
  </nav>
</template>

<style>
nav {
  display: flex;
  gap: 10px;
  background-color: #f4f4f4;
  padding: 10px;
}
</style>
