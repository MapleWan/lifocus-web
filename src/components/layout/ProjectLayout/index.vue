<script setup>
import TopBar from './components/TopBar.vue'
</script>
<template>
  <div class="project-layout p-4 bg-background-primary h-full flex flex-col">
    <TopBar />
    <RouterView class="flex-1" />
  </div>
</template>


<style scoped></style>