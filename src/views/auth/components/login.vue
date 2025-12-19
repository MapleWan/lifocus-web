<script setup>
import Cookies from 'js-cookie'
import { setToken } from '@/utils/auth'
import { login } from '@/api/auth'
import useUserStore from '@/stores/user'
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const userStore = useUserStore()
const emits = defineEmits('goToRegister')
function goToRegister() {
  emits('goToRegister')
}

const loginForm = reactive({
  username: '',
  password: ''
})
const rules = reactive({
  username: [
    { required: true, message: 'Please input username', trigger: 'blur' }
  ],
  password: [
    { required: true, message: 'Please input password', trigger: 'blur' }
  ]
})

const rememberMe = ref(true)
const loginFormRef = ref(null)
// import useCustomMessage from '@/hooks/useCustomMessage'
import useElMessage from '@/hooks/useElMessage'

// const customMessage = useCustomMessage(loginFormRef)
const elMessage = useElMessage()
function submitForm() {
  // customMessage.success('Login successfully')
  // elMessage.error('Login failed')

  // return
  loginFormRef.value.validate((valid) => {
    if (valid) {
      Cookies.set('isRemember', rememberMe.value)
      login(loginForm).then(res => {
        setToken(res.data.access_token, res.data.refresh_token, res.data.expire_time)
        elMessage.success('Login successfully')
        userStore.getCurrentUser().then(() => {
          router.push({ name: "dashboard" })
        })
      }).catch(err => {
        console.error(err)
        elMessage.error('Login failed: ' + err)
      })
    } else {
      // elMessage.error('Login failed')
      return false
    }
  })
}
</script>
<template>
  <div class="login-container w-xs sm:w-sm animate__animated animate__lightSpeedInLeft">
    <div class="login-title text-lg sm:text-3xl font-bold text-center m-b-4 ">
      Login
    </div>
    <div class="login-tips text-xs sm:text-sm text-center m-b-4">
      To get start, you need to sign in here.
    </div>
    <div class="login-form lf-div-shadow lf-div-border bg-white p-6">
      <el-form ref="loginFormRef" :model="loginForm" label-position="top" :rules="rules" @keydown.enter="submitForm">
        <el-form-item prop="username">
          <template #label>
            <div class="text-sm sm:text-base c-font-primary">Username</div>
          </template>
          <el-input v-model="loginForm.username" />
        </el-form-item>
        <el-form-item prop="password">
          <template #label>
            <div class="text-sm sm:text-base c-font-primary">Password</div>
          </template>
          <el-input v-model="loginForm.password" type="password" />
        </el-form-item>
      </el-form>
      <div class="extra-options flex justify-between items-center">
        <div class="remember-me flex items-center">
          <el-checkbox v-model="rememberMe" class="mr-2"><span class="text-xs">Remember Me</span></el-checkbox>
        </div>
        <div class="forgot-password">
          <span class="text-xs cursor-pointer c-font-secondary" @click="goToRegister">Register
            Now</span>
        </div>
      </div>
      <div class="login-button c-font-primary">
        <el-button type="primary" class="w-full" @click="submitForm">Login</el-button>
      </div>
    </div>

  </div>
</template>


<style scoped>
/* 移除必填项的红星 */
:deep(.el-form-item__label::before) {
  content: none !important;
}
</style>
