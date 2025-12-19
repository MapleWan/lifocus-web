<template>
  <div class="confirm-overlay" @click.self="handleCancel">
    <div class="confirm-box">
      <div class="confirm-header">
        <span class="confirm-title">{{ title }}</span>
        <span class="confirm-close" @click="handleCancel">&times;</span>
      </div>
      <div class="confirm-content">
        <slot>
          {{ content }}
        </slot>
      </div>
      <div class="confirm-footer">
        <button class="btn cancel-btn" @click="handleCancel">
          {{ cancelText }}
        </button>
        <button class="btn confirm-btn" @click="handleConfirm">
          {{ confirmText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  title: { type: String, default: '确认' },
  content: { type: String, default: '' },
  confirmText: { type: String, default: '确定' },
  cancelText: { type: String, default: '取消' }
})

const emit = defineEmits(['confirm', 'cancel'])

const handleConfirm = () => {
  emit('confirm')
}

const handleCancel = () => {
  emit('cancel')
}

// 支持 ESC 键关闭
const handleKeydown = (event) => {
  if (event.key === 'Escape') {
    handleCancel()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.confirm-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
}

.confirm-box {
  background: #f4f7fa;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 200px;
  max-width: 600px;
  user-select: none;
}

.confirm-header {
  padding: 16px;
  display: flex;
  justify-content: space-between;
  /* border-bottom: 1px solid #eeedf5; */
}

.confirm-title {
  font-size: 16px;
  font-weight: bold;
  color: #0a0a0a;
}

.confirm-close {
  width: 18px;
  height: 18px;
  cursor: pointer;
  font-size: 16px;
  text-align: center;
  color: #0a0a0a;
}

.confirm-close:hover {
  color: #eeedf5;
  background: #9d9d9d;
  border-radius: 50%;
}

.confirm-content {
  padding: 8px 16px;
  color: #0a0a0a;
}

.confirm-footer {
  padding: 8px;
  /* border-top: 1px solid #eeedf5; */
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.btn {
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  border: 1px solid #9d9d9d;
  transition: .1s;
}

.btn:hover {
  background: #9d9d9d;
  border-color: #9d9d9d;
}

.cancel-btn {
  background: #f2f2f2;
  color: #0a0a0a;
}

.confirm-btn {
  background: #0a0a0a;
  color: #f2f2f2;
  border-color: #0a0a0a;
}
</style>