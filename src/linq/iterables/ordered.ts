export class Ordered<TSource>  {
    private _elements: Iterable<TSource>;
    private _comparer: (first: TSource, second: TSource) => number;

    constructor(elements: Iterable<TSource>, comparer: (first: TSource, second: TSource) => number) {
        this._elements = elements;
        this._comparer = comparer;
    }

    *[Symbol.iterator](): Iterator<TSource> {
        let elements = [];

        for (let element of this._elements) {
            elements.push(element);
        }

        elements.sort(this._comparer);

        yield* elements;
    }

    from(selector: (elemment: TSource) => number | string, isAscending: boolean): Ordered<TSource> {
        let direction = isAscending ? 1 : -1;
        return new Ordered(this._elements, (first, second) => {
            let firstComparison = this._comparer(first, second);
            if (firstComparison === 0) {
                return this.compareWithSelector(first, second, selector) * direction; 
            }
            return firstComparison;
        });
    }

    // thenBy(selector: (elemment: TSource) => number | string): Ordered<TSource> {
    //     return new Ordered(this._elements, (first, second) => {
    //         let firstComparison = this._comparer(first, second);

    //         if (firstComparison === 0) {
    //             return this.compareWithSelector(first, second, selector);
    //         }
    //         return firstComparison;
    //     });
    // }

    // thenByDescending(selector: (elemment: TSource) => number | string): Ordered<TSource> {
    //     return new Ordered(this._elements, (first, second) => {
    //         let firstComparison = this._comparer(first, second);

    //         if (firstComparison === 0) {
    //             return this.compareWithSelector(second, first, selector);
    //         }
    //         return firstComparison;
    //     });
    // }

    private compareWithSelector(first: TSource, second: TSource, selector: (element: TSource) => number | string): number {
        let a = selector(first);
        let b = selector(second);
        if (a > b) {
            return 1;
        }
        else if (a === b) {
            return 0;
        }
        else {
            return -1;
        }
    }
}