namespace Linq {
    export class Distinct<TSource> extends Linqable<TSource> {
        private _elements: Iterable<TSource>;
        private _selector: (element: TSource) => any;

        constructor(elements: Iterable<TSource>, selector?: (element: TSource) => any) {
            super();
            this._elements = elements;
            this._selector = selector;
        }

        *[Symbol.iterator](): Iterator<TSource> {
            let map = new Map();
            for (let element of this._elements) {
                let key = this._selector(element);

                if (!map.has(key)) {
                    map.set(key, element);
                    yield element;
                }
            }
        }
    }
}