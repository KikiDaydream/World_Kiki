<script setup lang="ts">
import { ref, computed } from 'vue'

// ====== 农历转换 ======
// 从 1900 到 2100 年的农历数据
// 编码：前 4 位闰月（0=无），中间 12 位每月天数（0=29天，1=30天）
const lunarInfo = [
  0x04bd8,0x04ae0,0x0a570,0x054d5,0x0d260,0x0d950,0x16554,0x056a0,0x09ad0,0x055d2, // 1900-1909
  0x04ae0,0x0a5b6,0x0a4d0,0x0d250,0x1d255,0x0b540,0x0d6a0,0x0ada2,0x095b0,0x14977, // 1910-1919
  0x04970,0x0a4b0,0x0b4b5,0x06a50,0x06d40,0x1ab54,0x02b60,0x09570,0x052f2,0x04970, // 1920-1929
  0x06566,0x0d4a0,0x0ea50,0x16a95,0x05ad0,0x02b60,0x186e3,0x092e0,0x1c8d7,0x0c950, // 1930-1939
  0x0d4a0,0x1d8a6,0x0b550,0x056a0,0x1a5b4,0x025d0,0x092d0,0x0d2b2,0x0a950,0x0b557, // 1940-1949
  0x06ca0,0x0b550,0x15355,0x04da0,0x0a5b0,0x14573,0x052b0,0x0a9a8,0x0e950,0x06aa0, // 1950-1959
  0x0aea6,0x0ab50,0x04b60,0x0aae4,0x0a570,0x05260,0x0f263,0x0d950,0x05b57,0x056a0, // 1960-1969
  0x096d0,0x04dd5,0x04ad0,0x0a4d0,0x0d4d4,0x0d250,0x0d558,0x0b540,0x0b6a0,0x195a6, // 1970-1979
  0x095b0,0x049b0,0x0a974,0x0a4b0,0x0b27a,0x06a50,0x06d40,0x0af46,0x0ab60,0x09570, // 1980-1989
  0x04af5,0x04970,0x064b0,0x074a3,0x0ea50,0x06b58,0x05ac0,0x0ab60,0x096d5,0x092e0, // 1990-1999
  0x0c960,0x0d954,0x0d4a0,0x0da50,0x07552,0x056a0,0x0abb7,0x025d0,0x092d0,0x0cab5, // 2000-2009
  0x0a950,0x0b4a0,0x0baa4,0x0ad50,0x055d9,0x04ba0,0x0a5b0,0x15176,0x052b0,0x0a930, // 2010-2019
  0x07954,0x06aa0,0x0ad50,0x05b52,0x04b60,0x0a6e6,0x0a4e0,0x0d260,0x0ea65,0x0d530, // 2020-2029
  0x05aa0,0x076a3,0x096d0,0x04afb,0x04ad0,0x0a4d0,0x1d0b6,0x0d250,0x0d520,0x0dd45, // 2030-2039
  0x0b5a0,0x056d0,0x055b2,0x049b0,0x0a577,0x0a4b0,0x0aa50,0x1b255,0x06d20,0x0ada0, // 2040-2049
  0x14b63,0x09370,0x049f8,0x04970,0x064b0,0x168a6,0x0ea50,0x06aa0,0x1a6c4,0x0aae0, // 2050-2059
  0x092e0,0x0d2e3,0x0c960,0x0d557,0x0d4a0,0x0da50,0x05d55,0x056a0,0x0a6d0,0x055d4, // 2060-2069
  0x052d0,0x0a9b8,0x0a950,0x0b4a0,0x0b6a6,0x0ad50,0x055a0,0x0aba4,0x0a5b0,0x052b0, // 2070-2079
  0x0b273,0x06930,0x07337,0x06aa0,0x0ad50,0x14b55,0x04b60,0x0a570,0x054e4,0x0d160, // 2080-2089
  0x0e968,0x0d520,0x0daa0,0x16aa6,0x056d0,0x04ae0,0x0a9d4,0x0a4d0,0x0d150,0x0f252, // 2090-2099
  0x0d520,0x0ada6 // 2100
]
const Gan = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸']
const Zhi = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥']
const Animals = ['鼠','牛','虎','兔','龙','蛇','马','羊','猴','鸡','狗','猪']
const lunarMonths = ['正','二','三','四','五','六','七','八','九','十','冬','腊']

function daysInLunarYear(y: number): number {
  let sum = 348
  for (let i = 0x8000; i > 0x8; i >>= 1) sum += (lunarInfo[y - 1900] & i) ? 1 : 0
  return sum + daysInLeapYear(y)
}
function daysInLeapYear(y: number): number {
  const leap = leapMonth(y)
  return leap ? (lunarInfo[y - 1900] & 0x10000 ? 30 : 29) : 0
}
function leapMonth(y: number): number {
  return lunarInfo[y - 1900] & 0xf
}

