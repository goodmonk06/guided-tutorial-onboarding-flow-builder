import { describe, it, expect } from 'vitest'
import { z } from 'zod'
import {
  AppError,
  ValidationError,
  NotFoundError,
  ConflictError,
  handleError,
} from './errors'

describe('Error Handling', () => {
  describe('AppError', () => {
    it('should create an app error with correct properties', () => {
      const error = new AppError(400, 'Bad request', 'BAD_REQUEST')

      expect(error.statusCode).toBe(400)
      expect(error.message).toBe('Bad request')
      expect(error.code).toBe('BAD_REQUEST')
      expect(error.name).toBe('AppError')
    })
  })

  describe('ValidationError', () => {
    it('should create a validation error with 400 status', () => {
      const error = new ValidationError('Invalid input')

      expect(error.statusCode).toBe(400)
      expect(error.code).toBe('VALIDATION_ERROR')
      expect(error.name).toBe('ValidationError')
    })
  })

  describe('NotFoundError', () => {
    it('should create a not found error with 404 status', () => {
      const error = new NotFoundError('Resource not found')

      expect(error.statusCode).toBe(404)
      expect(error.code).toBe('NOT_FOUND')
      expect(error.name).toBe('NotFoundError')
    })
  })

  describe('ConflictError', () => {
    it('should create a conflict error with 409 status', () => {
      const error = new ConflictError('Resource already exists')

      expect(error.statusCode).toBe(409)
      expect(error.code).toBe('CONFLICT')
      expect(error.name).toBe('ConflictError')
    })
  })

  describe('handleError', () => {
    it('should handle ZodError', () => {
      const schema = z.object({
        name: z.string().min(1),
      })

      let caughtError: unknown
      try {
        schema.parse({})
      } catch (error) {
        caughtError = error
      }

      const result = handleError(caughtError)

      expect(result.error.statusCode).toBe(400)
      expect(result.error.code).toBe('VALIDATION_ERROR')
      expect(result.error.message).toBe('Validation failed')
      expect(result.error.details).toBeInstanceOf(Array)
    })

    it('should handle AppError', () => {
      const error = new NotFoundError('Guide not found')
      const result = handleError(error)

      expect(result.error.statusCode).toBe(404)
      expect(result.error.code).toBe('NOT_FOUND')
      expect(result.error.message).toBe('Guide not found')
    })

    it('should handle Prisma unique constraint error', () => {
      const prismaError = {
        code: 'P2002',
        meta: { target: ['key'] },
      }

      const result = handleError(prismaError)

      expect(result.error.statusCode).toBe(409)
      expect(result.error.code).toBe('UNIQUE_CONSTRAINT_VIOLATION')
    })

    it('should handle Prisma not found error', () => {
      const prismaError = {
        code: 'P2025',
      }

      const result = handleError(prismaError)

      expect(result.error.statusCode).toBe(404)
      expect(result.error.code).toBe('NOT_FOUND')
    })

    it('should handle unknown errors', () => {
      const error = new Error('Unknown error')
      const result = handleError(error)

      expect(result.error.statusCode).toBe(500)
      expect(result.error.code).toBe('INTERNAL_SERVER_ERROR')
    })
  })
})
