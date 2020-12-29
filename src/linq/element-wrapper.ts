export const elementsSymbol: unique symbol = Symbol()

export interface ElementsWrapper<T> {
  [elementsSymbol](): IterableIterator<Iterable<T> | AsyncIterable<T>>
}

export function isWrapper<T>(obj: ElementsWrapper<T> | Iterable<T> | AsyncIterable<T>): obj is ElementsWrapper<T> {
  return typeof obj[elementsSymbol] === 'function'
}