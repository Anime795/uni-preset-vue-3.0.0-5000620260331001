<template>
  <view class="page" :style="{ paddingTop: statusBarHeight + 'px' }">
    <view class="page-bg" aria-hidden="true" />

    <view class="inner">
      <view class="brand">
        <view class="logo-wrap" @tap="onLogoTap">
          <text class="logo-mark">◆</text>
        </view>
        <text class="title">欢迎回来</text>
        <text class="subtitle">使用账号密码登录</text>
      </view>

      <view class="card">
        <view class="field">
          <text class="label">账号</text>
          <view class="input-row">
            <text class="input-icon" aria-hidden="true">👤</text>
            <input
              id="login-account"
              class="input"
              type="text"
              v-model="account"
              placeholder="手机号 / 邮箱 / 用户"
              maxlength="64"
              confirm-type="next"
            />
          </view>
        </view>

        <view class="field">
          <text class="label">密码</text>
          <view class="input-row">
            <input
              id="login-password"
              class="input input--pwd"
              :password="!showPassword"
              v-model="password"
              placeholder="请输入密码"
              maxlength="32"
              confirm-type="done"
            />
            <button
              class="eye-btn"
              hover-class="eye-btn--hover"
              :aria-label="showPassword ? '隐藏密码' : '显示密码'"
              @tap="togglePassword"
            >
              <text class="eye-text">{{ showPassword ? '🙈' : '👁' }}</text>
            </button>
          </view>
        </view>

        <view class="row-actions">
          <button class="link" hover-class="link--hover" @tap="onForgot">忘记密码？</button>
        </view>

        <button
          class="btn-login"
          hover-class="btn-login--hover"
          :disabled="submitting"
          :class="{ 'btn-login--loading': submitting }"
          @tap="onSubmit"
        >
          <text v-if="submitting" class="btn-loading-dot" />
          <text class="btn-login-text">{{ submitting ? '登录中…' : '登 录' }}</text>
        </button>
      </view>

      <view class="footer footer--action" @tap.stop="goRegister" @click.stop="goRegister">
        <text class="footer-text">还没有账号 · 前往</text>
        <text class="footer-link">注册</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { login } from '@/api/auth.js'

const statusBarHeight = ref(20)
const account = ref('')
const password = ref('')
const showPassword = ref(false)
const submitting = ref(false)
const registerNavLock = ref(false)

onMounted(() => {
  try {
    const info = uni.getSystemInfoSync()
    statusBarHeight.value = info.statusBarHeight || 20
  } catch {
    statusBarHeight.value = 20
  }
})

function togglePassword() {
  showPassword.value = !showPassword.value
}

function onForgot() {
  uni.showToast({ title: '忘记密码流程 · 占位', icon: 'none' })
}

function goRegister() {
  if (registerNavLock.value) return
  registerNavLock.value = true
  uni.navigateTo({
    url: '/pages/register/register',
    fail(err) {
      console.error('[goRegister]', err)
      uni.showToast({
        title: '无法打开注册页，请保存代码并重新运行 dev',
        icon: 'none',
        duration: 2800,
      })
    },
    complete() {
      registerNavLock.value = false
    },
  })
}

function onLogoTap() {
  uni.showToast({ title: '品牌首页 · 待接入', icon: 'none' })
}

