import { defineStore } from 'pinia'
import { getCurrentUserApi } from '@/api/auth'
export const useUserStore = defineStore('user', {
  state: () => ({
    username: '',
    email: '',
    avatar: '',
  }),
  actions: {
    async getCurrentUser() {
      const res = await getCurrentUserApi()
      const user = res.data
      this.username = user.username
      this.email = user.email
      this.avatar = user.avatar
    },
  },

  persist: {
    key: 'user',
    storage: localStorage,
    paths: ['username', 'email', 'avatar'],
  }
});

export default useUserStore
