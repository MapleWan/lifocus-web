<script setup>
import { register } from '@/api/auth'

import { reactive, ref } from 'vue'
import useElMessage from '@/hooks/useElMessage'

const elMessage = useElMessage()
const emits = defineEmits(['goToLogin'])
function goToLogin() {
  emits('goToLogin')
}

const registerForm = reactive({
  username: '',
  email: '',
  password: '',
  repeatPassword: ''
})
const rules = reactive({
  username: [
    { required: true, message: 'Please input username', trigger: 'blur' }
  ],
  email: [
    { required: true, message: 'Please input email', trigger: 'blur' },
    { type: 'email', message: 'Please input correct email', trigger: 'blur' }
  ],
  password: [
    { required: true, message: 'Please input password', trigger: 'blur' },
    { min: 8, message: 'Password must be at least 8 characters', trigger: 'blur' },
    { max: 20, message: 'Password must be at most 20 characters', trigger: 'blur' }
  ],
  repeatPassword: [
    { required: true, message: 'Please input confirm password', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== registerForm.password) {
          callback(new Error('Two passwords do not match!'))
        } else {
          callback()
        }
      }, trigger: 'blur'
    }
  ]
})

const agreeTerms = ref(true)
const registerFormRef = ref(null)

function submitForm() {
  registerFormRef.value.validate((valid) => {
    if (valid) {
      if (!agreeTerms.value) {
        elMessage.error('Please agree to the terms and conditions')
        return false
      }
      register(registerForm).then(_ => {
        elMessage.success('create an account successfully, Sign In now')
        goToLogin()
      }).catch(err => {
        console.error(err)
        elMessage.error('create an account failed：' + err)
      })
    } else {
      return false
    }
  })
}
</script>
<template>
  <div class="register-container w-xs sm:w-sm animate__animated animate__lightSpeedInLeft">
    <div class="register-title text-lg sm:text-3xl font-bold text-center m-b-4 ">
      Sign Up
    </div>
    <div class="register-tips text-xs sm:text-sm text-center m-b-4">
      To get start, you need to sign up here.
    </div>
    <div class="register-form lf-div-shadow lf-div-border bg-white p-6">
      <el-form ref="registerFormRef" :model="registerForm" label-position="top" :rules="rules">
        <el-form-item prop="username">
          <template #label>
            <div class="text-sm sm:text-base c-font-primary">Username</div>
          </template>
          <el-input v-model="registerForm.username" />
        </el-form-item>
        <el-form-item prop="email">
          <template #label>
            <div class="text-sm sm:text-base c-font-primary">Email</div>
          </template>
          <el-input v-model="registerForm.email" />
        </el-form-item>
        <el-form-item prop="password">
          <template #label>
            <div class="text-sm sm:text-base c-font-primary">Password</div>
          </template>
          <el-input v-model="registerForm.password" type="password" />
        </el-form-item>
        <el-form-item prop="repeatPassword">
          <template #label>
            <div class="text-sm sm:text-base c-font-primary">Confirm Password</div>
          </template>
          <el-input v-model="registerForm.repeatPassword" type="password" />
        </el-form-item>
      </el-form>
      <div class="extra-options flex justify-between items-center">
        <div class="remember-me flex items-center">
          <el-checkbox v-model="agreeTerms" class="mr-2"><span class="text-xs">I Agree to the Terms &
              Conditions</span></el-checkbox>
        </div>
        <div class="forgot-password">
          <span class="text-xs cursor-pointer c-font-secondary" @click="goToLogin">To Sign
            In</span>
        </div>
      </div>
      <div class="register-button">
        <el-button type="primary" class="w-full" @click="submitForm">Create an account</el-button>
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
