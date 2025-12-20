import { defineStore } from 'pinia'
import { useWindowSize } from '@vueuse/core'
import { setCurrentProjectId } from '@/utils/project'
const { width } = useWindowSize()
const useMainStore = defineStore('main', {
  state: () => ({
    isLoading: false,
    currentProjectId: ''
  }),

  getters: {
    isPc: () => {
      return width.value > 768
    },
  },

  actions: {
    setCurrentProjectId(id) {
      this.currentProjectId = id
      setCurrentProjectId(id)
    },
  },
  persist: {
    key: 'main',
    storage: localStorage,
    paths: ['currentProjectId'],
  }
})
export default useMainStore
