<script setup>
import LogoIcon from '@/assets/icons/svg/logo.svg'
import ProjectSelect from '@/components/ProjectSelect/index.vue'
import { useRouter } from 'vue-router'
import useMainStore from '@/stores/main'
import useUserStore from '@/stores/user'

import { computed, onMounted, ref, watch, markRaw } from 'vue'
import TabSwitch from '@/components/TabSwitch/index.vue'
import { ChatLineRound, Connection, Edit } from '@element-plus/icons-vue'
const router = useRouter()
const mainStore = useMainStore()
const userStore = useUserStore()
const projectId = computed(() => mainStore.currentProjectId)
function toDashboard() {
  router.push({ name: 'dashboard' })
}

const tabs = ref([
  { id: 'projectDialog', label: '对话', icon: markRaw(ChatLineRound) },
  { id: 'projectDashboard', label: '工作台', icon: markRaw(Connection) },
  { id: 'projectNoteCreate', label: '创作', icon: markRaw(Edit) }])
const tabType = ref('projectDashboard') // projectDialog, projectDashboard, projectNoteCreate
watch(tabType, (newTabType) => {
  router.push({ name: newTabType })
})
onMounted(() => {
})
</script>
<template>
  <div class="top-bar flex justify-between items-center">
    <div class="left flex items-center">
      <LogoIcon class="w-10 h-8 m-r-3 cursor-pointer" @click="toDashboard" />
      <ProjectSelect :projectId="projectId" optionContainerWidth="180px" />
    </div>

    <div class="mid">
      <TabSwitch v-model="tabType" :tabs="tabs" />
    </div>

    <div class="right flex items-center">
      <img src="@/assets/icons/images/favicon1.jpg" class="w-6 h-6 rounded" alt="avator">
      <div class="nickname p-2 font-bold text-overflow">{{ userStore.username }}</div>
    </div>
  </div>
</template>


<style scoped></style>