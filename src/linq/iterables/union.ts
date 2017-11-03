export class Union<TSource>  {
    constructor(private left: Iterable<TSource>, 
                private right: Iterable<TSource>) {
    }

    *[Symbol.iterator]() {
        let set = new Set(this.left);

        for (let element of set) {
            yield element;
        }

        for (let element of this.right) {
            if (!set.has(element)) {
                set.add(element);
                yield element;
            }
        }
    }
}