async function onSubmit() {
  const u = account.value.trim()
  const p = password.value.trim()
  if (!u) {
    uni.showToast({ title: '请输入账号', icon: 'none' })
    return
  }
  if (!p) {
    uni.showToast({ title: '请输入密码', icon: 'none' })
    return
  }
  if (submitting.value) return
  submitting.value = true

  try {
    const result = await login({ username: u, password: p })
    uni.showToast({ title: '登录成功', icon: 'success', duration: 900 })
    setTimeout(() => {
      uni.redirectTo({ url: '/pages/memo/memo' })
    }, 900)
  } catch (error) {
    console.error('登录失败:', error)
    uni.showToast({ title: error.message || '登录失败', icon: 'none' })
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  position: relative;
  padding-bottom: calc(24rpx + env(safe-area-inset-bottom));
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
  padding: 32rpx 40rpx 0;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.brand {
  align-items: center;
  text-align: center;
  margin-bottom: 48rpx;
}

.logo-wrap {
  width: 112rpx;
  height: 112rpx;
  margin: 0 auto 24rpx;
  border-radius: 32rpx;
  background: linear-gradient(135deg, #5e5ce6 0%, #8e5af7 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 16rpx 40rpx rgba(94, 92, 230, 0.38);
}

.logo-mark {
  font-size: 52rpx;
  color: #121212;
  line-height: 1;
}

.title {
  display: block;
  font-size: 40rpx;
  font-weight: 700;
  color: #121212;
  letter-spacing: -0.5rpx;
}

.subtitle {
  display: block;
  margin-top: 12rpx;
  font-size: 26rpx;
  color: #64748b;
}

.card {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 40rpx;
  padding: 40rpx 32rpx 36rpx;
  border: 1rpx solid rgba(148, 163, 184, 0.35);
  box-shadow: 0 8rpx 40rpx rgba(15, 23, 42, 0.08);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

.field {
  margin-bottom: 28rpx;
}

.label {
  display: block;
  font-size: 24rpx;
  font-weight: 600;
  color: #64748b;
  margin-bottom: 12rpx;
}

.input-row {
  position: relative;
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.95);
  border: 1rpx solid rgba(148, 163, 184, 0.4);
  border-radius: 24rpx;
  min-height: 92rpx;
  padding: 0 20rpx;
  box-sizing: border-box;
}

.input-row:focus-within {
  border-color: #5e5ce6;
  box-shadow: 0 0 0 6rpx rgba(94, 92, 230, 0.18);
}

.input-icon {
  font-size: 30rpx;
  margin-right: 12rpx;
  opacity: 0.55;
}

.input {
  flex: 1;
  height: 92rpx;
  font-size: 30rpx;
  color: #121212;
}

.input--pwd {
  padding-right: 8rpx;
}

.eye-btn {
  width: 72rpx;
  height: 72rpx;
  padding: 0;
  margin: 0;
  border: none;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  line-height: 1;
}

.eye-btn::after {
  border: none;
}

.eye-btn--hover {
  background: rgba(94, 92, 230, 0.08);
  border-radius: 16rpx;
}

.eye-text {
  font-size: 34rpx;
}

.row-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: -8rpx;
  margin-bottom: 28rpx;
}

.link {
  padding: 8rpx 0;
  margin: 0;
  background: transparent;
  border: none;
  font-size: 24rpx;
  color: #5e5ce6;
  font-weight: 600;
  line-height: 1.4;
}

.link::after {
  border: none;
}

.link--hover {
  opacity: 0.85;
}

.btn-login {
  width: 100%;
  height: 96rpx;
  line-height: 96rpx;
  border: none;
  border-radius: 28rpx;
  padding: 0;
  margin: 0;
  background: linear-gradient(90deg, #5e5ce6 0%, #8e5af7 100%);
  color: #ffffff;
  font-size: 32rpx;
  font-weight: 600;
  box-shadow: 0 12rpx 36rpx rgba(94, 92, 230, 0.38);
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-login::after {
  border: none;
}

.btn-login--hover {
  opacity: 0.94;
}

.btn-login[disabled] {
  opacity: 0.72;
}

.btn-login-text {
  color: #ffffff;
}

.btn-loading-dot {
  width: 12rpx;
  height: 12rpx;
  border-radius: 50%;
  background: #fff;
  margin-right: 16rpx;
  animation: pulse 0.9s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 0.35;
    transform: scale(0.85);
  }
  50% {
    opacity: 1;
    transform: scale(1);
  }
}

.footer {
  margin-top: auto;
  padding-top: 48rpx;
  text-align: center;
  font-size: 22rpx;
  color: #94a3b8;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 0 4rpx;
}

.footer--action {
  cursor: pointer;
  padding: 20rpx 16rpx 8rpx;
  margin: 0 -16rpx;
  -webkit-tap-highlight-color: transparent;
}

.footer-link {
  color: #5e5ce6;
  font-weight: 600;
  padding: 0 4rpx;
}
</style>
