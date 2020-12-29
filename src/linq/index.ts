import { Linqable, extractSync } from './linqable'
import { Sequence } from './iterables/sequence'
import { elementsSymbol, ElementsWrapper, isWrapper } from './element-wrapper'
import { AsyncLinqable, extractAsync } from './linqableAsync'

export type SyncSource<T> = Iterable<T> | (() => Generator<T>)
export type AsyncSource<T> = AsyncIterable<T> | (() => AsyncGenerator<T>)

/**
 * Wraps an iterable or a generator into an iterator object which supports queries.
 * @param {Iterable<T>} iterable - An iterable or generator which will be queried.
 * @returns {Linqable<T>} An object with support for queries.
 */
export function linq<T>(iterable: Linqable<T> | SyncSource<T>): Linqable<T> {
  return new Linqable(extractSync(iterable))
}

/**
 * Wraps an iterable into an async iterator object which supports queries.
 * @param {Iterable<T>} iterable - An iterable or (async) generator which will be queried.
 * @returns {AsyncLinqable<T>} An object with support for queries.
 */
export function alinq<T>(iterable: Linqable<T> | SyncSource<T> | AsyncSource<T>): AsyncLinqable<T> {
  return new AsyncLinqable(extractAsync(iterable))
}

/**
 * Generates a sequence of numbers from start to end (if specified), increasing by the speficied step.
 * @param  {number} start - The beginning of the sequence. 0 by default.
 * @param  {number} step - The ammount to increment by on each iteration. 1 by default.
 * @param  {number} end - The end of the sequence. Infinity by default.
 * @returns {Linqable<number>}
 */
export function seq(start = 0, step = 1, end = Infinity): Linqable<number> {
  return new Linqable(new Sequence(start, step, end))
}

/**
 * Generates a sequence of the repeated element.
 * Will repeat the element infinitetly if called withouth a count.
 * @param element - The element to repeat.
 * @param count - The number of times to repeat the element.
 */
export function repeat<T>(element: T, count = Infinity): Linqable<T> {
  return linq([element]).repeat(count)
}


/**
 * The identity function (x => x). It takes an element and returns it.
 * @param  {T} element - The element to return.
 * @returns {T} The element which was passed as a parameter.
 */
export function id<T>(element: T): T {
  return element
}

/**
 * Prints a tree-like representation of the linqable structure to the console.
 * @param linqable - The linqable a object to print.
 */
export function print<T>(linqable: Linqable<T>): void {
  printTree<T>(linqable)
}

function printTree<T>(linqable: ElementsWrapper<T> | Iterable<T> | AsyncIterable<T>, indent = '', isLast = true): void {
  if (!linqable) {
    return
  }
  const childSymbol = isLast ? '└──' : '├──'
  const prefix = indent.length === 0 ? '' : indent + childSymbol
  console.log(prefix + linqable.toString().replace(/(\r?\n|\r)\s*/g, ''))
  if (isWrapper(linqable)) {
    const sources = Array.from(linqable[elementsSymbol]())

    for (let i = 0; i < sources.length; i++) {
      const source = sources[i]
      printTree(source, indent + (isLast ? '    ' : '|   '), i === sources.length - 1)
    }
  }
}
