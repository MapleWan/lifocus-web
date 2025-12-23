<script setup>
import { Plus, Clock, Files, Sort } from '@element-plus/icons-vue'
import ActiveIcon from '@/assets/icons/svg/active.svg'
import CardIcon from '@/assets/icons/svg/card.svg'
import ListIcon from '@/assets/icons/svg/list.svg'
import RecentNoteList from './RecentNoteList.vue'
import ProjectListCard from './ProjectListCard.vue'
import projectListTable from './ProjectListTable.vue'
import useElMessage from '@/hooks/useElMessage'
import { ref, computed, onMounted } from 'vue'

import { getUserProjectsApi, addProjectApi } from "@/api/project"
import { getRecentNoteListApi } from "@/api/note"
const elMessage = useElMessage()
const addProjectDialogVisible = ref(false)
const projectName = ref('')
function openAddProjectDialog() {
  addProjectDialogVisible.value = true
}
function addProject() {
  if (projectName.value) {
    addProjectApi({ name: projectName.value }).then(() => {
      elMessage.success('新增项目成功')
      addProjectDialogVisible.value = false
      projectName.value = ''
      getProjectList(currentProjectTabType.value)
    }).catch(err => {
      elMessage.error('新增项目失败: ' + err)
    })
  } else {
    elMessage.warning('项目名称不能为空')
  }
}
const recentNoteList = ref([])
const recentNoteLoading = ref(false)
const projectList = ref([])
const projectListLoading = ref(false)
const noteListContainerRef = ref(null)
const currentProjectTabType = ref('active') // active archived
function changeProjectTabType(type) {
  currentProjectTabType.value = type
  getProjectList(type)
}
const listType = ref('card') // card list
function changeListType(type) {
  listType.value = type
}

const getProjectList = (status) => {
  projectListLoading.value = true
  getUserProjectsApi({ status }).then(res => {
    projectList.value = res.data
  }).catch(err => {
    elMessage.error('获取项目列表失败: ' + err)
  }).finally(() => {
    projectListLoading.value = false
  })
}

const getRecentNoteList = () => {
  recentNoteLoading.value = true
  getRecentNoteListApi({ isRecent: 1 }).then(res => {
    recentNoteList.value = res.data
  }).catch(err => {
    elMessage.error('获取最近笔记列表失败: ' + err)
  }).finally(() => {
    recentNoteLoading.value = false
  })
}

function projectListSort(type, direction) {
  console.log(projectList.value)
  projectList.value = projectList.value.sort((a, b) => {
    if (['updated_at', 'created_at'].includes(type)) {
      return (new Date(b[type]) - new Date(a[type])) * direction
    }
    if (['name'].includes(type))
      return (a[type].localeCompare(b[type])) * direction
    else {
      return (a[type] - b[type]) * direction
    }
  })
}

function handleCommand(command) {
  let [type, direction] = command.split('-')
  direction = direction === 'down' ? 1 : -1
  projectListSort(type, direction)
}

onMounted(() => {
  getProjectList(currentProjectTabType.value)
  getRecentNoteList()
})
</script>
<template>
  <div class="h-full w-full overflow-hidden">
    <el-scrollbar class="flex flex-col h-full w-full p-x-10">
      <div class="header">
        <div class="header-title text-2xl font-bold m-b-4">项目</div>
        <el-button type="primary" :icon="Plus" round @click="openAddProjectDialog">新增项目</el-button>
      </div>

      <div class="recent-container w-full">
        <div class="recent-title flex items-center m-t-6 m-b-4">
          <Clock class="w-4 h-4 c-primary-200" />
          <span class="m-l-2 text-primary-200">最近</span>
        </div>
      </div>
      <div ref="noteListContainerRef" class="note-list-container w-full overflow-x-hidden"
        v-loading="recentNoteLoading">
        <RecentNoteList :recentNoteList="recentNoteList" />
      </div>

      <div class="project-container flex-1 flex flex-col overflow-hidden">
        <div class="project-container-head m-t-8 flex justify-between">
          <div class="flex items-center select-none">
            <div class="flex items-center text-primary-200 m-r-4 cursor-pointer"
              :class="{ 'text-primary-900!': currentProjectTabType === 'active' }"
              @click="changeProjectTabType('active')">
              <ActiveIcon class="w-4 h-4" />
              <div class="m-l-2">活跃中</div>
            </div>

            <div class="flex items-center text-primary-200 cursor-pointer"
              :class="{ 'text-primary-900!': currentProjectTabType === 'archived' }"
              @click="changeProjectTabType('archived')">
              <Files class="w-4 h-4" />
              <div class="m-l-2">归档</div>
            </div>

            <el-dropdown trigger="click" v-if="listType === 'card'" @command="handleCommand">
              <span class="el-dropdown-link">
                <div class="p-2 m-l-4 rounded-50% cursor-pointer hover:bg-background-hover">
                  <Sort class="w-4 h-4" />
                </div>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="updated_at-down">更新日期(&#8595;)</el-dropdown-item>
                  <el-dropdown-item command="updated_at-up">更新日期(&#8593;)</el-dropdown-item>
                  <el-dropdown-item command="created_at-down">创建日期(&#8595;)</el-dropdown-item>
                  <el-dropdown-item command="created_at-up">创建日期(&#8593;)</el-dropdown-item>
                  <el-dropdown-item command="name-down">项目名称(&#8595;)</el-dropdown-item>
                  <el-dropdown-item command="name-up">项目名称(&#8593;)</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>

          <div class="type-change-bar rounded-2xl bg-background-hover flex items-center p-y-1 p-x-2 relative z-[1]">
            <div class="absolute rounded-2xl bg-white w-8 h-6 transition-all duration-300 ease-in-out z-[2]"
              :class="listType === 'card' ? 'left-1' : 'left-9'">
            </div>
            <div class="rounded-50% p-1 m-r-2 flex items-center justify-center cursor-pointer z-[3]"
              @click="changeListType('card')">
              <CardIcon class="w-4 h-4" :class="listType === 'card' ? 'text-primary-900' : 'text-primary-200'" />
            </div>
            <div class="rounded-50% p-1 flex items-center justify-center cursor-pointer z-[3]"
              @click="changeListType('list')">
              <ListIcon class="w-4 h-4" :class="listType === 'list' ? 'text-primary-900' : 'text-primary-200'" />
            </div>
          </div>
        </div>
        <div class="flex-1 overflow-hidden" v-loading="projectListLoading">
          <ProjectListCard :projectList="projectList" v-show="listType === 'card'" />
          <projectListTable :projectList="projectList" v-show="listType === 'list'" />
        </div>
      </div>
    </el-scrollbar>
    <el-dialog v-model="addProjectDialogVisible" title="新增项目">
      <el-input placeholder="请输入项目名称" v-model="projectName" @keydown.enter="addProject" maxlength="64"
        show-word-limit />
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="addProjectDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="addProject">
            确认
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>

</template>


<style scoped></style>