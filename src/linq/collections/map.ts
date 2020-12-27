import { EqualityComparer, EqualsFunction, HashFunction, objectComparer } from './comparers'

type Entries<TKey, TValue> = Entry<TKey, TValue>[]

class Entry<TKey, TValue> {
  constructor(public key: TKey,
    public value: TValue,
    public hash: number,
    public deleted: boolean = false) {
  }
}

export class LinqMap<TKey, TValue> implements Map<TKey, TValue> {
  private readonly loadFactor = 0.8
  private readonly hash: HashFunction<TKey> = key => this.equalityComparer.hash(key)
  private readonly equals: EqualsFunction<TKey> = (first, second) => this.equalityComparer.equals(first, second)

  private _capacity = 2
  private _size = 0
  private data: Entries<TKey, TValue> = Array(this._capacity)

  get [Symbol.toStringTag](): string {
    return LinqMap.name
  } 

  get size(): number {
    return this._size
  }

  get capacity(): number {
    return this._capacity
  }
  
  constructor(private readonly equalityComparer: EqualityComparer<TKey> = objectComparer, capacity = nextCapacity(0)) {
    this._capacity = capacity
  }

  clear(): void {
    this.data = Array(nextCapacity(0))
    this._size = 0
    this._capacity = this.data.length
  }

  forEach(callbackfn: (value: TValue, key: TKey, map: Map<TKey, TValue>) => void, thisArg?: unknown): void {
    for (const entry of this.entries()) {
      callbackfn.call(thisArg, entry[0], entry[1], this)
    }
  }

  has(key: TKey): boolean {
    return this.findEntryIndex(key) >= 0
  }

  * [Symbol.iterator](): IterableIterator<[TKey, TValue]> {
    yield* this.entries()
  }

  * entries(): IterableIterator<[TKey, TValue]> {
    for (const entry of this.data) {
      if (isEntry(entry)) {
        yield [entry.key, entry.value]
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
    const hash = this.hash(key) >>> 0
    // console.timeEnd('hash')

    let slot = hash % this._capacity
    let entry = this.data[slot]
    while (isEntry(entry) && !entry.deleted) {
      if (entry.hash === hash && this.equals(entry.key, key)) {
        entry.value = value
        return this
      }
      slot = ++slot % this._capacity
      entry = this.data[slot]
    }

    if (entry) {
      this.data[slot].key = key
      this.data[slot].value = value
      this.data[slot].hash = hash
      this.data[slot].deleted = false
    } else {
      this.data[slot] = new Entry(key, value, hash)
    }

    this._size++
    if (this._size / this._capacity >= this.loadFactor) {
      this.resize(nextCapacity(this._capacity))
    }

    return this
  }

  delete(key: TKey): boolean {
    const index = this.findEntryIndex(key)
    if (index >= 0) {
      this.data[index].key = undefined
      this.data[index].value = undefined
      this.data[index].hash = undefined
      this.data[index].deleted = true
      this._size--
      return true
    }
    return false
  }

  get(key: TKey): TValue {
    const index = this.findEntryIndex(key)
    if (index >= 0) {
      return this.data[index].value
    }
  }

  private findEntryIndex(key: TKey): number {
    const hash = this.hash(key) >>> 0

    let slot = hash % this._capacity

    let entry = this.data[slot]
    while (isEntry(entry)) {
      if (entry.hash === hash && this.equals(entry.key, key)) {
        return slot
      }
      slot = ++slot % this._capacity
      entry = this.data[slot]
    }

    return -1
  }

  private resize(newCapacity: number): void {
    const newData = Array(newCapacity)
    for (let i = 0, length = this.data.length; i < length; i++) {
      const entry = this.data[i]
      this._set(entry, newData)
    }
    this.data = newData
    this._capacity = newCapacity
  }

  private _set(this: void, entry: Entry<TKey, TValue>, data: Entries<TKey, TValue>): void {
    if (!isEntry(entry) || entry.deleted) {
      return
    }

    const hash = entry.hash
    let slot = hash % data.length
    let found = data[slot]
    while (isEntry(found)) {
      slot = ++slot % data.length
      found = data[slot]
    }
    data[slot] = entry
  }
}

function isEntry(obj: unknown): obj is Entry<unknown, unknown> {
  return obj instanceof Entry
}

function nextCapacity(capacity: number): number {
  return capacity < 2 ? 2 : capacity * 2
}
