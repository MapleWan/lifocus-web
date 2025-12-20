<script setup>
import { ref } from 'vue'
import { getUserProjectsApi } from '@/api/project'

const projectId = defineModel('projectId', { type: String, default: '' })

const projectList = ref([])
const getProjectList = async () => {
    const res = await getUserProjectsApi()
    projectList.value = res.data
}
getProjectList()
</script>
<template>
    <div>
        <el-select v-model="projectId" placeholder="项目" style="width: 100%;" size="small" fit-input-width
            popper-class="project-select-popper">
            <el-option v-for="item in projectList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
    </div>
</template>

<style scoped></style>