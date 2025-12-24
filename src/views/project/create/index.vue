<script setup>
import SidebarDialog from '@/views/project/dialog/SidebarDialog.vue'
import { ArrowLeftBold, ArrowRightBold } from '@element-plus/icons-vue'
import LeftProjectNoteList from './components/LeftProjectNoteList.vue'
import NoteForm from '../dashboard/components/NoteForm.vue'
import useMainStore from '@/stores/main'
import { ref, watch, computed } from 'vue'

// 对话框折叠
const isDialogCollapsed = ref(true)
function toggleDialogCollapse() {
  isDialogCollapsed.value = !isDialogCollapsed.value
}

// 左侧项目笔记列表选择
function noteSelect(note) {
  if (note && note?.id) {
    noteInfo.value = note
    editorMode.value = 'edit'
  } else {
    noteInfo.value = { title: '', content: '' }
    editorMode.value = 'add'
  }
}
const leftProjectNoteListRef = ref()
function refreshProjectNodeList() {
  leftProjectNoteListRef?.value?.searchWithHistoryQuery()
}


// 笔记编辑相关
const editorMode = ref('add')
const noteInfo = ref({ title: '', content: '' })
function refresh() {
  refreshProjectNodeList()
}

const mainStore = useMainStore()
const currentProjectId = computed(() => mainStore.currentProjectId)
watch(() => currentProjectId.value, () => {
  noteInfo.value = { title: '', content: '' }
  refreshProjectNodeList()
}, { immediate: true })
</script>
<template>
  <div class="create-container flex">
    <div class="left flex flex-col h-full overflow-hidden bg-background-light rounded-lg p-2 w-20% m-r-2 min-w-75 ">
      <LeftProjectNoteList ref="leftProjectNoteListRef" @noteSelect="noteSelect" />
    </div>
    <div class="mid flex-1 flex flex-col h-full overflow-hidden bg-background-light rounded-lg p-2">
      <transition enter-active-class="duration-300 ease-out" enter-from-class="opacity-0 translate-x-5"
        leave-active-class="duration-300 ease-in" leave-to-class="opacity-0 translate-x-5">
        <NoteForm class="z-5 w-full h-full" :mode="editorMode" :noteInfo="noteInfo" :isShowBack="false"
          @refresh="refresh">
        </NoteForm>
      </transition>
    </div>
    <div class="right-dialog h-full overflow-hidden relative" :class="isDialogCollapsed ? 'w-6' : 'w-20%'">
      <transition enter-active-class="duration-500 ease-out" enter-from-class="opacity-0 translate-x-20%"
        leave-active-class="duration-500 ease-in" leave-to-class="opacity-0 translate-x-20%">
        <SidebarDialog class="m-l-4" v-show="!isDialogCollapsed" />
      </transition>
      <div class="z-6 absolute left-1 top-50% transform -translate-y-1/2" @click="toggleDialogCollapse">

        <transition mode="out-in" enter-active-class="duration-500 ease-out"
          enter-from-class="opacity-0 translate-x-20%" leave-active-class="duration-500 ease-in"
          leave-to-class="opacity-0 translate-x-20%">
          <ArrowLeftBold v-if="isDialogCollapsed" class="w-4 h-4 p-1 bg-background-light rounded-50% cursor-pointer"
            title="展开对话框" />
          <ArrowRightBold v-else class="w-4 h-4 p-1 bg-background-light  rounded-50% cursor-pointer" title="收起对话框" />
        </transition>
      </div>

    </div>
  </div>
</template>

<style scoped></style>