export class TakeWhile<TSource>  {
    constructor(private elements: Iterable<TSource>, 
                private predicate: (element: TSource) => boolean) {
    }

    *[Symbol.iterator](): Iterator<TSource> {
        for (let element of this.elements) {
            if (!this.predicate(element)) {
                break;
            }
            yield element;
        }
    }
}