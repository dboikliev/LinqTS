import { elementsSymbol, ElementsWrapper } from '../element-wrapper'
import { EqualityComparer } from '../collections/comparers'
import { LinqMap } from '../collections/map'

export class DistinctBy<TSource, TKey> implements ElementsWrapper<TSource> {
  constructor(private elements: Iterable<TSource>,
    private projection?: (element: TSource) => TKey,
    private equalityComparer?: EqualityComparer<TKey>) {
  }

  *[Symbol.iterator](): IterableIterator<TSource> {
    const map = this.equalityComparer ? new LinqMap<TKey, TSource>(this.equalityComparer) : new Map<TKey, TSource>()
    for (const element of this.elements) {
      const key = this.projection(element)

      if (!map.has(key)) {
        map.set(key, element)
        yield element
      }
    }
  }

  *[elementsSymbol](): IterableIterator<Iterable<TSource>> {
    yield this.elements
  }

  toString(): string {
    return `${DistinctBy.name}${this.projection ? ` (selector: ${this.projection})` : ''}`
  }
}
