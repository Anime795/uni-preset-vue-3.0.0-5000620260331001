<template>
  <view class="content">
    <image class="logo" src="/static/logo.png"></image>
    <view class="text-area">
      <text class="title">{{ title }}</text>
    </view>
  </view>
</template>

<script>
import { getToken } from '@/api/config.js'

export default {
  data() {
    return {
      title: '备忘录应用',
    }
  },
  onLoad() {
    // 检查登录状态
    const token = getToken()
    if (token) {
      // 已登录，跳转到备忘录页
      uni.redirectTo({ url: '/pages/memo/memo' })
    } else {
      // 未登录，跳转到登录页
      uni.redirectTo({ url: '/pages/login/login' })
    }
  },
  methods: {},
}
</script>

<style>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.logo {
  height: 200rpx;
  width: 200rpx;
  margin-top: 200rpx;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 50rpx;
}

.text-area {
  display: flex;
  justify-content: center;
}

.title {
  font-size: 36rpx;
  color: #8f8f94;
}
</style>
