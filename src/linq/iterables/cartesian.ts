import { elementsSymbol, ElementsWrapper } from '../element-wrapper'

export class Cartesian<TFirst, TSecond> implements ElementsWrapper<TFirst | TSecond> {
  private cacheFirst = new Map<number, Promise<IteratorResult<TFirst>> | IteratorResult<TFirst>>()
  private cacheSecond = new Map<number, Promise<IteratorResult<TSecond>> | IteratorResult<TSecond>>()

  constructor(private readonly first: Iterable<TFirst> | AsyncIterable<TFirst>,
    private readonly second: Iterable<TSecond> | AsyncIterable<TSecond>,
    private readonly preserveOrder: boolean = true) {
  }

  *[elementsSymbol](): IterableIterator<Iterable<TFirst | TSecond> | AsyncIterable<TFirst | TSecond>> {
    yield this.first
    yield this.second
  }

  *[Symbol.iterator](): IterableIterator<[TFirst, TSecond]> {
    if (typeof this.first[Symbol.iterator] !== 'function') {
      throw Error('Expected @@iterator')
    }

    if (this.preserveOrder) {
      for (const outer of this.first as Iterable<TFirst>) {
        for (const inner of this.second as Iterable<TSecond>) {
          yield [outer, inner]
        }
      }

      return
    }

    const itFirst = this.first[Symbol.iterator]() as Iterator<TFirst>
    const itSecond = this.second[Symbol.iterator]() as Iterator<TSecond>

    let firstIndex = 0
    let secondIndex = 0
    let row = 0
    let currentRow = 0
    let currentCol = 0
    let firstLen = 0
    let secondLen = 0
    while (true) {
      let first
      if (this.cacheFirst.has(firstIndex)) {
        first = this.cacheFirst.get(firstIndex)
      } else {
        const result = itFirst.next()
        first = result
        this.cacheFirst.set(firstIndex, result)
      }

      let second
      if (this.cacheSecond.has(secondIndex)) {
        second = this.cacheSecond.get(secondIndex)
      } else {
        const result = itSecond.next()
        second = result
        this.cacheSecond.set(secondIndex, result)
      }

      if (currentRow === 0) {
        currentCol = 0
        currentRow = ++row
      } else {
        currentRow--
        currentCol++
      }

      firstIndex = currentRow
      secondIndex = currentCol


      if (first.done && second.done) {
        break
      }

      if (first.done) {
        firstIndex = currentRow % firstLen
        continue
      } else {
        firstLen++
      }

      if (second.done) {
        secondIndex = currentCol % secondLen
        continue
      } else {
        secondLen++
      }

      yield [first.value, second.value]
    }
  }

  async *[Symbol.asyncIterator](): AsyncIterableIterator<[TFirst, TSecond]> {
    if (typeof this.first[Symbol.iterator] !== 'function' && typeof this.first[Symbol.asyncIterator] !== 'function') {
      throw Error('Expected @@iterator or @@asyncIterator')
    }

    if (this.preserveOrder) {
      for await (const outer of this.first) {
        for await (const inner of this.second) {
          yield [outer, inner]
        }
      }

      return
    }

    const itFirst = (typeof this.first[Symbol.asyncIterator] === 'function' && this.first[Symbol.asyncIterator]() || typeof this.first[Symbol.iterator] === 'function' && this.first[Symbol.iterator]()) as AsyncIterator<TFirst>
    const itSecond = (typeof this.second[Symbol.asyncIterator] === 'function' && this.second[Symbol.asyncIterator]() || typeof this.second[Symbol.iterator] === 'function' && this.second[Symbol.iterator]()) as AsyncIterator<TSecond>
    
    let firstIndex = 0
    let secondIndex = 0
    let row = 0
    let currentRow = 0
    let currentCol = 0
    let firstLen = 0
    let secondLen = 0
    while (true) {
      let firstResult: Promise<IteratorResult<TFirst>>
      if (this.cacheFirst.has(firstIndex)) {
        firstResult = this.cacheFirst.get(firstIndex) as Promise<IteratorResult<TFirst>>
      } else {
        const result = itFirst.next()
        this.cacheFirst.set(firstIndex, result)
        firstResult = result
      }

      let secondResult: Promise<IteratorResult<TSecond>>
      if (this.cacheSecond.has(secondIndex)) {
        secondResult = this.cacheSecond.get(secondIndex) as Promise<IteratorResult<TSecond>>
      } else {
        const result = itSecond.next()
        this.cacheSecond.set(secondIndex, result)
        secondResult = result
      }

      if (currentRow === 0) {
        currentCol = 0
        currentRow = ++row
      } else {
        currentRow--
        currentCol++
      }

      firstIndex = currentRow
      secondIndex = currentCol

      const [first, second] = await Promise.all([firstResult, secondResult])

      if (first.done && second.done) {
        break
      }

      if (first.done) {
        firstIndex = currentRow % firstLen
        continue
      } else {
        firstLen++
      }

      if (second.done) {
        secondIndex = currentCol % secondLen
        continue
      } else {
        secondLen++
      }

      yield [first.value, second.value]
    }
  }

  toString(): string {
    return `${Cartesian.name})`
  }
}
