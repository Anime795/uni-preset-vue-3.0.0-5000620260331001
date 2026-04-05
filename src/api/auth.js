import { request, setToken, clearToken } from './config.js'

// 用户注册
export const register = async (data) => {
  try {
    const response = await request('/api/auth/register', {
      method: 'POST',
      data
    })
    if (response.code === 200 || response.code === 201) {
      setToken(response.data.token)
      return response.data
    } else {
      throw new Error(response.message || '注册失败')
    }
  } catch (error) {
    throw error
  }
}

// 用户登录
export const login = async (data) => {
  try {
    const response = await request('/api/auth/login', {
      method: 'POST',
      data
    })
    if (response.code === 200) {
      setToken(response.data.token)
      return response.data
    } else {
      throw new Error(response.message || '登录失败')
    }
  } catch (error) {
    throw error
  }
}

// 获取当前用户信息
export const getCurrentUser = async () => {
  try {
    const response = await request('/api/auth/me')
    if (response.code === 200) {
      return response.data
    } else {
      throw new Error(response.message || '获取用户信息失败')
    }
  } catch (error) {
    throw error
  }
}

// 用户登出
export const logout = async () => {
  try {
    const response = await request('/api/auth/logout', {
      method: 'POST'
    })
    if (response.code === 200) {
      clearToken()
      return response.data
    } else {
      throw new Error(response.message || '登出失败')
    }
  } catch (error) {
    // 即使API调用失败，也清除本地token
    clearToken()
    throw error
  }
}