export interface MemoryCacheMapOptions<K = string, V = any> {
  /**
   * Time to live of the cached value.
   * Value in milliseconds.
   * 
   * @default
   * Infinity // Meaning cached values are never cleaned from the memory.
   * 
   * @example
   * 10 * 60 * 1000 // 10 minutes
   */
  timeToLive?: number;

  /**
   * A function called before a cached is deleted from the cache.
   * This means, this function called when you manually call the `delete` method or when the provided `timeToLive` of a cached value is reached.
   * 
   * @param key - The key of the cached value.
   * @param value - The cached value that will be deleted.
   */
  beforeDeleted?: (key: K, value: V) => void;
}