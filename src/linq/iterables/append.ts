import { elementsSymbol, ElementsWrapper } from '../element-wrapper'

export class Concat<TSource> implements ElementsWrapper<TSource>, Iterable<TSource> {
  constructor(private first: Iterable<TSource> | AsyncIterable<TSource>,
    private second: Iterable<TSource> | AsyncIterable<TSource>) {
  }

  *[Symbol.iterator](): IterableIterator<TSource> {
    if (typeof this.first[Symbol.iterator] !== 'function' ||
      typeof this.second[Symbol.iterator] !== 'function') {
      throw Error('Missing @@iterator')
    }

    yield* this.first as Iterable<TSource>
    yield* this.second as Iterable<TSource>
  }

  async *[Symbol.asyncIterator](): AsyncIterableIterator<TSource> {
    yield* this.first
    yield* this.second
  }

  *[elementsSymbol](): IterableIterator<Iterable<TSource> | AsyncIterable<TSource>> {
    yield this.first
    yield this.second
  }

  toString(): string {
    return Concat.name
  }
}
