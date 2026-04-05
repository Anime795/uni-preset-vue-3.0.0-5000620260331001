<template>
  <view class="page">
    <view class="card">
        <view class="header">
          <input class="title-input" v-model="title" placeholder="输入标题" />
          <button class="delete-btn" @click="onDelete">删除</button>
        </view>
        <view class="editor">
          <textarea class="content-area" v-model="content" placeholder="输入内容，支持换行"></textarea>
        </view>
        <view class="actions">
          <button class="save-btn" @click="onSave">保存</button>
        </view>
      </view>
    <view class="bottom-actions">
      <button class="back-btn-full" @click="onBack">返回列表</button>
    </view>
  </view>
</template>

<script>
import { getNote, createNote, updateNote, deleteNote } from '@/api/notes.js'
import { getToken } from '@/api/config.js'

export default {
  data() {
    return {
      id: null,
      title: '',
      content: '',
      loading: false,
      saving: false,
      deleting: false
    }
  },
  onLoad(options) {
    // 检查token
    const token = getToken()
    if (!token) {
      uni.redirectTo({ url: '/pages/login/login' })
      return
    }

    const id = options && options.id ? options.id : null
    this.id = id
    if (id) {
      this.loadNote(id)
    }
  },
  methods: {
    onBack() {
      uni.navigateBack()
    },
    async loadNote(id) {
      this.loading = true
      try {
        const note = await getNote(id)
        this.title = note.title || ''
        this.content = note.content || ''
      } catch (error) {
        uni.showToast({ title: error.message || '加载失败', icon: 'none' })
        uni.navigateBack()
      } finally {
        this.loading = false
      }
    },
    async onSave() {
      if (this.saving) return

      const title = this.title.trim()
      const content = this.content.trim()

      if (!title && !content) {
        uni.showToast({ title: '请输入标题或内容', icon: 'none' })
        return
      }

      this.saving = true
      try {
        let result
        if (this.id) {
          // 更新
          result = await updateNote(this.id, { title, content })
          uni.showToast({ title: '已保存', icon: 'success' })
        } else {
          // 创建
          result = await createNote({ title, content })
          this.id = result.id
          uni.showToast({ title: '已创建', icon: 'success' })
        }
      } catch (error) {
        uni.showToast({ title: error.message || '保存失败', icon: 'none' })
      } finally {
        this.saving = false
      }
    },
    async onDelete() {
      if (!this.id || this.deleting) return

      uni.showModal({
        title: '删除备忘',
        content: '确认删除此备忘录？',
        success: async (res) => {
          if (res.confirm) {
            this.deleting = true
            try {
              await deleteNote(this.id)
              uni.showToast({ title: '已删除', icon: 'success' })
              setTimeout(() => {
                uni.navigateBack()
              }, 300)
            } catch (error) {
              uni.showToast({ title: error.message || '删除失败', icon: 'none' })
            } finally {
              this.deleting = false
            }
          }
        }
      })
    }
  }
}
</script>

<style scoped>
.page { padding: 20rpx; background: #F8F8F8; min-height: 100vh; }
.card { background: #fff; border-radius: 16rpx; padding: 24rpx; box-shadow: 0 2rpx 6rpx rgba(0,0,0,0.04); }
.header { position: relative; padding-bottom: 10rpx; }
.title { font-size: 36rpx; font-weight: 700; color: #222; }
.delete-btn { position: absolute; right: 0; top: 0; padding: 10rpx 12rpx; color: #f44; background: transparent; border: none; }
.back-btn { position: absolute; left: 0; top: 0; padding: 10rpx 12rpx; color: #666; background: transparent; border: none; }
.body { margin-top: 14rpx; max-height: 80vh; }
.line { display: block; color: #666; line-height: 36rpx; margin-bottom: 8rpx; }
.bottom-actions { margin-top: 20rpx; padding: 0 20rpx; }
.back-btn-full { width: 100%; padding: 20rpx; background: #007AFF; color: white; border: none; border-radius: 12rpx; font-size: 32rpx; }
</style>
