import axios from "axios";
import { getToken, getRefreshToken, refreshToken, isTokenExpiringSoon, removeToken } from "@/utils/auth";
import { getCurrentProjectId } from "./project";
import useElMessage from "@/hooks/useElMessage";

let isRefreshingToken = false; // 是否正在刷新token
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
  (config) => {
    if (whiteList.includes(config.url)) {
      if (config.isRefreshToken) config.headers['Authorization'] = `Bearer ${getRefreshToken()}`
      return config
    }
    const token = getToken()
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
      const projectId = getCurrentProjectId() || ''
      if (projectId) config.headers['X-Project-Id'] = projectId
      // 如果 token 即将过期，则刷新 token
      if (isTokenExpiringSoon() && !['/auth/logout', ...whiteList].includes(config.url)) {
        if (isRefreshingToken) return
        isRefreshingToken = true
        refreshToken()
          .finally(() => {
            isRefreshingToken = false
          })
      }
    }
    return config
  }
)

service.interceptors.response.use(
  (response) => {
    // console.log(response)
    // 检查是否是 blob 类型的响应（用于文件下载）
    if (response.data instanceof Blob) {
      // 检查是否是错误响应的 blob（例如服务端返回错误信息）
      const contentType = response.headers['content-type'];
      if (contentType && contentType.includes('application/json')) {
        // 如果是 JSON 类型的 blob，转换为文本并解析
        return new Response(response.data).text().then(text => {
          try {
            const jsonData = JSON.parse(text);
            return Promise.reject(jsonData);
          } catch (e) {
            console.error(e)
            return Promise.reject({ message: '下载失败' });
          }
        });
      }

      // 处理文件下载
      const contentDisposition = response.headers
      ['content-disposition'];

      let filename = 'downloaded-file';
      if (contentDisposition) {
        // 优先匹配 filename* 格式，它包含 UTF-8 编码的文件名
        const filenameStarMatch = contentDisposition.match(/filename\*\s*=\s*[^'']*(UTF-8'')\s*(.+)/i);
        if (filenameStarMatch && filenameStarMatch[2]) {
          // 解码 URL 编码的 UTF-8 文件名，去除可能的引号
          filename = decodeURIComponent(filenameStarMatch[2].trim()).replace(/['"]/g, '');
        } else {
          // 如果没有 filename*，则尝试匹配普通的 filename
          const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/i);
          if (filenameMatch && filenameMatch[1]) {
            filename = filenameMatch[1].replace(/['"]/g, '');
            // 尝试解码可能的 URL 编码
            try {
              filename = decodeURIComponent(filename);
            } catch (e) {
              // 如果解码失败，使用原始文件名
            }
          }
        }
      }

      // 创建下载链接
      const url = window.URL.createObjectURL(response.data);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', decodeURIComponent(filename));
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      // 返回一个 resolved promise 表示下载完成
      return Promise.resolve({ message: '下载成功', filename });
    }

    // 对于非 blob 响应，返回 response.data
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
