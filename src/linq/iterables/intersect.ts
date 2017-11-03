export class Intersect<TSource>  {
    private _left: Iterable<TSource>;
    private _right: Iterable<TSource>;

    constructor(left: Iterable<TSource>, right: Iterable<TSource>) {
        this._left = left;
        this._right = right;
    }

    *[Symbol.iterator]() {
        let set = new Set(this._right);
        for (let element of this._left) {
            if (set.has(element)) {
                yield element;
            }
        }
    }
}