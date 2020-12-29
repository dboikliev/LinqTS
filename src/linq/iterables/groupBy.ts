import { EqualityComparer, LinqMap } from '../collections'
import { elementsSymbol, ElementsWrapper } from '../element-wrapper'

export type Grouping<TKey, TValue> = [TKey, TValue[]]

export class GroupBy<TKey, TValue> implements ElementsWrapper<TValue>, Iterable<Grouping<TKey, TValue>> {
  constructor(private elements: Iterable<TValue> | AsyncIterable<TValue>,
    private selector: (element: TValue) => TKey | Promise<TKey>,
    private equalityComparer?: EqualityComparer<TKey>) {
  }

  *[Symbol.iterator](): IterableIterator<Grouping<TKey, TValue>> {
    if (typeof this.elements[Symbol.iterator] !== 'function') {
      throw Error('Missing @@iterator')
    }

    const groups = this.equalityComparer ? new LinqMap<TKey, TValue[]>(this.equalityComparer) : new Map<TKey, TValue[]>()

    for (const element of this.elements as Iterable<TValue>) {
      const key = this.selector(element) as TKey
      const group = groups.get(key) || []
      group.push(element)
      groups.set(key, group)
    }

    yield* groups
  }

  async * [Symbol.asyncIterator](): AsyncIterableIterator<Grouping<TKey, TValue>> {
    const groups = this.equalityComparer ? new LinqMap<TKey, TValue[]>(this.equalityComparer) : new Map<TKey, TValue[]>()

    for await (const element of this.elements) {
      const key = await this.selector(element)
      const group = groups.get(key) || []
      group.push(element)
      groups.set(key, group)
    }

    yield* groups
  }

  *[elementsSymbol](): IterableIterator<Iterable<TValue> | AsyncIterable<TValue>> {
    yield this.elements
  }

  toString(): string {
    return `${GroupBy.name} (selector: ${this.selector})`
  }
}
