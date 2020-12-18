import { elementsSymbol, ElementsWrapper } from "../element-wrapper"

export class Ordered<TSource> implements ElementsWrapper  {
    constructor(private elements: Iterable<TSource>,
        private comparer: (left: TSource, right: TSource) => number,
        private selector: (element: TSource) => number | string,
        private isAscending: boolean) {
    }

    *[Symbol.iterator](): Iterator<TSource> {
        let sorted = []

        for (let element of this.elements) {
            sorted.push(element)
        }

        sorted.sort(this.comparer)

        yield* sorted
    }

    static from<T>(elements: Iterable<T>, selector: (elemment: T) => number | string, isAscending: boolean): Ordered<T> {
        return new Ordered(elements, (left, right) => this.compareWithSelector(left, right, selector, isAscending), selector, isAscending)
    }

    from(selector: (elemment: TSource) => number | string, isAscending: boolean): Ordered<TSource> {
        return new Ordered(this.elements, this.nestComparisons(selector, isAscending), selector, isAscending)
    }

    private nestComparisons(selector: (elemment: TSource) => number | string, isAscending: boolean) {
        return (left, right) => {
            let firstComparison = this.comparer(left, right)
            if (firstComparison === 0) {
                return Ordered.compareWithSelector(left, right, selector, isAscending)
            }
            return firstComparison
        }
    }

    private static compareWithSelector<T>(left: T, right: T, selector: (element: T) => number | string, isAscending: boolean) {
        let direction = isAscending ? 1 : -1
        let a = selector(left)
        let b = selector(right)

        if (a > b)
            return direction

        if (a < b)
            return -direction

        return 0
    }


    *[elementsSymbol](): Iterable<Iterable<TSource>> {
        yield this.elements;
    }

    toString() {
        return `${Ordered.name} (selector: ${this.selector}, direction: ${this.isAscending ? 'ascending' : 'descending'})`;
    }
}