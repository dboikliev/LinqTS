namespace Linq {
    export class Zip<TLeft, TRight, TResult> extends Linqable<TResult> {
        private _selector: (left: TLeft, right: TRight) => TResult;
        private _left: Iterable<TLeft>;
        private _right: Iterable<TRight>;

        constructor(left: Iterable<TLeft>, right: Iterable<TRight>, selector: (left: TLeft, right: TRight) => TResult) {
            super();
            this._left = left;
            this._right = right;
            this._selector = selector;
        }

        [Symbol.iterator](): Iterator<TResult> {
            let iterLeft = this._left[Symbol.iterator]();
            let iterRight = this._right[Symbol.iterator]();

            return {
                next: (): IteratorResult<TResult> => {
                    let iterationLeft = iterLeft.next();
                    let iterationRight = iterRight.next();

                    let isDone = iterationLeft.done || iterationRight.done;
                    let zip;
                    if (!isDone) {
                        zip = this._selector(iterationLeft.value, iterationRight.value);
                    }

                    let result: IteratorResult<TResult> = {
                        value: zip,
                        done: isDone
                    };

                    return result;
                }
            };
        }
    }
}