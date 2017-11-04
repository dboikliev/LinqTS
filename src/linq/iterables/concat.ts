export class Concat<TSource>{
    constructor(private first: Iterable<TSource>, 
                private second: Iterable<TSource>) {
    }

    *[Symbol.iterator](): Iterator<TSource> {
        yield* this.first
        yield* this.second
    }
}