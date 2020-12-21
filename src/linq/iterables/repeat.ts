import { elementsSymbol, ElementsWrapper } from '../element-wrapper'

export class Repeat<TSource> implements ElementsWrapper<TSource> {
  constructor(private elements: Iterable<TSource>, private count = Infinity) {
    if (count < 0) {
      this.count = Infinity
    }
  }

  * [Symbol.iterator](): IterableIterator<TSource> {
    for (let i = 0; i < this.count; i++) {
      for (const element of this.elements) {
        yield element
      }
    }
  }

  * [elementsSymbol](): IterableIterator<Iterable<TSource>> {
    yield this.elements
  }


  toString(): string {
    return `${Repeat.name} (count: ${this.count})`
  }
}
