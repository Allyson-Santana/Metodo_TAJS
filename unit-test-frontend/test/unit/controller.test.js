import { describe, expect, it, jest } from '@jest/globals';
import Controller from '../../public/src/controller.js';

describe('Controller test suite', () => {
    it('Test initial value #getView, #getService and getOnSubmit and constructor', () => {
        const configureOnSubmit = jest.fn();

        const controller = new Controller({
            service: {test: 'service_test'}, 
            view: {test: 'view_test', configureOnSubmit}
        });

        const view = controller.getView();
        const service = controller.getService();
        const onSubmit = controller.getOnSubmit();

        expect(view.test).toStrictEqual('view_test');
        expect(view.test).toStrictEqual('view_test');
        
        expect(service.test).toStrictEqual('service_test');
        expect(configureOnSubmit).toHaveBeenCalled();
        const [calledFunction] = configureOnSubmit.mock.calls[0];
        expect(typeof calledFunction).toBe('function');
        expect(calledFunction).toEqual(expect.any(Function));


        expect(typeof onSubmit).toBe('function');
    })
    
    it('#initialize view and calls loadItems', async () => {
        const configureOnSubmit = jest.fn();
        const initialize = jest.fn()

        const controller = new Controller({
            service: { }, view: { initialize, configureOnSubmit }
        });

        jest.spyOn(controller, 'loadItems').mockReturnValue("mock_return");

        const result = await controller.initialize();

        expect(initialize).toHaveBeenCalled();
        expect(controller.loadItems).toHaveBeenCalled();
        expect(result).toStrictEqual("mock_return")
    })

    it('#loadItems get items and update view', async () => {
        const mockItems = [
            { imageUrl: 'imageUrl_test_1', title: 'title_test_1' },
            { imageUrl: 'imageUrl_test_2', title: 'title_test_2' },
        ]
        const configureOnSubmit = jest.fn();
        const updateList = jest.fn()
        const getItems = jest.fn().mockResolvedValue(mockItems);
        
        const controller = new Controller({
            service: { getItems }, view: { updateList, configureOnSubmit }
        });

        await controller.loadItems();
        
        expect(updateList).toHaveBeenCalledWith(mockItems);  
    })

    it('#loadItems get items and no update view', async () => {
        const mockItems = []
        const configureOnSubmit = jest.fn();
        const updateList = jest.fn()
        const getItems = jest.fn().mockResolvedValue(mockItems);
        
        const controller = new Controller({
            service: { getItems }, view: { updateList, configureOnSubmit }
        });

        await controller.loadItems();
        
        expect(updateList).not.toBeCalled();  
    })

    it('#onSubmit save items and update view', async () => {
        const configureOnSubmit = jest.fn();
        const updateList = jest.fn().mockReturnValue('mock_return')
        const saveItem = jest.fn()

        const controller = new Controller({
            service: { saveItem }, 
            view: { configureOnSubmit, updateList }
        });

        const onSubmit = controller.getOnSubmit().bind(controller);

        const mockItem = { imageUrl: 'imageUrl_test_2', title: 'title_test_2' };

        const result = await onSubmit(mockItem);

        expect(saveItem).toHaveBeenCalledWith(mockItem);  
        expect(updateList).toHaveBeenCalledWith([mockItem]);

        expect(result).toStrictEqual('mock_return');
    })
})