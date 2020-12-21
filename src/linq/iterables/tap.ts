import { elementsSymbol, ElementsWrapper } from '../element-wrapper'

export class Tap<TSource> implements ElementsWrapper<TSource> {
  constructor(private elements: Iterable<TSource>, private action: (element: TSource) => void) {
  }

  *[Symbol.iterator](): IterableIterator<TSource> {
    for (const element of this.elements) {
      this.action(element)
      yield element
    }
  }

  *[elementsSymbol](): IterableIterator<Iterable<TSource>> {
    yield this.elements
  }

  toString(): string {
    return Tap.name
  }
}
