/**
 * 弹幕 Mock 数据生成测试
 * 测试文件: src/services/mock/index.ts
 */

import { describe, it, expect } from 'vitest'
import { generateMockDanmaku } from '../mock/index'

describe('弹幕 Mock 数据生成测试', () => {
  describe('1. 基础功能测试', () => {
    it('应该正确生成指定数量的弹幕', () => {
      const danmaku = generateMockDanmaku(50)
      expect(danmaku).toHaveLength(50)
    })

    it('应该生成空弹幕列表', () => {
      const danmaku = generateMockDanmaku(0)
      expect(danmaku).toHaveLength(0)
    })

    it('应该生成单个弹幕', () => {
      const danmaku = generateMockDanmaku(1)
      expect(danmaku).toHaveLength(1)
    })
  })

  describe('2. 弹幕数据结构测试', () => {
    it('生成的弹幕应该包含所有必需字段', () => {
      const danmaku = generateMockDanmaku(1)
      const item = danmaku[0]

      expect(item).toHaveProperty('id')
      expect(item).toHaveProperty('content')
      expect(item).toHaveProperty('time')
      expect(item).toHaveProperty('color')
      expect(item).toHaveProperty('type')
      expect(item).toHaveProperty('userId')
      expect(item).toHaveProperty('createdAt')
    })

    it('弹幕 ID 应该是唯一且递增的', () => {
      const danmaku = generateMockDanmaku(100)
      const ids = danmaku.map(d => d.id)
      const uniqueIds = new Set(ids)

      expect(uniqueIds.size).toBe(100)
      expect(ids).toEqual([...Array(100)].map((_, i) => i + 1))
    })

    it('弹幕时间应该在合理范围内', () => {
      const danmaku = generateMockDanmaku(100)
      
      danmaku.forEach(item => {
        expect(item.time).toBeGreaterThanOrEqual(0)
        expect(item.time).toBeLessThanOrEqual(300)
      })
    })

    it('弹幕颜色应该是有效的颜色值', () => {
      const validColors = ['#ffffff', '#ff6b6b', '#4ecdc4', '#ffe66d', '#95e1d3']
      const danmaku = generateMockDanmaku(100)
      
      danmaku.forEach(item => {
        expect(validColors).toContain(item.color)
      })
    })

    it('弹幕类型应该是有效类型', () => {
      const danmaku = generateMockDanmaku(100)
      
      danmaku.forEach(item => {
        expect(['scroll', 'top', 'bottom']).toContain(item.type)
      })
    })

    it('createdAt 应该是有效的 ISO 日期字符串', () => {
      const danmaku = generateMockDanmaku(10)
      
      danmaku.forEach(item => {
        const date = new Date(item.createdAt)
        expect(date).toBeInstanceOf(Date)
        expect(date.getTime()).not.toBeNaN()
      })
    })
  })

  describe('3. 弹幕内容测试', () => {
    it('弹幕内容应该来自预设列表', () => {
      const validContents = [
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
      
      const danmaku = generateMockDanmaku(100)
      
      danmaku.forEach(item => {
        expect(validContents).toContain(item.content)
      })
    })
  })

  describe('4. 性能测试', () => {
    it('生成大量弹幕应该在合理时间内完成', () => {
      const startTime = performance.now()
      generateMockDanmaku(10000)
      const endTime = performance.now()
      
      // 生成 10000 条弹幕应该在 100ms 内完成
      expect(endTime - startTime).toBeLessThan(100)
    })
  })

  describe('5. 边界测试', () => {
    it('应该正确处理负数参数', () => {
      // JavaScript 的 Array.from 会将负数转为空数组
      const danmaku = generateMockDanmaku(-1)
      expect(danmaku).toHaveLength(0)
    })

    it('应该正确处理小数参数', () => {
      const danmaku = generateMockDanmaku(5.5)
      // Array.from 会取整
      expect(danmaku.length).toBe(5)
    })
  })
})
