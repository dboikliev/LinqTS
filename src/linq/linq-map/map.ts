import { EqualityComparer, EqualsFunction, HashFunction, objectComparer } from './comparers'

class Entry<TKey, TValue> {
  constructor(public key: TKey, public value: TValue, public hash: number) {
  }
}

type Buckets<TKey, TValue> = Entry<TKey, TValue>[]

export class LinqMap<TKey, TValue> implements Map<TKey, TValue> {
  #loadFactor = 0.75
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
    let bucketIndex = hash % this.#capacity

    let entry = this.buckets[bucketIndex]
    while (entry && (entry.hash !== hash || this.#equals(entry.key, key))) {
      entry = this.buckets[bucketIndex++]
    }
    return false
  }

  * [Symbol.iterator](): IterableIterator<[TKey, TValue]> {
    yield* this.entries()
  }

  * entries(): IterableIterator<[TKey, TValue]> {
    for (const bucket of this.buckets) {
      yield [bucket.key, bucket.value]
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

    let bucketIndex = hash % this.#capacity
    let bucket = this.buckets[bucketIndex]
    while (bucket && (bucket.hash !== hash || !this.#equals(bucket.key, key))) {
      bucket = this.buckets[++bucketIndex]
    }
    
    if (bucket) {
      bucket.value = value
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
    if (!entry) {
      return
    }

    const hash = entry.hash
    let bucketIndex = hash % buckets.length

    let bucket = buckets[bucketIndex]
    while (isEntry(bucket)) {
      bucket = buckets[++bucketIndex]
    }
    buckets[bucketIndex] = entry
  }

  delete(key: TKey): boolean {
    const hash = this.#hash(key)
    let bucketIndex = hash % this.#capacity

    let bucket = this.buckets[bucketIndex]
    while (isEntry(bucket)) {
      if (bucket.hash === hash && this.#equals(bucket.key, key)) {
        this.buckets[bucketIndex] = undefined
        return true
      }

      bucket = this.buckets[bucketIndex++]
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

    let bucketIndex = hash % this.#capacity

    let bucket = this.buckets[bucketIndex]
    while (isEntry(bucket)) {
      if (bucket.hash === hash && this.#equals(bucket.key, key)) {
        return bucket.value
      }

      bucket = this.buckets[++bucketIndex]
    }
  }

  private resize(newCapacity: number): void {
    // console.time()
    // console.log("resize")
    const newArr = Array(newCapacity) 
    for (const key in this.buckets) {
      const bucket = this.buckets[key]
      this.#set(bucket, newArr)
    }
    this.buckets = newArr
    this.#capacity = newCapacity
    // console.timeEnd()

  }
}

function isEntry(obj: unknown): obj is Entry<unknown, unknown> {
  return obj instanceof Entry
}