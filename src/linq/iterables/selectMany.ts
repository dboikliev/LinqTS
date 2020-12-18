import { elementsSymbol, ElementsWrapper } from "../element-wrapper";

export class SelectMany<TSource, TResult> implements ElementsWrapper  {
    constructor(private elements: Iterable<TSource>, 
                private selector: (element: TSource) => Iterable<TResult>) {
    }

    *[Symbol.iterator](): Iterator<TResult> {
        for (let element of this.elements) {
            let innerElements = this.selector(element)
            yield* innerElements
        }
    }

    
    *[elementsSymbol](): Iterable<Iterable<TSource>> {
        yield this.elements;
    }

    toString() {
        return `${SelectMany.name} (selector: ${this.selector})`;
    }
}