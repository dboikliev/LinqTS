import { TcpSocketConnectOpts } from 'net'
import { elementsSymbol, ElementsWrapper } from '../element-wrapper'

export class Cartesian<TFirst, TSecond> implements ElementsWrapper<TFirst | TSecond> {
  private cacheFirst = new Map<number, Promise<IteratorResult<TFirst>> | IteratorResult<TFirst>>()
  private cacheSecond = new Map<number, Promise<IteratorResult<TSecond>> | IteratorResult<TSecond>>()

  constructor(private readonly first: Iterable<TFirst> | AsyncIterable<TFirst>, 
    private readonly second: Iterable<TSecond> | AsyncIterable<TSecond>) {
  }

  *[elementsSymbol](): IterableIterator<Iterable<TFirst | TSecond> | AsyncIterable<TFirst | TSecond>> {
    yield this.first
    yield this.second
  }

  *[Symbol.iterator](): IterableIterator<[TFirst, TSecond]> {
    if (typeof this.first[Symbol.iterator] !== 'function') {
      throw Error('Expected @@iterator')
    }

    let firstIndex = 0
    let secondIndex = 0
    const itFirst = this.first[Symbol.iterator]() as Iterator<TFirst>
    const itSecond = this.second[Symbol.iterator]() as Iterator<TSecond>
    let row = 0
    let currentRow = 0
    let currentCol = 0
    while (true) {
      let first
      if (this.cacheFirst.has(firstIndex)) {
        first = this.cacheFirst.get(firstIndex)
      } else {
        const result = itFirst.next()
        this.cacheFirst.set(firstIndex, result)
        if (result.done) {
          currentRow = 0
          return
        }
        first = result
      }

      let second
      if (this.cacheSecond.has(secondIndex)) {
        second = this.cacheSecond.get(secondIndex)
      } else {
        const result = itSecond.next()
        if (!result.done) {
          this.cacheSecond.set(secondIndex, result)
          second = result
        } else {
          // currentCol = 0
        }
      }

      yield [first.value, second.value]

      if (currentRow === 0) {
        currentCol = 0
        currentRow = row + 1
        row++
      } else {
        currentRow--
        currentCol++
      }


      firstIndex = currentRow
      secondIndex = currentCol
    }
  }

  async *[Symbol.asyncIterator](): AsyncIterableIterator<[TFirst, TSecond]> {
    if (typeof this.first[Symbol.iterator] !== 'function' && typeof this.first[Symbol.asyncIterator] !== 'function') {
      throw Error('Expected @@iterator or @@asyncIterator')
    }

    let firstIndex = 0
    let secondIndex = 0
    const itFirst = (typeof this.first[Symbol.asyncIterator] === 'function' && this.first[Symbol.asyncIterator]() || typeof this.first[Symbol.iterator] === 'function' && this.first[Symbol.iterator]()) as AsyncIterator<TFirst>
    const itSecond = (typeof this.second[Symbol.asyncIterator] === 'function' && this.second[Symbol.asyncIterator]() || typeof this.second[Symbol.iterator] === 'function' && this.second[Symbol.iterator]()) as AsyncIterator<TSecond>

    let row = 0
    let currentRow = 0
    let currentCol = 0
    while (true) {
      let first: Promise<IteratorResult<TFirst>>
      if (this.cacheFirst.has(firstIndex)) {
        first = this.cacheFirst.get(firstIndex) as Promise<IteratorResult<TFirst>>
      } else {
        const result = itFirst.next()
        this.cacheFirst.set(firstIndex, result)
        first = result
      }

      let second: Promise<IteratorResult<TSecond>>
      if (this.cacheSecond.has(secondIndex)) {
        second = this.cacheSecond.get(secondIndex) as Promise<IteratorResult<TSecond>>
      } else {
        const result = itSecond.next()
        this.cacheSecond.set(secondIndex, result)
        second = result
      }

      if (currentRow === 0) {
        currentCol = 0
        currentRow = row + 1
        row++
      }

      currentRow--
      currentCol++

      const f = (await first)
      const s = (await second)

      if (f.done) {
        currentRow = 0
        continue
      }

      if (s.done) {
        currentCol = 0
        continue
      }

      yield [f.value, s.value]

      firstIndex = currentRow
      secondIndex = currentCol
    }
  }

  toString(): string {
    return `${Cartesian.name})`
  }
}
