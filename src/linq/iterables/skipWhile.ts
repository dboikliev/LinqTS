import { elementsSymbol, ElementsWrapper } from '../element-wrapper'

export class SkipWhile<TSource> implements ElementsWrapper<TSource> {
  constructor(private elements: Iterable<TSource>,
    private predicate: (element: TSource) => boolean) {
  }

  *[Symbol.iterator](): Iterator<TSource> {
    const iterator = this.elements[Symbol.iterator]()

    let lastResult: IteratorResult<TSource>
    do {
      lastResult = iterator.next()
    } while (this.predicate(lastResult.value))

    while (!lastResult.done) {
      yield lastResult.value
      lastResult = iterator.next()
    }
  }

  *[elementsSymbol](): IterableIterator<Iterable<TSource>> {
    yield this.elements
  }

  toString(): string {
    return `${SkipWhile.name} (predicate: ${this.predicate})`
  }
}
