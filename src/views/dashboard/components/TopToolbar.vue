<script setup>
import LogoIcon from "@/assets/icons/svg/logo.svg"
const emits = defineEmits(["switchAccountSetting"])
const openAccountSetting = () => {
  emits("switchAccountSetting", true)
}
const closeAccountSetting = () => {
  emits("switchAccountSetting", false)
}

</script>
<template>
  <div class="top-toolbar w-full p-2 m-b-2 bg-white flex items-center justify-between">
    <LogoIcon class="w-10 h-8 m-r-3 cursor-pointer" @click="closeAccountSetting" alt="logo" />
    <img src="@/assets/icons/images/favicon1.jpg" class="w-8 h-8 rounded cursor-pointer" alt="avator"
      @click="openAccountSetting" />
  </div>
</template>


<style scoped></style>