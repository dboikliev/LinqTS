export class SelectMany<TSource, TResult>  {
    constructor(private elements: Iterable<TSource>, 
                private selector: (element: TSource) => Iterable<TResult>) {
    }

    *[Symbol.iterator](): Iterator<TResult> {
        for (let element of this.elements) {
            let innerElements = this.selector(element)
            yield* innerElements
        }
    }
}