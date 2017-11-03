export class Select<TSource, TResult>  {
    private _elements: Iterable<TSource>;
    private _selector: (element: TSource) => TResult;

    constructor(elements: Iterable<TSource>, selector: (element: TSource) => TResult) {
        this._elements = elements;
        this._selector = selector;
    }

    *[Symbol.iterator](): Iterator<TResult> {
        for (let element of this._elements) {
            yield this._selector(element);
        }
    }
}