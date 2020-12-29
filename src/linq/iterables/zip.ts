import { elementsSymbol, ElementsWrapper } from '../element-wrapper'

export class Zip<TLeft, TRight, TResult> implements ElementsWrapper<TLeft | TRight> {
  constructor(private left: Iterable<TLeft> | AsyncIterable<TLeft>,
    private right: Iterable<TRight> | AsyncIterable<TRight>,
    private selector: (left: TLeft, right: TRight) => TResult) {
  }

  *[Symbol.iterator](): IterableIterator<TResult> {
    if (typeof this.left[Symbol.iterator] !== 'function' ||
      typeof this.right[Symbol.iterator] !== 'function') {
      throw Error('Missing @@iterator')
    }

    const iterLeft = this.left[Symbol.iterator]()
    const iterRight = this.right[Symbol.iterator]()

    let iterationLeft = iterLeft.next()
    let iterationRight = iterRight.next()

    while (!iterationLeft.done && !iterationRight.done) {
      yield this.selector(iterationLeft.value, iterationRight.value)
      iterationLeft = iterLeft.next()
      iterationRight = iterRight.next()
    }
  }

  async * [Symbol.asyncIterator](): AsyncIterableIterator<TResult> {
    const iterLeft = (this.left[Symbol.asyncIterator] ? this.left[Symbol.asyncIterator]() : this.left[Symbol.iterator]()) as AsyncIterableIterator<TLeft>
    const iterRight = (this.right[Symbol.asyncIterator] ? this.right[Symbol.asyncIterator]() : this.right[Symbol.iterator]()) as AsyncIterableIterator<TRight>

    let [iterationLeft, iterationRight] = await Promise.all([iterLeft.next(), iterRight.next()])

    while (!iterationLeft.done && !iterationRight.done) {
      yield this.selector(iterationLeft.value, iterationRight.value);
      [iterationLeft, iterationRight] = await Promise.all([iterLeft.next(), iterRight.next()])
    }
  }

  *[elementsSymbol](): IterableIterator<Iterable<TLeft> | Iterable<TRight> | AsyncIterable<TLeft> | AsyncIterable<TRight>> {
    yield this.left
    yield this.right
  }

  toString(): string {
    return `${Zip.name} (selector: ${this.selector})`
  }
}
