namespace Linq {
    export class SelectMany<TSource, TResult> extends Linqable<TResult> {
        private _elements: Iterable<TSource>;
        private _selector: (element: TSource) => Iterable<TResult>;

        constructor(elements: Iterable<TSource>, selector: (element: TSource) => Iterable<TResult>) {
            super();
            this._elements = elements;
            this._selector = selector;
        }

        *[Symbol.iterator](): Iterator<TResult> {
            for (let element of this._elements) {
                let innerElements = this._selector(element);
                yield* innerElements;
            }
        }
    }
}