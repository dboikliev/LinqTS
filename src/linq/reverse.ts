namespace Linq {
    export class Reverse<TSource> extends Linqable<TSource> {
        private _elements: Iterable<TSource>;

        constructor(elements: Iterable<TSource>) {
            super();
            this._elements = elements;
        }

        *[Symbol.iterator](): Iterator<TSource> {
            let stack: TSource[] = [];

            for (let element of this._elements) {
                stack.push(element);
            }

            while (stack.length) {
                yield stack.pop();
            }
        }
    }
}