export class List<TSource>  {
    private _elements: Iterable<any>;

    constructor(elements: Iterable<any>) {
        this._elements = elements;
    }

    *[Symbol.iterator](): Iterator<TSource> {
        yield* this._elements;
    }
}