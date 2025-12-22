<script setup>
import SidebarDialog from '@/views/project/dialog/SidebarDialog.vue'
import NoteCard from '@/components/NoteCard/index.vue'
import NoDataIcon from "@/assets/icons/svg/noData.svg"
import { useRouter } from 'vue-router'
import { getProjectNotesApi } from '@/api/project'
import CardIcon from '@/assets/icons/svg/card.svg'
import ListIcon from '@/assets/icons/svg/list.svg'
import { Plus, DocumentCopy, EditPen, Delete } from '@element-plus/icons-vue'
const router = useRouter()
import useMainStore from '@/stores/main'
import { computed, onMounted, watch, ref } from 'vue'
import NoteForm from './components/NoteForm.vue'
import useElMessage from '@/hooks/useElMessage'
import useCustomConfirm from '@/hooks/useCustomConfirm'

import { deleteNoteApi } from '@/api/note'
const elMessage = useElMessage()
const customConfirm = useCustomConfirm()
const mainStore = useMainStore();
const isShowCreateNoteDialog = ref(false)

const currentProjectId = computed(() => mainStore.currentProjectId)
const projectNoteList = ref([])
const projectListLoading = ref(false)
const getProjectNoteList = () => {
  projectListLoading.value = true
  getProjectNotesApi().then(res => {
    projectNoteList.value = res.data
  }).finally(() => {
    projectListLoading.value = false
  })
}

const listType = ref('card') // card | list
function changeListType(type) {
  listType.value = type
}

// 新增笔记逻辑
const noteFormMode = ref('add') // add, view, edit
const noteInfo = ref({})
function openNoteForm(type, note) {
  noteFormMode.value = type
  noteInfo.value = note
  isShowCreateNoteDialog.value = true
}
function closeCreateNoteDialog(isNeedRefresh = false) {
  isShowCreateNoteDialog.value = false
  if (isNeedRefresh) {
    getProjectNoteList()
  }
}

// 删除笔记逻辑
function deleteNote(note) {

  customConfirm.confirm({
    title: '确认删除',
    content: `确定要删除笔记【${note.title}】吗？`,
    confirmText: '确定',
    cancelText: '取消',
  }).then((sure) => {
    if (!sure) return

    deleteNoteApi(note.id).then(res => {
      elMessage.success(res.message)
      getProjectNoteList()
    }).catch(err => {
      elMessage.error('删除失败：' + err.message)
    })
  })
}

watch(() => currentProjectId.value, () => {
  isShowCreateNoteDialog.value = false
  getProjectNoteList()
}, { immediate: true })

onMounted(() => {
})
</script>
<template>
  <div class="dashboard-container flex w-full h-full overflow-hidden">
    <div
      class="left-container relative flex flex-col flex-1 h-full overflow-hidden bg-background-light rounded-lg p-2 m-r-2">
      <div class="header flex justify-between items-center">
        <div class="left font-bold">笔记</div>
        <div class="mid flex items-center">
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
          <div
            class="m-l-2 rounded-50% p-1 flex items-center justify-center cursor-pointer bg-background-light border border-primary-100 border-solid hover:bg-background-hover hover:text-font-hover"
            title="新增笔记" @click="openNoteForm('add')">
            <Plus class="w-3 h-3 cursor-pointer" />
          </div>

        </div>
        <div class="right">
        </div>
      </div>
      <el-scrollbar class="content flex-1 m-t-4 overflow-x-hidden!" v-loading="projectListLoading"
        v-if="projectNoteList.length > 0">
        <transition mode="out-in" enter-active-class="duration-300 ease-out" enter-from-class="opacity-0 translate-x-5"
          leave-active-class="duration-300 ease-in" leave-to-class="opacity-0 translate-x-5">
          <div class="flex flex-wrap gap-4" v-if="listType === 'card'">
            <template v-for="note in projectNoteList" :key="note.id">
              <NoteCard :noteInfo="note" @click="openNoteForm('view', note)">
                <template #actions>
                  <EditPen class="w-4 h-4 rounded-50% bg-background-hover p-1 m-x-1 hover:text-font-hover"
                    @click="openNoteForm('edit', note)" />
                  <Delete class="w-4 h-4 rounded-50% bg-background-hover p-1 hover:text-font-danger"
                    @click="deleteNote(note)" />
                </template>
              </NoteCard>
            </template>
          </div>
          <div v-else class="flex flex-wrap">
            <div class="flex w-full rounded items-center justify-between p-2 hover:bg-background-hover "
              v-for="note in projectNoteList" :key="note.id">
              <div class="flex justify-between items-center flex-1 overflow-hidden">
                <DocumentCopy class="w-4 h-4" @click="openNoteForm('view', note)" />
                <div
                  class="m-l-4 flex-1 cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap text-lg font-bold"
                  @click="openNoteForm('view', note)" :title="note.title">
                  {{ note.title }}
                </div>
              </div>
              <div class="text-primary-200 m-l-2 w-42">{{ note.updated_at }}</div>
              <div>
                <EditPen
                  class="cursor-pointer w-4 h-4 rounded-50% hover:bg-background-light p-1 m-x-1 hover:text-font-hover"
                  @click="openNoteForm('edit', note)" />
                <Delete class="cursor-pointer w-4 h-4 rounded-50% hover:bg-background-light p-1 hover:text-font-danger"
                  @click="deleteNote(note)" />
              </div>
            </div>
          </div>
        </transition>
      </el-scrollbar>
      <template v-else>
        <div class="w-full h-full flex items-center justify-center">
          <NoDataIcon />
        </div>
      </template>
      <transition enter-active-class="duration-300 ease-out" enter-from-class="opacity-0 translate-x-5"
        leave-active-class="duration-300 ease-in" leave-to-class="opacity-0 translate-x-5">
        <NoteForm class="absolute left-0 top-0 bg-background-light z-5 w-full h-full" :visible="isShowCreateNoteDialog"
          :mode="noteFormMode" :noteInfo="noteInfo" v-show="isShowCreateNoteDialog" @close="closeCreateNoteDialog">
        </NoteForm>
      </transition>
    </div>
    <div class="right-dialog w-20% h-full overflow-hidden">
      <SidebarDialog />
    </div>

  </div>
</template>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from {
  transform: translateX(20px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>