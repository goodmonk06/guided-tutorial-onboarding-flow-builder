/* eslint-disable @typescript-eslint/no-explicit-any */
import { DomainEvent, DomainEventType } from './types'
import { logger } from '../logger'
import { metrics } from '../metrics'

type EventHandler<T = any> = (event: DomainEvent<T>) => void | Promise<void>

class EventBus {
  private handlers: Map<DomainEventType | '*', Set<EventHandler>> = new Map()
  private eventHistory: DomainEvent[] = []
  private readonly maxHistorySize = 1000

  /**
   * Subscribe to specific event type
   */
  on<T = any>(eventType: DomainEventType, handler: EventHandler<T>): () => void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, new Set())
    }

    this.handlers.get(eventType)!.add(handler)

    // Return unsubscribe function
    return () => {
      this.handlers.get(eventType)?.delete(handler)
    }
  }

  /**
   * Subscribe to all events
   */
  onAny(handler: EventHandler): () => void {
    if (!this.handlers.has('*')) {
      this.handlers.set('*', new Set())
    }

    this.handlers.get('*')!.add(handler)

    return () => {
      this.handlers.get('*')?.delete(handler)
    }
  }

  /**
   * Publish an event to all subscribers
   */
  async publish<T = any>(event: DomainEvent<T>): Promise<void> {
    // Add to history
    this.eventHistory.push(event)
    if (this.eventHistory.length > this.maxHistorySize) {
      this.eventHistory = this.eventHistory.slice(-this.maxHistorySize)
    }

    // Record metrics
    metrics.counter('event_published', 1, { type: event.type })

    // Log event
    logger.debug('Event published', {
      type: event.type,
      eventId: event.id,
      guideId: event.metadata?.guideId,
    })

    // Get handlers for this event type
    const typeHandlers = this.handlers.get(event.type) || new Set()
    const allHandlers = this.handlers.get('*') || new Set()
    const allHandlersToExecute = [...typeHandlers, ...allHandlers]

    // Execute all handlers
    const promises = allHandlersToExecute.map(async (handler) => {
      try {
        await handler(event)
      } catch (error) {
        logger.error('Error in event handler', error as Error, {
          eventType: event.type,
          eventId: event.id,
        })
        metrics.counter('event_handler_error', 1, { type: event.type })
      }
    })

    await Promise.allSettled(promises)
  }

  /**
   * Get event history (useful for debugging or replay)
   */
  getHistory(filter?: { type?: DomainEventType; guideId?: string }): DomainEvent[] {
    if (!filter) return [...this.eventHistory]

    return this.eventHistory.filter((event) => {
      if (filter.type && event.type !== filter.type) return false
      if (filter.guideId && event.metadata?.guideId !== filter.guideId) return false
      return true
    })
  }

  /**
   * Clear event history (useful for testing)
   */
  clearHistory(): void {
    this.eventHistory = []
  }

  /**
   * Get count of registered handlers
   */
  getHandlerCount(eventType?: DomainEventType): number {
    if (eventType) {
      return this.handlers.get(eventType)?.size || 0
    }

    let total = 0
    for (const handlers of this.handlers.values()) {
      total += handlers.size
    }
    return total
  }

  /**
   * Remove all handlers (useful for testing)
   */
  removeAllHandlers(): void {
    this.handlers.clear()
  }
}

// Default event bus instance
export const eventBus = new EventBus()

// Helper function to create domain events
export function createEvent<T>(
  type: DomainEventType,
  payload: T,
  metadata?: DomainEvent['metadata']
): DomainEvent<T> {
  return {
    id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type,
    timestamp: new Date(),
    payload,
    metadata,
  }
}
