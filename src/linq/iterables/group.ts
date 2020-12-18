import { elementsSymbol, ElementsWrapper } from '../element-wrapper'

export class Group<TKey, TValue> implements ElementsWrapper<TValue> {
  constructor(private elements: Iterable<TValue>,
    private selector: (element: TValue) => TKey) {
  }

  *[Symbol.iterator](): IterableIterator<[TKey, TValue[]]> {
    const groups = new Map<TKey, TValue[]>()

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
    return `${Group.name} (selector: ${this.selector})`
  }
}
