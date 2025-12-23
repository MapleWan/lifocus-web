<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
const props = defineProps({})

const referenceRef = ref()

const isShowPopover = ref(false) // 是否显示选项


// 点击外部区域关闭下拉框
function handleClickOutside(event) {
  if (referenceRef.value && !referenceRef.value.contains(event.target)) {
    isShowPopover.value = false
  }
}
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

const toggleShowPopover = () => {
  isShowPopover.value = !isShowPopover.value
}
</script>
<template>
  <div class="relative p-y-1 rounded-xl hover:border" ref="referenceRef">
    <div class="relative cursor-pointer flex items-center w-full" @click="toggleShowPopover">
      <slot></slot>
    </div>

    <transition name="slide-fade">
      <div class="popover-container" v-if="isShowPopover">
        <slot name="popover"></slot>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.popover-container {
  z-index: 10;
  position: absolute;
  top: calc(100% + 2px);
  left: 0;
  right: 0;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  /* background-color: white;
  border: 1px solid #dcdfe6;
  padding: 8px;
  display: flex;
  flex-direction: column; */
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