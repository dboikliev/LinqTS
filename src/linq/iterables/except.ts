export class Except<TSource>  {
    constructor(private left: Iterable<TSource>, 
                private right: Iterable<TSource>) {
    }

    *[Symbol.iterator]() {
        let set = new Set(this.right)
        for (let element of this.left) {
            if (!set.has(element)) {
                yield element
            }
        }
    }
}