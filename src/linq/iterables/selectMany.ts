import { elementsSymbol, ElementsWrapper } from '../element-wrapper'
import { SelectManyResult } from '../linqable'
import { SelectManyAsyncResult } from '../linqableAsync'

export class SelectMany<TSource, TResult> implements ElementsWrapper<TSource>, Iterable<SelectManyResult<TResult>>, AsyncIterable<SelectManyAsyncResult<TResult>> {
  constructor(private elements: Iterable<TSource> | AsyncIterable<TSource>,
    private selector: (element: TSource) => TResult | Promise<TResult>) {
  }

  *[Symbol.iterator](): IterableIterator<SelectManyResult<TResult>> {
    if (!isSyncIterable(this.elements)) {
      throw Error('Missing @@iterator')
    }

    for (const element of this.elements) {
      const innerElements = this.selector(element) 
      if (isSyncIterable<TResult>(innerElements)) {
        for (const element of innerElements) {
          yield element as SelectManyResult<TResult>
        }
      } else {
        yield innerElements as SelectManyResult<TResult>
      }
    }
  }

  async *[Symbol.asyncIterator](): AsyncIterableIterator<SelectManyAsyncResult<TResult>> {
    for await (const element of this.elements) {
      const innerElements = await this.selector(element)
      if (isIterable(innerElements)) {
        for await (const element of innerElements) {
          yield element as SelectManyAsyncResult<TResult>
        }
      } else {
        yield innerElements as SelectManyAsyncResult<TResult>
      }
    }
  }

  *[elementsSymbol](): IterableIterator<Iterable<TSource> | AsyncIterable<TSource>> {
    yield this.elements
  }

  toString(): string {
    return `${SelectMany.name} (selector: ${this.selector})`
  }
}

function isSyncIterable<T>(obj): obj is Iterable<T> {
  return typeof obj[Symbol.iterator] === 'function'
}
function isIterable<T>(obj): obj is Iterable<T | Promise<T>> | AsyncIterable<T | Promise<T>>  {
  return typeof obj[Symbol.asyncIterator] === 'function' || typeof obj[Symbol.iterator] === 'function'
}