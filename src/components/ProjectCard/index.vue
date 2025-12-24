<script setup>
import { ref, onMounted } from 'vue'
import ProjectIcon from '@/assets/icons/svg/project.svg'
import NoDataIcon from "@/assets/icons/svg/noData.svg"
import { useRouter } from 'vue-router'
import useMainStore from '@/stores/main'
import useElMessage from '@/hooks/useElMessage'
import { getProjectNotesApi, updateProjectApi } from '@/api/project'
import { DocumentCopy, EditPen } from '@element-plus/icons-vue'
import Cookies from 'js-cookie'
import useCustomConfirm from '@/hooks/useCustomConfirm'
const router = useRouter()
const mainStore = useMainStore()
const elMessage = useElMessage()
const customConfirm = useCustomConfirm()
const props = defineProps({
  projectInfo: {
    type: Object,
    required: true
  }
})
const emits = defineEmits(['refresh'])


const recentNoteList = ref([])

function goToProject(projectId) {
  mainStore.setCurrentProjectId(projectId)
  router.push({ name: 'projectDashboard' })
}

function goToNote(projectId, noteId) {

  mainStore.setCurrentProjectId(projectId)
  Cookies.set('noteId', noteId)
  router.push({ name: 'projectDashboard' })
}

const getProjectNotes = async () => {
  try {
    const res = await getProjectNotesApi({ isRecent: true, projectId: props.projectInfo.id })
    recentNoteList.value = res.data
  } catch (error) {
    elMessage.error('获取项目笔记列表失败：' + error.message)
  }
}

// 编辑项目名称
const isShowActions = ref(false)
const toggleActions = () => {
  isShowActions.value = !isShowActions.value
}

const isEditProjectName = ref(false) // 是否编辑项目名称
const projectName = ref(props.projectInfo.name) // 编辑项目名称
const updateProjectName = () => {
  if (props.projectInfo.name === projectName.value) {
    elMessage.warning("项目名称未修改")
    isEditProjectName.value = false
    return
  }
  customConfirm.confirm({
    title: '确认修改',
    content: `确定要修改项目名称【${props.projectInfo.name}】->【${projectName.value}】吗？`,
    confirmText: '确定',
    cancelText: '取消',
  }).then((sure) => {
    if (!sure) {
      isEditProjectName.value = false
      projectName.value = props.projectInfo.name
      return
    }
    if (sure) {
      console.log(props.projectInfo.id)
      updateProjectApi(props.projectInfo.id, {
        name: projectName.value
      }).then(() => {
        elMessage.success("修改成功")
        emits('refresh')
      }).catch(err => {
        elMessage.error("修改失败：", err)
      }).finally(() => {
        isEditProjectName.value = false
      })
    }
  })
  // isEditProjectName.value = false
}

onMounted(() => {
  getProjectNotes()
})
</script>
<template>
  <div class="project-card lf-div-shadow p-4 rounded-3xl hover:shadow-none bg-background-primary"
    style="border: 1px solid rgba(2, 4, 26, 0.16);" @mouseenter="toggleActions" @mouseleave="toggleActions">
    <div class="w-50 h-40 overflow-hidden flex flex-col">
      <div class="header flex items-center justify-between cursor-pointer" :title="projectInfo.name"
        @click="goToProject(projectInfo.id)">
        <ProjectIcon class="w-7 h-7 flex-shrink-0" />
        <el-input v-model="projectName" v-if="isEditProjectName" @click.stop @keydown.enter="updateProjectName"
          @blur="updateProjectName"></el-input>
        <div class="title line-clamp-1 font-bold text-xl" v-else>{{ projectInfo.name }}</div>
      </div>
      <div class="time text-sm text-primary-50 flex m-t-2">{{ projectInfo.updated_at }}</div>
      <template v-if="recentNoteList.length === 0">
        <div class="flex flex-col items-center justify-center">
          <NoDataIcon class="w-15 h-15 m-auto" />
          <span class="text-sm text-primary-100">暂无数据</span>
        </div>
      </template>
      <el-scrollbar class="note flex-1 m-t-2" v-else>
        <template v-for="note in recentNoteList" :key="note.id">
          <div
            class="cursor-pointer text-sm text-primary-500 p-y-1 flex justify-between hover:bg-background-hover p-x-2 rounded underline underline-dashed w-full overflow-hidden flex items-center"
            @click="goToNote(projectInfo.id, note.id)">
            <DocumentCopy class="w-4 h-4 m-r-2" />
            <div class="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">{{ note.title }}</div>
            <!-- <span>{{ note.updated_at }}</span> -->
          </div>
        </template>
      </el-scrollbar>
    </div>

    <transition enter-active-class="transition-all duration-300 ease-out"
      leave-active-class="transition-all duration-300 ease-in" enter-from-class="opacity-0 scale-75"
      leave-to-class="opacity-0 scale-75">
      <div class="absolute top-2 right-2 flex items-center" v-show="isShowActions" @click.stop>
        <slot name="actions">
          <EditPen class="w-6 h-6 rounded-50% bg-background-light p-1 m-x-1 hover:text-font-hover cursor-pointer"
            @click="isEditProjectName = true" />
        </slot>
      </div>
    </transition>
  </div>
</template>


<style scoped>
.project-card {
  will-change: transform, box-shadow;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.project-card:hover {
  transform: translateY(-8px);
}
</style>