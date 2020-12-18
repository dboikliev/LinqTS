import { elementsSymbol, ElementsWrapper } from '../element-wrapper'

export class Where<TSource> implements ElementsWrapper<TSource> {
  constructor(private elements: Iterable<TSource>,
    private predicate: (element: TSource) => boolean) {
  }

  *[Symbol.iterator](): IterableIterator<TSource> {
    for (const element of this.elements) {
      if (this.predicate(element)) {
        yield element
      }
    }
  }

  *[elementsSymbol](): IterableIterator<Iterable<TSource>> {
    yield this.elements
  }

  toString(): string {
    return `${Where.name} (predicate: ${this.predicate.toString()})`
  }
}
