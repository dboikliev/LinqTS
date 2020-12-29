import { elementsSymbol, ElementsWrapper } from '../element-wrapper'

export class Ordered<TSource> implements ElementsWrapper<TSource> {
  constructor(private elements: Iterable<TSource> | AsyncIterable<TSource>,
    private comparer: (left: TSource, right: TSource) => number) {
  }

  *[Symbol.iterator](): IterableIterator<TSource> {
    if (typeof this.elements[Symbol.iterator] !== 'function') {
      throw Error('Missing @@iterator')
    }

    const sorted = []

    for (const element of this.elements as Iterable<TSource>) {
      sorted.push(element)
    }

    sorted.sort(this.comparer)

    yield* sorted
  }

  async *[Symbol.asyncIterator](): AsyncIterableIterator<TSource> {
    const sorted = []

    for await (const element of this.elements) {
      sorted.push(element)
    }

    sorted.sort(this.comparer)

    yield* sorted
  }

  static from<T>(elements: Iterable<T> | AsyncIterable<T>, selector: (elemment: T) => number | string, isAscending: boolean): Ordered<T> {
    return new Ordered(elements, (left, right) => this.compareWithSelector(left, right, selector, isAscending))
  }

  from(selector: (elemment: TSource) => number | string, isAscending: boolean): Ordered<TSource> {
    return new Ordered(this.elements, this.nestComparisons(selector, isAscending))
  }

  private nestComparisons(selector: (elemment: TSource) => number | string, isAscending: boolean) {
    return (left: TSource, right: TSource) => {
      const firstComparison = this.comparer(left, right)
      if (firstComparison === 0) {
        return Ordered.compareWithSelector(left, right, selector, isAscending)
      }
      return firstComparison
    }
  }

  private static compareWithSelector<T>(left: T, right: T, selector: (element: T) => number | string, isAscending: boolean) {
    const direction = isAscending ? 1 : -1
    const a = selector(left)
    const b = selector(right)

    if (a > b) { return direction }

    if (a < b) { return -direction }

    return 0
  }

  *[elementsSymbol](): IterableIterator<Iterable<TSource> | AsyncIterable<TSource>> {
    yield this.elements
  }

  toString(): string {
    return `${Ordered.name}`
  }
}
