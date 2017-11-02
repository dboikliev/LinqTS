namespace Linq {
    export class Skip<TSource> extends Linqable<TSource> {
        private _elements: Iterable<TSource>;
        private _count: number;

        constructor(elements: Iterable<TSource>, count: number) {
            super();
            this._elements = elements;
            this._count = count;
        }

        *[Symbol.iterator](): Iterator<TSource> {
            let iterator = this._elements[Symbol.iterator]();
            let iteratorResult: IteratorResult<TSource> = iterator.next();
            for (let i = 0; i < this._count && !iteratorResult.done; i++) {
                iteratorResult = iterator.next();
            }

            while (!iteratorResult.done) {
                yield iteratorResult.value;
                iteratorResult = iterator.next();
            }
        }
    }
}