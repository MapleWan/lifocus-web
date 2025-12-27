<script setup>
import SidebarDialog from '@/views/project/dialog/SidebarDialog.vue'
import NoteCard from '@/components/NoteCard/index.vue'
import NoDataIcon from "@/assets/icons/svg/noData.svg"
import { getProjectNotesApi } from '@/api/project'
import CardIcon from '@/assets/icons/svg/card.svg'
import ListIcon from '@/assets/icons/svg/list.svg'
import SearchIcon from '@/assets/icons/svg/search.svg'
import { Plus, DocumentCopy, EditPen, Delete, Search, CloseBold, ArrowLeftBold, ArrowRightBold, Download, Upload, Sort } from '@element-plus/icons-vue'
import Cookies from 'js-cookie'

import useMainStore from '@/stores/main'
import { computed, onMounted, watch, ref, nextTick } from 'vue'
import NoteForm from './components/NoteForm.vue'
import useElMessage from '@/hooks/useElMessage'
import useCustomConfirm from '@/hooks/useCustomConfirm'
import { useThrottleFn } from '@vueuse/core'

import { deleteNoteApi, getNoteByIdApi, downloadNoteApi, uploadNoteApi } from '@/api/note'
const elMessage = useElMessage()
const customConfirm = useCustomConfirm()
const mainStore = useMainStore()
const isShowCreateNoteDialog = ref(false)

const currentProjectId = computed(() => mainStore.currentProjectId)
const projectNoteList = ref([])
const projectListLoading = ref(false)
const getProjectNoteList = async (title = '') => {
  projectListLoading.value = true
  try {
    const tmpSelectedNotes = projectNoteList.value.filter(note => note.isSelected).map(note => note.id)
    const res = await getProjectNotesApi({ title })
    projectNoteList.value = res.data.map(note => ({
      ...note,
      isSelected: tmpSelectedNotes.includes(note.id)
    }))
    handleCommand(currentSort.value)
  } catch (err) {
    elMessage.error('获取项目笔记列表失败：' + err.message)
  } finally {
    projectListLoading.value = false
  }
}

const listType = ref('card') // card | list
function changeListType(type) {
  listType.value = type
}

// 新增笔记逻辑
const noteFormMode = ref('add') // add, view, edit
const noteInfo = ref({})
function openNoteForm(type, note = {}) {
  noteFormMode.value = type
  if (type === 'view') {
    getNoteByIdApi(note.id).then(res => {
      noteInfo.value = res.data
      isShowCreateNoteDialog.value = true
    })
  } else {
    noteInfo.value = note
    isShowCreateNoteDialog.value = true
  }
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

// 对话框折叠
const isDialogCollapsed = ref(true)
function toggleDialogCollapse() {
  isDialogCollapsed.value = !isDialogCollapsed.value
}

// 下载笔记
function downloadNote(note) {
  downloadNoteApi({ note_ids: note.id }).then(() => {
    projectNoteList.value.forEach(n => {
      n.isSelected = false
    })
  })
}
function batchDownloadNote() {
  const noteIds = selectedNoteList.value.map(note => note.id).join(',')
  downloadNoteApi({ note_ids: noteIds }).then(() => {
    projectNoteList.value.forEach(n => {
      n.isSelected = false
    })
    selectAll.value = false
  })
}

// 添加上传笔记功能
function uploadNote() {
  // 创建隐藏的文件输入元素
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.md,.zip' // 支持的文件类型
  input.onchange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    // 检查文件大小 (限制为10MB)
    if (file.size > 100 * 1024 * 1024) {
      elMessage.error('文件大小不能超过100MB')
      return
    }

    const formData = new FormData()
    formData.append('file', file)
    formData.append('project_id', currentProjectId.value)

    uploadNoteApi(formData).then((res) => {
      elMessage.success('上传成功，' + res.message)
      getProjectNoteList() // 刷新笔记列表
    }).catch(err => {
      elMessage.error('上传失败：' + err.message)
    })
  }
  input.click()
}

// 选中逻辑
const selectAll = ref(false)
const selectedNoteList = computed(() => projectNoteList.value.filter(note => note.isSelected))
function toggleSelectAll() {
  projectNoteList.value.forEach(note => {
    note.isSelected = selectAll.value
  })
}
watch(() => selectedNoteList.value.length, (newValue) => {
  selectAll.value = newValue === projectNoteList.value.length
})

// 排序
function projectNoteListSort(type, direction) {
  projectNoteList.value = projectNoteList.value.sort((a, b) => {
    if (['updated_at', 'created_at'].includes(type)) {
      return (new Date(b[type]) - new Date(a[type])) * direction
    }
    if (['title'].includes(type))
      return (a[type].localeCompare(b[type])) * direction * -1
    else {
      return (a[type] - b[type]) * direction
    }
  })
}
const currentSort = ref('title-up')
function handleCommand(command) {
  currentSort.value = command
  let [type, direction] = command.split('-')
  direction = direction === 'down' ? 1 : -1
  projectNoteListSort(type, direction)
}

watch(() => currentProjectId.value, () => {
  isShowCreateNoteDialog.value = false
  getProjectNoteList()
}, { immediate: true })

