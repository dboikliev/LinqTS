import { elementsSymbol, ElementsWrapper } from '../element-wrapper'

export class SelectMany<TSource, TResult> implements ElementsWrapper<TSource> {
  constructor(private elements: Iterable<TSource> | AsyncIterable<TSource>,
    private selector: (element: TSource) => Iterable<TResult> | AsyncIterable<TResult> | Promise<Iterable<TResult> | AsyncIterable<TResult>>) {
  }

  *[Symbol.iterator](): IterableIterator<TResult> {
    if (typeof this.elements[Symbol.iterator] !== 'function') {
      throw Error('Missing @@iterator')
    }

    for (const element of this.elements as Iterable<TSource>) {
      const innerElements = this.selector(element)
      if (typeof innerElements[Symbol.iterator] !== 'function') {
        throw Error('Missing @@iterator')
      }
      yield* innerElements as Iterable<TResult>
    }
  }

  async *[Symbol.asyncIterator](): AsyncIterableIterator<TResult> {
    for await (const element of this.elements) {
      yield* await this.selector(element)
    }
  }

  *[elementsSymbol](): IterableIterator<Iterable<TSource> | AsyncIterable<TSource>> {
    yield this.elements
  }

  toString(): string {
    return `${SelectMany.name} (selector: ${this.selector})`
  }
}
