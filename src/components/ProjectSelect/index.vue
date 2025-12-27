<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { Search, ArrowRight } from '@element-plus/icons-vue'
import { watchDebounced } from '@vueuse/core'
import useMainStore from '@/stores/main'
import useProjectStore from '@/stores/project'
const mainStore = useMainStore()
const projectStore = useProjectStore()


const props = defineProps({
  optionContainerHeight: { type: String, default: 'auto' },
  optionContainerWidth: { type: String, default: '200px' },
  showArrow: { type: Boolean, default: true },
})

const customSelectRef = ref()
const projectId = defineModel('projectId', { type: [String, Number], default: '' })

const projectList = ref([])
const projectIdToNameDict = ref({})
// 获取项目列表
const getProjectList = async () => {
  if (projectStore.projectList.length === 0)
    await projectStore.fetchProjects()
  projectList.value = projectStore.projectList
  projectIdToNameDict.value = projectList.value.reduce((acc, cur) => {
    acc[cur.id] = cur.name
    return acc
  }, {})
  filteredProjectList.value = projectList.value
}

const showOptions = ref(false) // 是否显示选项
// 选择选项
function selectItem(item) {
  projectId.value = item.id
  keyword.value = ''
  mainStore.setCurrentProjectId(item.id)
  showOptions.value = false
}

// 搜索项目
const filteredProjectList = ref([])
const keyword = ref('')
watchDebounced(keyword, searchProject, { debounce: 300 })

function searchProject() {
  filteredProjectList.value = projectList.value.filter(item => item.name.includes(keyword.value))
}

// 点击外部区域关闭下拉框
function handleClickOutside(event) {
  if (customSelectRef.value && !customSelectRef.value.contains(event.target)) {
    showOptions.value = false
  }
}
onMounted(() => {
  getProjectList()
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
<template>
  <div class="relative p-x-2 p-y-1 rounded-xl cursor-pointer hover:bg-background-hover hover:border z-100"
    ref="customSelectRef" :title="projectIdToNameDict[projectId]" @click.self="showOptions = !showOptions">
    <div class="relative flex items-center w-full">
      <ArrowRight v-if="showArrow" class="w-4 h-4 transition-transform duration-500 ease-in-out m-r-2" :class="{
        'rotate-90': showOptions,
      }" @click.self="showOptions = !showOptions" />
      <div class="overflow-hidden text-ellipsis whitespace-nowrap" @click.self="showOptions = !showOptions">{{
        projectIdToNameDict[projectId] }}</div>
    </div>

    <transition name="slide-fade">
      <div class="option-container"
        :style="{ height: optionContainerHeight, width: optionContainerWidth, maxHeight: optionContainerHeight !== 'auto' ? optionContainerHeight : '300px' }"
        v-if="showOptions">
        <el-input placeholder="搜索项目" v-model="keyword" size="small" :prefix-icon="Search"></el-input>
        <el-scrollbar class="flex-1 m-t-1" :style="{ height: optionContainerHeight }">
          <template v-for="item in filteredProjectList" :key="item.id">
            <div
              class="option p-2 rounded hover:bg-background-hover cursor-pointer w-full text-ellipsis whitespace-nowrap overflow-hidden"
              :title="item.name" :class="{ 'text-font-hover bg-background-hover': projectId === item.id }"
              @click="selectItem(item)">
              {{ item.name }}
            </div>
          </template>
        </el-scrollbar>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.option-container {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background-color: white;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  padding: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}


.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from {
  transform: translateY(-10px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}
</style>