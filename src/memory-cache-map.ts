import { defaultMemoryCacheMapOptions } from './default-memory-cache-map-options';
import { MemoryCacheMapOptions } from './memory-cache-map-options';

/**
 * MemoryCacheMap is an in-memory cache using the JavaScript `Map` class and adding the possibility to set a "time to live" for the cached values.
 * 
 * A default time to live for cached values can be set via the constructor.
 */
export class MemoryCacheMap<K = string, V = any> {

  /**
   * Here is where the values are cached.
   */
  private readonly cache: Map<K, CacheContent<K, V>> = new Map<K, CacheContent<K, V>>();

  /**
   * @param options - The passed options are applied for all values.
   */
  constructor(private options: MemoryCacheMapOptions<K, V> = defaultMemoryCacheMapOptions as any) { }

  /**
   * Get a value from the cache.
   */
  get(key: K): V | undefined {
    if (!this.cache.has(key)) {
      return;
    }
    return this.cache.get(key)!.value;
  }

  /**
   * Check if value exists in the cache. 
   */
  has(key: K): boolean {
    return this.cache.has(key);
  }

  /**
   * Set the `value` in the cache.
   * 
   * @param memoryCacheMapOptions - The passed options overwrite options passed through the constructor and are only applied for this `value`.
   */
  set(key: K, value: V, memoryCacheMapOptions?: MemoryCacheMapOptions<K, V>): void {
    if (typeof this.options.maxSize !== 'undefined') {
      if (this.options.maxSize <= 0) {
        return;
      }
      if (
        this.cache.size === this.options.maxSize
        && !this.has(key) // To make sure that the beforeDeleted callback is only called when the to be inserted item does not already exists.
      ) {
        this.deleteOldestItem();
      }
      this.deleteItemIfExists(key); // To move the new item at the end (like newest) of the "map array".
    }
    const { timeout, beforeDeleted } = this.handleMemoryCacheMapOptions(key, memoryCacheMapOptions);
    this.cache.set(key, { value, timeout, beforeDeleted });
  }

  /**
   * Delete a cached value.
   */
  delete(key: K): void {
    const cacheContent = this.cache.get(key);
    if (!cacheContent) {
      return;
    }
    const { timeout, beforeDeleted, value } = cacheContent;
    if (timeout) {
      clearTimeout(timeout);
    }

    if (beforeDeleted) {
      beforeDeleted({ key, value });
    }
    this.cache.delete(key);
  }

  /**
   * Delete the cached value after the passed "time to live".
   */
  private handleMemoryCacheMapOptions(key: K, memoryCacheMapOptionsThroughSetMethod?: MemoryCacheMapOptions<K, V>): Omit<CacheContent<K, V>, 'value'> {
    const { timeToLive, beforeDeleted } = Object.assign({}, defaultMemoryCacheMapOptions, this.options, memoryCacheMapOptionsThroughSetMethod);
    if (!timeToLive || timeToLive === Infinity) {
      return { beforeDeleted };
    }

    const timeout = setTimeout(() => {
      this.delete(key);
    }, timeToLive) as any as number;

    return { timeout, beforeDeleted };
  }

  private deleteOldestItem(): void {
    const oldestItemKey = this.cache.keys().next().value;
    this.delete(oldestItemKey);
  }

  /**
   * Delete item if exists and without calling the beforeDeleted callback.
   */
  private deleteItemIfExists(key: K): void {
    const cacheContent = this.cache.get(key);
    if (!cacheContent) {
      return;
    }
    const { timeout } = cacheContent;
    if (timeout) {
      clearTimeout(timeout);
    }

    this.cache.delete(key);
  }
}

interface CacheContent<K, V> extends Pick<MemoryCacheMapOptions<K, V>, 'beforeDeleted'> {
  value: V;
  /**
   * The timeout used to delete the cached value after the "time to live".
   */
  timeout?: number;
}