onMounted(() => {
  // 从首页卡片那边跳转到卡片详情，自动进入项目主页，同时打开对应的笔记
  const noteId = Cookies.get('noteId')
  if (noteId) {
    getNoteByIdApi(noteId).then(res => {
      openNoteForm('view', res.data)
    })
    Cookies.remove('noteId')
  }
})
</script>
<template>
  <div class="dashboard-container flex w-full h-full overflow-hidden">
    <div class="left-container relative flex flex-col flex-1 h-full overflow-hidden bg-background-light rounded-lg p-2">
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

          <div
            class="m-l-2 rounded-50% p-1 flex items-center justify-center cursor-pointer bg-background-light border border-primary-100 border-solid hover:bg-background-hover hover:text-font-hover"
            title="上传笔记" @click="uploadNote">
            <Upload class="w-3 h-3 cursor-pointer" />
          </div>

          <el-dropdown trigger="click" @command="handleCommand">
            <span class="el-dropdown-link">
              <div
                class="m-l-2 rounded-50% p-1 flex items-center justify-center cursor-pointer bg-background-light border border-primary-100 border-solid hover:bg-background-hover hover:text-font-hover"
                title="排序">
                <Sort class="w-3 h-3" />
              </div>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="updated_at-down">更新时间(&#8595;)</el-dropdown-item>
                <el-dropdown-item command="updated_at-up">更新时间(&#8593;)</el-dropdown-item>
                <el-dropdown-item command="created_at-down">创建时间(&#8595;)</el-dropdown-item>
                <el-dropdown-item command="created_at-up">创建时间(&#8593;)</el-dropdown-item>
                <el-dropdown-item command="title-down">笔记名称(&#8595;)</el-dropdown-item>
                <el-dropdown-item command="title-up">笔记名称(&#8593;)</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>

          <div
            class="m-l-2 rounded-50% p-1 flex items-center justify-center cursor-pointer bg-background-light border border-primary-100 border-solid hover:bg-background-hover hover:text-font-hover"
            title="下载笔记" v-if="selectedNoteList.length > 0" @click="batchDownloadNote">
            <Download class="w-3 h-3 cursor-pointer" />
          </div>

          <div
            class="m-l-2 rounded p-x-1 flex items-center justify-center cursor-pointer bg-background-light hover:bg-background-hover"
            title="全选/取消全选" v-if="selectedNoteList.length > 0">
            <el-checkbox v-model="selectAll" v-if="selectedNoteList.length > 0" :label="selectAll ? '取消全选' : '全选'"
              title="全选/取消全选" @change="toggleSelectAll" />
          </div>
        </div>
        <div class="right relative max-w-60 flex items-center">
          <!-- 搜索框 - 默认隐藏，点击图标时显示 -->
          <transition enter-active-class="duration-300 ease-out" enter-from-class="opacity-0 translate-x-5"
            leave-active-class="duration-300 ease-in" leave-to-class="opacity-0 translate-x-5">
            <div v-show="showSearchBox"
              class="search-box-container absolute right-0 top-1/2 transform -translate-y-1/2">
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
        </div>
      </div>
      <el-scrollbar class="content flex-1 m-t-4 overflow-x-hidden!" v-loading="projectListLoading"
        v-if="projectNoteList.length > 0">
        <transition mode="out-in" enter-active-class="duration-300 ease-out" enter-from-class="opacity-0 translate-x-5"
          leave-active-class="duration-300 ease-in" leave-to-class="opacity-0 translate-x-5">
          <div class="flex flex-wrap gap-4 p-t-4" v-if="listType === 'card'">
            <template v-for="note in projectNoteList" :key="note.id">
              <NoteCard :noteInfo="note" @click="openNoteForm('view', note)">
                <template #actions>
                  <EditPen class="w-4 h-4 rounded-50% bg-background-hover p-1 m-x-1 hover:text-font-hover"
                    @click="openNoteForm('edit', note)" title="编辑笔记" />
                  <Download class="w-4 h-4 rounded-50% bg-background-hover p-1 m-x-1 hover:text-font-hover"
                    @click="downloadNote(note)" title="下载笔记" />
                  <Delete class="w-4 h-4 rounded-50% bg-background-hover p-1 hover:text-font-danger"
                    @click="deleteNote(note)" title="删除笔记" />
                </template>
                <template #select>
                  <el-checkbox v-model="note.isSelected" title="选择笔记" />
                </template>
              </NoteCard>
            </template>
          </div>
          <div v-else class="flex flex-wrap">
            <div class="flex w-full rounded items-center justify-between p-2 hover:bg-background-hover "
              v-for="note in projectNoteList" :key="note.id">
              <div class="flex justify-between items-center flex-1 overflow-hidden">
                <el-checkbox v-model="note.isSelected" title="选择笔记" />
                <DocumentCopy class="m-l-2 w-4 h-4" @click="openNoteForm('view', note)" />
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
                  @click="openNoteForm('edit', note)" title="编辑笔记" />
                <Download
                  class="cursor-pointer w-4 h-4 rounded-50% hover:bg-background-light p-1 m-x-1 hover:text-font-hover"
                  @click="downloadNote(note)" title="下载笔记" />
                <Delete class="cursor-pointer w-4 h-4 rounded-50% hover:bg-background-light p-1 hover:text-font-danger"
                  @click="deleteNote(note)" title="删除笔记" />
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
          :mode="noteFormMode" :noteInfo="noteInfo" v-show="isShowCreateNoteDialog" @close="closeCreateNoteDialog"
          @openEdit="noteFormMode = 'edit'">
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