<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
defineProps({
  tabs: {
    type: Array,
    default: () => []
  }
})

const currentTab = defineModel({
  type: String,
  default: 'dialog'
})

function selectTab(tabId) {
  currentTab.value = tabId
}

onMounted(() => {
  currentTab.value = router.currentRoute.value.name
})
</script>

<template>
  <div class="tab-switch-container relative inline-flex items-center p-2 rounded-lg">
    <div v-for="tab in tabs" :key="tab.id"
      class="tab-item rounded-lg p-x-3 p-y-1 flex items-center justify-center cursor-pointer transition-all duration-300 ease-in-out p-x-4"
      :class="{ 'text-font-primary bg-#ebebed': currentTab === tab.id, 'text-primary-200': currentTab !== tab.id }"
      @click="selectTab(tab.id)">
      <component :is="tab.icon" class="w-4 h-4" />
      <span class="m-l-2">{{ tab.label }}</span>
    </div>
  </div>
</template>

<style scoped></style>