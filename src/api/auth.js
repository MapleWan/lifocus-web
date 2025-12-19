import request from '@/utils/request'

// 登录
export function login(data) {
  return request({
    url: '/auth/login',
    method: 'post',
    data
  })
}

// 刷新 token
export function refreshToken() {
  return request({
    url: '/auth/login',
    method: 'get'
  })
}

// 注册
export function register(data) {
  return request({
    url: '/auth/register',
    method: 'post',
    data
  })
}

export function logoutApi() {
  return request({
    url: '/auth/logout',
    method: 'post'
  })
}

export function getCurrentUserApi() {
  return request({
    url: `/user/currentUser`,
    method: 'get'
  })
}