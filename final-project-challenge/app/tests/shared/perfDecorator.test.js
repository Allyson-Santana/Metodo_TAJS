import { describe, expect, it, jest } from '@jest/globals';
import PerfDecorator from '../../shared/perfDecorator';


describe('PerfDecorator', () => {
    let observers;
    let appId;
    let perfDecorator;

    beforeEach(() => {
        observers = {
            notify: jest.fn(),
        };
        appId = 'my-app-id';
        perfDecorator = new PerfDecorator({ observers, appId });
    });

    it('should call observers.notify with started event and mark startedTag', async () => {
        const now = 1234567890
        jest.spyOn(Date, 'now').mockReturnValue(now)

        const mark = jest.spyOn(performance,'mark')

        const fn = () => {};
        const wrappedFn = perfDecorator.measureTime(fn);
        wrappedFn();

        expect(observers.notify).toHaveBeenNthCalledWith(1, {
            appId,
            tag: 'fn-started',
            at: now,
        });
        
        expect(mark).toHaveBeenNthCalledWith(1, 'fn-started')
    });

    it('should call observers.notify with ended event and mark startedTag', async () => {
        const now = 1234567890
        jest.spyOn(Date, 'now').mockReturnValue(now)

        const duration = 123
        const measure = jest.spyOn(performance, 'measure').mockReturnValue({duration})

        const mark = jest.spyOn(performance,'mark')

        const fn = () => Promise.resolve();
        const wrappedFn = perfDecorator.measureTime(fn);
        await wrappedFn();

        expect(observers.notify).toHaveBeenNthCalledWith(2, {
            appId,
            tag: 'fn-ended',
            at: now,
            message: `fn took ${duration}ms`,
        });

        expect(mark).toHaveBeenNthCalledWith(2, 'fn-ended')
        expect(measure).toHaveBeenCalledTimes(1)
        expect(measure).toHaveBeenCalledWith('fn-duration', 'fn-started', 'fn-ended')
    });
});