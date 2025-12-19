import request from '@/utils/request'

// 获取当前用户下所有的项目
export function getUserProjectsApi(params) {
  return request({
    url: '/project/userProject',
    method: 'get',
    params
  })
}

// 新增项目
export function addProjectApi(data) {
  return request({
    url: '/project/singleProject',
    method: 'post',
    data
  })
}
