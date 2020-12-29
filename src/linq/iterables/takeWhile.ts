import { elementsSymbol, ElementsWrapper } from '../element-wrapper'

export class TakeWhile<TSource> implements ElementsWrapper<TSource> {
  constructor(private elements: Iterable<TSource> | AsyncIterable<TSource>,
    private predicate: (element: TSource) => boolean | Promise<boolean>) {
  }

  *[Symbol.iterator](): IterableIterator<TSource> {
    if (typeof this.elements[Symbol.iterator] !== 'function') {
      throw Error('Missing @@iterator')
    }

    for (const element of this.elements as Iterable<TSource>) {
      if (!this.predicate(element)) {
        break
      }
      yield element
    }
  }

  async *[Symbol.asyncIterator](): AsyncIterableIterator<TSource> {
    if (typeof this.elements[Symbol.iterator] !== 'function') {
      throw Error('Missing @@iterator')
    }

    for await (const element of this.elements) {
      if (!await this.predicate(element)) {
        break
      }
      yield element
    }
  }

  *[elementsSymbol](): IterableIterator<Iterable<TSource> | AsyncIterable<TSource>> {
    yield this.elements
  }

  toString(): string {
    return `${TakeWhile.name} (predicate: ${this.predicate})`
  }
}
