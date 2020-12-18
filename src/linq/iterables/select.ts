import { elementsSymbol, ElementsWrapper } from "../element-wrapper";

export class Select<TSource, TResult> implements ElementsWrapper  {
    constructor(private elements: Iterable<TSource>, 
                private selector: (element: TSource) => TResult) {
    }

    *[Symbol.iterator](): Iterator<TResult> {
        for (let element of this.elements) {
            yield this.selector(element)
        }
    }

    
    *[elementsSymbol](): Iterable<Iterable<TSource>> {
        yield this.elements;
    }

    toString(): string {
        return `${Select.name} (selector: ${this.selector})`;
    }
}