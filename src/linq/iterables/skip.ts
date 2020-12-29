import { elementsSymbol, ElementsWrapper } from '../element-wrapper'

export class Skip<TSource> implements ElementsWrapper<TSource> {
  constructor(private elements: Iterable<TSource> | AsyncIterable<TSource>,
    private count: number) {
  }

  *[Symbol.iterator](): IterableIterator<TSource> {
    if (typeof this.elements[Symbol.iterator] !== 'function') {
      throw Error('Missing @@iterator')
    }

    let skipped = 0
    for (const element of this.elements as Iterable<TSource>) {
      if (skipped >= this.count) {
        yield element
      } else {
        skipped++
      }
    }

    // const iterator = this.elements[Symbol.iterator]()
    // let iteratorResult: IteratorResult<TSource> = iterator.next()
    // for (let i = 0; i < this.count && !iteratorResult.done; i++) {
    //   iteratorResult = iterator.next()
    // }

    // while (!iteratorResult.done) {
    //   yield iteratorResult.value
    //   iteratorResult = iterator.next()
    // }
  }

  async * [Symbol.asyncIterator](): AsyncIterableIterator<TSource> {
    let skipped = 0
    for await (const element of this.elements) {
      if (skipped >= this.count) {
        yield element
      } else {
        skipped++
      }
    }
  }


  *[elementsSymbol](): IterableIterator<Iterable<TSource> | AsyncIterable<TSource>> {
    yield this.elements
  }

  toString(): string {
    return `${Skip.name} (count: ${this.count})`
  }
}
