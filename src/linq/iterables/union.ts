import { elementsSymbol, ElementsWrapper } from '../element-wrapper'

export class Union<TSource> implements ElementsWrapper<TSource> {
  constructor(private left: Iterable<TSource>,
    private right: Iterable<TSource>) {
  }

  *[Symbol.iterator](): IterableIterator<TSource> {
    const set = new Set(this.left)

    for (const element of set) {
      yield element
    }

    for (const element of this.right) {
      if (!set.has(element)) {
        set.add(element)
        yield element
      }
    }
  }

  *[elementsSymbol](): IterableIterator<Iterable<TSource>> {
    yield this.left
    yield this.right
  }

  toString(): string {
    return `${Union.name}`
  }
}
