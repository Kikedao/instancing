<template>
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'App',
});
</script>
<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');

body {
  margin: 0;
  padding: 0;
  font-family: 'Inter', sans-serif;
}
</style>