import { Linqable, Sequence } from "./linqable"
import { elementsSymbol, ElementsWrapper, isWrapper, unwrap } from "./element-wrapper";

/**
 * Wraps an interable into an object which supports queries.
 * @param {Iterable<T>} iterable The sequence which will be queried.
 * @returns {Linqable<number>} An object with support for queries.
 */
export function linq<T>(iterable: Iterable<T>): Linqable<T> {
    return new Linqable(unwrap(iterable))
}

/**
 * Generates a sequence of numbers from start to end (if specified), increasing by the speficied step.
 * @param  {number} start The beginning of the sequence. 0 by default.
 * @param  {number} step The ammount to increment by on each iteration. 1 by default.
 * @param  {number} end The end of the sequence. Infinity by default.
 * @returns {Linqable<number>}
 */
export function seq(start: number = 0, step: number = 1, end: number = Infinity): Linqable<number> {
    return new Sequence(start, step, end);
}

/**
 * The identity function (x => x). It takes an element and returns it.
 * @param  {T} element The element to return.
 * @returns {T} The element which was passed as a parameter.
 */
export function id<T>(element: T): T {
    return element
}

export function prettyPrint<T>(linqable: Linqable<T>) {
    return print(linqable);
}

function print<T>(linqable: ElementsWrapper | Iterable<T>, indent = '', isLast = true) {
    if (!linqable) {
        return;
    }
    const childSymbol = isLast ? '└──' : '├──';
    console.log(indent + childSymbol + linqable.toString().replace(/(\r?\n|\r)\s*/g, ''))
    if (isWrapper(linqable)) {
        const sources = Array.from(linqable[elementsSymbol]());

        for (let i = 0; i < sources.length; i++) {
            const source = sources[i];
            print(source, indent + (isLast ? '    ' : '|   '), i == sources.length - 1);
        }
    }
}
