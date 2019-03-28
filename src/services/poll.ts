import { from, timer } from 'rxjs';
import { first, flatMap, timeout, map } from 'rxjs/operators';

export const pollFn = <S>(
    fn: () => Promise<S>,
    interval: number,
    timeoutInMs: number,
    condition: (a: S) => boolean,
    quittingCondition: (a: S) => boolean,
): Promise<S> => {
    return timer(0, interval)
        .pipe(
            flatMap(() => from(fn())),
            map((obj: S) => {
                if (quittingCondition(obj)) {
                    throw new Error('unsolvable');
                } else {
                    return obj;
                }
            }),
            first(condition),
            timeout(timeoutInMs),
        )
        .toPromise();
};
