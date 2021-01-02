import { elementsSymbol, ElementsWrapper } from '../element-wrapper'

export class Memoized<TSource> implements ElementsWrapper<TSource> {
  private cache: (Promise<IteratorResult<TSource>> | IteratorResult<TSource>)[] = []
  private done = false
  private it: Iterator<TSource> | AsyncIterator<TSource>

  constructor(private readonly iterable: Iterable<TSource> | AsyncIterable<TSource>) {
  }

  *[elementsSymbol](): IterableIterator<Iterable<TSource> | AsyncIterable<TSource>> {
    yield this.iterable
  }

  *[Symbol.iterator](): IterableIterator<TSource> {
    if (typeof this.iterable[Symbol.iterator] !== 'function' && typeof this.iterable[Symbol.asyncIterator] !== 'function') {
      throw Error('Expected @@iterator or @@asyncIterator')
    }

    if (this.done) {
      for (const el of this.cache) {
        const res = (el as IteratorResult<TSource>)
        if (res.done) {
          return
        }
        yield res.value
      }
    }

    if (!this.it) {
      this.it = this.iterable[Symbol.iterator]()
    }

    let index = 0
    while (true) {
      if (index >= this.cache.length) {
        const result = this.it.next() as IteratorYieldResult<TSource>
        this.done = result.done
        this.cache.push(result)
      }

      const res = this.cache[index] as IteratorYieldResult<TSource>
      if (res.done) {
        break
      }

      index++
      yield res.value
    }
  }

  async *[Symbol.asyncIterator](): AsyncIterableIterator<TSource> {
    if (typeof this.iterable[Symbol.iterator] !== 'function' && typeof this.iterable[Symbol.asyncIterator] !== 'function') {
      throw Error('Expected @@iterator or @@asyncIterator')
    }

    if (this.done) {
      for (const el of this.cache) {
        const result = await (el as Promise<IteratorResult<TSource>>)
        if (result.done) {
          return
        }
        yield result.value
      }
    }

    if (!this.it) {
      this.it = (this.iterable[Symbol.asyncIterator]() || this.iterable[Symbol.iterator]())
    }

    let index = 0
    while (true) {
      if (index >= this.cache.length) {
        console.log('get next')
        const result = this.it.next() as Promise<IteratorResult<TSource, any>>
        this.cache.push(result)
      }

      const res = await this.cache[index]
      this.done = res.done

      if (res.done) {
        return
      }

      index++
      yield res.value
    }
  }

  toString(): string {
    return `${Memoized.name})`
  }
}
