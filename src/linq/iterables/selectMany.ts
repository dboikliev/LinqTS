import { elementsSymbol, ElementsWrapper } from '../element-wrapper'

export class SelectMany<TSource, TResult> implements ElementsWrapper<TSource> {
  constructor(private elements: Iterable<TSource>,
    private selector: (element: TSource) => Iterable<TResult>) {
  }

  *[Symbol.iterator](): IterableIterator<TResult> {
    for (const element of this.elements) {
      const innerElements = this.selector(element)
      yield* innerElements
    }
  }

  *[elementsSymbol](): IterableIterator<Iterable<TSource>> {
    yield this.elements
  }

  toString(): string {
    return `${SelectMany.name} (selector: ${this.selector})`
  }
}
