export const PAGE_SIZE = 10

export const ARTICLE_STATUS_MAP: Record<string, string> = {
  draft: '草稿',
  published: '已发布',
}

export const ARTICLE_STATUS_OPTIONS = [
  { label: '全部', value: '' },
  { label: '已发布', value: 'published' },
  { label: '草稿', value: 'draft' },
]
