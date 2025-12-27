<script setup>
import ProjectIcon from "@/assets/icons/svg/project.svg"
import ProjectFullIcon from "@/assets/icons/svg/projectFull.svg"
import SearchIcon from "@/assets/icons/svg/search.svg"
import SettingIcon from "@/assets/icons/svg/setting.svg"
import LogoIcon from "@/assets/icons/svg/logo.svg"
import NoDataIcon from "@/assets/icons/svg/noData.svg"
import { computed } from "vue"

import useMainStore from '@/stores/main'
import useProjectStore from "@/stores/project"
const mainStore = useMainStore()
const projectStore = useProjectStore()
import useUserStore from "@/stores/user"
import { useRouter } from "vue-router"
const userStore = useUserStore()
const router = useRouter()


const emit = defineEmits(['toSearch', 'switchAccountSetting'])
const props = defineProps({
  recentProjectListLoading: {
    type: Boolean,
    default: false
  },
})

const projectListLoading = computed(() => {
  return props.recentProjectListLoading
})
function toSearch() {
  emit('toSearch')
}
function openProject(project) {
  mainStore.setCurrentProjectId(project.id)
  router.push({ name: 'projectDashboard' })
}
function openAccountSetting() {
  emit('switchAccountSetting', true)
}
function closeAccountSetting() {
  emit('switchAccountSetting', false)
}
</script>
<template>
  <div class="top flex-1 flex flex-col justify-start overflow-hidden">
    <div class="logo flex items-center justify-between">
      <!-- <ProjectFullIcon class="m-r-1" /> -->
      <div class="flex items-center cursor-pointer" @click="closeAccountSetting">
        <!-- <img src="@/assets/icons/images/logo.png" class="w-10" alt=""> -->
        <LogoIcon class="w-10 h-8 m-r-3" />
        <div class="text-primary-900 font-bold text-base">LiFocus</div>
      </div>
      <SearchIcon class="c-primary-500 hover:c-font-hover w-4 h-4 cursor-pointer" @click="toSearch" />
    </div>

    <div class="project-list-container m-t-4 m-l-3px flex-1 flex flex-col overflow-hidden">
      <div class="project-header flex items-center cursor-pointer hover:bg-background-hover p-2 rounded"
        @click="closeAccountSetting">
        <ProjectFullIcon class="m-r-1 w-6 h-6" />
        <div class="text-base">项目</div>
      </div>

      <div class="project-list m-t-4 flex-1 flex flex-col overflow-hidden relative p-2">
        <div class="c-primary-300 text-xs">近期项目</div>

        <el-scrollbar class="animate__animated animate__fadeInLeft flex-1" v-loading="projectListLoading">
          <template v-if="projectStore.recentProjectList.length > 0">
            <template v-for="item in projectStore.recentProjectList" :key="item">
              <div class="project-item flex items-center cursor-pointer hover:bg-background-hover p-2 rounded"
                :title="item.name" @click="openProject(item)">
                <ProjectIcon class="m-r-1 w-4 h-4 flex-shrink-0" v-if="!item.icon" />
                <img :src="item.icon" class="m-r-1 w-4 h-4 flex-shrink-0" v-else />
                <div class="project-item-title text-ellipsis overflow-hidden whitespace-nowrap">{{ item.name }}</div>
                <!-- <div>{{ item }}</div> -->
              </div>
            </template>
          </template>
          <template v-else>
            <NoDataIcon class="w-1/2 h-1/2 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </template>
        </el-scrollbar>
      </div>
    </div>
  </div>

  <div class="bottom flex justify-between items-center m-l-3px">
    <img src="@/assets/icons/images/favicon1.jpg" class="w-8 h-8 rounded" alt="avator">
    <div class="nickname p-2 font-bold text-overflow">{{ userStore.username }}
    </div>
    <SettingIcon class="w-5 h-5 cursor-pointer hover:c-font-hover" @click="openAccountSetting" />
  </div>
</template>


<style scoped></style>