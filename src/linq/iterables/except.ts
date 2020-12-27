import { EqualityComparer, LinqSet } from '../collections'
import { elementsSymbol, ElementsWrapper } from '../element-wrapper'

export class Except<TSource> implements ElementsWrapper<TSource>, Iterable<TSource> {
  constructor(private left: Iterable<TSource>,
    private right: Iterable<TSource>,
    private equalityComparer?: EqualityComparer<TSource>) {
  }

  *[Symbol.iterator](): IterableIterator<TSource> {
    const set = this.equalityComparer ? new LinqSet(this.equalityComparer, this.right) : new Set(this.right)
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
