<template>
  <div class="home-container">
    <h1>Welcome</h1>
    <div class="button-group">
      <router-link to="/div-rectangles">
        <button class="styled-button">Div rectangles</button>
      </router-link>
      <router-link to="/canvas-rectangles">
        <button class="styled-button">Canvas Rectangles</button>
      </router-link>
      <router-link to="/canvas-three-cubes">
        <button class="styled-button">Three Cubes</button>
      </router-link>
      <router-link to="/canvas-three-instanced">
        <button class="styled-button">Canvas Three</button>
      </router-link>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Home',
});
</script>

<!-- Global styles: Import Inter font and remove default body padding/margin -->
<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');

body {
  margin: 0;
  padding: 0;
  font-family: 'Inter', sans-serif;
}
</style>

<!-- Scoped styles for the Home component -->
<style scoped>
.home-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #121212; /* Truly dark background */
  color: #f1f1f1; /* Light text color */
  text-align: center;
}

.button-group {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.styled-button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  background-color: #2c2c2c; /* Dark button background */
  color: #fff;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.styled-button:hover {
  background-color: #3c3c3c;
}

/* Remove default link styling */
.router-link-active,
.router-link-exact-active {
  text-decoration: none;
}
</style>
