import { elementsSymbol, ElementsWrapper } from '../element-wrapper'

export class Reverse<TSource> implements ElementsWrapper<TSource> {
  constructor(private elements: Iterable<TSource>) {
  }

  *[Symbol.iterator](): IterableIterator<TSource> {
    const stack: TSource[] = []

    for (const element of this.elements) {
      stack.push(element)
    }

    while (stack.length) {
      yield stack.pop()
    }
  }

  *[elementsSymbol](): IterableIterator<Iterable<TSource>> {
    yield this.elements
  }

  toString(): string {
    return Reverse.name
  }
}
