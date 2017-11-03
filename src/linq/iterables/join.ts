export class Join<TLeft, TRight, TResult>  {
    private _leftElements: Iterable<TLeft>;
    private _rightElements: Iterable<TRight>;
    private _leftSelector: (element: TLeft) => any;
    private _rightSelector: (element: TRight) => any;
    private _resultSelector: (left: TLeft, right: TRight) => TResult;

    constructor(leftElements: Iterable<TLeft>,
        rightElements: Iterable<TRight>,
        leftSelector: (element: TLeft) => any,
        rightSelector: (element: TRight) => any,
        resultSelector: (left: TLeft, right: TRight) => TResult) {
        this._leftElements = leftElements;
        this._rightElements = rightElements;
        this._leftSelector = leftSelector;
        this._rightSelector = rightSelector;
        this._resultSelector = resultSelector;
    }

    *[Symbol.iterator](): Iterator<TResult> {
        let groups = new Map<any, TRight[]>();

        for (let element of this._rightElements) {
            let key = this._rightSelector(element);
            let group = groups.get(key) || [];
            group.push(element);
            groups.set(key, group);
        }

        for (let left of this._leftElements) {
            let leftKey = this._leftSelector(left);
            let group = groups.get(leftKey) || [];

            for (let match of group) {
                yield this._resultSelector(left, match);
            }
        }
    }
}