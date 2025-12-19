<script setup>
import login from './components/login.vue';
import register from './components/register.vue';
import { ref } from 'vue';

const formType = ref('login');
</script>
<template>
  <div class="auth-container h-full flex flex-col min-w-xs overflow-auto">
    <div class="header flex justify-center items-center p-4">
      <div class="text-lg sm:text-4xl font-bold ">LiFocus: Rising To The Top</div>
    </div>
    <div class="form-container bg-background-primary flex-1 flex items-center justify-center">
      <login v-if="formType === 'login'" @goToRegister="() => { formType = 'register' }" />
      <register v-if="formType === 'register'" @goToLogin="() => { formType = 'login' }" />
    </div>
    <div class="footer">
      <div class="text-xs sm:text-sm p-4 flex justify-center items-center bg-background-secondary c-font-revert">
        @ 2025 Copyright LiFocus. All Rights Reserved. MapleWan ♥
      </div>
    </div>
  </div>
</template>


<style scoped></style>
