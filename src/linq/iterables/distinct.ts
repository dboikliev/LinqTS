import { elementsSymbol, ElementsWrapper } from "../element-wrapper";

export class Distinct<TSource> implements ElementsWrapper {
    constructor(private elements: Iterable<TSource>, 
                private selector?: (element: TSource) => any) {
    }

    *[Symbol.iterator](): Iterator<TSource> {
        let map = new Map()
        for (let element of this.elements) {
            let key = this.selector(element)

            if (!map.has(key)) {
                map.set(key, element)
                yield element
            }
        }
    }

        
    *[elementsSymbol](): Iterable<Iterable<TSource>> {
        yield this.elements;
    }

    toString() {
        return `${Distinct.name}${this.selector ? ` (selector: ${this.selector})` : ''}`
    }
}