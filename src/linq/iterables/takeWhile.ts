import { elementsSymbol, ElementsWrapper } from '../element-wrapper'

export class TakeWhile<TSource> implements ElementsWrapper<TSource> {
  constructor(private elements: Iterable<TSource>,
    private predicate: (element: TSource) => boolean) {
  }

  *[Symbol.iterator](): IterableIterator<TSource> {
    for (const element of this.elements) {
      if (!this.predicate(element)) {
        break
      }
      yield element
    }
  }

  *[elementsSymbol](): IterableIterator<Iterable<TSource>> {
    yield this.elements
  }

  toString(): string {
    return `${TakeWhile.name} (predicate: ${this.predicate})`
  }
}
