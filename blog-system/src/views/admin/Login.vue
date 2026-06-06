<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useTitle } from '@vueuse/core'
import { ElMessage } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'

useTitle('登录 - 博客系统')

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const form = reactive({
  username: '',
  password: '',
})

const loading = ref(false)

async function handleLogin() {
  if (!form.username || !form.password) {
    ElMessage.warning('请输入用户名和密码')
    return
  }

  loading.value = true
  try {
    await authStore.loginAction(form.username, form.password)
    ElMessage.success('登录成功')
    const redirect = (route.query.redirect as string) || '/admin'
    router.push(redirect)
  } catch (err: any) {
    ElMessage.error(err?.response?.data?.message || '登录失败')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-page">
    <div class="login-card">
      <div class="login-header">
        <span class="login-icon">📝</span>
        <h1 class="login-title">博客后台登录</h1>
        <p class="login-desc">请输入管理员账号和密码</p>
      </div>

      <el-form @submit.prevent="handleLogin" class="login-form">
        <el-form-item>
          <el-input
            v-model="form.username"
            placeholder="用户名"
            size="large"
            @keyup.enter="handleLogin"
          >
            <template #prefix><el-icon><User /></el-icon></template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="form.password"
            type="password"
            placeholder="密码"
            size="large"
            show-password
            @keyup.enter="handleLogin"
          >
            <template #prefix><el-icon><Lock /></el-icon></template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            size="large"
            :loading="loading"
            class="login-btn"
            @click="handleLogin"
          >
            {{ loading ? '登录中...' : '登录' }}
          </el-button>
        </el-form-item>
      </el-form>

      <div class="login-footer">
        <p>默认账号：admin / 123456</p>
        <el-button text size="small" @click="router.push('/')">返回首页</el-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: var(--color-bg-secondary);
  padding: var(--spacing-md);
}

.login-card {
  background: var(--color-bg);
  border-radius: 12px;
  border: 1px solid var(--color-border);
  padding: var(--spacing-xl);
  width: 100%;
  max-width: 400px;
  box-shadow: var(--shadow-lg);
}

.login-header {
  text-align: center;
  margin-bottom: var(--spacing-xl);
}

.login-icon {
  font-size: 3rem;
  display: block;
  margin-bottom: var(--spacing-md);
}

.login-title {
  font-size: var(--font-size-xl);
  margin-bottom: var(--spacing-xs);
}

.login-desc {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
}

.login-form {
  margin-bottom: var(--spacing-md);
}

.login-btn {
  width: 100%;
}

.login-footer {
  text-align: center;
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
}

.login-footer p {
  margin-bottom: var(--spacing-xs);
}
</style>
