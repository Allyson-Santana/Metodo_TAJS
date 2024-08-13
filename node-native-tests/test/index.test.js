import { deepStrictEqual } from 'node:assert'
import { describe, it, mock } from 'node:test'

import Controller from '../src/controller.js'
import View from '../src/view.js'

const mockedData = [{
  name: 'morty smith',
  image: 'http://',
  age: 20,
  birthDay: new Date()
}, {
  name: 'pickle rick',
  image: 'http://',
  age: 20,
  birthDay: new Date()
}]


describe('Unit tests on frontend', () => {
  it('should add a property if name contains smith and remove all other props', () => {
    const controller = new Controller({
      view: {},
      service: {}
    })
    const expected = [{
      name: 'morty smith',
      image: 'http://',
      isBold: true
    }, {
      name: 'pickle rick',
      image: 'http://',
      isBold: false
    }]

    const result = controller.prepareItems(mockedData)
    deepStrictEqual(result, expected)
  })

  it('should verify all functions were called properly', async () => {
    let htmlResult = '';

    globalThis.document = {
      querySelector: mock.fn(() => {
        return {
          set innerHTML(value) {
            htmlResult = value;
          }
        };
      })
    };

    const view = new View();

    const service = {
      getCharacters: mock.fn(() => mockedData)
    };

    const controller = new Controller({
      view,
      service
    });

    await controller.init(mockedData);

    const serviceCalls = service.getCharacters.mock.calls;

    deepStrictEqual(serviceCalls[0].arguments[0], { skip: 0, limit: 5 });

    deepStrictEqual(
      htmlResult,
      `<li><img width=50px src="http://" /> <strong>morty smith</strong></li><br><li><img width=50px src="http://" /> pickle rick</li>`
    );
  });

})