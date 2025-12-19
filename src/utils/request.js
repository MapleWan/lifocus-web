import axios from "axios";
import { getToken, refreshToken, isTokenExpiringSoon, removeToken } from "@/utils/auth";
import useElMessage from "@/hooks/useElMessage";
const elMessage = useElMessage();
// 创建axios实例
const service = axios.create({
  baseURL: import.meta.env.VITE_BASE_API, // 后端接口基础路径
  timeout: 60000, // 请求超时时间，单位ms
})

// 白名单路由
const whiteList = ['/auth/login', '/auth/register']

// 请求拦截器

service.interceptors.request.use(
  async (config) => {
    const token = getToken()
    if (token && !whiteList.includes(config.url)) {
      config.headers['Authorization'] = `Bearer ${token}`
      // 如果 token 即将过期，则刷新 token
      if (isTokenExpiringSoon() && config.url !== '/auth/logout') {
        await refreshToken()
      }
    }
    return config
  }
)

service.interceptors.response.use(
  (response) => {
    // console.log(response)
    return response.data
  },
  (error) => {
    console.log("【Lifocus】", error)
    if (error.status === 401) {
      removeToken()
      elMessage.error('登录状态异常，请重新登录')
      window.location.href = '/login'
    }
    return Promise.reject(error?.response?.data?.message || "服务错误")
  }
)

export default service
