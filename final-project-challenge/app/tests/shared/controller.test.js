import { describe, expect, it, jest } from '@jest/globals';
import Controller from '../../shared/controller';


describe('#Suite Controller', () => {

    it('Initialization Controller', async () => {
        // # Arrage
        const view = {
            render: jest.fn(),
            configureOnSearchClick: jest.fn(),
            configureOnClearClick: jest.fn(),
        }

        const data = [
            { id: 1, name: 'Mrs. Misty Rempel-Lehner' },
            { id: 2, name: 'Mrs. Misty Rempel-Lehner 2' }
        ];

        const service = {
            searchLocallyByName: jest.fn(),
            getData: jest.fn().mockImplementation(async function* () {
                yield data[0];
                yield data[1];
            }),
        };

        // Act
        const controller = await Controller.init({ view, service })

        // Assert
        expect(view.configureOnSearchClick).toHaveBeenCalledTimes(1)
        expect(view.configureOnSearchClick).toHaveBeenCalledWith(expect.any(Function.bind(controller)))
        expect(view.configureOnClearClick).toHaveBeenCalledTimes(1)
        expect(view.configureOnClearClick).toHaveBeenCalledWith(expect.any(Function.bind(controller)))

        expect(view.render).toHaveBeenCalledTimes(data.length)
        expect(view.render).toHaveBeenNthCalledWith(1, data[0])
        expect(view.render).toHaveBeenNthCalledWith(2, data[1])

        expect(controller).toBeInstanceOf(Controller)
    })

    it('#onClear', async () => {
        // # Arrage
        const view = { render: jest.fn() }

        const service = { searchLocallyByName: jest.fn() }

        // Act
        const controller = new Controller({ view, service })
        controller.getOnClear().bind(controller)()

        // Assert
        expect(service.searchLocallyByName).toHaveBeenCalledTimes(1)
        expect(view.render).toHaveBeenCalledTimes(1)
        expect(view.render).toHaveBeenCalledWith(service.searchLocallyByName())
    })

    it('#onSearch', async () => {
        // # Arrage
        const view = { render: jest.fn() }

        const service = { searchLocallyByName: jest.fn() };

        // Act
        const controller = new Controller({ view, service })

        const search = '__search__'
        controller.getOnSearch().bind(controller)(search);

        // Assert
        expect(service.searchLocallyByName).toHaveBeenCalledTimes(1);
        expect(view.render).toHaveBeenCalledTimes(1);

        expect(service.searchLocallyByName).toHaveBeenCalledTimes(1);
        expect(view.render).toHaveBeenCalledTimes(1);

        expect(view.render).toHaveBeenCalledWith(service.searchLocallyByName())
        expect(service.searchLocallyByName).toHaveBeenCalledWith(search)
    })
})