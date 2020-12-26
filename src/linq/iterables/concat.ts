import { elementsSymbol, ElementsWrapper } from '../element-wrapper'

export class Concat<TSource, TOther> implements ElementsWrapper<TSource | TOther>, Iterable<TSource | TOther> {
  constructor(private first: Iterable<TSource>,
    private second: Iterable<TOther>) {
  }

  *[Symbol.iterator](): IterableIterator<TSource | TOther> {
    yield* this.first
    yield* this.second
  }

  *[elementsSymbol](): IterableIterator<Iterable<TSource | TOther>> {
    yield this.first
    yield this.second
  }

  toString(): string {
    return Concat.name
  }
}
