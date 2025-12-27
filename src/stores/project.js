import { defineStore } from 'pinia'
import { getUserProjectsApi } from '@/api/project'
const useProjectStore = defineStore("project", {
  state: () => ({
    projectList: [],
    recentProjectList: [],
  }),
  getters: {
    activeProjectList: (state) => {
      return state.projectList.filter((project) => project.status === 'active');
    },
    archivedProjectList: (state) => {
      return state.projectList.filter((project) => project.status === 'archived');
    },
  },
  actions: {
    async fetchProjects() {
      try {
        const res = await getUserProjectsApi();
        this.projectList = res.data;
      } catch (error) {
        console.error("项目列表获取失败", error);
      }
    },
    async fetchRecentProjects() {
      try {
        console.log("store 获取最近项目")
        const res = await getUserProjectsApi({ isRecent: true });
        this.recentProjectList = res.data;
      } catch (error) {
        console.error("最近项目列表获取失败", error);
      }
    },
  },
});

export default useProjectStore
