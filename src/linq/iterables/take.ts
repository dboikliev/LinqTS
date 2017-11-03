export class Take<TSource>  {
    private _elements: Iterable<TSource>;
    private _count: number;

    constructor(elements: Iterable<TSource>, count: number) {
        this._elements = elements;
        this._count = count;
    }

    *[Symbol.iterator](): Iterator<TSource> {
        let current = 0;
        for (let element of this._elements) {
            if (current >= this._count) {
                return;
            }
            current++;
            yield element;
        }
    }
}