<script setup>
import { useRouter } from 'vue-router'
import { getProjectNotesApi } from '@/api/project'
const router = useRouter()
import useMainStore from '@/stores/main'
import { computed, onMounted, watch, ref } from 'vue';
const mainStore = useMainStore();

const currentProjectId = computed(() => mainStore.currentProjectId)
const projectNoteList = ref([])
const getProjectNoteList = () => {
  getProjectNotesApi().then(res => {
    projectNoteList.value = res.data
  })
}
watch(() => currentProjectId.value, () => {
  console.log(currentProjectId.value)
  getProjectNoteList()
}, { immediate: true })

onMounted(() => {
})
</script>
<template>
  <div class="dashboard-container">
    项目主页 {{ mainStore.currentProjectId }}
  </div>
</template>


<style scoped></style>