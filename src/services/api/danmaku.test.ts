/**
 * 弹幕API接口测试
 * 测试文件: src/services/api/danmaku.ts
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { danmakuApi } from './danmaku'
import { http } from '../request'
import type { Danmaku, DanmakuParams, DanmakuStats } from '@/types'

vi.mock('../request', () => ({
  http: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn()
  }
}))

function createMockDanmaku(overrides: Partial<Danmaku> = {}): Danmaku {
  return {
    id: 1,
    content: '测试弹幕',
    time: 10.5,
    color: '#ffffff',
    type: 'scroll',
    userId: 1,
    createdAt: new Date().toISOString(),
    ...overrides
  }
}

describe('弹幕API接口测试', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('1. 获取弹幕接口测试', () => {
    describe('1.1 正常场景', () => {
      it('应该正确获取视频弹幕列表', async () => {
        const mockDanmaku: Danmaku[] = [createMockDanmaku()]
        
        vi.mocked(http.get).mockResolvedValueOnce({
          data: { code: 0, data: mockDanmaku }
        } as any)

        const result = await danmakuApi.getDanmaku(1)
        
        expect(http.get).toHaveBeenCalledWith('/videos/1/danmaku', { params: undefined })
        expect(result.data.data).toEqual(mockDanmaku)
      })

      it('应该正确获取指定集数的弹幕', async () => {
        const mockDanmaku: Danmaku[] = [createMockDanmaku({ content: '第2集弹幕' })]
        
        vi.mocked(http.get).mockResolvedValueOnce({
          data: { code: 0, data: mockDanmaku }
        } as any)

        const result = await danmakuApi.getDanmaku(1, { episodeId: 2 })
        
        expect(http.get).toHaveBeenCalledWith('/videos/1/danmaku', { params: { episodeId: 2 } })
        expect(result.data.data).toEqual(mockDanmaku)
      })

      it('应该正确获取时间范围内的弹幕', async () => {
        const mockDanmaku: Danmaku[] = [createMockDanmaku({ time: 15 })]
        
        vi.mocked(http.get).mockResolvedValueOnce({
          data: { code: 0, data: mockDanmaku }
        } as any)

        const result = await danmakuApi.getDanmaku(1, { startTime: 10, endTime: 20 })
        
        expect(http.get).toHaveBeenCalledWith('/videos/1/danmaku', { params: { startTime: 10, endTime: 20 } })
        expect(result.data.data).toEqual(mockDanmaku)
      })
    })

    describe('1.2 边界场景', () => {
      it('应该正确处理空弹幕列表', async () => {
        vi.mocked(http.get).mockResolvedValueOnce({
          data: { code: 0, data: [] }
        } as any)

        const result = await danmakuApi.getDanmaku(1)
        
        expect(result.data.data).toEqual([])
      })

      it('应该正确处理大量弹幕数据(1000条)', async () => {
        const mockDanmaku: Danmaku[] = Array.from({ length: 1000 }, (_, i) => 
          createMockDanmaku({ id: i + 1, time: i })
        )
        
        vi.mocked(http.get).mockResolvedValueOnce({
          data: { code: 0, data: mockDanmaku }
        } as any)

        const result = await danmakuApi.getDanmaku(1)
        
        expect(result.data.data.length).toBe(1000)
      })
    })

    describe('1.3 错误处理', () => {
      it('应该正确处理视频不存在的情况', async () => {
        vi.mocked(http.get).mockRejectedValueOnce(new Error('Video not found'))

        await expect(danmakuApi.getDanmaku(999)).rejects.toThrow('Video not found')
      })

      it('应该正确处理网络错误', async () => {
        vi.mocked(http.get).mockRejectedValueOnce(new Error('Network error'))

        await expect(danmakuApi.getDanmaku(1)).rejects.toThrow('Network error')
      })

      it('应该正确处理服务器错误', async () => {
        vi.mocked(http.get).mockRejectedValueOnce(new Error('Server error'))

        await expect(danmakuApi.getDanmaku(1)).rejects.toThrow('Server error')
      })
    })
  })

  describe('2. 发送弹幕接口测试', () => {
    describe('2.1 正常场景', () => {
      it('应该正确发送普通弹幕', async () => {
        const params: DanmakuParams = {
          videoId: 1,
          content: '测试弹幕',
          time: 10.5,
          color: '#ffffff',
          type: 'scroll'
        }
        
        const mockResponse = createMockDanmaku(params)
        
        vi.mocked(http.post).mockResolvedValueOnce({
          data: { code: 0, data: mockResponse }
        } as any)

        const result = await danmakuApi.sendDanmaku(params)
        
        expect(http.post).toHaveBeenCalledWith('/danmaku', params)
        expect(result.data.data.content).toBe('测试弹幕')
      })

      it('应该正确发送顶部弹幕', async () => {
        const params: DanmakuParams = {
          videoId: 1,
          content: '顶部弹幕',
          time: 20,
          type: 'top'
        }
        
        const mockResponse = createMockDanmaku({ ...params, color: '#ffffff', type: 'top' })
        
        vi.mocked(http.post).mockResolvedValueOnce({
          data: { code: 0, data: mockResponse }
        } as any)

        await danmakuApi.sendDanmaku(params)
        
        expect(http.post).toHaveBeenCalledWith('/danmaku', params)
      })

      it('应该正确发送底部弹幕', async () => {
        const params: DanmakuParams = {
          videoId: 1,
          content: '底部弹幕',
          time: 30,
          type: 'bottom'
        }
        
        const mockResponse = createMockDanmaku({ ...params, color: '#ffffff', type: 'bottom' })
        
        vi.mocked(http.post).mockResolvedValueOnce({
          data: { code: 0, data: mockResponse }
        } as any)

        await danmakuApi.sendDanmaku(params)
        
        expect(http.post).toHaveBeenCalledWith('/danmaku', params)
      })

      it('应该正确发送彩色弹幕', async () => {
        const params: DanmakuParams = {
          videoId: 1,
          content: '彩色弹幕',
          time: 10,
          color: '#ff6b6b',
          type: 'scroll'
        }
        
        const mockResponse = createMockDanmaku({ ...params, color: '#ff6b6b' })
        
        vi.mocked(http.post).mockResolvedValueOnce({
          data: { code: 0, data: mockResponse }
        } as any)

        await danmakuApi.sendDanmaku(params)
        
        expect(http.post).toHaveBeenCalledWith('/danmaku', params)
      })
    })

    describe('2.2 边界场景', () => {
      it('应该正确发送最短弹幕(1个字符)', async () => {
        const params: DanmakuParams = {
          videoId: 1,
          content: '哈',
          time: 10,
          type: 'scroll'
        }
        
        const mockResponse = createMockDanmaku({ content: '哈', color: '#ffffff' })
        
        vi.mocked(http.post).mockResolvedValueOnce({
          data: { code: 0, data: mockResponse }
        } as any)

        const result = await danmakuApi.sendDanmaku(params)
        
        expect(result.data.data.content).toBe('哈')
      })

      it('应该正确发送最大长度弹幕(100个字符)', async () => {
        const longContent = 'a'.repeat(100)
        const params: DanmakuParams = {
          videoId: 1,
          content: longContent,
          time: 10,
          type: 'scroll'
        }
        
        const mockResponse = createMockDanmaku({ content: longContent, color: '#ffffff' })
        
        vi.mocked(http.post).mockResolvedValueOnce({
          data: { code: 0, data: mockResponse }
        } as any)

        const result = await danmakuApi.sendDanmaku(params)
        
        expect(result.data.data.content.length).toBe(100)
      })

      it('应该正确处理时间戳为0的弹幕', async () => {
        const params: DanmakuParams = {
          videoId: 1,
          content: '开头弹幕',
          time: 0,
          type: 'scroll'
        }
        
        const mockResponse = createMockDanmaku({ time: 0, color: '#ffffff' })
        
        vi.mocked(http.post).mockResolvedValueOnce({
          data: { code: 0, data: mockResponse }
        } as any)

        const result = await danmakuApi.sendDanmaku(params)
        
        expect(result.data.data.time).toBe(0)
      })
    })

    describe('2.3 错误处理', () => {
      it('应该正确处理未登录状态', async () => {
        vi.mocked(http.post).mockRejectedValueOnce(new Error('Unauthorized'))

        await expect(danmakuApi.sendDanmaku({
          videoId: 1,
          content: '测试',
          time: 10
        })).rejects.toThrow('Unauthorized')
      })

      it('应该正确处理内容为空的情况', async () => {
        vi.mocked(http.post).mockRejectedValueOnce(new Error('Content cannot be empty'))

        await expect(danmakuApi.sendDanmaku({
          videoId: 1,
          content: '',
          time: 10
        })).rejects.toThrow('Content cannot be empty')
      })

      it('应该正确处理内容超长的情况', async () => {
        vi.mocked(http.post).mockRejectedValueOnce(new Error('Content too long'))

        await expect(danmakuApi.sendDanmaku({
          videoId: 1,
          content: 'a'.repeat(101),
          time: 10
        })).rejects.toThrow('Content too long')
      })

      it('应该正确处理无效颜色值', async () => {
        vi.mocked(http.post).mockRejectedValueOnce(new Error('Invalid color'))

        await expect(danmakuApi.sendDanmaku({
          videoId: 1,
          content: '测试',
          time: 10,
          color: 'invalid'
        })).rejects.toThrow('Invalid color')
      })

      it('应该正确处理无效弹幕类型', async () => {
        vi.mocked(http.post).mockRejectedValueOnce(new Error('Invalid type'))

        await expect(danmakuApi.sendDanmaku({
          videoId: 1,
          content: '测试',
          time: 10,
          type: 'invalid' as any
        })).rejects.toThrow('Invalid type')
      })
    })
  })

  describe('3. 删除弹幕接口测试', () => {
    describe('3.1 正常场景', () => {
      it('应该正确删除自己的弹幕', async () => {
        vi.mocked(http.delete).mockResolvedValueOnce({
          data: { code: 0, data: { success: true } }
        } as any)

        const result = await danmakuApi.deleteDanmaku(1)
        
        expect(http.delete).toHaveBeenCalledWith('/danmaku/1')
        expect(result.data.data.success).toBe(true)
      })
    })

    describe('3.2 错误处理', () => {
      it('应该正确处理删除他人弹幕的情况', async () => {
        vi.mocked(http.delete).mockRejectedValueOnce(new Error('Forbidden'))

        await expect(danmakuApi.deleteDanmaku(1)).rejects.toThrow('Forbidden')
      })

      it('应该正确处理弹幕不存在的情况', async () => {
        vi.mocked(http.delete).mockRejectedValueOnce(new Error('Danmaku not found'))

        await expect(danmakuApi.deleteDanmaku(999)).rejects.toThrow('Danmaku not found')
      })

      it('应该正确处理未登录状态', async () => {
        vi.mocked(http.delete).mockRejectedValueOnce(new Error('Unauthorized'))

        await expect(danmakuApi.deleteDanmaku(1)).rejects.toThrow('Unauthorized')
      })
    })
  })

  describe('4. 批量获取弹幕测试', () => {
    it('应该正确批量获取多集弹幕', async () => {
      const mockBatchData = {
        1: [createMockDanmaku({ id: 1 })],
        2: [createMockDanmaku({ id: 2 })]
      }
      
      vi.mocked(http.post).mockResolvedValueOnce({
        data: { code: 0, data: mockBatchData }
      } as any)

      const result = await danmakuApi.getDanmakuBatch({ videoId: 1, episodeIds: [1, 2] })
      
      expect(http.post).toHaveBeenCalledWith('/danmaku/batch', { videoId: 1, episodeIds: [1, 2] })
      expect(result.data.data[1].length).toBe(1)
      expect(result.data.data[2].length).toBe(1)
    })
  })

  describe('5. 弹幕统计接口测试', () => {
    it('应该正确获取视频弹幕统计', async () => {
      const mockStats: DanmakuStats = {
        total: 100,
        scrollCount: 80,
        topCount: 10,
        bottomCount: 10
      }
      
      vi.mocked(http.get).mockResolvedValueOnce({
        data: { code: 0, data: mockStats }
      } as any)

      const result = await danmakuApi.getDanmakuStats(1)
      
      expect(http.get).toHaveBeenCalledWith('/videos/1/danmaku/stats')
      expect(result.data.data.total).toBe(100)
    })

    it('应该正确获取指定集数弹幕统计', async () => {
      const mockStats: DanmakuStats = {
        total: 50,
        scrollCount: 40,
        topCount: 5,
        bottomCount: 5
      }
      
      vi.mocked(http.get).mockResolvedValueOnce({
        data: { code: 0, data: mockStats }
      } as any)

      const result = await danmakuApi.getDanmakuStats(1, 2)
      
      expect(http.get).toHaveBeenCalledWith('/videos/1/episodes/2/danmaku/stats')
      expect(result.data.data.total).toBe(50)
    })
  })

  describe('6. 举报弹幕接口测试', () => {
    it('应该正确举报弹幕', async () => {
      vi.mocked(http.post).mockResolvedValueOnce({
        data: { code: 0, data: { success: true } }
      } as any)

      const result = await danmakuApi.reportDanmaku(1, '不当内容')
      
      expect(http.post).toHaveBeenCalledWith('/danmaku/1/report', { reason: '不当内容' })
      expect(result.data.data.success).toBe(true)
    })

    it('应该正确处理举报失败', async () => {
      vi.mocked(http.post).mockRejectedValueOnce(new Error('Report failed'))

      await expect(danmakuApi.reportDanmaku(1, '不当内容')).rejects.toThrow('Report failed')
    })
  })
})
