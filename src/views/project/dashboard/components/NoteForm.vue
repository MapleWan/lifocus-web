<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import Editor from '@/components/Editor/index.vue'
import { ArrowLeft } from '@element-plus/icons-vue'
import useElMessage from '@/hooks/useElMessage'
import { addNoteApi, updateNoteApi } from '@/api/note'
const elMessage = useElMessage()
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  mode: {
    type: String,
    default: 'add', // add, view, edit
  },
  noteInfo: {
    type: Object,
    default: () => ({})
  },
})

const isPreview = computed(() => props.mode === 'view')
const emits = defineEmits(['close'])
const savingLoading = ref(false)
const note = ref({
  title: '',
  content: '',
})
async function saveNote() {
  if (!note.value.title) {
    elMessage.warning('请输入笔记标题')
    return
  }
  savingLoading.value = true
  let tip = '创建' // 创建  更新
  if (props.mode === 'edit') {
    tip = '更新'
    try {
      await updateNoteApi(props.noteInfo.id, note.value)
      clearNote()
      close(true)
      elMessage.success(`${tip}成功`)
    } catch (error) {
      elMessage.error(`${tip}失败: ` + error)
    } finally {
      savingLoading.value = false
    }
  } else if (props.mode === 'add') {
    tip = '创建'
    try {
      await addNoteApi(note.value)
      clearNote()
      close(true)
      elMessage.success(`${tip}成功`)
    } catch (error) {
      elMessage.error(`${tip}失败: ` + error)
    } finally {
      savingLoading.value = false
    }
  }
}

function close(isNeedRefresh = false) {
  emits('close', isNeedRefresh)
  if (props.mode !== 'add') clearNote()
}

function clearNote() {
  note.value.content = ''
  note.value.title = ''
}

watch(() => props.visible, (visible) => {
  if (visible) {
    if (props.mode !== 'add') {
      note.value = { ...props.noteInfo }
    }
  }
})

onMounted(() => {
  if (props.mode !== 'add') {
    note.value = { ...props.noteInfo }
    console.log(note.value)
  }
})
</script>
<template>
  <div class="create-note p-4 flex flex-col h-full">
    <div class="head-bar flex justify-between items-center">
      <div class="left cursor-pointer flex items-center hover:c-font-hover" @click="close">
        <ArrowLeft class="w-6 h-6" />
        <span>工作台</span>
      </div>
      <div class="mid flex-1 m-x-6">
        <div class="w-full font-bold" v-if="isPreview">
          {{ note.title }}
        </div>
        <el-input v-else placeholder="笔记标题" :readonly="isPreview" v-model="note.title" maxlength="100"
          :show-word-limit="false" style="min-width: 160px; width: 100%;" />
      </div>
      <div class="right">
        <el-button type="primary" @click="saveNote" :loading="savingLoading" v-if="!isPreview">保存</el-button>
      </div>
    </div>
    <el-scrollbar class="flex-1 m-t-4">
      <Editor :isPreview="isPreview" class="p-4" v-model="note.content"
        :editorConfig="{ disabled: savingLoading && isPreview }" />
    </el-scrollbar>
  </div>
</template>


<style scoped>
:deep(.el-input__wrapper) {
  box-shadow: 0 0 0 1px #f1f1f1 inset !important;
  background-color: transparent !important;
}

:deep(.el-scrollbar__view) {
  height: calc(100% - 8px);
}
</style>