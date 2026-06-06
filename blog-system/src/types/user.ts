export interface UserInfo {
  id: number
  username: string
  nickname?: string
  avatar?: string
  title?: string
  bio?: string
  location?: string
  website?: string
  github?: string
  twitter?: string
  skills?: string[]
}

export interface LoginParams {
  username: string
  password: string
}

export interface LoginResult {
  token: string
  user: UserInfo
}

export interface ProfileData extends UserInfo {
  stats: {
    totalArticles: number
    totalViews: number
    draftCount: number
  }
  categoryStats: {
    id: number
    name: string
    slug: string
    count: number
  }[]
}
