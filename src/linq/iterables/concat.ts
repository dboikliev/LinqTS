import { elementsSymbol, ElementsWrapper } from "../element-wrapper";

export class Concat<TSource> implements ElementsWrapper {
    constructor(private first: Iterable<TSource>, 
                private second: Iterable<TSource>) {
    }

    *[Symbol.iterator](): Iterator<TSource> {
        yield* this.first
        yield* this.second
    }

    
    *[elementsSymbol](): Iterable<Iterable<TSource>> {
        yield this.first;
        yield this.second;
    }

    toString() {
        return Concat.name;
    }
}