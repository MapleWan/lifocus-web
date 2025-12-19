<script setup>
import useElMessage from "@/hooks/useElMessage"
import useMainStore from "@/stores/main"
import LeftToolbar from "./components/LeftToolbar.vue"
import RightContent from "./components/RightContent.vue"
import TopToolbar from "./components/TopToolbar.vue"
import AccountSetting from "./components/AccountSetting.vue"
import { ref, onMounted } from "vue"

import { getUserProjectsApi } from "@/api/project"

const elMessage = useElMessage()
const mainStore = useMainStore()

// 打开搜索框
const toSearch = () => {
  elMessage.warning('【TODO】打开搜索框..')
}

// 打开项目
const openProject = () => {
  elMessage.warning('【TODO】跳转项目...')
}

const showAccountSetting = ref(false)
function switchShowAccountSetting(val) {
  showAccountSetting.value = val
}

const recentProjectList = ref([])
const recentProjectListLoading = ref(false)
onMounted(() => {
  recentProjectListLoading.value = true
  getUserProjectsApi({ isRecent: 1 }).then(res => {
    recentProjectList.value = res.data
  }).catch(err => {
    elMessage.error('获取项目列表失败: ' + err)
  }).finally(() => {
    recentProjectListLoading.value = false
  })
})
</script>
<template>
  <div class="dashboard-container p-4 bg-background-primary h-full flex" :class="{ 'flex-col': !mainStore.isPc }">
    <div v-if="mainStore.isPc" class="left-container w-60 h-full bg-background-primary flex flex-col m-r-4">
      <LeftToolbar :recentProjectList="recentProjectList" :recentProjectListLoading="recentProjectListLoading"
        @toSearch="toSearch" @openProject="openProject" @switchAccountSetting="switchShowAccountSetting" />
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