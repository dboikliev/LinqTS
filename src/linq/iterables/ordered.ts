export class Ordered<TSource>  {
    constructor(private elements: Iterable<TSource>, 
                private comparer: (first: TSource, second: TSource) => number) {
    }

    *[Symbol.iterator](): Iterator<TSource> {
        let sorted = [];

        for (let element of this.elements) {
            sorted.push(element);
        }

        sorted.sort(this.comparer);

        yield* sorted;
    }

    from(selector: (elemment: TSource) => number | string, isAscending: boolean): Ordered<TSource> {
        return new Ordered(this.elements, this.nestComparisons(selector, isAscending));
    }

    private nestComparisons(selector: (elemment: TSource) => number | string, isAscending: boolean) {
        return (first, second) => {
            let firstComparison = this.comparer(first, second);
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