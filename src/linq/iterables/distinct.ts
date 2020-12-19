import { elementsSymbol, ElementsWrapper } from '../element-wrapper'

export class Distinct<TSource> implements ElementsWrapper<TSource> {
  constructor(private elements: Iterable<TSource>,
    private equalityComparer: (first: TSource, second: TSource) => boolean) {
  }

  *[Symbol.iterator](): IterableIterator<TSource> {
    const set = [];
    for (const element of this.elements) {
      if (!set.some(el => this.equalityComparer(element, el))) {
        set.push(element)
      }
    }
    yield* set
  }

  *[elementsSymbol](): IterableIterator<Iterable<TSource>> {
    yield this.elements
  }

  toString(): string {
    return `${Distinct.name} (comparer: ${this.equalityComparer})}`
  }
}
