<template>
  <view class="page" :style="{ paddingTop: statusBarHeight + 'px' }">
    <view class="page-bg" aria-hidden="true" />

    <view class="inner">
      <view class="header">
        <text class="header-title">备忘录</text>
        <text class="header-sub">{{ loading ? '加载中...' : `共 ${notes.length} 条` }}</text>
      </view>

      <view class="grid">
        <view
          v-for="item in notes"
          :key="item.id"
          class="memo-cell"
        >
          <view class="memo-card" hover-class="memo-card--hover" @tap="onCard(item)">
            <text class="memo-title">{{ item.title }}</text>
            <text class="memo-preview">{{ item.preview }}</text>
          </view>
        </view>
      </view>
    </view>

    <button class="fab" hover-class="fab--hover" aria-label="新建" @tap="onFab">
      <text class="fab-plus">+</text>
    </button>
  </view>
</template>

<script>
import { getNotes } from '@/api/notes.js'
import { getToken } from '@/api/config.js'

export default {
  data() {
    return {
      statusBarHeight: 20,
      notes: [],
      loading: false
    }
  },
  onLoad() {
    try {
      const info = uni.getSystemInfoSync()
      this.statusBarHeight = info.statusBarHeight || 20
    } catch {
      this.statusBarHeight = 20
    }
  },
  onShow() {
    this.loadNotes()
  },
  methods: {
    async loadNotes() {
      // 检查是否有token，如果没有则跳转到登录页
      const token = getToken()
      if (!token) {
        uni.redirectTo({ url: '/pages/login/login' })
        return
      }

      this.loading = true
      try {
        const result = await getNotes()
        // 过滤掉没有有效ID的备忘录
        this.notes = (result.data || []).filter(note => note && note.id)
      } catch (error) {
        uni.showToast({ title: error.message || '加载失败', icon: 'none' })
        this.notes = []
      } finally {
        this.loading = false
      }
    },
    onCard(item) {
      if (!item || !item.id) {
        uni.showToast({ title: '备忘录数据异常', icon: 'none' })
        return
      }
      const url = '/pages/memo/detail?id=' + encodeURIComponent(item.id)
      uni.navigateTo({ url })
    },
    onFab() {
      // 新建空备忘并进入编辑页
      uni.navigateTo({ url: '/pages/memo/detail' })
    }
  }
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  position: relative;
  padding-bottom: calc(160rpx + env(safe-area-inset-bottom));
  box-sizing: border-box;
}

.page-bg {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 0;
  background: linear-gradient(180deg, #f7f8ff 0%, #e6e8ff 45%, #eef0ff 100%);
}

.inner {
  position: relative;
  z-index: 1;
  padding: 24rpx 32rpx 0;
}

.header {
  margin-bottom: 28rpx;
}

.header-title {
  display: block;
  font-size: 44rpx;
  font-weight: 700;
  color: #121212;
  letter-spacing: -0.5rpx;
}

.header-sub {
  display: block;
  margin-top: 8rpx;
  font-size: 24rpx;
  color: #64748b;
}

.grid {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin: 0 -12rpx;
}

.memo-cell {
  width: 50%;
  padding: 12rpx;
  box-sizing: border-box;
}

.memo-card {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 28rpx;
  border: 1rpx solid rgba(148, 163, 184, 0.35);
  box-shadow: 0 8rpx 32rpx rgba(15, 23, 42, 0.06);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  padding: 20rpx;
  box-sizing: border-box;
  min-height: 200rpx;
}

.memo-title {
  display: block;
  font-size: 28rpx;
  font-weight: 700;
  color: #121212;
  margin-bottom: 12rpx;
}

.memo-preview {
  display: block;
  font-size: 22rpx;
  color: #64748b;
  line-height: 1.55;
}

.memo-card--hover {
  opacity: 0.92;
}

.fab {
  position: fixed;
  right: 40rpx;
  bottom: calc(48rpx + env(safe-area-inset-bottom));
  z-index: 10;
  width: 112rpx;
  height: 112rpx;
  padding: 0;
  margin: 0;
  border: none;
  border-radius: 50%;
  background: linear-gradient(135deg, #5e5ce6 0%, #8e5af7 100%);
  box-shadow: 0 16rpx 40rpx rgba(94, 92, 230, 0.42);
  display: flex;
  align-items: center;
  justify-content: center;
}

.fab::after {
  border: none;
}

.fab--hover {
  opacity: 0.92;
  transform: scale(0.96);
}

.fab-plus {
  font-size: 64rpx;
  font-weight: 300;
  color: #ffffff;
  line-height: 1;
  margin-top: -6rpx;
}
</style>
