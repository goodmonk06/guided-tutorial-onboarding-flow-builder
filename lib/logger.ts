/* eslint-disable @typescript-eslint/no-explicit-any */
type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogContext {
  [key: string]: any
}

class Logger {
  private context: LogContext = {}

  constructor(private defaultContext: LogContext = {}) {
    this.context = defaultContext
  }

  withContext(context: LogContext): Logger {
    return new Logger({ ...this.context, ...context })
  }

  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString()
    const allContext = { ...this.context, ...context }
    const contextStr = Object.keys(allContext).length > 0 ? JSON.stringify(allContext) : ''

    return `[${timestamp}] [${level.toUpperCase()}] ${message} ${contextStr}`.trim()
  }

  debug(message: string, context?: LogContext): void {
    if (process.env.NODE_ENV === 'development' || process.env.LOG_LEVEL === 'debug') {
      console.debug(this.formatMessage('debug', message, context))
    }
  }

  info(message: string, context?: LogContext): void {
    console.info(this.formatMessage('info', message, context))
  }

  warn(message: string, context?: LogContext): void {
    console.warn(this.formatMessage('warn', message, context))
  }

  error(message: string, error?: Error, context?: LogContext): void {
    const errorContext = error
      ? {
          ...context,
          error: {
            message: error.message,
            stack: error.stack,
            name: error.name,
          },
        }
      : context

    console.error(this.formatMessage('error', message, errorContext))
  }
}

// Default logger instance
export const logger = new Logger()

// Factory for creating loggers with context
export function createLogger(context: LogContext): Logger {
  return new Logger(context)
}
