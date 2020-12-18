import { elementsSymbol, ElementsWrapper } from "../element-wrapper"

export class Group<TKey, TValue> implements ElementsWrapper  {
    constructor(private elements: Iterable<TValue>, 
                private selector: (element: TValue) => TKey) {
    }

    *[Symbol.iterator](): Iterator<[TKey, TValue[]]> {
        let groups = new Map<TKey, TValue[]>()

        for (let element of this.elements) {
            let key = this.selector(element)
            let group = groups.get(key) || []
            group.push(element)
            groups.set(key, group)
        }

        yield* groups
    }

    *[elementsSymbol](): Iterable<Iterable<TValue>> {
        yield this.elements;
    }

    toString() {
        return `${Group.name} (selector: ${this.selector})`;
    }
}