<!-- src/components/MessageItem.vue -->
<template>
  <transition name="message-fade">
    <div v-show="visible" class="message" :class="type">
      {{ message }}
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  message: String,
  type: { type: String, default: 'info' },
  duration: { type: Number, default: 3000 }
})

const visible = ref(false)
let timer = null

onMounted(() => {
  visible.value = true
  if (props.duration > 0) {
    timer = setTimeout(() => {
      visible.value = false
    }, props.duration)
  }
})

onBeforeUnmount(() => {
  if (timer) clearTimeout(timer)
})
</script>

<style scoped>
.message {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 12px 16px;
  border-radius: 4px;
  color: white;
  z-index: 9999;
  max-width: 400px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.message.success {
  background-color: #67C23A;
}

.message.error {
  background-color: #F56C6C;
}

.message.warning {
  background-color: #E6A23C;
}

.message.info {
  background-color: #909399;
}

.message-fade-enter-active,
.message-fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.message-fade-enter-from {
  opacity: 0;
  transform: translateX(-50%) translateY(-100%);
}

.message-fade-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-100%);
}
</style>