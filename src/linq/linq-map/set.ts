import { EqualityComparer } from "./comparers";
import { LinqMap } from "./map";

export class LinqSet<TValue> implements Set<TValue> {
  private readonly map: LinqMap<TValue, TValue>

  /**
   *
   */
  constructor(equalityComparer: EqualityComparer<TValue>) {
    this.map = new LinqMap(equalityComparer)
  }

  add(value: TValue): this {
    this.map.set(value, value)
    return this
  }
  clear(): void {
    this.map.clear()
  }
  delete(value: TValue): boolean {
    return this.delete(value)
  }
  forEach(callbackfn: (value: TValue, value2: TValue, set: Set<TValue>) => void, thisArg?: any): void {
    for (const entry of this.entries()) {
      callbackfn.call(thisArg, entry[0], entry[1], this)
    }
  }
  has(value: TValue): boolean {
    return this.map.has(value)
  }
  get size(): number {
    return this.map.size
  }
  *[Symbol.iterator](): IterableIterator<TValue> {
    yield* this.values()
  }
  *entries(): IterableIterator<[TValue, TValue]> {
    yield* this.entries()
  }
  * keys(): IterableIterator<TValue> {
    yield* this.map.keys()
  }
  * values(): IterableIterator<TValue> {
    yield* this.map.values()
  }
  [Symbol.toStringTag] = LinqSet.name
}
