import { ZodError } from 'zod'

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public code?: string,
    public details?: any
  ) {
    super(message)
    this.name = 'AppError'
    Object.setPrototypeOf(this, AppError.prototype)
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: any) {
    super(400, message, 'VALIDATION_ERROR', details)
    this.name = 'ValidationError'
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(404, message, 'NOT_FOUND')
    this.name = 'NotFoundError'
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Resource already exists') {
    super(409, message, 'CONFLICT')
    this.name = 'ConflictError'
  }
}

export interface ErrorResponse {
  error: {
    message: string
    code?: string
    details?: any
    statusCode: number
  }
}

export function handleError(error: unknown): ErrorResponse {
  // Handle Zod validation errors
  if (error instanceof ZodError) {
    return {
      error: {
        message: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: error.errors?.map((e) => ({
          path: e.path?.join('.') || '',
          message: e.message,
        })) || [],
        statusCode: 400,
      },
    }
  }

  // Handle custom app errors
  if (error instanceof AppError) {
    return {
      error: {
        message: error.message,
        code: error.code,
        details: error.details,
        statusCode: error.statusCode,
      },
    }
  }

  // Handle Prisma errors
  if (error && typeof error === 'object' && 'code' in error) {
    const prismaError = error as { code: string; meta?: any }

    if (prismaError.code === 'P2002') {
      return {
        error: {
          message: 'A record with this unique field already exists',
          code: 'UNIQUE_CONSTRAINT_VIOLATION',
          details: prismaError.meta,
          statusCode: 409,
        },
      }
    }

    if (prismaError.code === 'P2025') {
      return {
        error: {
          message: 'Record not found',
          code: 'NOT_FOUND',
          statusCode: 404,
        },
      }
    }
  }

  // Handle generic errors
  console.error('Unhandled error:', error)
  return {
    error: {
      message: 'An unexpected error occurred',
      code: 'INTERNAL_SERVER_ERROR',
      statusCode: 500,
    },
  }
}

export function formatErrorResponse(errorResponse: ErrorResponse, statusCode: number) {
  return Response.json(errorResponse, { status: statusCode })
}
