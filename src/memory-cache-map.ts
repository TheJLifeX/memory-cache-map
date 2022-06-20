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

  private readonly memoryCacheMapDefaultOptions: MemoryCacheMapOptions<K, V>;

  private readonly defaultTimeToLive = Infinity;

  /**
   * @param options - The passed options are applied for all values.
   */
  constructor(options?: MemoryCacheMapOptions<K, V>) {
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
   * 
   * @param memoryCacheMapOptions - The passed options overwrite options passed through the constructor and are only applied for this `value`.
   */
  set(key: K, value: V, memoryCacheMapOptions?: MemoryCacheMapOptions<K, V>): void {
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
      beforeDeleted(key, value);
    }
    this.cache.delete(key);
  }

  /**
   * Delete the cached value after the passed "time to live".
   */
  private handleMemoryCacheMapOptions(key: K, memoryCacheMapOptions?: MemoryCacheMapOptions<K, V>): Omit<CacheContent<K, V>, 'value'> {
    const { timeToLive, beforeDeleted } = Object.assign({}, defaultMemoryCacheMapOptions, this.memoryCacheMapDefaultOptions, memoryCacheMapOptions);
    if (!timeToLive || timeToLive === Infinity) {
      return { beforeDeleted };
    }

    const timeout = setTimeout(() => {
      this.delete(key);
    }, timeToLive) as any as number;

    return { timeout, beforeDeleted };
  }
}

interface CacheContent<K, V> extends Pick<MemoryCacheMapOptions<K, V>, 'beforeDeleted'> {
  value: V;
  /**
   * The timeout used to delete the cached value after the "time to live".
   */
  timeout?: number;
}
