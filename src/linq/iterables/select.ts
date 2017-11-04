export class Select<TSource, TResult>  {
    constructor(private elements: Iterable<TSource>, 
                private selector: (element: TSource) => TResult) {
    }

    *[Symbol.iterator](): Iterator<TResult> {
        for (let element of this.elements) {
            yield this.selector(element)
        }
    }
}