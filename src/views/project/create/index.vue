<script setup>
import useMainStore from '@/stores/main'
const mainStore = useMainStore()
import Editor from '@/components/Editor/index.vue'
import { watch, ref } from 'vue'
const content = ref('')
watch(content, (newValue) => {
  console.log(newValue)
})
</script>
<template>
  <div class="create-container">
    创作 {{ mainStore.currentProjectId }}
    <Editor v-model="content" />
  </div>
</template>

<style scoped></style>