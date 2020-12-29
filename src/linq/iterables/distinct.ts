import { elementsSymbol, ElementsWrapper } from '../element-wrapper'
import { EqualityComparer } from '../collections/comparers'
import { LinqSet } from '../collections/set'

export class Distinct<TSource> implements ElementsWrapper<TSource>, Iterable<TSource> {
  constructor(private elements: Iterable<TSource> | AsyncIterable<TSource>,
    private equalityComparer?: EqualityComparer<TSource>) {
  }

  *[Symbol.iterator](): IterableIterator<TSource> {
    if (typeof this.elements[Symbol.iterator] !== 'function') {
      throw Error('Missing @@iterator')
    }

    const set = this.equalityComparer ? new LinqSet(this.equalityComparer) : new Set<TSource>()
    for (const element of this.elements as Iterable<TSource>) {
      if (!set.has(element)) {
        set.add(element)
        yield element
      }
    }
  }

  async * [Symbol.asyncIterator](): AsyncIterableIterator<TSource> {
    const set = this.equalityComparer ? new LinqSet(this.equalityComparer) : new Set<TSource>()
    for await (const element of this.elements) {
      if (!set.has(element)) {
        set.add(element)
        yield element
      }
    }
  }

  *[elementsSymbol](): IterableIterator<Iterable<TSource> | AsyncIterable<TSource>> {
    yield this.elements
  }

  toString(): string {
    return `${Distinct.name} (comparer: ${this.equalityComparer})}`
  }
}
