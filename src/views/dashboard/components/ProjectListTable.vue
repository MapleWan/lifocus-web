<script setup>
import NoDataIcon from "@/assets/icons/svg/noData.svg"

const props = defineProps({
  projectList: {
    type: Array,
    required: true
  }
})

</script>
<template>
  <div class="flex flex-wrap gap-4 p-t-4">
    <el-table :data="projectList" style="width: 100%" v-if="projectList.length > 0" max-height="800">
      <el-table-column prop="name" fixed label="项目名" min-width="180" sortable />
      <el-table-column prop="updated_at" label="更新时间" width="180" sortable />
      <el-table-column prop="created_at" label="创建时间" width="180" sortable />
    </el-table>
    <div class="w-full flex items-center justify-center h-60" v-else>
      <NoDataIcon class="w-1/2 h-1/2" />
    </div>
  </div>
</template>


<style scoped></style>