<script setup>
import { ArrowLeft, ArrowRight } from '@element-plus/icons-vue'
import NoteCard from '@/components/NoteCard/index.vue'
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import NoDataIcon from "@/assets/icons/svg/noData.svg"
import useMainStore from '@/stores/main'
import { useRouter } from 'vue-router'
import Cookies from 'js-cookie'

const mainStore = useMainStore()
const router = useRouter()

const props = defineProps({
  recentNoteList: {
    type: Array,
    required: true
  }
})

const noteListRef = ref()
const arrowLeftOrRight = ref('') // left(只显示左边) right(只显示右边) mid(两个都显示)
// 添加检查箭头显示状态的函数
function checkArrowVisibility() {
  const noteListScrollWidth = noteListRef.value?.scrollWidth || 0
  const noteListClientWidth = noteListRef.value?.clientWidth || 0
  const noteListScrollLeft = noteListRef.value?.scrollLeft || 0
  if (noteListScrollWidth <= noteListClientWidth) {
    // 内容未超出容器，不需要箭头
    arrowLeftOrRight.value = ''
  } else if (noteListScrollLeft === 0) {
    // 在最左侧，只能向右滚动
    arrowLeftOrRight.value = 'right'
  } else if (noteListScrollLeft === noteListScrollWidth - noteListClientWidth) {
    // 在最右侧，只能向左滚动
    arrowLeftOrRight.value = 'left'
  } else {
    // 在中间，可以双向滚动
    arrowLeftOrRight.value = 'mid'
  }
}

function handleNoteListScroll() {
  checkArrowVisibility()
}

// 添加 resize 事件处理函数
function handleResize() {
  checkArrowVisibility()
}

// 向左滚动
function scrollLeft() {
  const noteListScrollWidth = noteListRef.value?.scrollWidth || 0
  const moveDistance = noteListScrollWidth / props.recentNoteList.length
  if (noteListRef.value && noteListRef.value.scrollLeft > 0) {
    noteListRef.value.scrollLeft = noteListRef.value.scrollLeft - moveDistance > 0 ? noteListRef.value.scrollLeft - moveDistance : 0
  }
}
// 向右滚动
function scrollRight() {
  const noteListScrollWidth = noteListRef.value?.scrollWidth || 0
  const noteListClientWidth = noteListRef.value?.clientWidth || 0
  const moveDistance = noteListScrollWidth / props.recentNoteList.length
  if (noteListRef.value && noteListRef.value.scrollLeft < noteListScrollWidth - noteListClientWidth) {
    noteListRef.value.scrollLeft = noteListRef.value.scrollLeft + moveDistance < noteListScrollWidth - noteListClientWidth ? noteListRef.value.scrollLeft + moveDistance : noteListScrollWidth - noteListClientWidth
  }
}

function goToNote(projectId, noteId) {
  mainStore.setCurrentProjectId(projectId)
  Cookies.set('noteId', noteId)
  router.push({ name: 'projectDashboard' })
}

watch(() => props.recentNoteList, async () => {
  await nextTick()
  checkArrowVisibility()
})

onMounted(() => {
  noteListRef?.value.addEventListener('scroll', handleNoteListScroll)
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  noteListRef?.value.removeEventListener('scroll', handleNoteListScroll)
  window.removeEventListener('resize', handleResize)
})
</script>
<template>
  <div class="relative">
    <div ref="noteListRef" class="recent-note-list p-y-4 flex gap-3 overflow-x-auto">
      <template v-for="note in recentNoteList" :key="note.id">
        <NoteCard :noteInfo="note" @click="goToNote(note.project_id, note.id)" />
      </template>
    </div>
    <template v-if="recentNoteList.length === 0">
      <div class="w-full h-40 flex items-center justify-center">
        <NoDataIcon class="w-1/2 h-1/2 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2" />
      </div>
    </template>
    <template v-if="arrowLeftOrRight && arrowLeftOrRight !== 'right'">
      <div class="pointer-events-none absolute top-0 z-[5] h-full left-0"
        style="width: 40px; background: linear-gradient(to right, #fff, transparent);">
      </div>
      <el-button class="absolute top-50% left-0 transform -translate-y-50% z-[6]" :icon="ArrowLeft" circle
        @click="scrollLeft" />
    </template>
    <template v-if="arrowLeftOrRight && arrowLeftOrRight !== 'left'">
      <div class="pointer-events-none absolute top-0 z-[5] h-full right-0"
        style="width: 40px; background: linear-gradient(to left, #fff, transparent);">
      </div>
      <el-button class="absolute top-50% right-0 transform -translate-y-50% z-[6]" :icon="ArrowRight" circle
        @click="scrollRight" />
    </template>
  </div>
</template>

<style scoped>
.recent-note-list {
  scroll-behavior: smooth;
}

::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(3px);
  -webkit-backdrop-filter: blur(3px);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.6);
}
</style>