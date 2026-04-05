import { mockRequest } from './mock.js'

// API基础配置
const BASE_URL = 'https://eydhjkzxoezn.sealoshzh.site'

// 是否启用Mock API（当后端API不可用时）
const USE_MOCK_API = true

// 获取存储的token
const getToken = () => {
  try {
    return uni.getStorageSync('token')
  } catch (e) {
    return null
  }
}

// 设置token
const setToken = (token) => {
  try {
    uni.setStorageSync('token', token)
  } catch (e) {}
}

// 清除token
const clearToken = () => {
  try {
    uni.removeStorageSync('token')
  } catch (e) {}
}

// 通用请求方法
const request = (url, options = {}) => {
  const token = getToken()
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  // 如果启用了Mock API，直接使用Mock API
  if (USE_MOCK_API) {
    console.log('使用Mock API:', url, options.method)
    return mockRequest(url, options)
  }

  return new Promise((resolve, reject) => {
    uni.request({
      url: `${BASE_URL}${url}`,
      method: options.method || 'GET',
      data: options.data,
      header: headers,
      success: (res) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          const body = res.data || {}
          if (body && typeof body === 'object' && 'code' in body) {
            // 兼容后端标准响应格式
            if (body.code !== 200 && body.code !== 201) {
              reject({
                code: body.code,
                message: body.message || '请求失败',
                data: body
              })
            } else {
              resolve(body)
            }
          } else {
            // 兼容直接返回资源对象的情况
            resolve({ code: 200, message: 'success', data: body })
          }
        } else {
          reject({
            code: res.statusCode,
            message: res.data?.message || '请求失败',
            data: res.data
          })
        }
      },
      fail: (err) => {
        reject({
          code: -1,
          message: '网络连接失败',
          data: err
        })
      }
    })
  })
}

export { BASE_URL, getToken, setToken, clearToken, request }