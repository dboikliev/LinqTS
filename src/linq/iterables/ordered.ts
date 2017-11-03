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
        return new Ordered(this._elements, this.nestComparisons(selector, isAscending));
    }

    private nestComparisons(selector: (elemment: TSource) => number | string, isAscending: boolean) {
        return function(first, second) {
            let firstComparison = this._comparer(first, second);
            if (firstComparison === 0) {
                return this.compareWithSelector(first, second, selector, isAscending) ; 
            }
            return firstComparison;
        }
    }

    private compareWithSelector(first: TSource, second: TSource, selector: (element: TSource) => number | string, isAscending: boolean) {
        let direction = isAscending ? 1 : -1;
        let a = selector(first);
        let b = selector(second);

        if (a > b)
            return direction;

        if (a < b)
            return -direction;
        
        return 0;
    }
}