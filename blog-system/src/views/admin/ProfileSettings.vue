<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useProfileStore } from '@/stores/profile'
import { ElMessage } from 'element-plus'
import { useTitle } from '@vueuse/core'
import avatarSrc from '@/assets/images/头像.jpg'

useTitle('个人信息 - 博客系统')

const store = useProfileStore()
const loading = ref(false)

const form = ref({
  nickname: '',
  avatar: '',
  title: '',
  bio: '',
  location: '',
  website: '',
  github: '',
  twitter: '',
  skills: [] as string[],
})

const skillInput = ref('')

onMounted(async () => {
  await store.loadProfile()
  if (store.profile) {
    form.value.nickname = store.profile.nickname || ''
    form.value.avatar = store.profile.avatar || ''
    form.value.title = store.profile.title || ''
    form.value.bio = store.profile.bio || ''
    form.value.location = store.profile.location || ''
    form.value.website = store.profile.website || ''
    form.value.github = store.profile.github || ''
    form.value.twitter = store.profile.twitter || ''
    form.value.skills = store.profile.skills || []
  }
})

function addSkill() {
  const tag = skillInput.value.trim()
  if (tag && !form.value.skills.includes(tag)) {
    form.value.skills.push(tag)
  }
  skillInput.value = ''
}

function removeSkill(index: number) {
  form.value.skills.splice(index, 1)
}

async function handleSave() {
  loading.value = true
  try {
    await store.saveProfile(form.value)
    ElMessage.success('个人信息已更新')
  } catch (err: any) {
    ElMessage.error(err?.response?.data?.message || '保存失败')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="profile-settings">
    <h2 class="page-title">个人信息设置</h2>

    <div class="settings-layout">
      <!-- 头像预览 -->
      <div class="avatar-section">
        <div class="avatar-preview">
          <img
            :src="form.avatar || avatarSrc"
            :alt="form.nickname"
            class="avatar-img"
          />
        </div>
        <p class="avatar-hint">输入图片 URL 更换头像</p>
      </div>

      <!-- 表单 -->
      <div class="form-section">
        <el-form label-width="100px" size="large">
          <el-form-item label="昵称">
            <el-input v-model="form.nickname" placeholder="你的昵称" />
          </el-form-item>

          <el-form-item label="头像 URL">
            <el-input v-model="form.avatar" placeholder="https://example.com/avatar.jpg" />
          </el-form-item>

          <el-form-item label="头衔">
            <el-input v-model="form.title" placeholder="如：全栈开发者" />
          </el-form-item>

          <el-form-item label="个人简介">
            <el-input
              v-model="form.bio"
              type="textarea"
              :rows="4"
              placeholder="介绍一下自己..."
              maxlength="500"
              show-word-limit
            />
          </el-form-item>

          <el-form-item label="所在地">
            <el-input v-model="form.location" placeholder="中国 · 上海" />
          </el-form-item>

          <el-divider content-position="left">社交链接</el-divider>

          <el-form-item label="个人网站">
            <el-input v-model="form.website" placeholder="https://your-site.com">
              <template #prefix><el-icon><Link /></el-icon></template>
            </el-input>
          </el-form-item>

          <el-form-item label="GitHub">
            <el-input v-model="form.github" placeholder="用户名">
              <template #prefix><el-icon><Github /></el-icon></template>
            </el-input>
          </el-form-item>

          <el-form-item label="Twitter">
            <el-input v-model="form.twitter" placeholder="用户名">
              <template #prefix><el-icon><ChatLineSquare /></el-icon></template>
            </el-input>
          </el-form-item>

          <el-divider content-position="left">技能标签</el-divider>

          <el-form-item label="技能">
            <div class="skills-wrapper">
              <div class="skills-tags">
                <el-tag
                  v-for="(skill, index) in form.skills"
                  :key="index"
                  closable
                  :disable-transitions="false"
                  @close="removeSkill(index)"
                >
                  {{ skill }}
                </el-tag>
              </div>
              <div class="skills-input">
                <el-input
                  v-model="skillInput"
                  placeholder="输入技能名后回车添加"
                  @keyup.enter="addSkill"
                >
                  <template #append>
                    <el-button @click="addSkill">添加</el-button>
                  </template>
                </el-input>
              </div>
            </div>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" :loading="loading" @click="handleSave" size="large">
              保存设置
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-settings {
  padding: var(--spacing-md) 0;
  max-width: 800px;
}

.page-title {
  font-size: var(--font-size-xl);
  margin-bottom: var(--spacing-lg);
}

.settings-layout {
  display: flex;
  gap: var(--spacing-xl);
}

.avatar-section {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-md);
}

.avatar-preview {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid var(--color-border);
  background: var(--color-bg-secondary);
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-hint {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  text-align: center;
}

.form-section {
  flex: 1;
  min-width: 0;
}

.skills-wrapper {
  width: 100%;
}

.skills-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
  margin-bottom: var(--spacing-sm);
}

.skills-input {
  display: flex;
  gap: var(--spacing-xs);
}

@media (max-width: 768px) {
  .settings-layout {
    flex-direction: column;
    align-items: center;
  }
}
</style>
