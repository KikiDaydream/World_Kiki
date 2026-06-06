import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import App from './App.vue'
import router from './router'
import { setupRouterGuard } from './router/guard'
import './assets/styles/reset.css'
import './assets/styles/variables.css'

const app = createApp(App)

// Register Pinia
app.use(createPinia())

// Register Router
app.use(router)

// Register Router Guard
setupRouterGuard(router)

// Register Element Plus
app.use(ElementPlus)

// Register all Element Plus icons
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.mount('#app')
