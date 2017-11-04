export class Ordered<TSource>  {
    constructor(private elements: Iterable<TSource>, 
                private comparer: (left: TSource, right: TSource) => number) {
    }

    *[Symbol.iterator](): Iterator<TSource> {
        let sorted = []

        for (let element of this.elements) {
            sorted.push(element)
        }

        sorted.sort(this.comparer)

        yield* sorted
    }

    from(selector: (elemment: TSource) => number | string, isAscending: boolean): Ordered<TSource> {
        return new Ordered(this.elements, this.nestComparisons(selector, isAscending))
    }

    private nestComparisons(selector: (elemment: TSource) => number | string, isAscending: boolean) {
        return (left, right) => {
            let firstComparison = this.comparer(left, right)
            if (firstComparison === 0) {
                return this.compareWithSelector(left, right, selector, isAscending)  
            }
            return firstComparison
        }
    }

    private compareWithSelector(left: TSource, right: TSource, selector: (element: TSource) => number | string, isAscending: boolean) {
        let direction = isAscending ? 1 : -1
        let a = selector(left)
        let b = selector(right)

        if (a > b)
            return direction

        if (a < b)
            return -direction
        
        return 0
    }
}