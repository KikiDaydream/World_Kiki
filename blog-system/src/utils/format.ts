export function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  const y = date.getUTCFullYear()
  const m = String(date.getUTCMonth() + 1).padStart(2, '0')
  const d = String(date.getUTCDate()).padStart(2, '0')
  const h = String(date.getUTCHours()).padStart(2, '0')
  const min = String(date.getUTCMinutes()).padStart(2, '0')
  return `${y}-${m}-${d} ${h}:${min}`
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

export function stripHtml(html: string): string {
  const div = document.createElement('div')
  div.innerHTML = html
  return div.textContent || div.innerText || ''
}

export function getSummary(content: string, maxLen = 150): string {
  const plain = content.replace(/[#*`~>_\-\\\[\]()|]/g, ' ').replace(/\s+/g, ' ').trim()
  return truncateText(plain, maxLen)
}
