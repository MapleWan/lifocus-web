<script setup>
import ProjectCard from '@/components/ProjectCard/index.vue'
import NoDataIcon from "@/assets/icons/svg/noData.svg"

defineProps({
  projectList: {
    type: Array,
    required: true
  }
})

const emits = defineEmits(['refresh'])

function refresh() {
  emits('refresh')
}
</script>
<template>
  <el-scrollbar class="p-x-1">
    <div class="flex flex-wrap gap-4 p-t-4" v-if="projectList.length > 0">
      <template v-for="project in projectList" :key="project.id">
        <ProjectCard :projectInfo="project" @refresh="refresh" />
      </template>
    </div>
    <div class="w-full flex items-center justify-center p-t-4 h-60" v-else>
      <NoDataIcon class="w-1/2 h-1/2" />
    </div>
  </el-scrollbar>
</template>


<style scoped></style>