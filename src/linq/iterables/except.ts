import { elementsSymbol, ElementsWrapper } from '../element-wrapper'

export class Except<TSource> implements ElementsWrapper<TSource>, Iterable<TSource> {
  constructor(private left: Iterable<TSource>,
    private right: Iterable<TSource>) {
  }

  *[Symbol.iterator](): IterableIterator<TSource> {
    const set = new Set(this.right)
    for (const element of this.left) {
      if (!set.has(element)) {
        yield element
      }
    }
  }

  *[elementsSymbol](): IterableIterator<Iterable<TSource>> {
    yield this.left
    yield this.right
  }

  toString(): string {
    return Except.name
  }
}
