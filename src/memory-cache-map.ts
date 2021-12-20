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
  private readonly cache: Map<K, CacheContent<V>> = new Map<K, CacheContent<V>>();

  constructor(private readonly memoryCacheMapOptions?: MemoryCacheMapOptions<V>) { }

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
  set(key: K, value: V, memoryCacheMapOptions?: MemoryCacheMapOptions<V>): void {
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
      beforeDeleted(value);
    }
    this.cache.delete(key);
  }

  /**
   * Delete the cached value after the passed "time to live".
   */
  private handleMemoryCacheMapOptions(key: K, memoryCacheMapOptions?: MemoryCacheMapOptions<V>): Omit<CacheContent<V>, "value"> {
    const { timeToLive, beforeDeleted } = Object.assign({}, defaultMemoryCacheMapOptions, this.memoryCacheMapOptions, memoryCacheMapOptions);
    if (!timeToLive || timeToLive === Infinity) {
      return { beforeDeleted };
    }

    const timeout = setTimeout(() => {
      this.delete(key);
    }, timeToLive) as any as number;

    return { timeout, beforeDeleted };
  }
}

interface CacheContent<V> extends Pick<MemoryCacheMapOptions<V>, "beforeDeleted"> {
  value: V;
  /**
   * The timeout used to delete the cached value after the "time to live".
   */
  timeout?: number;
}
