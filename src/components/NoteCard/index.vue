<script setup>
import { ref, onMounted } from 'vue'
import Editor from '@/components/Editor/index.vue'
const props = defineProps({
  noteInfo: {
    type: Object,
    required: true
  }
})

const isShowActions = ref(false)
const toggleActions = () => {
  isShowActions.value = !isShowActions.value
}

const content = ref('')
onMounted(() => {
  content.value = props.noteInfo.content
})

</script>
<template>
  <div class="note-card relative lf-div-shadow lf-div-border p-x-2 p-t-2 rounded-2xl cursor-pointer hover:shadow-none"
    @mouseenter="toggleActions" @mouseleave="toggleActions">
    <div class="h-60 w-40 flex flex-col justify-between">
      <div class="title line-clamp-2 font-bold text-xl">{{ noteInfo?.title || '' }}</div>
      <div class="divider w-full h-2px bg-background-hover m-y-2"></div>
      <!-- <div class="content text-primary-200 text-sm flex-1 overflow-x-hidden overflow-y-auto">{{ noteInfo?.content || ''
      }}</div> -->
      <el-scrollbar class="content text-primary-200 text-sm flex-1 overflow-x-hidden break-all">
        <!-- {{ noteInfo?.content || '' }} -->
        <!-- <Editor :isPreview="true" class="p-4" v-model="content" /> -->
        {{ noteInfo?.title || '' }}
      </el-scrollbar>
      <div class="time text-xs m-t-1 text-primary-50">{{ noteInfo?.updated_at || '' }}</div>
    </div>
    <transition enter-active-class="transition-all duration-300 ease-out"
      leave-active-class="transition-all duration-300 ease-in" enter-from-class="opacity-0 scale-75"
      leave-to-class="opacity-0 scale-75">
      <div class="absolute top-2 right-2 flex items-center" v-show="isShowActions" @click.stop>
        <slot name="actions">
        </slot>
      </div>
    </transition>
    <transition enter-active-class="transition-all duration-300 ease-out"
      leave-active-class="transition-all duration-300 ease-in" enter-from-class="opacity-0 scale-75"
      leave-to-class="opacity-0 scale-75">
      <div class="absolute bottom-2 right-2 flex items-center" v-show="isShowActions || noteInfo.isSelected"
        @click.stop>
        <slot name="select">
        </slot>
      </div>
    </transition>
  </div>
</template>


<style scoped>
.note-card {
  will-change: transform, box-shadow;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.note-card:hover {
  transform: translateY(-8px);
}
</style>