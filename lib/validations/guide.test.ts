import { describe, it, expect } from 'vitest'
import { createGuideSchema, updateGuideSchema, createStepSchema, updateStepSchema } from './guide'

describe('Guide Validation', () => {
  describe('createGuideSchema', () => {
    it('should validate a valid guide', () => {
      const validGuide = {
        name: 'Test Guide',
        key: 'test-guide',
        description: 'A test guide',
      }

      const result = createGuideSchema.safeParse(validGuide)
      expect(result.success).toBe(true)
    })

    it('should reject guide without name', () => {
      const invalidGuide = {
        key: 'test-guide',
      }

      const result = createGuideSchema.safeParse(invalidGuide)
      expect(result.success).toBe(false)
    })

    it('should reject guide without key', () => {
      const invalidGuide = {
        name: 'Test Guide',
      }

      const result = createGuideSchema.safeParse(invalidGuide)
      expect(result.success).toBe(false)
    })

    it('should reject guide with invalid key format', () => {
      const invalidGuide = {
        name: 'Test Guide',
        key: 'Test Guide!',
      }

      const result = createGuideSchema.safeParse(invalidGuide)
      expect(result.success).toBe(false)
    })

    it('should accept guide with valid key formats', () => {
      const validKeys = ['test-guide', 'test_guide', 'test123', 'test-guide-123']

      validKeys.forEach((key) => {
        const guide = {
          name: 'Test Guide',
          key,
        }
        const result = createGuideSchema.safeParse(guide)
        expect(result.success).toBe(true)
      })
    })

    it('should reject guide with name too long', () => {
      const invalidGuide = {
        name: 'a'.repeat(201),
        key: 'test-guide',
      }

      const result = createGuideSchema.safeParse(invalidGuide)
      expect(result.success).toBe(false)
    })
  })

  describe('updateGuideSchema', () => {
    it('should allow partial updates', () => {
      const partialUpdate = {
        name: 'Updated Name',
      }

      const result = updateGuideSchema.safeParse(partialUpdate)
      expect(result.success).toBe(true)
    })

    it('should allow empty object', () => {
      const result = updateGuideSchema.safeParse({})
      expect(result.success).toBe(true)
    })
  })

  describe('createStepSchema', () => {
    it('should validate a valid step', () => {
      const validStep = {
        selector: '#welcome',
        contentMarkdown: '# Welcome',
        placement: 'bottom' as const,
        routePath: '/',
      }

      const result = createStepSchema.safeParse(validStep)
      expect(result.success).toBe(true)
    })

    it('should reject step without selector', () => {
      const invalidStep = {
        contentMarkdown: '# Welcome',
      }

      const result = createStepSchema.safeParse(invalidStep)
      expect(result.success).toBe(false)
    })

    it('should reject step without content', () => {
      const invalidStep = {
        selector: '#welcome',
      }

      const result = createStepSchema.safeParse(invalidStep)
      expect(result.success).toBe(false)
    })

    it('should default placement to bottom', () => {
      const step = {
        selector: '#welcome',
        contentMarkdown: '# Welcome',
      }

      const result = createStepSchema.parse(step)
      expect(result.placement).toBe('bottom')
    })

    it('should validate placement values', () => {
      const placements = ['top', 'right', 'bottom', 'left'] as const

      placements.forEach((placement) => {
        const step = {
          selector: '#welcome',
          contentMarkdown: '# Welcome',
          placement,
        }
        const result = createStepSchema.safeParse(step)
        expect(result.success).toBe(true)
      })
    })

    it('should reject invalid placement', () => {
      const step = {
        selector: '#welcome',
        contentMarkdown: '# Welcome',
        placement: 'invalid',
      }

      const result = createStepSchema.safeParse(step)
      expect(result.success).toBe(false)
    })
  })

  describe('updateStepSchema', () => {
    it('should allow partial updates', () => {
      const partialUpdate = {
        contentMarkdown: 'Updated content',
      }

      const result = updateStepSchema.safeParse(partialUpdate)
      expect(result.success).toBe(true)
    })

    it('should allow empty object', () => {
      const result = updateStepSchema.safeParse({})
      expect(result.success).toBe(true)
    })
  })
})
