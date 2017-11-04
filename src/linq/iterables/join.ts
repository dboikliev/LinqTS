export class Join<TLeft, TRight, TResult>  {
    constructor(private leftElements: Iterable<TLeft>,
                private rightElements: Iterable<TRight>,
                private leftSelector: (element: TLeft) => any,
                private rightSelector: (element: TRight) => any,
                private resultSelector: (left: TLeft, right: TRight) => TResult) {
    }

    *[Symbol.iterator](): Iterator<TResult> {
        let groups = new Map<any, TRight[]>();

        for (let element of this.rightElements) {
            let key = this.rightSelector(element);
            let group = groups.get(key) || [];
            group.push(element);
            groups.set(key, group);
        }

        for (let left of this.leftElements) {
            let leftKey = this.leftSelector(left);
            let group = groups.get(leftKey) || [];

            for (let match of group) {
                yield this.resultSelector(left, match);
            }
        }
    }
}