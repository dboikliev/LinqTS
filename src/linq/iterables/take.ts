import { elementsSymbol, ElementsWrapper } from '../element-wrapper'

export class Take<TSource> implements ElementsWrapper<TSource> {
  constructor(private elements: Iterable<TSource>,
    private count: number) {
  }

  *[Symbol.iterator](): IterableIterator<TSource> {
    if (this.count <= 0) {
      return
    }

    let total = 0
    for (const element of this.elements) {
      yield element
      
      total++
      if (total >= this.count) {
        return
      }
    }
  }

  *[elementsSymbol](): IterableIterator<Iterable<TSource>> {
    yield this.elements
  }

  toString(): string {
    return `${Take.name} (count: ${this.count})`
  }
}
