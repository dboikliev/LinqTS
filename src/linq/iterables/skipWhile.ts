import { elementsSymbol, ElementsWrapper } from "../element-wrapper"

export class SkipWhile<TSource> implements ElementsWrapper {
    constructor(private elements: Iterable<TSource>,
                private predicate: (element: TSource) => boolean) {
    }

    [Symbol.iterator](): Iterator<TSource> {
        let iterator = this.elements[Symbol.iterator]()

        let lastResult
        do {
            lastResult = iterator.next()
        } while (this.predicate(lastResult.value))

        return {
            next: (): IteratorResult<TSource> => {
                if (lastResult) {
                    let copy = lastResult
                    lastResult = undefined
                    return copy
                }

                let iteratorResult = iterator.next()
                let result: IteratorResult<TSource> = {
                    value: iteratorResult.value,
                    done: iteratorResult.done
                }
                return result
            }
        }
    }

    
    *[elementsSymbol](): Iterable<Iterable<TSource>> {
        yield this.elements;
    }

    toString(): string {
        return `${SkipWhile.name} (predicate: ${this.predicate})`;
    }
}