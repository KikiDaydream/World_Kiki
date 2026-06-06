import { describe, it, expect } from 'vitest'
import { formatDate, truncateText, getSummary } from '@/utils/format'

describe('formatDate', () => {
  it('should format a date string correctly', () => {
    const result = formatDate('2026-05-15T08:00:00Z')
    expect(result).toBe('2026-05-15 08:00')
  })

  it('should handle different date formats', () => {
    const result = formatDate('2026-01-01T00:00:00Z')
    expect(result).toBe('2026-01-01 00:00')
  })
})

describe('truncateText', () => {
  it('should not truncate short text', () => {
    expect(truncateText('Hello', 10)).toBe('Hello')
  })

  it('should truncate long text with ellipsis', () => {
    expect(truncateText('Hello World', 5)).toBe('Hello...')
  })

  it('should handle empty string', () => {
    expect(truncateText('', 5)).toBe('')
  })
})

describe('getSummary', () => {
  it('should strip markdown syntax and truncate', () => {
    const md = '# Hello\nThis is **bold** text with `code`'
    const result = getSummary(md, 50)
    expect(result).toBe('Hello This is bold text with code')
    expect(result.length).toBeLessThanOrEqual(53) // 50 + '...'
  })

  it('should handle empty content', () => {
    expect(getSummary('', 100)).toBe('')
  })
})
