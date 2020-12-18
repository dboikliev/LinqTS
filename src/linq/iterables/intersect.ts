import { elementsSymbol, ElementsWrapper } from "../element-wrapper";

export class Intersect<TSource> implements ElementsWrapper  {
    constructor(private left: Iterable<TSource>, 
                private right: Iterable<TSource>) {
    }

    *[Symbol.iterator]() {
        let set = new Set(this.right)
        for (let element of this.left) {
            if (set.has(element)) {
                yield element
            }
        }
    }

    
    *[elementsSymbol](): Iterable<Iterable<TSource>> {
        yield this.left;
        yield this.right;
    }

    toString(): string {
        return Intersect.name;
    }
}