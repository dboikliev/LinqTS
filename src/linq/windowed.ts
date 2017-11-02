namespace Linq {
    export class Windowed<TSource> extends Linqable<TSource[]> {
        private _source: Iterable<TSource>;
        private _size: number;
        private _step: number;

        constructor(source: Iterable<TSource>, size: number, step: number) {
            super();
            this._source = source;
            this._size = size;
            this._step = step;
        }

        *[Symbol.iterator]() {
            let window = [];

            let iterator = this._source[Symbol.iterator]();
            let current: IteratorResult<TSource>;
            for (let i = 0; i < this._size; i++) {
                current = iterator.next();
                if (current.done) {
                    break;
                }
                window.push(current.value);
            }

            yield Array.from(window);

            current = iterator.next();
            while (current && !current.done) {
                let skipped = 0;
                while (skipped < this._step && window.length > 0) {
                    window.shift();
                    skipped++;
                }

                while (window.length < this._size) {
                    if (skipped >= this._step) {
                        window.push(current.value);
                    }
                    else {
                        skipped++;
                    }

                    current = iterator.next();
                    if (current.done) {
                        break;
                    }
                }

                if (window.length === 0) {
                    return;
                }

                yield Array.from(window);
            }
        }
    }
}