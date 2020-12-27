import { EqualityComparer, objectComparer } from './comparers'
import { LinqMap } from './map'

export class LinqSet<TValue> implements Set<TValue> {
  private readonly map: LinqMap<TValue, TValue>

  get size(): number {
    return this.map.size
  }

  get [Symbol.toStringTag](): string {
    return LinqSet.name
  }

  constructor(equalityComparer: EqualityComparer<TValue> = objectComparer, elements?: Iterable<TValue>) {
    this.map = new LinqMap(equalityComparer)
    if (elements && typeof elements[Symbol.iterator] === 'function') {
      for (const element of elements) {
        this.add(element)
      }
    }
  }

  add(value: TValue): this {
    this.map.set(value, undefined)
    return this
  }

  clear(): void {
    this.map.clear()
  }

  delete(value: TValue): boolean {
    return this.map.delete(value)
  }

  forEach(callbackfn: (value: TValue, value2: TValue, set: Set<TValue>) => void, thisArg?: unknown): void {
    for (const entry of this.entries()) {
      callbackfn.call(thisArg, entry[0], entry[0], this)
    }
  }

  has(value: TValue): boolean {
    return this.map.has(value)
  }

  * [Symbol.iterator](): IterableIterator<TValue> {
    yield* this.values()
  }

  * entries(): IterableIterator<[TValue, TValue]> {
    for (const key of this.keys()) {
      yield [key, key]
    }
  }

  * keys(): IterableIterator<TValue> {
    yield* this.map.keys()
  }

  * values(): IterableIterator<TValue> {
    yield* this.map.keys()
  }
}
