abstract class Linq<T> implements Iterable<T> {
    protected _elements: Iterable<any>;

    constructor(elements: Iterable<any>) {
        this._elements = elements;
    }

    any(predicate?: (element: T) => boolean): boolean {
        if (predicate) {
            for (let value of this._elements) {
                if (predicate(value)) {
                    return true;
                }
            }
        }
        else {
            let iter = this._elements[Symbol.iterator]();
            return !iter.next().done;
        }

        return false;
    }


    abstract [Symbol.iterator](): Iterator<T>
}

class Linqable<TSource> extends Linq<TSource> {
    [Symbol.iterator](): Iterator<TSource> {
        let iter = this._elements[Symbol.iterator]();
        return {
            next: (): IteratorResult<TSource> => { 
                let iteration = iter.next();
                let result: IteratorResult<TSource> = {
                    value: iteration.value,
                    done: iteration.done
                };
                return result;
            }
        }
    }

    where(predicate: (element: TSource) => boolean): Linqable<TSource> {
        return new WhereLinq<TSource>(this, predicate);
    }

    select<TResult>(predicate: (element: TSource) => TResult): Linqable<TResult> {
        return new SelectLinq<TSource, TResult>(this, predicate);
    }

    zip<TRight, TResult>(right: Iterable<TRight>, selector: (left: TSource, right: TRight) => TResult): Linqable<TResult> {
        return new ZipLinq<TSource, TRight, TResult>(this, right, selector);
    }
}

class ZipLinq<TLeft, TRight, TResult> extends Linqable<TResult> {
    private _selector: (left: TLeft, right: TRight) => TResult;
    private _right: Iterable<TRight>;

    constructor(left: Iterable<TLeft>, right: Iterable<TRight>, selector: (left: TLeft, right: TRight) => TResult) {
        super(left);
        this._right = right;
        this._selector = selector;
    }

    [Symbol.iterator](): Iterator<TResult> {
        let iterLeft = this._elements[Symbol.iterator]();
        let iterRight = this._right[Symbol.iterator]();

        return {
            next: (): IteratorResult<TResult> => {
                let iterationLeft = iterLeft.next();
                let iterationRight = iterRight.next();

                let isDone = iterationLeft.done || iterationRight.done;
                let zip;
                if (!isDone) {
                    zip = this._selector(iterationLeft.value, iterationRight.value)
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

class WhereLinq<T> extends Linqable<T> {
    private _predicate: (element: T) => boolean;

    constructor(elements: Iterable<T>, predicate: (element: T) => boolean) {
        super(elements);
        this._predicate = predicate;
    }

    [Symbol.iterator](): Iterator<T> {
        let iter = this._elements[Symbol.iterator]();

        return {
            next: (): IteratorResult<T> => {
                let iteration = iter.next();
                while (iteration.value && !this._predicate(iteration.value)) {
                    iteration = iter.next();
                }

                let result: IteratorResult<T> = {
                    value: iteration.value,
                    done: iteration.done
                };

                return result;
            }
        }
    }
}

class SelectLinq<T, K> extends Linqable<K> {
    private _selector: (element: T) => any;

    constructor(elements: Iterable<T>, selector: (element: T) => K) {
        super(elements);
        this._selector = selector;
    }

    [Symbol.iterator](): Iterator<K> {
        let iter = this._elements[Symbol.iterator]();

        return {
            next: (): IteratorResult<K> => {
                let iteration = iter.next();

                let result: IteratorResult<K> = {
                    value: iteration.value ? this._selector(iteration.value) : undefined,
                    done: iteration.done
                };

                return result;
            }
        }
    }
}

interface IPerson {
    name: string;
    age: number;
}

function linq<T>(iterable: Iterable<T>) {
    return new Linqable<T>(iterable);
}

let people: IPerson[] = [{ name: "Ivan", age: 24 }, { name: "Deyan", age: 25 }];

let olderThan24 = linq(people)
    .where(p => p.age >= 24)
    .select(p => p.name)
    .zip([1, 2], (a, b) => `${ b }: ${ a }`);

for (let key of olderThan24) {
    console.log(key);
}