export class Take<TSource>  {
    constructor(private elements: Iterable<TSource>, 
                private count: number) {
    }

    *[Symbol.iterator](): Iterator<TSource> {
        let current = 0;
        for (let element of this.elements) {
            if (current >= this.count) {
                return;
            }
            current++;
            yield element;
        }
    }
}