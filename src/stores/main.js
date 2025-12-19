import { defineStore } from 'pinia'
import { useWindowSize } from '@vueuse/core'
const { width } = useWindowSize()
const useMainStore = defineStore('main', {
  state: () => ({
    isLoading: false,
  }),

  getters: {
    isPc: () => {
      return width.value > 768
    },
  },
})
export default useMainStore
