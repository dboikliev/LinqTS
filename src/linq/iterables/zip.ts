import { elementsSymbol, ElementsWrapper } from "../element-wrapper"

export class Zip<TLeft, TRight, TResult> implements ElementsWrapper  {
    constructor(private left: Iterable<TLeft>, 
                private right: Iterable<TRight>, 
                private selector: (left: TLeft, right: TRight) => TResult) {
    }

    [Symbol.iterator](): Iterator<TResult> {
        let iterLeft = this.left[Symbol.iterator]()
        let iterRight = this.right[Symbol.iterator]()

        return {
            next: (): IteratorResult<TResult> => {
                let iterationLeft = iterLeft.next()
                let iterationRight = iterRight.next()

                let isDone = iterationLeft.done || iterationRight.done
                let zip
                if (!isDone) {
                    zip = this.selector(iterationLeft.value, iterationRight.value)
                }

                let result: IteratorResult<TResult> = {
                    value: zip,
                    done: isDone
                }

                return result
            }
        }
    }

    
    *[elementsSymbol](): Iterable<Iterable<TLeft> | Iterable<TRight>> {
        yield this.left;
        yield this.right;
    }

    toString(): string {
        return `${Zip.name} (selector: ${this.selector})`
    }
}