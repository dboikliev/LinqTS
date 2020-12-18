import { elementsSymbol, ElementsWrapper } from "../element-wrapper";

export class Where<TSource> implements ElementsWrapper  {
    constructor(private elements: Iterable<TSource>, 
                private predicate: (element: TSource) => boolean) {
    }

    *[Symbol.iterator](): Iterator<TSource> {
        for (let element of this.elements) {
            if (this.predicate(element)) {
                yield element
            }
        }
    }

    *[elementsSymbol](): Iterable<Iterable<TSource>> {
        yield this.elements;
    }

    toString() {
        return `${Where.name} (predicate: ${this.predicate.toString()})`;
    }
}