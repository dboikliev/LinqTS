import { EqualityComparer, LinqMap } from '../collections'
import { elementsSymbol, ElementsWrapper } from '../element-wrapper'

export type Grouping<TKey, TValue> = [TKey, TValue[]]

export class GroupBy<TKey, TValue> implements ElementsWrapper<TValue>, Iterable<Grouping<TKey, TValue>> {
  constructor(private elements: Iterable<TValue>,
    private selector: (element: TValue) => TKey,
    private equalityComparer?: EqualityComparer<TKey>) {
  }

  *[Symbol.iterator](): IterableIterator<Grouping<TKey, TValue>> {
    const groups = this.equalityComparer ? new LinqMap<TKey, TValue[]>(this.equalityComparer) : new Map<TKey, TValue[]>()

    for (const element of this.elements) {
      const key = this.selector(element)
      const group = groups.get(key) || []
      group.push(element)
      groups.set(key, group)
    }

    yield* groups
  }

  *[elementsSymbol](): IterableIterator<Iterable<TValue>> {
    yield this.elements
  }

  toString(): string {
    return `${GroupBy.name} (selector: ${this.selector})`
  }
}
