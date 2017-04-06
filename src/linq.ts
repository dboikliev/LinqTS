export abstract class Linqable<TSource> implements Iterable<TSource> {
    abstract [Symbol.iterator](): Iterator<TSource>;

    any(predicate?: (element: TSource) => boolean): boolean {
        if (predicate) {
            for (let value of this) {
                if (predicate(value)) {
                    return true;
                }
            }
        }
        else {
            let iter = this[Symbol.iterator]();
            return !iter.next().done;
        }

        return false;
    }

    where(predicate: (element: TSource) => boolean): Linqable<TSource> {
        return new Where<TSource>(this, predicate);
    }

    select<TResult>(predicate: (element: TSource) => TResult): Linqable<TResult> {
        return new Select<TSource, TResult>(this, predicate);
    }

    zip<TRight, TResult>(right: Iterable<TRight>, selector: (left: TSource, right: TRight) => TResult): Linqable<TResult> {
        return new Zip<TSource, TRight, TResult>(this, right, selector);
    }

    distinct(selector: (element: TSource) => any = (element: TSource) => element): Linqable<TSource> {
        return new Distinct<TSource>(this, selector);
    }

    first(): TSource {
        let iter = this[Symbol.iterator]();
        return iter.next().value;
    }

    firstOrDefault<TDefault>(predicate?: (element: TSource) => boolean, defaultInitializer: () => TDefault = () => undefined): TSource | TDefault {
        if (predicate) {
            for (let value of this) {
                if (predicate(value)) {
                    return value;
                }
            }

            return defaultInitializer();
        }
        else {
            let iter = this[Symbol.iterator]();
            let descriptor = iter.next();
            
            if (descriptor.done && !descriptor.value) {
                return defaultInitializer();
            }
            else {
                return descriptor.value;
            }
        }
    }
}

class Distinct<TSource> extends Linqable<TSource> {
    private _elements: Iterable<TSource>;
    private _selector: (element: TSource) => any;

    constructor(elements: Iterable<TSource>, selector?: (element: TSource) => any) {
        super();
        this._elements = elements
        this._selector = selector;
    }

    [Symbol.iterator](): Iterator<TSource> {
        let map = new Map();
        let iterator = this._elements[Symbol.iterator]();
        let iteratorResult = iterator.next();
        while (!iteratorResult.done) {
            let key = this._selector(iteratorResult.value);

            if (map.has(key)) {
                iteratorResult = iterator.next();
            }
            else {
                map.set(key, iteratorResult.value);
            }
        }

        let mapIterator = map[Symbol.iterator]();
        return {
            next: (): IteratorResult<TSource> => {
                let mapIteratorResult = mapIterator.next();
                let result: IteratorResult<TSource> = {
                    value: mapIteratorResult.value ? mapIteratorResult.value[1] : undefined,
                    done: mapIteratorResult.done
                };
                return result;
            }
        }
    }
}

class List<TSource> extends Linqable<TSource> {
    private _elements: Iterable<any>;

    constructor(elements: Iterable<any>) {
        super();
        this._elements = elements;
    }

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
        };
    }
}


class Zip<TLeft, TRight, TResult> extends Linqable<TResult> {
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

class Where<TSource> extends Linqable<TSource> {
    private _elements: Iterable<TSource>;
    private _predicate: (element: TSource) => boolean;

    constructor(elements: Iterable<TSource>, predicate: (element: TSource) => boolean) {
        super();
        this._elements = elements;
        this._predicate = predicate;
    }

    [Symbol.iterator](): Iterator<TSource> {
        let iter = this._elements[Symbol.iterator]();

        return {
            next: (): IteratorResult<TSource> => {
                let iteration = iter.next();
                while (!iteration.done && iteration.value != undefined && !this._predicate(iteration.value)) {
                    iteration = iter.next();
                }

                let result: IteratorResult<TSource> = {
                    value: iteration.value,
                    done: iteration.done
                };

                return result;
            }
        };
    }
}

class Select<TSource, TDestination> extends Linqable<TDestination> {
    private _elements: Iterable<TSource>;
    private _selector: (element: TSource) => any;

    constructor(elements: Iterable<TSource>, selector: (element: TSource) => TDestination) {
        super();
        this._elements = elements;
        this._selector = selector;
    }

    [Symbol.iterator](): Iterator<TDestination> {
        let iter = this._elements[Symbol.iterator]();

        return {
            next: (): IteratorResult<TDestination> => {
                let iteration = iter.next();

                let value = iteration.done ? undefined : this._selector(iteration.value);

                let result: IteratorResult<TDestination> = {
                    value: value,
                    done: iteration.done
                };

                return result;
            }
        };
    }
}

export function linq<T>(iterable: Iterable<T>) {
    return new List<T>(iterable);
}

export function* range(start: number = 0, step: number = 1, end?: number): IterableIterator<number> {
    let i = start;

    while (!end || i <= end) {
        yield i;
        i += step;
    }
}