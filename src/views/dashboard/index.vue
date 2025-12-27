<script setup>
import useElMessage from "@/hooks/useElMessage"
import useMainStore from "@/stores/main"
import LeftToolbar from "./components/LeftToolbar.vue"
import RightContent from "./components/RightContent.vue"
import TopToolbar from "./components/TopToolbar.vue"
import AccountSetting from "./components/AccountSetting.vue"
import { ref, onMounted } from "vue"

import useProjectStore from "@/stores/project"

const elMessage = useElMessage()
const mainStore = useMainStore()
const projectStore = useProjectStore()

// 打开搜索框
const toSearch = () => {
  elMessage.warning('【TODO】打开搜索框..')
}

const showAccountSetting = ref(false)
function switchShowAccountSetting(val) {
  showAccountSetting.value = val
}

const getRecentProjectList = () => {
  recentProjectListLoading.value = true
  projectStore.fetchRecentProjects().finally(() => {
    recentProjectListLoading.value = false
  })
}
const recentProjectListLoading = ref(false)
onMounted(() => {
  getRecentProjectList()
  if (projectStore.projectList.length === 0)
    projectStore.fetchProjects()
})

</script>
<template>
  <div class="dashboard-container p-4 bg-background-primary h-full flex" :class="{ 'flex-col': !mainStore.isPc }">
    <div v-if="mainStore.isPc" class="left-container w-30% max-w-75 h-full bg-background-primary flex flex-col m-r-4">
      <LeftToolbar :recentProjectListLoading="recentProjectListLoading" @toSearch="toSearch"
        @switchAccountSetting="switchShowAccountSetting" />
    </div>
    <div v-else class="w-full">
      <TopToolbar @switchAccountSetting="switchShowAccountSetting" />
    </div>

    <div class="right-container flex-1 bg-white rounded-xl p-y-6 overflow-hidden">
      <transition name="fade" mode="out-in">
        <RightContent class="w-full" v-if="!showAccountSetting" key="right-content" />
        <AccountSetting class="w-full" v-else key="account-setting" />
      </transition>
    </div>
  </div>
</template>


<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>