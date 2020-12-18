import { elementsSymbol, ElementsWrapper } from '../element-wrapper'

export class Zip<TLeft, TRight, TResult> implements ElementsWrapper<TLeft | TRight> {
  constructor(private left: Iterable<TLeft>,
    private right: Iterable<TRight>,
    private selector: (left: TLeft, right: TRight) => TResult) {
  }

  *[Symbol.iterator](): IterableIterator<TResult> {
    const iterLeft = this.left[Symbol.iterator]()
    const iterRight = this.right[Symbol.iterator]()

    let iterationLeft = iterLeft.next()
    let iterationRight = iterRight.next()

    while (!iterationLeft.done && !iterationRight.done) {
      yield this.selector(iterationLeft.value, iterationRight.value);
      iterationLeft = iterLeft.next()
      iterationRight = iterRight.next()
    }
  }

  *[elementsSymbol](): IterableIterator<Iterable<TLeft> | Iterable<TRight>> {
    yield this.left
    yield this.right
  }

  toString(): string {
    return `${Zip.name} (selector: ${this.selector})`
  }
}
