import { elementsSymbol, ElementsWrapper } from "../element-wrapper"

export class Windowed<TSource> implements ElementsWrapper {
    constructor(private source: Iterable<TSource>,
        private size: number,
        private step: number,
        private dropRemainder: boolean = false) {

        if (size > 0 && step <= 0) {
            throw Error('"step" must be greater than 0.');
        };
    }

    *[Symbol.iterator]() {
        if (this.size <= 0) {
            return
        }

        const window = []

        const iterator = this.source[Symbol.iterator]()
        let current: IteratorResult<TSource>
        for (let i = 0; i < this.size; i++) {
            current = iterator.next()
            if (current.done) {
                break
            }
            window.push(current.value)
        }

        current = iterator.next()

        if (this.skipWindow(window) && current.done) {
            return
        }

        yield Array.from(window);

        while (current && !current.done) {
            let skipped = 0
            while (skipped < this.step && window.length > 0) {
                window.shift()
                skipped++
            }

            while (window.length < this.size) {
                if (skipped >= this.step) {
                    window.push(current.value)
                }
                else {
                    skipped++
                }

                current = iterator.next()
                if (current.done) {
                    break
                }
            }

            if (window.length === 0 || this.skipWindow(window)) {
                return
            }

            yield Array.from(window)
        }
    }

    private skipWindow(window: any[]): boolean {
        return window.length < this.size && this.dropRemainder;
    }


    *[elementsSymbol](): Iterable<Iterable<TSource>> {
        yield this.source;
    }

    toString(): string {
        return `${Windowed.name} (size: ${this.size}, step: ${this.step}, dropRemainder: ${this.dropRemainder})`
    }
}