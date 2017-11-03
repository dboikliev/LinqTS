export class Where<TSource>  {
    private _elements: Iterable<TSource>;
    private _predicate: (element: TSource) => boolean;

    constructor(elements: Iterable<TSource>, predicate: (element: TSource) => boolean) {
        this._elements = elements;
        this._predicate = predicate;
    }

    *[Symbol.iterator](): Iterator<TSource> {
        for (let element of this._elements) {
            if (this._predicate(element)) {
                yield element;
            }
        }
    }
}