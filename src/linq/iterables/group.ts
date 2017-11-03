
export class Group<TKey, TValue>  {
    private _elements: Iterable<TValue>;
    private _selector: (element: TValue) => any;

    constructor(elements: Iterable<TValue>, selector: (element: TValue) => TKey) {
        this._elements = elements;
        this._selector = selector;
    }

    *[Symbol.iterator](): Iterator<[TKey, TValue[]]> {
        let groups = new Map<TKey, TValue[]>();

        for (let element of this._elements) {
            let key = this._selector(element);
            let group = groups.get(key) || [];
            group.push(element);
            groups.set(key, group);
        }

        yield* groups;
    }
}