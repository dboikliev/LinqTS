import { elementsSymbol, ElementsWrapper } from "../element-wrapper";

export class Reverse<TSource> implements ElementsWrapper  {
    constructor(private elements: Iterable<TSource>) {
    }

    *[Symbol.iterator](): Iterator<TSource> {
        let stack: TSource[] = []

        for (let element of this.elements) {
            stack.push(element)
        }

        while (stack.length) {
            yield stack.pop()
        }
    }

    *[elementsSymbol](): Iterable<Iterable<TSource>> {
        yield this.elements;
    }

    toString() {
        return Reverse.name;
    }
}