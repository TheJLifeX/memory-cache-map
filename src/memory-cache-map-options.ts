export interface MemoryCacheMapOptions<V = any> {
  /**
   * Time to live of the cached value.
   * Value in milliseconds.
   * 
   * @default
   * Infinity // meaning cached values are never cleaned from the memory.
   * 
   * @example
   * 10 * 60 * 1000 // 10 minutes
   */
  timeToLive?: number;

  /**
   * A function called before a cached is deleted from the cache.
   * This means, this function called when you manually call the `delete` method or when the provided `timeToLive` of a cached value is reached.
   * 
   * @param value - The cached value that will be deleted.
   */
  beforeDeleted?: (value: V) => void;
}