<script setup>
import useMainStore from '@/stores/main';
const mainStore = useMainStore();
mainStore
</script>
<template>
  <div class="dialog-container">
    对话 {{ mainStore.currentProjectId }}
  </div>
</template>


<style scoped></style>