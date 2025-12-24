import request from '@/utils/request'

// 获取用户所有笔记 或 最近一个月的笔记（isRecent 参数）
export function getRecentNoteListApi(params) {
  return request({
    url: '/note/allNote',
    method: 'get',
    params
  })
}

// 新增笔记
export function addNoteApi(data) {
  return request({
    url: '/note/singleNote',
    method: 'post',
    data: {
      type: 'note',
      ...data,
    }
  })
}

// 修改笔记
export function updateNoteApi(id, data) {
  return request({
    url: `/note/singleNote/${id}`,
    method: 'put',
    data
  })
}

// 删除笔记
export function deleteNoteApi(id) {
  return request({
    url: `/note/singleNote/${id}`,
    method: 'delete'
  })
}

// 根据笔记 id 获取笔记信息
export function getNoteByIdApi(id) {
  return request({
    url: `/note/singleNote/${id}`,
    method: 'get'
  })
}

// 下载笔记
export function downloadNoteApi(data) {
  return request({
    url: `/note/export`,
    method: 'post',
    responseType: 'blob',
    data
  })
}
