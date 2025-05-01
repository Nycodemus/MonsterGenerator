<script setup lang="ts">
import MonsterGenerator from './components/MonsterGenerator.vue'
</script>

<template>
  <v-app>
    <v-app-bar color="primary" density="compact">
      <v-app-bar-title>D&D Monster Generator</v-app-bar-title>
    </v-app-bar>

    <v-main>
      <MonsterGenerator />
    </v-main>

    <v-footer app class="text-center d-flex justify-center">
      <div>&copy; {{ new Date().getFullYear() }} — D&D Monster Generator</div>
    </v-footer>
  </v-app>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Serif:ital,wght@0,400;0,700;1,400;1,700&display=swap');

body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

#app {
  width: 100%;
  min-height: 100vh;
}
</style>
