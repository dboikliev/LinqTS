import { elementsSymbol, ElementsWrapper } from "../element-wrapper";

export class Take<TSource> implements ElementsWrapper {
    constructor(private elements: Iterable<TSource>, 
                private count: number) {
    }

    *[Symbol.iterator](): Iterator<TSource> {
        let current = 0
        for (let element of this.elements) {
            if (current >= this.count) {
                return
            }
            current++
            yield element
        }
    }

    
    *[elementsSymbol](): Iterable<Iterable<TSource>> {
        yield this.elements;
    }

    toString(): string {
        return `${Take.name} (count: ${this.count})`;
    }
}