import { elementsSymbol, ElementsWrapper } from '../element-wrapper'

export class Concat<TSource> implements ElementsWrapper<TSource>, Iterable<TSource> {
  constructor(private first: Iterable<TSource>,
    private second: Iterable<TSource>) {
  }

  *[Symbol.iterator](): IterableIterator<TSource> {
    yield* this.first
    yield* this.second
  }

  *[elementsSymbol](): IterableIterator<Iterable<TSource>> {
    yield this.first
    yield this.second
  }

  toString(): string {
    return Concat.name
  }
}
