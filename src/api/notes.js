import { request } from './config.js'

// 获取备忘录列表
const buildQueryString = (params = {}) => {
  return Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&')
}

export const getNotes = async (params = {}) => {
  try {
    const queryString = buildQueryString(params)
    const url = `/api/notes${queryString ? '?' + queryString : ''}`
    const response = await request(url)
    if (response.code === 200) {
      // 处理后端返回的数据结构 {data: [...], meta: {...}}
      const notesArray = response.data?.data || response.data || []
      // 统一处理字段名，将 _id 映射为 id
      const notes = notesArray.map(note => ({
        ...note,
        id: note._id || note.id
      }))
      return { ...response, data: notes }
    } else {
      throw new Error(response.message || '获取备忘录列表失败')
    }
  } catch (error) {
    throw error
  }
}

// 获取单个备忘录
export const getNote = async (id) => {
  try {
    const response = await request(`/api/notes/${id}`)
    if (response.code === 200) {
      // 统一处理字段名，将 _id 映射为 id
      return {
        ...response.data,
        id: response.data._id || response.data.id
      }
    } else {
      throw new Error(response.message || '获取备忘录失败')
    }
  } catch (error) {
    throw error
  }
}

// 创建备忘录
export const createNote = async (data) => {
  try {
    const response = await request('/api/notes', {
      method: 'POST',
      data
    })
    if (response.code === 200 || response.code === 201) {
      // 统一处理字段名，将 _id 映射为 id
      return {
        ...response.data,
        id: response.data._id || response.data.id
      }
    } else {
      throw new Error(response.message || '创建备忘录失败')
    }
  } catch (error) {
    throw error
  }
}

// 更新备忘录
export const updateNote = async (id, data) => {
  try {
    const response = await request(`/api/notes/${id}`, {
      method: 'PUT',
      data
    })
    if (response.code === 200) {
      // 统一处理字段名，将 _id 映射为 id
      return {
        ...response.data,
        id: response.data._id || response.data.id
      }
    } else {
      throw new Error(response.message || '更新备忘录失败')
    }
  } catch (error) {
    throw error
  }
}

// 删除备忘录
export const deleteNote = async (id) => {
  try {
    const response = await request(`/api/notes/${id}`, {
      method: 'DELETE'
    })
    if (response.code === 200 || response.code === 204) {
      return true
    } else {
      throw new Error(response.message || '删除备忘录失败')
    }
  } catch (error) {
    throw error
  }
}

// 上传附件
export const uploadAttachment = async (noteId, filePath) => {
  try {
    return new Promise((resolve, reject) => {
      uni.uploadFile({
        url: `/api/notes/${noteId}/attachments`,
        filePath: filePath,
        name: 'file',
        header: {
          'Authorization': `Bearer ${uni.getStorageSync('token')}`
        },
        success: (res) => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            const data = JSON.parse(res.data)
            if (data.code >= 200 && data.code < 300) {
              resolve(data.data)
            } else {
              reject(new Error(data.message || '上传附件失败'))
            }
          } else {
            reject(new Error('上传失败'))
          }
        },
        fail: (err) => {
          reject(new Error('网络错误'))
        }
      })
    })
  } catch (error) {
    throw error
  }
}

// 删除附件
export const deleteAttachment = async (id) => {
  try {
    const response = await request(`/api/attachments/${id}`, {
      method: 'DELETE'
    })
    if (response.code === 200 || response.code === 204) {
      return true
    } else {
      throw new Error(response.message || '删除附件失败')
    }
  } catch (error) {
    throw error
  }
}