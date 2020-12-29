import { elementsSymbol, ElementsWrapper } from '../element-wrapper'

export class SkipWhile<TSource> implements ElementsWrapper<TSource> {
  constructor(private elements: Iterable<TSource> | AsyncIterable<TSource>,
    private predicate: (element: TSource) => boolean | Promise<boolean>) {
  }

  *[Symbol.iterator](): Iterator<TSource> {
    if (typeof this.elements[Symbol.iterator] !== 'function') {
      throw Error('Missing @@iterator')
    }

    let checkPredicate = true
    for (const element of this.elements as Iterable<TSource>) {
      if (!(checkPredicate && this.predicate(element))) {
        checkPredicate = false
        yield element
      }
    }
  }

  async *[Symbol.asyncIterator](): AsyncIterator<TSource> {
    let checkPredicate = true
    for await (const element of this.elements) {
      if (!(checkPredicate && await this.predicate(element))) {
        checkPredicate = false
        yield element
      }
    }
  }

  *[elementsSymbol](): IterableIterator<Iterable<TSource> | AsyncIterable<TSource>> {
    yield this.elements
  }

  toString(): string {
    return `${SkipWhile.name} (predicate: ${this.predicate})`
  }
}
