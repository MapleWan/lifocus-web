<template>
  <MdPreview v-model="content" v-if="isPreview" v-bind="previewConfigTemplate" style="background-color: transparent;" />
  <MdEditor v-model="content" v-else v-bind="editorConfigTemplate" style="height: 100%;" :footers="footers">
    <template #defFooters>
      {{ dayjs().format('YYYY-MM-DD HH:mm:ss') }}
    </template>
  </MdEditor>
</template>

<script setup>
import dayjs from 'dayjs';
import { ref, watchEffect } from 'vue'
import { MdEditor, MdPreview } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'

const footers = ['markdownTotal', '=', 0, 'scrollSwitch'];
// 详细配置表参考 https://imzbf.github.io/md-editor-v3/zh-CN/api#%F0%9F%91%82%F0%9F%8F%BC%20on
const defaultEditorConfig = {
  theme: 'light', // 主题，可选值：dark、light
  showCodeRowNumber: true, // 代码块是否显示行号
  preview: true, // 是否显示预览，可选值：true, false
  htmlPreview: false, // 是否显示 HTML 预览，可选值：true(需要将preview设置为false), false
  previewTheme: 'github', // 预览主题，可选值：default、github、vuepress、mk-cute、smart-blue、cyanosis
  codeTheme: 'github', // 代码主题，可选值：atom、a11y、github、gradient、kimbie、paraiso、qtcreator、stackoverflow
  toolbars: [
    'bold',
    'underline',
    'italic',
    'strikeThrough',
    '-',
    'title',
    'sub',
    'sup',
    'quote',
    'unorderedList',
    'orderedList',
    'task',
    '-',
    'codeRow',
    'code',
    'link',
    'image',
    'table',
    'mermaid',
    'katex',
    'mark',
    '-',
    'revoke',
    'next',
    '=',
    'prettier',
    'pageFullscreen',
    'fullscreen',
    'preview',
    'previewOnly',
    'htmlPreview',
    'catalog',
  ], // 工具栏 'bold', 'underline', 'italic', '-', 'title', 'strikeThrough', 'sub', 'sup', 'quote', 'unorderedList', 'orderedList', 'task', '-', 'codeRow', 'code', 'link', 'image', 'table', 'mermaid', 'katex', '-', 'revoke', 'next', 'save', '=', 'pageFullscreen', 'fullscreen', 'preview', 'previewOnly', 'htmlPreview', 'catalog', 'github'
  placeholder: '我有一个想法....', // 占位内容
  autoFocus: true, // 是否自动聚焦
  disabled: false, // 是否禁用文本区域
  readOnly: false, // 是否只读
  showToolbarName: false, // 是否显示工具栏名称
  inputBoxWidth: '50%', // 输入框宽度
  catalogLayout: 'fixed', // 目录布局，可选值：'fixed': 悬浮在内容上方，'flat': 展示在右侧
}

const defaultPreviewConfig = {
  theme: 'light', // 主题，可选值：dark、light
  showCodeRowNumber: true, // 代码块是否显示行号
  previewTheme: 'github', // 预览主题，可选值：default、github、vuepress、mk-cute、smart-blue、cyanosis
  codeTheme: 'github', // 代码主题，可选值：atom、a11y、github、gradient、kimbie、paraiso、qtcreator、stackoverflow
}

const editorConfigTemplate = ref({})
const previewConfigTemplate = ref({})

const props = defineProps({
  isPreview: {
    type: Boolean,
    default: false,
  },

  editorConfig: {
    type: Object,
    default: () => ({}),
  },

  previewConfig: {
    type: Object,
    default: () => ({}),
  },
})
watchEffect(
  () => {
    if (props.isPreview) {
      previewConfigTemplate.value = {
        ...defaultPreviewConfig,
        ...props.previewConfig,
      }
    } else {
      editorConfigTemplate.value = {
        ...defaultEditorConfig,
        ...props.editorConfig,
      }
    }
  },
)

const content = defineModel({
  type: String,
  default: '',
})
</script>

<style scoped>
.md-editor {
  /* --md-bk-color: transparent; */
  /* --md-scrollbar-bg-color: #999999; */
  /* background: none; */
  border-radius: 12px;
  /* height: 400px; */
  /* height: 30vh; */
}

:deep(.md-editor-custom-scrollbar__track) {
  border-radius: 1px;
  width: 2px;
}
</style>
