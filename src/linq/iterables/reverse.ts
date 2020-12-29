import { elementsSymbol, ElementsWrapper } from '../element-wrapper'

export class Reverse<TSource> implements ElementsWrapper<TSource> {
  constructor(private elements: Iterable<TSource> | AsyncIterable<TSource>) {
  }

  *[Symbol.iterator](): IterableIterator<TSource> {
    if (typeof this.elements[Symbol.iterator] !== 'function') {
      throw Error('Missing @@iterator')
    }

    const stack: TSource[] = []

    for (const element of this.elements as Iterable<TSource>) {
      stack.push(element)
    }

    while (stack.length) {
      yield stack.pop()
    }
  }

  async *[Symbol.asyncIterator](): AsyncIterableIterator<TSource> {
    const stack: TSource[] = []

    for await (const element of this.elements as Iterable<TSource>) {
      stack.push(element)
    }

    while (stack.length) {
      yield stack.pop()
    }
  }


  *[elementsSymbol](): IterableIterator<Iterable<TSource> | AsyncIterable<TSource>> {
    yield this.elements
  }

  toString(): string {
    return Reverse.name
  }
}
