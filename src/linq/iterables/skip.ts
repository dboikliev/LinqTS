import { elementsSymbol, ElementsWrapper } from '../element-wrapper'

export class Skip<TSource> implements ElementsWrapper<TSource> {
  constructor(private elements: Iterable<TSource>,
    private count: number) {
  }

  *[Symbol.iterator](): IterableIterator<TSource> {
    const iterator = this.elements[Symbol.iterator]()
    let iteratorResult: IteratorResult<TSource> = iterator.next()
    for (let i = 0; i < this.count && !iteratorResult.done; i++) {
      iteratorResult = iterator.next()
    }

    while (!iteratorResult.done) {
      yield iteratorResult.value
      iteratorResult = iterator.next()
    }
  }

  *[elementsSymbol](): IterableIterator<Iterable<TSource>> {
    yield this.elements
  }

  toString(): string {
    return `${Skip.name} (count: ${this.count})`
  }
}
