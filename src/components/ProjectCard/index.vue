<script setup>
import { ref } from 'vue'
import NoteCard from '@/components/NoteCard/index.vue'
import ProjectIcon from '@/assets/icons/svg/project.svg'
import NoDataIcon from "@/assets/icons/svg/noData.svg"

import useElMessage from '@/hooks/useElMessage'
const elMessage = useElMessage()

const props = defineProps({
  projectInfo: {
    type: Object,
    required: true
  }
})

const recentNoteList = ref([])

function goToProject(projectId) {
  elMessage.warning(`【TODO】Go to project, projectId: ${projectId}`)
}

function goToNote(projectId, noteId) {
  elMessage.warning(`【TODO】Go to note, projectId: ${projectId}, noteId: ${noteId}`)
}
</script>
<template>
  <div class="project-card lf-div-shadow p-4 rounded-3xl hover:shadow-none bg-background-primary"
    style="border: 1px solid rgba(2, 4, 26, 0.16);">
    <div class="w-50 h-40 overflow-hidden flex flex-col">
      <div class="header flex items-center justify-between cursor-pointer" :title="projectInfo.name"
        @click="goToProject(projectInfo.id)">
        <ProjectIcon class="w-7 h-7 flex-shrink-0" />
        <div class="title line-clamp-1 font-bold text-xl">{{ projectInfo.name }}</div>
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
            class="cursor-pointer text-sm text-primary-500 p-y-1 flex justify-between hover:bg-background-hover p-x-2 rounded"
            @click="goToNote(projectInfo.id, note.id)">
            <span>{{ note.title }}</span>
            <!-- <span>{{ note.updated_at }}</span> -->
          </div>
        </template>
      </el-scrollbar>
    </div>
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