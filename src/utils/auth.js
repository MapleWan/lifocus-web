import Cookies from 'js-cookie';
import { refreshToken as refreshTokenApi } from '@/api/auth';

// token 过期时间阈值（2分钟）
const TOKEN_EXPIRY_THRESHOLD = 2 * 60 * 1000

// 设置token
export function setToken(accessToken, refreshToken, expireTime) {
  const isRemember = Cookies.get('isRemember');
  if (isRemember === 'true') {
    Cookies.set('accessToken', accessToken, { expires: 1 / 24 });
    Cookies.set('refreshToken', refreshToken, { expires: 1 / 24 });
    Cookies.set('expiryTime', expireTime, { expires: 1 / 24 });
  } else {
    // Cookies.set('accessToken', accessToken);
    // Cookies.set('refreshToken', refreshToken);
    // Cookies.set('expiryTime', expireTime);
    sessionStorage.setItem('accessToken', accessToken);
    sessionStorage.setItem('refreshToken', refreshToken);
    sessionStorage.setItem('expireTime', expireTime);
  }
}

// 获取 token
export function getToken() {
  const isRemember = Cookies.get('isRemember');
  if (isRemember === 'true') {
    return Cookies.get('accessToken') || '';
  } else {
    return sessionStorage.getItem('accessToken') || '';
  }
}

// 获取过期时间
export function getExpiryTime() {
  const isRemember = Cookies.get('isRemember');
  if (isRemember === 'true') {
    return Cookies.get('expiryTime') || '';
  } else {
    return sessionStorage.getItem('expireTime') || '';
  }
}

// 移除 token
export function removeToken() {
  const isRemember = Cookies.get('isRemember');
  if (isRemember === 'true') {
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
    Cookies.remove('expiryTime');
  } else {
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('refreshToken');
    sessionStorage.removeItem('expireTime');
  }
}

// 刷新 token
export async function refreshToken() {
  try {
    const newTokenData = await refreshTokenApi();
    setToken(newTokenData.access_token, newTokenData.refresh_token, newTokenData.expire_time);
    return Promise.resolve(newTokenData);
  } catch (error) {
    return Promise.reject(error);
  }
}

// 检查 access token 是否即将过期
export function isTokenExpiringSoon() {
  let expiryTime = getExpiryTime();
  if (!expiryTime) return false
  return Date.now() < expiryTime && Date.now() > expiryTime - TOKEN_EXPIRY_THRESHOLD
}
