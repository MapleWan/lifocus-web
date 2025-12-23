<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { SwitchButton } from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import { option } from './mock/line'
import { logoutApi } from '@/api/auth'
import { useRouter } from 'vue-router'
import useElMessage from '@/hooks/useElMessage'
import useCustomConfirm from '@/hooks/useCustomConfirm'
import { removeToken } from '@/utils/auth'
import useMainStore from '@/stores/main'
import useUserStore from "@/stores/user"

const userStore = useUserStore()
const mainStore = useMainStore()
const router = useRouter()
const elMessage = useElMessage()
const customConfirm = useCustomConfirm()
const statisticsChartRef = ref(null)
const statisticsChart = ref(null)
function logout() {
  customConfirm.confirm({
    title: '确认登出',
    content: '确定要退出登录吗？',
    confirmText: '确定',
    cancelText: '取消',
  }).then((sure) => {
    if (!sure) return
    logoutApi().then(() => {
      elMessage.success('登出成功')
      removeToken()
      router.push('/login')
    }).catch(err => {
      console.log(err)
    });
  })
}

onMounted(() => {
  statisticsChart.value = echarts.init(statisticsChartRef.value);
  statisticsChart.value.setOption(option);
  window.addEventListener('resize', () => {
    statisticsChart.value.resize();
  });
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', () => {
    statisticsChart.value.resize()
  });
});
</script>
<template>
  <div class="flex flex-col h-full w-full p-x-6 overflow-hidden">
    <div class="header">
      <div class="header-title text-xl font-bold m-b-4">设置</div>
    </div>

    <div class="account rounded-xl bg-background-primary p-4 m-b-4">
      <div class="account-header text-lg font-bold m-b-4">账户</div>
      <div class="account-content flex justify-between items-center m-l-4">
        <div class="flex justify-start items-center ">
          <img src="@/assets/icons/images/favicon1.jpg" class="w-8 h-8 rounded cursor-pointer" alt="avator"
            @click="openAccountSetting" />
          <div class="m-l-4" :style="{ maxWidth: !mainStore.isPc ? '160px' : 'auto' }">
            <div class="username text-primary-900 font-bold m-b-1">{{ userStore.username }}
            </div>
            <div class="email text-primary-100"
              :class="{ 'text-ellipsis overflow-hidden whitespace-nowrap': !mainStore.isPc }">{{ userStore.email }}
            </div>
          </div>
        </div>
        <div>
          <el-button v-if="mainStore.isPc" type="primary" round @click="logout">退出登录</el-button>
          <el-button v-else type="primary" :icon="SwitchButton" circle @click="logout" />
        </div>
      </div>
    </div>

    <el-scrollbar class="flex-1">
      <div class="statistics rounded-xl bg-background-primary p-4">
        <div class="statistics-header text-lg font-bold m-b-4">【TODO】数据统计(展示数据)</div>
        <div class="statistics-chart w-full h-96" id="statistics-chart" ref="statisticsChartRef">
        </div>
      </div>

      <div class="statistics rounded-xl bg-background-primary p-4 m-t-4" v-if="false">
        <div class="statistics-header text-lg font-bold m-b-4">数据统计</div>
        <div class="statistics-chart w-full h-96">
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>


<style scoped></style>