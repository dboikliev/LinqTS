import { elementsSymbol, ElementsWrapper } from '../element-wrapper'

export class Take<TSource> implements ElementsWrapper<TSource> {
  constructor(private elements: Iterable<TSource> | AsyncIterable<TSource>,
    private count: number) {
  }

  *[Symbol.iterator](): IterableIterator<TSource> {
    if (typeof this.elements[Symbol.iterator] !== 'function') {
      throw Error('Missing @@iterator')
    }

    if (this.count <= 0) {
      return
    }

    let total = 0
    for (const element of this.elements as Iterable<TSource>) {
      yield element
      
      total++
      if (total >= this.count) {
        return
      }
    }
  }

  async * [Symbol.asyncIterator](): AsyncIterableIterator<TSource> {
    if (this.count <= 0) {
      return
    }

    let total = 0
    for await (const element of this.elements) {
      yield element
      
      total++
      if (total >= this.count) {
        return
      }
    }
  }


  *[elementsSymbol](): IterableIterator<Iterable<TSource> | AsyncIterable<TSource>> {
    yield this.elements
  }

  toString(): string {
    return `${Take.name} (count: ${this.count})`
  }
}
