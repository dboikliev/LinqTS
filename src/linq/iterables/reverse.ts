export class Reverse<TSource>  {
    constructor(private elements: Iterable<TSource>) {
    }

    *[Symbol.iterator](): Iterator<TSource> {
        let stack: TSource[] = [];

        for (let element of this.elements) {
            stack.push(element);
        }

        while (stack.length) {
            yield stack.pop();
        }
    }
}