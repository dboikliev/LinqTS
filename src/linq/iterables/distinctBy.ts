import { elementsSymbol, ElementsWrapper } from '../element-wrapper'

export class DistinctBy<TSource> implements ElementsWrapper<TSource> {
  constructor(private elements: Iterable<TSource>,
    private selector?: (element: TSource) => unknown) {
  }

  *[Symbol.iterator](): IterableIterator<TSource> {
    const map = new Map()
    for (const element of this.elements) {
      const key = this.selector(element)

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
    return `${DistinctBy.name}${this.selector ? ` (selector: ${this.selector})` : ''}`
  }
}
