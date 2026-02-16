import type { Video, VideoDetail, Category, Tag, Comment, Danmaku, User } from '@/types'

export const mockCategories: Category[] = [
  { id: 1, name: '推荐', slug: 'recommend' },
  { id: 2, name: '番剧', slug: 'anime' },
  { id: 3, name: '国创', slug: 'chinese' },
  { id: 4, name: '剧场版', slug: 'movie' },
  { id: 5, name: 'OVA', slug: 'ova' }
]

export const mockTags: Tag[] = [
  { id: 1, name: '热血', type: 'genre' },
  { id: 2, name: '恋爱', type: 'genre' },
  { id: 3, name: '搞笑', type: 'genre' },
  { id: 4, name: '科幻', type: 'genre' },
  { id: 5, name: '冒险', type: 'genre' },
  { id: 6, name: '奇幻', type: 'genre' },
  { id: 7, name: '校园', type: 'genre' },
  { id: 8, name: '运动', type: 'genre' },
  { id: 9, name: '日本', type: 'country' },
  { id: 10, name: '中国', type: 'country' },
  { id: 11, name: '美国', type: 'country' },
  { id: 12, name: '韩国', type: 'country' }
]

const covers = [
  'https://picsum.photos/seed/anime1/300/400',
  'https://picsum.photos/seed/anime2/300/400',
  'https://picsum.photos/seed/anime3/300/400',
  'https://picsum.photos/seed/anime4/300/400',
  'https://picsum.photos/seed/anime5/300/400',
  'https://picsum.photos/seed/anime6/300/400',
  'https://picsum.photos/seed/anime7/300/400',
  'https://picsum.photos/seed/anime8/300/400'
]

const titles = [
  '进击的巨人 最终季',
  '鬼灭之刃 柱训练篇',
  '咒术回战 第二季',
  '间谍过家家 第二季',
  '我推的孩子',
  '葬送的芙莉莲',
  '药屋少女的呢喃',
  '迷宫饭',
  '无职转生 第三季',
  '关于我转生变成史莱姆这档事 第三季',
  '刀剑神域 Progressive',
  'Re:从零开始的异世界生活 第三季',
  '辉夜大小姐想让我告白',
  '一拳超人 第三季',
  '我的英雄学院 第七季'
]

const descriptions = [
  '这是一部精彩绝伦的动漫作品，讲述了一个充满冒险与友情的故事。主角们在艰难的旅程中不断成长，最终实现了自己的梦想。',
  '在这个充满奇幻色彩的世界里，少年少女们展开了一段惊心动魄的冒险。他们将面对各种挑战，结识新的伙伴。',
  '热血沸腾的战斗场面，感人至深的友情羁绊，这是一部不容错过的佳作。',
  '独特的世界观设定，精美的人物设计，引人入胜的剧情发展。',
  '年度最受欢迎的动漫作品之一，口碑与人气双丰收。'
]

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function generateMockVideos(count: number, category?: string): Video[] {
  const videos: Video[] = []
  const currentYear = new Date().getFullYear()

  for (let i = 0; i < count; i++) {
    const id = i + 1
    videos.push({
      id,
      title: randomItem(titles) + (count > 1 ? ` 第${id}集` : ''),
      cover: randomItem(covers),
      description: randomItem(descriptions),
      playCount: randomInt(10000, 9999999),
      likeCount: randomInt(1000, 999999),
      collectCount: randomInt(100, 99999),
      episode: `更新至第${randomInt(1, 24)}话`,
      category: category || randomItem(mockCategories).slug,
      tags: [
        randomItem(mockTags.filter(t => t.type === 'genre')).name,
        randomItem(mockTags.filter(t => t.type === 'genre')).name
      ],
      country: randomItem(mockTags.filter(t => t.type === 'country')).name,
      year: randomInt(currentYear - 5, currentYear),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })
  }

  return videos
}

export function generateMockVideoDetail(id: number): VideoDetail {
  const video = generateMockVideos(1)[0]
  return {
    ...video,
    id,
    videoUrl: 'https://media.w3.org/2010/05/sintel/trailer_hd.mp4',
    episodes: Array.from({ length: 12 }, (_, i) => ({
      id: i + 1,
      title: `第${i + 1}话`,
      videoUrl: 'https://media.w3.org/2010/05/sintel/trailer_hd.mp4',
      duration: randomInt(1200, 1500)
    })),
    relatedVideos: generateMockVideos(6)
  }
}

