export const elementsSymbol: unique symbol = Symbol()

export interface ElementsWrapper<T> {
  [elementsSymbol](): IterableIterator<Iterable<T>>
}

export function isWrapper<T>(obj: ElementsWrapper<T> | Iterable<T>): obj is ElementsWrapper<T> {
  return typeof obj[elementsSymbol] === 'function'
}

export function unwrap<T>(obj: ElementsWrapper<T> | Iterable<T>): Iterable<T> {
  if (isWrapper(obj)) {
    const sources = obj[elementsSymbol]()
    return sources.next().value
  }
  return obj as Iterable<T>
}
