import { elementsSymbol, ElementsWrapper } from '../element-wrapper'

export class Repeat<TSource> implements ElementsWrapper<TSource> {
  constructor(private elements: Iterable<TSource> | AsyncIterable<TSource>, private count = Infinity) {
    if (count < 0) {
      this.count = Infinity
    }
  }

  * [Symbol.iterator](): IterableIterator<TSource> {
    if (typeof this.elements[Symbol.iterator] !== 'function') {
      throw Error('Missing @@iterator')
    }

    for (let i = 0; i < this.count; i++) {
      for (const element of this.elements as Iterable<TSource>) {
        yield element
      }
    }
  }

  async * [Symbol.asyncIterator](): AsyncIterableIterator<TSource> {
    for (let i = 0; i < this.count; i++) {
      for await (const element of this.elements) {
        yield element
      }
    }
  }

  * [elementsSymbol](): IterableIterator<Iterable<TSource> | AsyncIterable<TSource>> {
    yield this.elements
  }


  toString(): string {
    return `${Repeat.name} (count: ${this.count})`
  }
}
