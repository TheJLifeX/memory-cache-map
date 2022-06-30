# MemoryCacheMap

[![NPM](https://img.shields.io/npm/v/memory-cache-map?label=NPM&color=blue)](https://www.npmjs.com/package/memory-cache-map "View this project on NPM.") [![NPM downloads](https://img.shields.io/npm/dt/memory-cache-map?label=NPM%20downloads)](https://www.npmjs.com/package/memory-cache-map "View this project on NPM.")

MemoryCacheMap is an in-memory cache using the JavaScript [Map class](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) and adding the possibility to set a "time to live" for the cached values.

## Installation
```sh
npm install memory-cache-map --save
```

## Usage
```ts
import { MemoryCacheMap } from 'memory-cache-map';

const cache = new MemoryCacheMap();

cache.set('myKey', 'myValue');

const myKeyValue = cache.get('myKey');

console.log(myKeyValue);
```

## Documentation
### MemoryCacheMap class
```ts
class MemoryCacheMap<K = string, V = any> {

  /**
   * @param options - The passed options are applied for all values.
   */
  constructor(options?: MemoryCacheMapOptions);

  /**
   * Get a value from the cache.
   */
  get(key: K): V | undefined;

  /**
   * Check if value exists in the cache.
   */
  has(key: K): boolean;

  /**
   * Set the `value` in the cache.
   *
   * @param memoryCacheMapOptions - The passed options overwrite options passed through the constructor and are only applied for this `value`.
   */
  set(key: K, value: V, memoryCacheMapOptions?: MemoryCacheMapOptions): void;

  /**
   * Delete a cached value.
   */
  delete(key: K): void;
}
```

### MemoryCacheMapOptions interface
```ts
interface MemoryCacheMapOptions {
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
```


## License
MIT