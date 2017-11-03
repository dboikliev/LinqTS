export class Union<TSource>  {
    private _left: Iterable<TSource>;
    private _right: Iterable<TSource>;

    constructor(left: Iterable<TSource>, right: Iterable<TSource>) {
        this._left = left;
        this._right = right;
    }

    *[Symbol.iterator]() {
        let set = new Set(this._left);

        for (let element of set) {
            yield element;
        }

        for (let element of this._right) {
            if (!set.has(element)) {
                set.add(element);
                yield element;
            }
        }
    }
}