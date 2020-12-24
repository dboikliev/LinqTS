import { EqualityComparer, EqualsFunction, HashFunction, objectComparer } from './comparers'

class Entry<TKey, TValue> {
  constructor(public key: TKey, public value: TValue, public hash: number) {
  }
}

type Buckets<TKey, TValue> = (Entry<TKey, TValue>[] | Entry<TKey, TValue>)[]

export class LinqMap<TKey, TValue> implements Map<TKey, TValue> {
  #loadFactor = 0.7
  #size = 0
  #capacity = 2
  buckets: Buckets<TKey, TValue> = Array(this.#capacity)
  #hash: HashFunction<TKey> = (key: TKey): number => {
    return this.equalityComparer.hash(key)
  }
  #equals: EqualsFunction<TKey> = (first: TKey, second: TKey): boolean => {
    return this.equalityComparer.equals(first, second)
  }
  public get size(): number {
    return this.#size
  }

  constructor(private equalityComparer: EqualityComparer<TKey> = objectComparer, capacity = 2) {
    this.#capacity = capacity
  }

  [Symbol.toStringTag]: string = LinqMap.name

  clear(): void {
    this.buckets = Array(2)
    this.#size = 0
    this.#capacity = this.buckets.length
  }

  forEach(callbackfn: (value: TValue, key: TKey, map: Map<TKey, TValue>) => void, thisArg?: unknown): void {
    for (const entry of this.entries()) {
      callbackfn.call(thisArg, entry[0], entry[1], this)
    }
  }

  has(key: TKey): boolean {
    const hash = this.#hash(key)
    const bucketIndex = hash % this.#capacity

    const bucket = this.buckets[bucketIndex]
    if (Array.isArray(bucket)) {
      return bucket.some(p => p.hash === hash && this.#equals(p.key, key))
    } else if (bucket instanceof Entry) {
      return bucket.hash === hash && this.#equals(bucket.key, key)
    }
    return false
  }

  *[Symbol.iterator](): IterableIterator<[TKey, TValue]> {
    yield* this.entries()
  }

  * entries(): IterableIterator<[TKey, TValue]> {
    for (const bucket of this.buckets) {
      if (Array.isArray(bucket)) {
        for (const entry of bucket) {
          yield [entry.key, entry.value]
        }
      } else if (isEntry(bucket)) {
        yield [bucket.key, bucket.value]
      }
    }
  }

  * keys(): IterableIterator<TKey> {
    for (const entry of this.entries()) {
      yield entry[0]
    }
  }
  * values(): IterableIterator<TValue> {
    for (const entry of this.entries()) {
      yield entry[1]
    }
  }

  set(key: TKey, value: TValue): this {
    // console.time('hash')
    const hash = this.#hash(key)
    // console.timeEnd('hash')
    
    if (typeof hash === 'undefined') {
      throw Error(`The hash for "${key}" cannot be undefined`)
    }

    const bucketIndex = hash % this.#capacity
    const bucket = this.buckets[bucketIndex]
    if (isEntry(bucket)) {
      if (bucket.hash === hash && this.#equals(bucket.key, key)) {
        bucket.value = value
      } else {
        this.buckets[bucketIndex] = [bucket, new Entry(key, value, hash)]
      }
    } else if (Array.isArray(bucket)) {
      const index = bucket.findIndex(p => p.hash === hash && this.#equals(p.key, key))
      if (index < 0) {
        bucket.push(new Entry(key, value, hash))
      } else {
        bucket[index].value = value
      }
    } else {
      this.buckets[bucketIndex] = new Entry(key, value, hash)
    }
    // console.time('resize')

    this.#size++
    if (this.#size / this.#capacity >= this.#loadFactor) {
      this.resize(this.#capacity * 2)
    }
    // console.timeEnd('resize')

    return this
  }

  #set = function (this: void, entry: Entry<TKey, TValue>, buckets: Buckets<TKey, TValue>): void {
    const hash = entry.hash
    const bucketIndex = hash % buckets.length

    const bucket = buckets[bucketIndex]
    if (isEntry(bucket)) {
      buckets[bucketIndex] = [bucket, entry]
    } else if (Array.isArray(bucket)) {
      bucket.push(entry)
    } else {
      buckets[bucketIndex] = entry
    }
  }

  delete(key: TKey): boolean {
    const hash = this.#hash(key)
    const bucketIndex = hash % this.#capacity

    const bucket = this.buckets[bucketIndex]
    if (Array.isArray(bucket)) {
      const pairIndex = bucket.findIndex(p => p.hash === hash && this.#equals(p.key, key))
      if (pairIndex >= 0) {
        this.buckets[bucketIndex] = bucket.splice(pairIndex, 1)
        this.#size--
        return true
      }
    } else if (bucket instanceof Entry) {
      this.buckets[bucketIndex] = undefined
      this.#size--
      return true
    }
    return false
  }

  get(key: TKey): TValue {
    // console.time('hash')
    const hash = this.#hash(key)

    if (typeof hash === 'undefined') {
      throw Error(`The hash for "${key}" cannot be undefined`)
    }
    // console.timeEnd('hash')

    const bucketIndex = hash % this.#capacity
    const bucket = this.buckets[bucketIndex]

    if (Array.isArray(bucket)) {
      return bucket.find(p => p.hash === hash && this.#equals(p.key, key))?.value
    } else if (isEntry(bucket) && bucket.hash === hash && this.#equals(bucket.key, key)) {
      return bucket.value
    }
  }

  private resize(newCapacity: number): void {
    console.time()
    console.log("resize")
    const newArr = Array(newCapacity) 
    for (const key in this.buckets) {
      const bucket = this.buckets[key]
      if (isEntry(bucket)) {
        this.#set(bucket, newArr)
      } else if (Array.isArray(bucket)) {
        for (let i = 0, length = bucket.length; i < length; i++) {
          const entry = bucket[i]
          this.#set(entry, newArr)
        }
      }
    }
    this.buckets = newArr
    this.#capacity = newCapacity
    console.timeEnd()

  }
}

function isEntry(obj: unknown): obj is Entry<unknown, unknown> {
  return obj instanceof Entry
}