export const mockComments: Comment[] = [
  {
    id: 1,
    userId: 1,
    username: '动漫迷小王',
    avatar: 'https://picsum.photos/seed/user1/100/100',
    content: '这部动漫真的太好看了！剧情紧凑，人物刻画细腻，强烈推荐！',
    likeCount: 128,
    createdAt: '2024-01-15T10:30:00Z',
    replies: [
      {
        id: 11,
        userId: 2,
        username: '二次元爱好者',
        avatar: 'https://picsum.photos/seed/user2/100/100',
        content: '同意！特别是战斗场面，制作太精良了',
        likeCount: 45,
        createdAt: '2024-01-15T11:00:00Z'
      }
    ]
  },
  {
    id: 2,
    userId: 3,
    username: '追番达人',
    avatar: 'https://picsum.photos/seed/user3/100/100',
    content: '每周必追的番剧，等更新等得好辛苦啊',
    likeCount: 89,
    createdAt: '2024-01-14T18:20:00Z'
  },
  {
    id: 3,
    userId: 4,
    username: 'ACG老司机',
    avatar: 'https://picsum.photos/seed/user4/100/100',
    content: '画质和音效都很棒，弹幕氛围也很好',
    likeCount: 56,
    createdAt: '2024-01-13T09:15:00Z'
  }
]

export function generateMockDanmaku(count: number): Danmaku[] {
  const contents = [
    '哈哈哈笑死我了',
    '这也太帅了吧',
    '前方高能预警',
    '泪目了',
    '神作预定',
    '经费在燃烧',
    '这波操作666',
    '太感人了',
    '燃起来了',
    '这就是青春啊'
  ]
  const colors = ['#ffffff', '#ff6b6b', '#4ecdc4', '#ffe66d', '#95e1d3']

  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    content: randomItem(contents),
    time: randomInt(0, 300),
    color: randomItem(colors),
    type: 'scroll' as const,
    userId: randomInt(1, 100),
    createdAt: new Date().toISOString()
  }))
}

export const mockUser: User = {
  id: 1,
  username: '动漫爱好者',
  email: 'user@example.com',
  avatar: 'https://picsum.photos/seed/myavatar/100/100',
  bio: '热爱动漫，喜欢追番~',
  createdAt: '2024-01-01T00:00:00Z'
}

export const mockLoginResponse = {
  token: 'mock_jwt_token_' + Date.now(),
  user: mockUser
}

export interface WeekScheduleData {
  day: string
  dayName: string
  videos: Video[]
}

const scheduleTitles = [
  '进击的巨人 最终季',
  '鬼灭之刃 柱训练篇',
  '咒术回战 第二季',
  '间谍过家家 第二季',
  '我推的孩子',
  '葬送的芙莉莲',
  '药屋少女的呢喃',
  '迷宫饭',
  '无职转生 第三季',
  '关于我转生变成史莱姆这档事',
  '刀剑神域 Progressive',
  'Re:从零开始的异世界生活',
  '辉夜大小姐想让我告白',
  '一拳超人 第三季',
  '我的英雄学院 第七季',
  '蓝色监狱 第二季',
  '排球少年 垃圾场的决战',
  '魔法使的新娘 第三季',
  '地狱乐 第二季',
  '不死不幸'
]

const updateTimes = ['00:00', '10:00', '12:00', '17:00', '18:00', '20:00', '22:00', '23:30']

export function generateWeekSchedule(): WeekScheduleData[] {
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
  const dayNames: Record<string, string> = {
    monday: '周一',
    tuesday: '周二',
    wednesday: '周三',
    thursday: '周四',
    friday: '周五',
    saturday: '周六',
    sunday: '周日'
  }

  return days.map(day => {
    const videoCount = randomInt(3, 8)
    const videos: Video[] = []
    const usedTitles = new Set<string>()

    for (let i = 0; i < videoCount; i++) {
      let title = randomItem(scheduleTitles)
      while (usedTitles.has(title)) {
        title = randomItem(scheduleTitles)
      }
      usedTitles.add(title)

      videos.push({
        id: randomInt(1000, 9999),
        title,
        cover: `https://picsum.photos/seed/schedule${day}${i}/300/400`,
        description: randomItem(descriptions),
        playCount: randomInt(10000, 9999999),
        likeCount: randomInt(1000, 999999),
        collectCount: randomInt(100, 99999),
        episode: `更新至第${randomInt(1, 24)}话`,
        category: 'anime',
        tags: [randomItem(mockTags.filter(t => t.type === 'genre')).name],
        country: '日本',
        year: new Date().getFullYear(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        currentEpisode: randomInt(1, 24),
        updateTime: randomItem(updateTimes)
      })
    }

    videos.sort((a, b) => {
      if (!a.updateTime || !b.updateTime) return 0
      return a.updateTime.localeCompare(b.updateTime)
    })

    return {
      day,
      dayName: dayNames[day],
      videos
    }
  })
}
