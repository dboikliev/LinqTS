import { elementsSymbol, ElementsWrapper } from '../element-wrapper'

export class Concat<TSource, TOther> implements ElementsWrapper<TSource | TOther>, Iterable<TSource | TOther> {
  constructor(private first: Iterable<TSource> | AsyncIterable<TSource>,
    private second: Iterable<TOther> | AsyncIterable<TOther>) {
  }

  *[Symbol.iterator](): IterableIterator<TSource | TOther> {
    if (typeof this.first[Symbol.iterator] !== 'function' || typeof this.second[Symbol.iterator] !== 'function' ) {
      throw Error('Missing @@iterator')
    }
    yield* this.first as Iterable<TSource>
    yield* this.second as Iterable<TOther>
  }

  async *[Symbol.asyncIterator](): AsyncIterableIterator<TSource | TOther> {
    yield* this.first
    yield* this.second
  }

  *[elementsSymbol](): IterableIterator<Iterable<TSource | TOther> | AsyncIterable<TSource | TOther>> {
    yield this.first
    yield this.second
  }

  toString(): string {
    return Concat.name
  }
}
