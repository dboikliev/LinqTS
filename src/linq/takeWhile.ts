namespace Linq {
    export class TakeWhile<TSource> extends Linqable<TSource> {
        private _elements: Iterable<TSource>;
        private _predicate: (element: TSource) => boolean;

        constructor(elements: Iterable<TSource>, predicate: (element: TSource) => boolean) {
            super();
            this._elements = elements;
            this._predicate = predicate;
        }

        *[Symbol.iterator](): Iterator<TSource> {
            for (let element of this._elements) {
                if (!this._predicate(element)) {
                    break;
                }
                yield element;
            }
        }
    }
}