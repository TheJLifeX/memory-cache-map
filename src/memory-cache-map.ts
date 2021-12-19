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
  private readonly cache: Map<K, CacheContent<V>> = new Map<K, CacheContent<V>>();

  private readonly memoryCacheMapDefaultOptions: MemoryCacheMapOptions;

  private readonly defaultTimeToLive = Infinity;

  constructor(options?: MemoryCacheMapOptions) {
    if (typeof options === 'undefined') {
      this.memoryCacheMapDefaultOptions = { timeToLive: this.defaultTimeToLive };
    } else {
      this.memoryCacheMapDefaultOptions = options;
    }
  }

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
   */
  set(key: K, value: V, memoryCacheMapOptions?: MemoryCacheMapOptions): void {
    const timeout = this.handleTimeToLive(key, memoryCacheMapOptions);
    this.cache.set(key, { value, timeout });
  }

  /**
   * Delete a cached value.
   */
  delete(key: K): void {
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

  /**
   * Delete the cached value after the passed "time to live".
   */
  private handleTimeToLive(key: K, memoryCacheMapOptions?: MemoryCacheMapOptions): number | undefined {
    const memoryCacheMapDefaultOptionsCopy = JSON.parse(JSON.stringify(this.memoryCacheMapDefaultOptions)) as MemoryCacheMapOptions;
    const { timeToLive } = Object.assign(memoryCacheMapDefaultOptionsCopy, memoryCacheMapOptions);
    if (!timeToLive || timeToLive === this.defaultTimeToLive) {
      return;
    }

    const timeout = setTimeout(() => {
      this.cache.delete(key);
    }, timeToLive) as any as number;

    return timeout;
  }
}

interface CacheContent<T> {
  /**
   * The timeout used to delete the cached value after the "time to live".
   */
  timeout?: number;
  value: T;
}
