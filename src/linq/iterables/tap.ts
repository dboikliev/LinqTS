import { AsyncSource, SyncSource } from '..'
import { elementsSymbol, ElementsWrapper } from '../element-wrapper'

export class Tap<TSource> implements ElementsWrapper<TSource> {
  constructor(private elements: Iterable<TSource> | AsyncIterable<TSource>, private action: (element: TSource) => void) {
  }

  *[Symbol.iterator](): IterableIterator<TSource> {
    if (typeof this.elements[Symbol.iterator] !== 'function') {
      throw Error('Missing @@iterator')
    }

    for (const element of this.elements as Iterable<TSource>) {
      this.action(element)
      yield element
    }
  }

  async * [Symbol.asyncIterator](): AsyncIterableIterator<TSource> {
    for await (const element of this.elements) {
      this.action(element)
      yield element
    }
  }

  *[elementsSymbol](): IterableIterator<Iterable<TSource> | AsyncIterable<TSource>> {
    yield this.elements
  }

  toString(): string {
    return Tap.name
  }
}
