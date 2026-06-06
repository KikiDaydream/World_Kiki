<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useFetch } from '@vueuse/core'

const city = ref('加载中...')
const weather = ref<any>(null)
const loading = ref(true)
const error = ref('')

// 默认坐标：北京
const DEFAULT_LAT = 39.9042
const DEFAULT_LON = 116.4074

// WMO 天气代码 → [图标, 描述]
function getWeatherInfo(code: number): [string, string] {
  const map: Record<number, [string, string]> = {
    0: ['☀️', '晴天'], 1: ['🌤️', '晴'], 2: ['⛅', '多云'],
    3: ['☁️', '阴天'], 45: ['🌫️', '雾'], 48: ['🌫️', '霜雾'],
    51: ['🌦️', '小毛毛雨'], 53: ['🌦️', '毛毛雨'], 55: ['🌦️', '大毛毛雨'],
    61: ['🌧️', '小雨'], 63: ['🌧️', '中雨'], 65: ['🌧️', '大雨'],
    71: ['❄️', '小雪'], 73: ['❄️', '中雪'], 75: ['❄️', '大雪'],
    80: ['🌦️', '阵雨'], 81: ['🌦️', '中阵雨'], 82: ['🌧️', '大阵雨'],
    95: ['⛈️', '雷暴'], 96: ['⛈️', '雷暴+冰雹'], 99: ['⛈️', '强雷暴'],
  }
  return map[code] || ['🌈', '未知']
}

// 使用 VueUse 的 useFetch 调用 Open-Meteo 天气 API
const apiUrl = ref('')
const { data, isFetching, execute } = useFetch(apiUrl, { immediate: false }).json()

// 监听数据加载完毕
watch(isFetching, (fetching) => {
  if (!fetching) {
    if (data.value?.current) {
      weather.value = data.value.current
      loading.value = false
    } else if (apiUrl.value && !fetching) {
      // 请求完成但没有数据 = 出错了
      if (!weather.value) {
        error.value = '天气数据加载失败'
        loading.value = false
      }
    }
  }
})

// 根据坐标获取城市名（Open-Meteo 反向地理编码）
async function getCityName(lat: number, lon: number): Promise<string> {
  try {
    const res = await fetch(
      `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${lat}&longitude=${lon}&language=zh&format=json`
    )
    const json = await res.json()
    if (json.results?.[0]) {
      const r = json.results[0]
      return r.country === 'China' || !r.country ? r.name : `${r.country} · ${r.name}`
    }
    return '当前位置'
  } catch {
    return '当前位置'
  }
}

// 获取天气数据
async function fetchWeather(lat: number, lon: number, name: string) {
  city.value = name
  apiUrl.value = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,weather_code&timezone=auto`
  await execute()
}

// 获取用户位置，失败则回退到默认城市
async function initWeather() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords
        const name = await getCityName(latitude, longitude)
        await fetchWeather(latitude, longitude, name)
      },
      async () => {
        await fetchWeather(DEFAULT_LAT, DEFAULT_LON, '北京')
      },
      { timeout: 5000, enableHighAccuracy: false }
    )
  } else {
    await fetchWeather(DEFAULT_LAT, DEFAULT_LON, '北京')
  }
}

onMounted(initWeather)
</script>

<template>
  <div class="sidebar-section weather-widget">
    <h3 class="sidebar-title">🌤 天气</h3>

    <div v-if="loading && !weather" class="weather-loading">
      <span class="weather-spinner"></span>
      <span class="weather-loading-text">获取天气信息...</span>
    </div>

    <div v-else-if="error" class="weather-error">
      <span>{{ error }}</span>
    </div>

    <div v-else-if="weather" class="weather-body">
      <div class="weather-city">{{ city }}</div>
      <div class="weather-main">
        <span class="weather-icon">{{ getWeatherInfo(weather.weather_code)[0] }}</span>
        <span class="weather-temp">{{ Math.round(weather.temperature_2m) }}°</span>
      </div>
      <div class="weather-desc">{{ getWeatherInfo(weather.weather_code)[1] }}</div>
      <div class="weather-feels">
        体感 {{ Math.round(weather.apparent_temperature) }}°
      </div>
    </div>
  </div>
</template>

<style scoped>
.weather-widget {
  padding: var(--spacing-md);
}
.weather-loading {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  padding: var(--spacing-sm) 0;
}
.weather-spinner {
  width: 14px;
  height: 14px;
  border: 2px solid var(--color-border);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  display: inline-block;
}
.weather-loading-text {
  font-size: var(--font-size-xs);
}
.weather-error {
  color: #ef4444;
  font-size: var(--font-size-xs);
  padding: var(--spacing-sm) 0;
}
.weather-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}
.weather-city {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-xs);
}
.weather-main {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}
.weather-icon {
  font-size: 36px;
  line-height: 1;
}
.weather-temp {
  font-size: 28px;
  font-weight: 700;
  color: var(--color-text);
}
.weather-desc {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}
.weather-feels {
  font-size: 11px;
  color: var(--color-text-secondary);
  margin-top: 2px;
}
</style>
