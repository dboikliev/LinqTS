import { elementsSymbol, ElementsWrapper } from '../element-wrapper'

export class Scan<TSource, TResult> implements ElementsWrapper<TSource> {
  constructor(private readonly elements: Iterable<TSource> | AsyncIterable<TSource>,
    private readonly seed: TResult,
    private readonly accumulator: (accumulated: TResult, element: TSource, index: number) => TResult | Promise<TResult>) {
  }

  *[Symbol.iterator](): IterableIterator<TResult> {
    const iterator = typeof this.elements[Symbol.iterator] === 'function' && this.elements[Symbol.iterator]()

    let index = 0

    let accumulated = this.seed
    if (typeof this.seed === 'undefined') {
      let result = iterator.next()
      if (!result.done) {
        yield result.value
        let second = iterator.next()
        index++
        if (!second.done) {
          accumulated = this.accumulator(result.value, second.value, index++) as TResult
          yield accumulated
        }
      }
    }
    let result = iterator.next()
    while (!result.done) {
      accumulated = this.accumulator(accumulated, result.value, index++) as TResult
      yield accumulated
      result = iterator.next()
    }
  }

  async *[Symbol.asyncIterator](): AsyncIterableIterator<TResult> {
    const iterator = (typeof this.elements[Symbol.asyncIterator] === 'function' && this.elements[Symbol.asyncIterator]() ||
      typeof this.elements[Symbol.iterator] === 'function' && this.elements[Symbol.iterator]()) as IterableIterator<TSource> | AsyncIterableIterator<TSource>

    let index = 0

    let accumulated = this.seed
    if (typeof this.seed === 'undefined') {
      let result = await iterator.next()
      if (!result.done) {
        yield result.value
        let second = await iterator.next()
        index++
        if (!second.done) {
          accumulated = await this.accumulator(result.value, second.value, index++) as TResult
          yield accumulated
        }
      }
    }
    let result = await iterator.next()
    while (!result.done) {
      accumulated = await this.accumulator(accumulated, result.value, index++) as TResult
      yield accumulated
      result = await iterator.next()
    }
  }

  *[elementsSymbol](): IterableIterator<Iterable<TSource> | AsyncIterable<TSource>> {
    yield this.elements
  }

  toString(): string {
    return Scan.name
  }
}
