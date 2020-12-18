import { elementsSymbol, ElementsWrapper } from '../element-wrapper'

export class Take<TSource> implements ElementsWrapper<TSource> {
  constructor(private elements: Iterable<TSource>,
    private count: number) {
  }

  *[Symbol.iterator](): IterableIterator<TSource> {
    let current = 0
    for (const element of this.elements) {
      if (current >= this.count) {
        return
      }
      current++
      yield element
    }
  }

  *[elementsSymbol](): IterableIterator<Iterable<TSource>> {
    yield this.elements
  }

  toString(): string {
    return `${Take.name} (count: ${this.count})`
  }
}