function solarToLunar(year: number, month: number, day: number) {
  const baseDate = new Date(1900, 0, 31) // 1900-01-31 = 农历正月初一
  const targetDate = new Date(year, month - 1, day)
  let offset = Math.floor((targetDate.getTime() - baseDate.getTime()) / 86400000)

  let i
  for (i = 1900; i < 2101 && offset > 0; i++) {
    const days = daysInLunarYear(i)
    offset -= days
  }
  if (offset < 0) { offset += daysInLunarYear(i - 1); i-- }

  const lunarYear = i
  const leap = leapMonth(i)
  let isLeap = false

  for (let j = 1; j < 13 && offset > 0; j++) {
    if (leap > 0 && j === leap + 1) {
      const ld = lunarInfo[i - 1900] & 0x10000 ? 30 : 29
      if (offset < ld) { isLeap = true; break }
      offset -= ld
    }
    const days = lunarInfo[i - 1900] & (0x10000 >> j) ? 30 : 29
    if (offset < days) { break }
    offset -= days
  }

  const lunarMonth = isLeap ? leap : (offset + 1 > 12 ? 12 : offset + 1 > leap && leap > 0 ? offset : offset + 1)
  const lunarDay = offset + 1

  const ganZhiYear = Gan[(lunarYear - 4) % 10] + Zhi[(lunarYear - 4) % 12]
  const animal = Animals[(lunarYear - 4) % 12]

  return {
    year: lunarYear,
    month: Math.min(Math.max(1, lunarMonth), 12),
    day: Math.min(lunarDay, 30),
    isLeap,
    ganZhiYear,
    animal,
    monthName: (isLeap ? '闰' : '') + (lunarMonth <= 12 ? lunarMonths[lunarMonth - 1] : '') + '月',
    dayName: lunarDay <= 10 ? ['初一','初二','初三','初四','初五','初六','初七','初八','初九','初十'][lunarDay - 1] || lunarDay + '' : lunarDay < 20 ? '十' + ['一','二','三','四','五','六','七','八','九'][lunarDay - 11] || '' : lunarDay === 20 ? '二十' : lunarDay < 30 ? '廿' + ['一','二','三','四','五','六','七','八','九'][lunarDay - 21] || '' : '三十'
  }
}

// ====== 当前日期 ======
const now = new Date()
const y = now.getFullYear()
const m = now.getMonth() + 1
const d = now.getDate()
const dayNames = ['日', '一', '二', '三', '四', '五', '六']
const weekDay = dayNames[now.getDay()]
const lunar = solarToLunar(y, m, d)

// ====== 考试倒计时 ======
interface Exam { date: string; name: string }
const exams: Exam[] = [
  { date: '2026-06-19', name: '算法' },
  { date: '2026-06-26', name: '上机' },
  { date: '2026-06-29', name: '计网' },
  { date: '2026-07-01', name: '操作系统' },
  { date: '2026-07-03', name: '英语' },
  { date: '2026-07-07', name: '毛概' },
]

const today = new Date()
today.setHours(0, 0, 0, 0)

const examList = computed(() => {
  return exams.map(e => {
    const [Y, M, D] = e.date.split('-').map(Number)
    const examDate = new Date(Y, M - 1, D)
    examDate.setHours(0, 0, 0, 0)
    const diff = Math.ceil((examDate.getTime() - today.getTime()) / 86400000)
    return {
      ...e,
      daysLeft: diff,
      past: diff < 0,
      today: diff === 0,
    }
  })
})
</script>

<template>
  <div class="sidebar-section calendar-widget">
    <h3 class="sidebar-title">📅 日期</h3>
    <div class="date-main">
      <div class="date-big">{{ m }}月{{ d }}日</div>
      <div class="date-week">星期{{ weekDay }}</div>
    </div>
    <div class="lunar-info">
      <span>农历 {{ lunar.monthName }}{{ lunar.dayName }}</span>
      <span class="dot">·</span>
      <span>{{ lunar.ganZhiYear }}年【{{ lunar.animal }}】</span>
    </div>

    <div class="exam-section">
      <div class="exam-header">📝 考试倒计时</div>
      <div class="exam-list">
        <div
          v-for="exam in examList"
          :key="exam.date"
          class="exam-item"
          :class="{ 'exam-past': exam.past, 'exam-today': exam.today }"
        >
          <span class="exam-name">{{ exam.name }}</span>
          <span class="exam-date">{{ exam.date.slice(5) }}</span>
          <span v-if="exam.today" class="exam-days badge-today">今天</span>
          <span v-else-if="exam.past" class="exam-days badge-done">已过</span>
          <span v-else class="exam-days">{{ exam.daysLeft }}天</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.calendar-widget {
  padding: var(--spacing-md);
}
.date-main {
  text-align: center;
  padding: var(--spacing-sm) 0;
}
.date-big {
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--color-primary);
  line-height: 1.3;
}
.date-week {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin-top: 2px;
}
.lunar-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  padding: var(--spacing-xs) 0 var(--spacing-sm);
  border-bottom: 1px solid var(--color-border);
}
.dot {
  opacity: 0.4;
}

.exam-section {
  margin-top: var(--spacing-sm);
}
.exam-header {
  font-size: var(--font-size-xs);
  font-weight: 600;
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-xs);
  padding-bottom: var(--spacing-xs);
  text-transform: uppercase;
  letter-spacing: 1px;
}
.exam-list {
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.exam-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: 5px 8px;
  border-radius: 6px;
  font-size: var(--font-size-xs);
  transition: background 0.15s;
}
.exam-item:hover {
  background: var(--color-bg-secondary);
}
.exam-name {
  flex: 1;
  font-weight: 500;
  color: var(--color-text);
}
.exam-date {
  color: var(--color-text-secondary);
  font-size: 11px;
}
.exam-days {
  min-width: 36px;
  text-align: right;
  font-weight: 600;
  color: #ef4444;
}
.exam-past .exam-days {
  color: var(--color-text-secondary);
}
.exam-today .exam-days {
  color: var(--color-primary);
}
.badge-today {
  color: var(--color-primary) !important;
}
</style>
