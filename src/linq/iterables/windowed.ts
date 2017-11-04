export class Windowed<TSource>  {
    constructor(private source: Iterable<TSource>, 
                private size: number, 
                private step: number) {
    }

    *[Symbol.iterator]() {
        let window = []

        let iterator = this.source[Symbol.iterator]()
        let current: IteratorResult<TSource>
        for (let i = 0; i < this.size; i++) {
            current = iterator.next()
            if (current.done) {
                break
            }
            window.push(current.value)
        }

        yield Array.from(window)

        current = iterator.next()
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

            if (window.length === 0) {
                return
            }

            yield Array.from(window)
        }
    }
}