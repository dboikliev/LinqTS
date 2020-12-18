import { elementsSymbol, ElementsWrapper } from "../element-wrapper";

export class TakeWhile<TSource> implements ElementsWrapper  {
    constructor(private elements: Iterable<TSource>, 
                private predicate: (element: TSource) => boolean) {
    }

    *[Symbol.iterator](): Iterator<TSource> {
        for (let element of this.elements) {
            if (!this.predicate(element)) {
                break
            }
            yield element
        }
    }

    
    *[elementsSymbol](): Iterable<Iterable<TSource>> {
        yield this.elements;
    }

    toString(): string {
        return `${TakeWhile.name} (predicate: ${this.predicate})`;
    }
}