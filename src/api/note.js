import request from '@/utils/request'

// 获取用户所有笔记 或 最近一个月的笔记（isRecent 参数）
export function getRecentNoteListApi(params) {
    return request({
        url: '/note/allNote',
        method: 'get',
        params
    })
}
