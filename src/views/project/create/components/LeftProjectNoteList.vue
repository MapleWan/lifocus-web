<script setup>

import { getProjectNotesApi } from '@/api/project'
import { deleteNoteApi } from '@/api/note'
import { useThrottleFn } from '@vueuse/core'
import useElMessage from '@/hooks/useElMessage'
import { Plus, CloseBold, Search, Delete, DocumentCopy } from '@element-plus/icons-vue'
import SearchIcon from '@/assets/icons/svg/search.svg'
import useCustomConfirm from '@/hooks/useCustomConfirm'
import { ref, nextTick, onMounted } from 'vue'

const elMessage = useElMessage()
const customConfirm = useCustomConfirm()

const emits = defineEmits(['noteSelect'])

// 搜索框相关
const showSearchBox = ref(false)
const searchQuery = ref('') // 搜索 title 关键字
const searchTag = ref('')  // 当前搜索条件显示
const searchInputRef = ref()
function toggleSearchBox(val = true) {
  showSearchBox.value = val
  if (val) {
    nextTick(() => {
      searchInputRef.value.focus()
    })
  }
}
function searchTagClose() {
  searchTag.value = ''
  getProjectNoteList()
}
const handleSearch = useThrottleFn(() => {
  getProjectNoteList(searchQuery.value).then(() => {
    searchTag.value = searchQuery.value
    searchQuery.value = ''
    toggleSearchBox(false)
  })
}, 1000)
const searchWithHistoryQuery = useThrottleFn(() => {
  getProjectNoteList(searchTag.value).then(() => {
    toggleSearchBox(false)
  })
}, 1000)

// 左侧项目列表
const projectListLoading = ref(false)
const projectNoteList = ref([])
const getProjectNoteList = async (title = '') => {
  projectListLoading.value = true
  try {
    const res = await getProjectNotesApi({ title })
    projectNoteList.value = res.data
  } catch (err) {
    elMessage.error('获取项目笔记列表失败：' + err.message)
  } finally {
    projectListLoading.value = false
  }
}

// 笔记选择
const currentNote = ref()
function noteSelect(note) {
  currentNote.value = note
  emits('noteSelect', note)
}
// 笔记删除
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
      if (currentNote.value && currentNote.value.id === note.id) {
        currentNote.value = null
        noteSelect(null)
      }
      elMessage.success(res.message)
      getProjectNoteList()
    }).catch(err => {
      elMessage.error('删除失败：' + err.message)
    })
  })
}

defineExpose({ searchWithHistoryQuery, noteSelect })

onMounted(() => {
  getProjectNoteList()
})

</script>
<template>
  <div class="header flex justify-between items-center">
    <div class="left font-bold">笔记</div>
    <div class="right relative max-w-50 flex items-center">
      <!-- 搜索框 - 默认隐藏，点击图标时显示 -->
      <transition enter-active-class="duration-300 ease-out" enter-from-class="opacity-0 translate-x-5"
        leave-active-class="duration-300 ease-in" leave-to-class="opacity-0 translate-x-5">
        <div v-show="showSearchBox" class="search-box-container absolute right-0 top-1/2 transform -translate-y-1/2">
          <el-input ref="searchInputRef" v-model="searchQuery" :autofocus="true" :prefix-icon="Search"
            style="width: 200px;" @keyup.enter="handleSearch" @blur="toggleSearchBox(false)" placeholder="搜索笔记..."
            class="w-40 border-0 focus:outline-none text-sm" @click.stop />
        </div>
      </transition>
      <div class="flex-1 flex items-center max-w-50 overflow-hidden">
        <div v-if="searchTag"
          class="flex items-center w-[calc(100%-24px)] rounded p-x-2 p-y-1 text-font-hover text-xs bg-background-hover"
          :title="searchTag">
          <div class="overflow-hidden text-ellipsis whitespace-nowrap" style="width: calc(100% - 16px);">{{
            searchTag }}</div>
          <CloseBold class="w-4 h-4 text-primary-500 hover:text-font-hover cursor-pointer" @click="searchTagClose"
            title="清除搜索条件" />
        </div>

        <SearchIcon class="w-4 h-4 m-l-2 text-primary-900 hover:text-font-hover cursor-pointer"
          @click="toggleSearchBox(true)" title="打开搜索" />
      </div>
      <div
        class="m-l-2 rounded-50% p-1 flex items-center justify-center cursor-pointer bg-background-light border border-primary-100 border-solid hover:bg-background-hover hover:text-font-hover"
        title="新增笔记" @click="noteSelect(null)">
        <Plus class="w-3 h-3 cursor-pointer" />
      </div>
    </div>
  </div>

  <div class="project-list flex-1 m-t-2 overflow-hidden" v-loading="projectListLoading">
    <el-scrollbar>
      <div class="flex w-full rounded items-center justify-between p-y-2 p-x-1 hover:bg-background-hover"
        :class="note.id === currentNote?.id ? 'bg-background-hover' : ''" v-for="note in projectNoteList"
        :key="note.id">
        <div class="flex justify-between items-center flex-1 overflow-hidden cursor-pointer" @click="noteSelect(note)">
          <DocumentCopy class="w-8 h-8 p-2 rounded border border-primary-50 c-primary-50 border-solid m-r-2" />
          <div class="flex flex-col justify-between flex-1 overflow-hidden">
            <div class="flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-lg font-bold" :title="note.title">
              {{ note.title }}
            </div>
            <div class="text-primary-200 w-42">{{ note.updated_at }}</div>
          </div>
        </div>
        <div>
          <!-- <EditPen class="cursor-pointer w-4 h-4 rounded-50% hover:bg-background-light p-1 m-x-1 hover:text-font-hover"
          @click="openNoteForm('edit', note)" /> -->
          <Delete class="cursor-pointer w-4 h-4 rounded-50% hover:bg-background-light p-1 hover:text-font-danger"
            @click="deleteNote(note)" />
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>


<style scoped></style>