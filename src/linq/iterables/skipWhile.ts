export class SkipWhile<TSource>  {
    private _elements: Iterable<TSource>;
    private _predicate: (element: TSource) => boolean;

    constructor(elements: Iterable<TSource>, predicate: (element: TSource) => boolean) {
        this._elements = elements;
        this._predicate = predicate;
    }

    [Symbol.iterator](): Iterator<TSource> {
        let iterator = this._elements[Symbol.iterator]();

        let lastResult;
        do {
            lastResult = iterator.next();
        } while (this._predicate(lastResult.value));

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