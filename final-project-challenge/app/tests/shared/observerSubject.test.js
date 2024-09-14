import { describe, expect, it, jest } from '@jest/globals';

import ObserverSubject from './../../shared/observerSubject.js';

describe('#Suite ObserverSubject', () => {
  it('adds observers correctly', () => {
    const subject = new ObserverSubject();
    const observer1 = { notify: jest.fn() };
    const observer2 = { notify: jest.fn() };

    subject.subscribe(observer1);
    subject.subscribe(observer2);

    subject.notify('myData');

    expect(observer1.notify).toHaveBeenCalledTimes(1);
    expect(observer1.notify).toHaveBeenCalledWith('myData');

    expect(observer2.notify).toHaveBeenCalledTimes(1);
    expect(observer2.notify).toHaveBeenCalledWith('myData');
  });

  it('removes observers correctly', () => {
    const subject = new ObserverSubject();
    const observer1 = { notify: jest.fn() };
    const observer2 = { notify: jest.fn() };

    subject.subscribe(observer1);
    subject.subscribe(observer2);

    subject.unsubscribe(observer1);

    subject.notify('myData');

    expect(observer1.notify).toHaveBeenCalledTimes(0);
    
    expect(observer2.notify).toHaveBeenCalledTimes(1);
    expect(observer2.notify).toHaveBeenCalledWith('myData');
  });

  it('notifies observers correctly', () => {
    const subject = new ObserverSubject();
    const observer1 = { notify: jest.fn() };
    const observer2 = { notify: jest.fn() };

    subject.subscribe(observer1);
    subject.subscribe(observer2);

    subject.notify('myData');

    expect(observer1.notify).toHaveBeenCalledTimes(1);
    expect(observer1.notify).toHaveBeenCalledWith('myData');

    expect(observer2.notify).toHaveBeenCalledTimes(1);
    expect(observer2.notify).toHaveBeenCalledWith('myData');;
  });
});