<script setup>
import useMainStore from '@/stores/main';
const mainStore = useMainStore();

</script>
<template>
  <div class="create-container">
    创作 {{ mainStore.currentProjectId }}
  </div>
</template>


<style scoped></style>