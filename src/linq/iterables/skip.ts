export class Skip<TSource>  {
    constructor(private elements: Iterable<TSource>, 
                private count: number) {
    }

    *[Symbol.iterator](): Iterator<TSource> {
        let iterator = this.elements[Symbol.iterator]()
        let iteratorResult: IteratorResult<TSource> = iterator.next()
        for (let i = 0; i < this.count && !iteratorResult.done; i++) {
            iteratorResult = iterator.next()
        }

        while (!iteratorResult.done) {
            yield iteratorResult.value
            iteratorResult = iterator.next()
        }
    }
}