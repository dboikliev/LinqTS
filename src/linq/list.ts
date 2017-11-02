namespace Linq {
    export class List<TSource> extends Linqable<TSource> {
        private _elements: Iterable<any>;

        constructor(elements: Iterable<any>) {
            super();
            this._elements = elements;
        }

        *[Symbol.iterator](): Iterator<TSource> {
            yield* this._elements;
        }
    }
}