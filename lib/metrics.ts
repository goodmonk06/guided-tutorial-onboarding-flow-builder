/* eslint-disable @typescript-eslint/no-explicit-any */
interface MetricLabels {
  [key: string]: string | number
}

interface Metric {
  name: string
  value: number
  labels: MetricLabels
  timestamp: Date
  type: 'counter' | 'gauge' | 'histogram'
}

class MetricsCollector {
  private metrics: Metric[] = []
  private readonly maxMetrics = 10000 // Prevent memory leaks

  /**
   * Record a counter metric (monotonically increasing value)
   */
  counter(name: string, value: number = 1, labels: MetricLabels = {}): void {
    this.recordMetric({
      name,
      value,
      labels,
      timestamp: new Date(),
      type: 'counter',
    })
  }

  /**
   * Record a gauge metric (can go up or down)
   */
  gauge(name: string, value: number, labels: MetricLabels = {}): void {
    this.recordMetric({
      name,
      value,
      labels,
      timestamp: new Date(),
      type: 'gauge',
    })
  }

  /**
   * Record a histogram metric (for timing/distributions)
   */
  histogram(name: string, value: number, labels: MetricLabels = {}): void {
    this.recordMetric({
      name,
      value,
      labels,
      timestamp: new Date(),
      type: 'histogram',
    })
  }

  /**
   * Record timing for an operation
   */
  timing(name: string, durationMs: number, labels: MetricLabels = {}): void {
    this.histogram(`${name}_duration_ms`, durationMs, labels)
  }

  /**
   * Measure and record timing for an async operation
   */
  async measure<T>(
    name: string,
    fn: () => Promise<T>,
    labels: MetricLabels = {}
  ): Promise<T> {
    const start = Date.now()
    try {
      const result = await fn()
      this.timing(name, Date.now() - start, { ...labels, status: 'success' })
      return result
    } catch (error) {
      this.timing(name, Date.now() - start, { ...labels, status: 'error' })
      throw error
    }
  }

  private recordMetric(metric: Metric): void {
    this.metrics.push(metric)

    // Trim old metrics if we exceed the limit
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics)
    }

    // In production, send to external metrics service
    if (process.env.NODE_ENV === 'production' && process.env.METRICS_ENDPOINT) {
      this.sendToExternalService(metric)
    }
  }

  private sendToExternalService(metric: Metric): void {
    // Stub for external metrics service (e.g., Prometheus, Datadog, etc.)
    // In a real implementation, this would send metrics to your monitoring system
    if (process.env.LOG_LEVEL === 'debug') {
      console.log('[METRICS]', JSON.stringify(metric))
    }
  }

  /**
   * Get all recorded metrics (useful for debugging or local aggregation)
   */
  getMetrics(): Metric[] {
    return [...this.metrics]
  }

  /**
   * Get metrics filtered by name
   */
  getMetricsByName(name: string): Metric[] {
    return this.metrics.filter((m) => m.name === name)
  }

  /**
   * Clear all metrics (useful for testing)
   */
  clear(): void {
    this.metrics = []
  }

  /**
   * Get aggregated statistics for a counter metric
   */
  getCounterStats(name: string): { total: number; count: number } {
    const counterMetrics = this.metrics.filter(
      (m) => m.name === name && m.type === 'counter'
    )

    return {
      total: counterMetrics.reduce((sum, m) => sum + m.value, 0),
      count: counterMetrics.length,
    }
  }

  /**
   * Get aggregated statistics for a histogram metric
   */
  getHistogramStats(name: string): {
    min: number
    max: number
    avg: number
    p50: number
    p95: number
    p99: number
  } {
    const histogramMetrics = this.metrics
      .filter((m) => m.name === name && m.type === 'histogram')
      .map((m) => m.value)
      .sort((a, b) => a - b)

    if (histogramMetrics.length === 0) {
      return { min: 0, max: 0, avg: 0, p50: 0, p95: 0, p99: 0 }
    }

    const percentile = (p: number) => {
      const index = Math.ceil((p / 100) * histogramMetrics.length) - 1
      return histogramMetrics[index]
    }

    return {
      min: histogramMetrics[0],
      max: histogramMetrics[histogramMetrics.length - 1],
      avg: histogramMetrics.reduce((sum, v) => sum + v, 0) / histogramMetrics.length,
      p50: percentile(50),
      p95: percentile(95),
      p99: percentile(99),
    }
  }
}

// Default metrics collector instance
export const metrics = new MetricsCollector()

// Export types for external use
export type { Metric, MetricLabels }
