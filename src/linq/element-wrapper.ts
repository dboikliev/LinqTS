export const elementsSymbol: unique symbol = Symbol()

export interface ElementsWrapper<T> {
  [elementsSymbol](): IterableIterator<Iterable<T>>
}

export function isWrapper<T>(obj: ElementsWrapper<T> | Iterable<T>): obj is ElementsWrapper<T> {
  return typeof obj[elementsSymbol] === 'function'
}