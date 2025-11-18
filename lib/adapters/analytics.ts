/* eslint-disable @typescript-eslint/no-explicit-any */
import { logger } from '../logger'

export interface AnalyticsData {
  guideId: string
  eventType: string
  userId?: string
  metadata?: Record<string, any>
  timestamp?: Date
}

/**
 * Interface for analytics adapters
 * Allows sending analytics data to external services
 */
export interface IAnalyticsAdapter {
  /**
   * Send analytics event to external service
   */
  track(data: AnalyticsData): Promise<void>

  /**
   * Flush any buffered events
   */
  flush?(): Promise<void>

  /**
   * Get adapter name
   */
  getName(): string
}

/**
 * In-memory analytics adapter (default)
 * Stores events in memory for testing and development
 */
export class InMemoryAnalyticsAdapter implements IAnalyticsAdapter {
  private events: AnalyticsData[] = []

  async track(data: AnalyticsData): Promise<void> {
    this.events.push({
      ...data,
      timestamp: data.timestamp || new Date(),
    })

    logger.debug('[Analytics] Event tracked', { eventType: data.eventType, guideId: data.guideId })
  }

  getEvents(): AnalyticsData[] {
    return [...this.events]
  }

  clear(): void {
    this.events = []
  }

  getName(): string {
    return 'in-memory'
  }
}

/**
 * Console analytics adapter
 * Logs analytics events to console (useful for debugging)
 */
export class ConsoleAnalyticsAdapter implements IAnalyticsAdapter {
  async track(data: AnalyticsData): Promise<void> {
    console.log('[Analytics]', JSON.stringify(data, null, 2))
  }

  getName(): string {
    return 'console'
  }
}

/**
 * HTTP analytics adapter
 * Sends analytics events to an external HTTP endpoint
 */
export class HttpAnalyticsAdapter implements IAnalyticsAdapter {
  private buffer: AnalyticsData[] = []
  private readonly bufferSize = 100
  private readonly flushInterval = 5000 // 5 seconds

  constructor(private endpoint: string, private apiKey?: string) {
    // Auto-flush every interval
    if (typeof setInterval !== 'undefined') {
      setInterval(() => this.flush(), this.flushInterval)
    }
  }

  async track(data: AnalyticsData): Promise<void> {
    this.buffer.push({
      ...data,
      timestamp: data.timestamp || new Date(),
    })

    // Auto-flush if buffer is full
    if (this.buffer.length >= this.bufferSize) {
      await this.flush()
    }
  }

  async flush(): Promise<void> {
    if (this.buffer.length === 0) return

    const eventsToSend = [...this.buffer]
    this.buffer = []

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      }

      if (this.apiKey) {
        headers['Authorization'] = `Bearer ${this.apiKey}`
      }

      await fetch(this.endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify({ events: eventsToSend }),
      })

      logger.debug('[Analytics] Flushed events', { count: eventsToSend.length })
    } catch (error) {
      logger.error('[Analytics] Failed to flush events', error as Error)
      // Re-add events to buffer for retry
      this.buffer.unshift(...eventsToSend)
    }
  }

  getName(): string {
    return 'http'
  }
}

/**
 * Analytics service that manages adapters
 */
class AnalyticsService {
  private adapters: IAnalyticsAdapter[] = []

  /**
   * Register an analytics adapter
   */
  registerAdapter(adapter: IAnalyticsAdapter): void {
    this.adapters.push(adapter)
    logger.info(`Analytics adapter registered: ${adapter.getName()}`)
  }

  /**
   * Remove an analytics adapter
   */
  removeAdapter(adapterName: string): void {
    this.adapters = this.adapters.filter((a) => a.getName() !== adapterName)
  }

  /**
   * Send analytics event to all registered adapters
   */
  async track(data: AnalyticsData): Promise<void> {
    const promises = this.adapters.map((adapter) =>
      adapter.track(data).catch((error) => {
        logger.error(`Analytics adapter ${adapter.getName()} failed`, error)
      })
    )

    await Promise.allSettled(promises)
  }

  /**
   * Flush all adapters
   */
  async flush(): Promise<void> {
    const promises = this.adapters.map((adapter) =>
      adapter.flush?.().catch((error) => {
        logger.error(`Analytics adapter ${adapter.getName()} flush failed`, error)
      })
    )

    await Promise.allSettled(promises)
  }

  /**
   * Get all registered adapters
   */
  getAdapters(): IAnalyticsAdapter[] {
    return [...this.adapters]
  }
}

// Default analytics service instance
export const analyticsService = new AnalyticsService()

// Register default adapter
if (process.env.NODE_ENV !== 'production') {
  analyticsService.registerAdapter(new InMemoryAnalyticsAdapter())
}
