import { elementsSymbol, ElementsWrapper } from '../element-wrapper'

export class Join<TLeft, TRight, TResult> implements ElementsWrapper<TLeft | TRight> {
  constructor(private leftElements: Iterable<TLeft>,
    private rightElements: Iterable<TRight>,
    private leftSelector: (element: TLeft) => unknown,
    private rightSelector: (element: TRight) => unknown,
    private resultSelector: (left: TLeft, right: TRight) => TResult) {
  }

  *[Symbol.iterator](): IterableIterator<TResult> {
    const groups = new Map<unknown, TRight[]>()

    for (const element of this.rightElements) {
      const key = this.rightSelector(element)
      const group = groups.get(key) || []
      group.push(element)
      groups.set(key, group)
    }

    for (const left of this.leftElements) {
      const leftKey = this.leftSelector(left)
      const group = groups.get(leftKey) || []

      for (const match of group) {
        yield this.resultSelector(left, match)
      }
    }
  }

  *[elementsSymbol](): IterableIterator<Iterable<TLeft> | Iterable<TRight>> {
    yield this.leftElements
    yield this.rightElements
  }

  toString(): string {
    return `${Join.name} (left: ${this.leftSelector}, right: ${this.rightSelector})`
  }
}
