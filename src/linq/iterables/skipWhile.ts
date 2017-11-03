export class SkipWhile<TSource>  {
    constructor(private elements: Iterable<TSource>,
                private predicate: (element: TSource) => boolean) {
    }

    [Symbol.iterator](): Iterator<TSource> {
        let iterator = this.elements[Symbol.iterator]();

        let lastResult;
        do {
            lastResult = iterator.next();
        } while (this.predicate(lastResult.value));

        return {
            next: (): IteratorResult<TSource> => {
                if (lastResult) {
                    let copy = lastResult;
                    lastResult = undefined;
                    return copy;
                }

                let iteratorResult = iterator.next();
                let result: IteratorResult<TSource> = {
                    value: iteratorResult.value,
                    done: iteratorResult.done
                };
                return result;
            }
        };
    }
}