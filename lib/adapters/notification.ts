/* eslint-disable @typescript-eslint/no-explicit-any */
import { logger } from '../logger'

export interface NotificationPayload {
  userId?: string
  channel: 'email' | 'webhook' | 'push' | 'sms'
  subject?: string
  message: string
  metadata?: Record<string, any>
}

/**
 * Interface for notification adapters
 * Allows sending notifications through various channels
 */
export interface INotificationAdapter {
  /**
   * Send notification
   */
  send(payload: NotificationPayload): Promise<void>

  /**
   * Check if this adapter supports the given channel
   */
  supportsChannel(channel: NotificationPayload['channel']): boolean

  /**
   * Get adapter name
   */
  getName(): string
}

/**
 * Console notification adapter
 * Logs notifications to console (useful for development)
 */
export class ConsoleNotificationAdapter implements INotificationAdapter {
  async send(payload: NotificationPayload): Promise<void> {
    console.log('[Notification]', JSON.stringify(payload, null, 2))
  }

  supportsChannel(): boolean {
    return true // Supports all channels for logging
  }

  getName(): string {
    return 'console'
  }
}

/**
 * Webhook notification adapter
 * Sends notifications to HTTP webhooks
 */
export class WebhookNotificationAdapter implements INotificationAdapter {
  constructor(private webhookUrl: string, private secret?: string) {}

  async send(payload: NotificationPayload): Promise<void> {
    if (payload.channel !== 'webhook') {
      return
    }

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      }

      if (this.secret) {
        headers['X-Webhook-Secret'] = this.secret
      }

      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error(`Webhook request failed: ${response.statusText}`)
      }

      logger.debug('[Notification] Webhook sent successfully')
    } catch (error) {
      logger.error('[Notification] Webhook failed', error as Error)
      throw error
    }
  }

  supportsChannel(channel: NotificationPayload['channel']): boolean {
    return channel === 'webhook'
  }

  getName(): string {
    return 'webhook'
  }
}

/**
 * Email notification adapter (stub)
 * In production, this would integrate with an email service like SendGrid, AWS SES, etc.
 */
export class EmailNotificationAdapter implements INotificationAdapter {
  constructor(
    private config: {
      apiKey: string
      fromEmail: string
      fromName?: string
    }
  ) {}

  async send(payload: NotificationPayload): Promise<void> {
    if (payload.channel !== 'email') {
      return
    }

    // In production, integrate with email service
    logger.info('[Notification] Email would be sent', {
      to: payload.userId,
      subject: payload.subject,
      message: payload.message,
    })

    // Stub implementation
    // await emailService.send({
    //   to: payload.userId,
    //   from: this.config.fromEmail,
    //   subject: payload.subject,
    //   html: payload.message,
    // })
  }

  supportsChannel(channel: NotificationPayload['channel']): boolean {
    return channel === 'email'
  }

  getName(): string {
    return 'email'
  }
}

/**
 * Notification service that manages adapters
 */
class NotificationService {
  private adapters: INotificationAdapter[] = []

  /**
   * Register a notification adapter
   */
  registerAdapter(adapter: INotificationAdapter): void {
    this.adapters.push(adapter)
    logger.info(`Notification adapter registered: ${adapter.getName()}`)
  }

  /**
   * Remove a notification adapter
   */
  removeAdapter(adapterName: string): void {
    this.adapters = this.adapters.filter((a) => a.getName() !== adapterName)
  }

  /**
   * Send notification through appropriate adapter
   */
  async send(payload: NotificationPayload): Promise<void> {
    const supportedAdapters = this.adapters.filter((adapter) =>
      adapter.supportsChannel(payload.channel)
    )

    if (supportedAdapters.length === 0) {
      logger.warn(`No adapter supports channel: ${payload.channel}`)
      return
    }

    // Send through all supporting adapters
    const promises = supportedAdapters.map((adapter) =>
      adapter.send(payload).catch((error) => {
        logger.error(`Notification adapter ${adapter.getName()} failed`, error)
      })
    )

    await Promise.allSettled(promises)
  }

  /**
   * Get all registered adapters
   */
  getAdapters(): INotificationAdapter[] {
    return [...this.adapters]
  }
}

// Default notification service instance
export const notificationService = new NotificationService()

// Register default adapter
if (process.env.NODE_ENV !== 'production') {
  notificationService.registerAdapter(new ConsoleNotificationAdapter())
}
