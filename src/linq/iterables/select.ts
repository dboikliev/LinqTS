import { elementsSymbol, ElementsWrapper } from '../element-wrapper'

export class Select<TSource, TResult> implements ElementsWrapper<TSource> {
  constructor(private elements: Iterable<TSource>,
    private selector: (element: TSource) => TResult) {
  }

  *[Symbol.iterator](): IterableIterator<TResult> {
    for (const element of this.elements) {
      yield this.selector(element)
    }
  }

  *[elementsSymbol](): IterableIterator<Iterable<TSource>> {
    yield this.elements
  }

  toString(): string {
    return `${Select.name} (selector: ${this.selector})`
  }
}
