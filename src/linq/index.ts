import { Linqable } from "./linqable";

/**
 * Wraps an interable into an object which supports queries.
 * @param {Iterable<T>} iterable The sequence which will be queried.
 * @returns {ble<number>} An object with support for queries.
 */
export function linq<T>(iterable: Iterable<T> | number | string | object): Linqable<T> {
    return new Linqable<T>(iterable as Iterable<T>);
}

/**
 * Generates a sequence of numbers from start to end (if specified), increasing by the speficied step.
 * @param  {number} start The beginning of the sequence. 0 by default.
 * @param  {number} step The ammount to increment by on each iteration. 1 by default.
 * @param  {number} end The end of the sequence. Infinity by default.
 * @returns {ble<number>}
 */
export function seq(start: number = 0, step: number = 1, end: number = Infinity): Linqable<number> {
    function* sequenceGenerator() {
        for (let i = start; end === Infinity || i <= end; i += step) {
            yield i;
        }
    }

    return linq(sequenceGenerator());
}

/**
 * The identity function (x => x). It takes an element and returns it.
 * @param  {T} element The element to return.
 * @returns {T} The element which was passed as a parameter.
 */
export function id<T>(element: T): T {
    return element;
}