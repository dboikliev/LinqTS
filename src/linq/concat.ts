namespace Linq {
    export class Concat<TSource> extends Linqable<TSource> {
        private _first: Iterable<TSource>;
        private _second: Iterable<TSource>;

        constructor(first: Iterable<TSource>, second: Iterable<TSource>) {
            super();
            this._first = first;
            this._second = second;
        }

        *[Symbol.iterator](): Iterator<TSource> {
            yield* this._first;
            yield* this._second;
        }
    }
}