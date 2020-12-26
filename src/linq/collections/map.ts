import { EqualityComparer, EqualsFunction, HashFunction, objectComparer } from './comparers'

type Entries<TKey, TValue> = Entry<TKey, TValue>[]

class Entry<TKey, TValue> {
  constructor(public key: TKey,
    public value: TValue,
    public hash: number) {
  }
}
export class LinqMap<TKey, TValue> implements Map<TKey, TValue> {
  private readonly loadFactor = 0.8
  private readonly hash: HashFunction<TKey> = key => this.equalityComparer.hash(key)
  private readonly equals: EqualsFunction<TKey> = (first, second) => this.equalityComparer.equals(first, second)

  size = 0
  capacity = 2
  data: Entries<TKey, TValue> = Array(this.capacity)

  get [Symbol.toStringTag](): string {
    return LinqMap.name
  } 
  
  constructor(private readonly equalityComparer: EqualityComparer<TKey> = objectComparer, capacity = nextCapacity(0)) {
    this.capacity = capacity
  }

  clear(): void {
    this.data = Array(nextCapacity(0))
    this.size = 0
    this.capacity = this.data.length
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
    const hash = this.hash(key)
    // console.timeEnd('hash')

    let collisions = 0
    let slotIndex = hash % this.capacity
    let entry = this.data[slotIndex]
    while (isEntry(entry)) {
      if (entry.hash === hash && this.equals(entry.key, key)) {
        entry.value = value
        return this
      }
      collisions++
      slotIndex = (hash + collisions) % this.capacity
      entry = this.data[slotIndex]
    }

    this.data[slotIndex] = new Entry(key, value, hash)

    this.size++
    if (this.size / this.capacity >= this.loadFactor) {
      this.resize(nextCapacity(this.capacity))
    }

    return this
  }

  _set(this: void, entry: Entry<TKey, TValue>, data: Entries<TKey, TValue>): void {
    if (!entry) {
      return
    }

    const hash = entry.hash
    let collisions = 0
    let slotIndex = hash % data.length
    let slot = data[slotIndex]
    while (isEntry(slot)) {
      collisions++
      slotIndex = (hash + collisions) % data.length
      slot = data[slotIndex]
    }
    data[slotIndex] = entry
  }

  delete(key: TKey): boolean {
    const index = this.findEntryIndex(key)
    if (index >= 0) {
      this.data[index] = undefined
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
    const hash = this.hash(key)

    let slotIndex = hash % this.capacity

    let entry = this.data[slotIndex]
    let collisions = 0
    while (isEntry(entry)) {
      if (entry.hash === hash && this.equals(entry.key, key)) {
        return slotIndex
      }
      collisions++
      slotIndex = (hash + collisions) % this.capacity
      entry = this.data[slotIndex]
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
    this.capacity = newCapacity
  }
}

function isEntry(obj: unknown): obj is Entry<unknown, unknown> {
  return obj instanceof Entry
}

function nextCapacity(capacity: number): number {
  return capacity < 2 ? 2 : capacity * 2
}
