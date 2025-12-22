<script setup>
import TopBar from './components/TopBar.vue'
</script>
<template>
  <div class="project-layout p-4 bg-background-primary h-full flex flex-col">
    <TopBar />
    <div class="flex-1 overflow-hidden m-1">
      <RouterView class="h-full w-full" />
    </div>
  </div>
</template>


<style scoped></style>