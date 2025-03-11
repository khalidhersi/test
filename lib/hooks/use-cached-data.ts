"use client"

import { useState, useEffect } from "react"
import { cacheService, CACHE_DURATIONS } from "../cache-service"

/**
 * Hook for fetching and caching data
 * @param key Cache key
 * @param fetchFn Function to fetch data if not in cache
 * @param dependencies Dependencies array for refetching
 * @param duration Cache duration
 * @returns Object with data, loading state, error, and refetch function
 */
export function useCachedData<T>(
  key: string,
  fetchFn: () => Promise<T>,
  dependencies: any[] = [],
  duration: number = CACHE_DURATIONS.MEDIUM,
) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  // Function to fetch and cache data
  const fetchData = async () => {
    setLoading(true)
    setError(null)

    try {
      // Check cache first
      const cachedData = cacheService.get<T>(key)

      if (cachedData) {
        setData(cachedData)
        setLoading(false)
        return
      }

      // Fetch fresh data
      const freshData = await fetchFn()

      // Cache the result
      cacheService.set(key, freshData, duration)

      setData(freshData)
    } catch (err) {
      console.error(`Error fetching data for key ${key}:`, err)
      setError(err instanceof Error ? err : new Error(String(err)))
    } finally {
      setLoading(false)
    }
  }

  // Fetch data on mount and when dependencies change
  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies)

  // Function to manually refetch data
  const refetch = () => {
    // Remove from cache to force fresh fetch
    cacheService.remove(key)
    return fetchData()
  }

  return { data, loading, error, refetch }
}

