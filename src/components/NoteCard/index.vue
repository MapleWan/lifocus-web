<script setup>
import useElMessage from '@/hooks/useElMessage';
const elMessage = useElMessage();
const props = defineProps({
  noteInfo: {
    type: Object,
    required: true
  },
  // 是否在轮播图内
  isInner: {
    type: Boolean,
    default: false
  },
})
function goToNote() {
  elMessage.warning(`【TODO】Go to note, noteId: ${props.noteInfo.id}`)
}
</script>
<template>
  <div class="note-card lf-div-shadow lf-div-border p-x-2 p-t-2 rounded-2xl cursor-pointer hover:shadow-none"
    @click="goToNote">
    <div class="h-40 flex flex-col justify-between" :class="{ 'w-35': !isInner }">
      <div class="title line-clamp-2 font-bold text-xl">{{ noteInfo.title }}</div>
      <div class="divider w-full h-2px bg-background-hover m-y-2"></div>
      <div class="content text-primary-200 text-sm h-20 overflow-auto">{{ noteInfo.content }}</div>
      <div class="time text-xs m-t-1 text-primary-50">{{ noteInfo.updated_at }}</div>
    </div>
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