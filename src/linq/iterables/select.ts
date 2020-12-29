import { elementsSymbol, ElementsWrapper } from '../element-wrapper'

export class Select<TSource, TResult> implements ElementsWrapper<TSource> {
  constructor(private elements: Iterable<TSource> | AsyncIterable<TSource>,
    private selector: (element: TSource, index: number) => TResult | Promise<TResult>) {
  }

  *[Symbol.iterator](): IterableIterator<TResult> {
    if (typeof this.elements[Symbol.iterator] !== 'function') {
      throw Error('Missing @@iterator')
    }

    let index = 0
    for (const element of this.elements as Iterable<TSource>) {
      yield this.selector(element, index++) as TResult
    }
  }

  async * [Symbol.asyncIterator](): AsyncIterableIterator<TResult> {
    let index = 0
    for await (const element of this.elements) {
      yield this.selector(element, index++)
    }
  }


  *[elementsSymbol](): IterableIterator<Iterable<TSource> | AsyncIterable<TSource>> {
    yield this.elements
  }

  toString(): string {
    return `${Select.name} (selector: ${this.selector})`
  }
}
