import { elementsSymbol, ElementsWrapper } from '../element-wrapper'

export class Join<TLeft, TRight, TResult> implements ElementsWrapper<TLeft | TRight> {
  constructor(private leftElements: Iterable<TLeft> | AsyncIterable<TLeft>,
    private rightElements: Iterable<TRight> | AsyncIterable<TRight>,
    private leftSelector: (element: TLeft) => unknown,
    private rightSelector: (element: TRight) => unknown,
    private resultSelector: (left: TLeft, right: TRight) => TResult | Promise<TResult>) {
  }

  *[Symbol.iterator](): IterableIterator<TResult> {
    if (!this.leftElements[Symbol.iterator] || !this.rightElements[Symbol.iterator]) {
      throw Error('Missing @@iterator')
    }

    const groups = new Map<unknown, TRight[]>()

    for (const element of this.rightElements as Iterable<TRight>) {
      const key = this.rightSelector(element)
      const group = groups.get(key) || []
      group.push(element)
      groups.set(key, group)
    }

    for (const left of this.leftElements as Iterable<TLeft>) {
      const leftKey = this.leftSelector(left)
      const group = groups.get(leftKey) || []

      for (const match of group) {
        yield this.resultSelector(left, match) as TResult
      }
    }
  }

  async * [Symbol.asyncIterator](): AsyncIterableIterator<TResult> {
    const groups = new Map<unknown, TRight[]>()

    for await (const element of this.rightElements as Iterable<TRight>) {
      const key = await this.rightSelector(element)
      const group = groups.get(key) || []
      group.push(element)
      groups.set(key, group)
    }

    for await (const left of this.leftElements as Iterable<TLeft>) {
      const leftKey = await this.leftSelector(left)
      const group = groups.get(leftKey) || []

      for (const match of group) {
        yield await this.resultSelector(left, match)
      }
    }
  }

  *[elementsSymbol](): IterableIterator<(Iterable<TLeft> | Iterable<TRight>) | (AsyncIterable<TLeft> | AsyncIterable<TRight>)> {
    yield this.leftElements
    yield this.rightElements
  }

  toString(): string {
    return `${Join.name} (left: ${this.leftSelector}, right: ${this.rightSelector})`
  }
}
