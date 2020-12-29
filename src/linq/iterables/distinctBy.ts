import { elementsSymbol, ElementsWrapper } from '../element-wrapper'
import { EqualityComparer } from '../collections/comparers'
import { LinqMap } from '../collections/map'

export class DistinctBy<TSource, TKey> implements ElementsWrapper<TSource>, Iterable<TSource> {
  constructor(private elements: Iterable<TSource> | AsyncIterable<TSource>,
    private projection?: (element: TSource) => TKey | Promise<TKey>,
    private equalityComparer?: EqualityComparer<TKey>) {
  }

  *[Symbol.iterator](): IterableIterator<TSource> {
    if (typeof this.elements[Symbol.iterator] !== 'function') {
      throw Error('Missing @@iterator')
    }

    const map = this.equalityComparer ? new LinqMap<TKey, TSource>(this.equalityComparer) : new Map<TKey, TSource>()
    for (const element of this.elements as Iterable<TSource>) {
      const key = this.projection(element) as TKey

      if (!map.has(key)) {
        map.set(key, element)
        yield element
      }
    }
  }

  async *[Symbol.asyncIterator](): AsyncIterableIterator<TSource> {
    const map = this.equalityComparer ? new LinqMap<TKey, TSource>(this.equalityComparer) : new Map<TKey, TSource>()
    for await (const element of this.elements) {
      const key = await this.projection(element)

      if (!map.has(key)) {
        map.set(key, element)
        yield element
      }
    }
  }

  *[elementsSymbol](): IterableIterator<Iterable<TSource> | AsyncIterable<TSource>> {
    yield this.elements
  }

  toString(): string {
    return `${DistinctBy.name}${this.projection ? ` (selector: ${this.projection})` : ''}`
  }
}
