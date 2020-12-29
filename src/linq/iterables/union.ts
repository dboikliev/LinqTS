import { EqualityComparer, LinqSet } from '../collections'
import { elementsSymbol, ElementsWrapper } from '../element-wrapper'

export class Union<TSource> implements ElementsWrapper<TSource> {
  constructor(private left: Iterable<TSource> | AsyncIterable<TSource>,
    private right: Iterable<TSource> | AsyncIterable<TSource>,
    private equalityComparer: EqualityComparer<TSource>) {
  }

  *[Symbol.iterator](): IterableIterator<TSource> {
    if (typeof this.left[Symbol.iterator] !== 'function' ||
      typeof this.right[Symbol.iterator] !== 'function') {
      throw Error('Missing @@iterator')
    }

    const set = this.equalityComparer ? new LinqSet(this.equalityComparer, this.left as Iterable<TSource>) : new Set(this.left as Iterable<TSource>)

    for (const element of set) {
      yield element
    }

    for (const element of this.right as Iterable<TSource>) {
      if (!set.has(element)) {
        set.add(element)
        yield element
      }
    }
  }

  async * [Symbol.asyncIterator](): AsyncIterableIterator<TSource> {
    if (typeof this.left[Symbol.iterator] !== 'function' ||
      typeof this.right[Symbol.iterator] !== 'function') {
      throw Error('Missing @@iterator')
    }

    const set = this.equalityComparer ? new LinqSet(this.equalityComparer) : new Set()

    for await (const element of this.left) {
      set.add(element)
      yield element
    }

    for await (const element of this.right) {
      if (!set.has(element)) {
        set.add(element)
        yield element
      }
    }
  }

  *[elementsSymbol](): IterableIterator<Iterable<TSource> | AsyncIterable<TSource>> {
    yield this.left
    yield this.right
  }

  toString(): string {
    return `${Union.name}`
  }
}
