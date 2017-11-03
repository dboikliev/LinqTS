
export class Group<TKey, TValue>  {
    constructor(private elements: Iterable<TValue>, 
                private selector: (element: TValue) => TKey) {
    }

    *[Symbol.iterator](): Iterator<[TKey, TValue[]]> {
        let groups = new Map<TKey, TValue[]>();

        for (let element of this.elements) {
            let key = this.selector(element);
            let group = groups.get(key) || [];
            group.push(element);
            groups.set(key, group);
        }

        yield* groups;
    }
}