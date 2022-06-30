export interface MemoryCacheMapOptions<K = string, V = any> {
  /**
   * Time to live of the cached value.
   * Value in milliseconds.
   * 
   * @example
   * 10 * 60 * 1000 // 10 minutes
   * 
   * @default
   * undefined // Meaning cached values are never cleaned from the memory.
   */
  timeToLive?: number;

  /**
   * Maximum number of cached items.
   * When the maximum number of cached items is reached, the oldest cached item is removed.
   * 
   * @default
   * undefined // Meaning no limit.
   */
  maxSize?: number;

  /**
   * @optional
   * 
   * A function called before a cached is deleted from the cache.
   * This means, this function called when you manually call the `delete` method or when the provided `timeToLive` of a cached value is reached.
   * 
   * @param key - The key of the cached value.
   * @param value - The cached value that will be deleted.
   */
  beforeDeleted?: (params: { key: K, value: V }) => void;
}