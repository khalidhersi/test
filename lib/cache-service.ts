// Cache durations in milliseconds
export const CACHE_DURATIONS = {
  SHORT: 5 * 60 * 1000, // 5 minutes
  MEDIUM: 30 * 60 * 1000, // 30 minutes
  LONG: 24 * 60 * 60 * 1000, // 24 hours
}

interface CacheItem<T> {
  data: T
  timestamp: number
  expiry: number
}

export class CacheService {
  private static instance: CacheService
  private cache: Map<string, CacheItem<any>> = new Map()
  private memoryUsage = 0
  private readonly MAX_MEMORY_USAGE = 10 * 1024 * 1024 // 10MB limit

  private constructor() {
    // Initialize cache cleanup interval
    setInterval(() => this.cleanupExpiredCache(), 5 * 60 * 1000) // Run every 5 minutes
  }

  public static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService()
    }
    return CacheService.instance
  }

  /**
   * Set an item in the cache
   * @param key Cache key
   * @param data Data to cache
   * @param duration Cache duration in milliseconds
   * @returns boolean indicating if caching was successful
   */
  public set<T>(key: string, data: T, duration: number = CACHE_DURATIONS.MEDIUM): boolean {
    try {
      // Estimate size of data
      const dataSize = this.estimateSize(data)

      // Check if adding this would exceed memory limit
      if (this.memoryUsage + dataSize > this.MAX_MEMORY_USAGE) {
        this.evictLeastRecentlyUsed(dataSize)
      }

      const cacheItem: CacheItem<T> = {
        data,
        timestamp: Date.now(),
        expiry: Date.now() + duration,
      }

      this.cache.set(key, cacheItem)
      this.memoryUsage += dataSize
      return true
    } catch (error) {
      console.error("Error caching data:", error)
      return false
    }
  }

  /**
   * Get an item from the cache
   * @param key Cache key
   * @returns The cached data or null if not found or expired
   */
  public get<T>(key: string): T | null {
    const item = this.cache.get(key) as CacheItem<T> | undefined

    if (!item) {
      return null
    }

    // Check if item is expired
    if (Date.now() > item.expiry) {
      this.cache.delete(key)
      this.memoryUsage -= this.estimateSize(item.data)
      return null
    }

    return item.data
  }

  /**
   * Remove an item from the cache
   * @param key Cache key
   */
  public remove(key: string): void {
    const item = this.cache.get(key)
    if (item) {
      this.memoryUsage -= this.estimateSize(item.data)
      this.cache.delete(key)
    }
  }

  /**
   * Clear the entire cache
   */
  public clear(): void {
    this.cache.clear()
    this.memoryUsage = 0
  }

  /**
   * Check if a key exists in the cache and is not expired
   * @param key Cache key
   * @returns boolean indicating if the key exists and is valid
   */
  public has(key: string): boolean {
    const item = this.cache.get(key)
    if (!item) return false

    if (Date.now() > item.expiry) {
      this.cache.delete(key)
      this.memoryUsage -= this.estimateSize(item.data)
      return false
    }

    return true
  }

  /**
   * Remove expired items from the cache
   */
  private cleanupExpiredCache(): void {
    const now = Date.now()
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiry) {
        this.memoryUsage -= this.estimateSize(item.data)
        this.cache.delete(key)
      }
    }
  }

  /**
   * Estimate the size of data in bytes
   * @param data Data to estimate size for
   * @returns Estimated size in bytes
   */
  private estimateSize(data: any): number {
    try {
      const jsonString = JSON.stringify(data)
      return new Blob([jsonString]).size
    } catch (error) {
      // Fallback to a rough estimate
      return JSON.stringify(data).length * 2
    }
  }

  /**
   * Evict least recently used items to make room for new data
   * @param requiredSpace Space needed in bytes
   */
  private evictLeastRecentlyUsed(requiredSpace: number): void {
    // Sort items by timestamp (oldest first)
    const items = Array.from(this.cache.entries()).sort((a, b) => a[1].timestamp - b[1].timestamp)

    let freedSpace = 0
    for (const [key, item] of items) {
      const itemSize = this.estimateSize(item.data)
      this.cache.delete(key)
      this.memoryUsage -= itemSize
      freedSpace += itemSize

      if (freedSpace >= requiredSpace) {
        break
      }
    }
  }
}

// Export a singleton instance
export const cacheService = CacheService.getInstance()

