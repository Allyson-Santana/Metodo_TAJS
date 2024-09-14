// import LayoutBuilder from "../../../platforms/console/layoutBuilder.js";
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import LayoutBuilder from '../../../platforms/console/layoutBuilder.js';
import View from '../../../platforms/console/view.js';


describe('#Suite View', () => {
    let view;

    beforeEach(() => {
        view = new View();
    })

    it('just to cover 100% coverage (no effects)', () => {
        view.getOnSearch()
        view.configureOnClearClick()
    })

    it('should configure onSearch click', () => {
        // arrange
        const input = {
            getValue: jest.fn().mockReturnValue('_test_'),
            clearValue: jest.fn(),
            focus: jest.fn(),
        };
        const onSearchParam = jest.fn();

        // Act
        view.configureOnSearchClick(onSearchParam);

        // Assert
        view.getOnSearch(input);

        expect(input.getValue).toBeCalled();
        expect(input.clearValue).toBeCalled();
        expect(input.focus).toBeCalled();
        expect(onSearchParam).toBeCalledWith('_test_');
    })

    it('Should return data and headers empty', () => {
        // arrange
        const data = [];

        // Act
        const result = view.getPrepareData(data)

        // Assert
        const expected = {
            headers: view.getHeaders,
            data: []
        }

        expect(result).toStrictEqual(expected)
    });

    it('Should return data prepared with your headers', () => {
        // arrange
        const data = [
            { "id": "id_one", "name": "name_one", "age": "age_one", },
            { "id": "id_two", "name": "name_two", "age": "age_two", },
        ];

        // Act
        const result = view.getPrepareData(data)

        // Assert
        const headersExpected = ['id', 'name', 'age'];
        const dataExpected = [
            ["id_one", "name_one", "age_one"],
            ["id_two", "name_two", "age_two"],
        ];

        const expected = {
            headers: headersExpected,
            data: dataExpected,
        }

        expect(result).toStrictEqual(expected);
        expect(view.getHeaders).toStrictEqual(headersExpected);
    });

    it('Should update table with table data empty', () => {
        // Arrange
        const data = [
            { "id": "id_one", "name": "name_one", "age": "age_one", },
            { "id": "id_two", "name": "name_two", "age": "age_two", },
        ];


        jest.spyOn(LayoutBuilder.prototype, 'setScreen').mockReturnThis();
        jest.spyOn(LayoutBuilder.prototype, 'setLayoutComponent').mockReturnThis();
        jest.spyOn(LayoutBuilder.prototype, 'setSearchComponent').mockReturnThis();
        jest.spyOn(LayoutBuilder.prototype, 'setTable').mockReturnThis();
        jest.spyOn(LayoutBuilder.prototype, 'build').mockReturnValue({
            table: { setData: jest.fn() },
            screen: { render: jest.fn() },
        });

        // Act
        view.render(data);

        view.getUpdateTable({ data: data, cleanFirst: true });

        // Assert
        const templateHeadersExpected = ['id', 'name', 'age'];
        const templateDataExpected = [
            ["id_one", "name_one", "age_one"],
            ["id_two", "name_two", "age_two"],
        ];
        expect(view.getTableData).toStrictEqual(templateDataExpected);
        expect(view.getComponents.table.setData).toHaveBeenCalledWith({
            headers: templateHeadersExpected,
            data: view.getTableData
        });
        expect(view.getComponents.screen.render).toHaveBeenCalled();
    })

    it('Should update table with table data not empty', () => {
        // Arrange
        const data = [
            { "id": "id_one", "name": "name_one", "age": "age_one", },
            { "id": "id_two", "name": "name_two", "age": "age_two", },
        ];

        jest.spyOn(LayoutBuilder.prototype, 'setScreen').mockReturnThis();
        jest.spyOn(LayoutBuilder.prototype, 'setLayoutComponent').mockReturnThis();
        jest.spyOn(LayoutBuilder.prototype, 'setSearchComponent').mockReturnThis();
        jest.spyOn(LayoutBuilder.prototype, 'setTable').mockReturnThis();
        jest.spyOn(LayoutBuilder.prototype, 'build').mockReturnValue({
            table: { setData: jest.fn() },
            screen: { render: jest.fn() },
        });

        // Act
        view.render(data);

        view.getUpdateTable({ data: data, cleanFirst: false });

        // Assert
        const templateHeadersExpected = ['id', 'name', 'age'];
        const templateDataExpected = [
            ["id_one", "name_one", "age_one"],
            ["id_two", "name_two", "age_two"],
            ["id_one", "name_one", "age_one"],
            ["id_two", "name_two", "age_two"],
        ];
        expect(view.getTableData).toStrictEqual(templateDataExpected);
        expect(view.getComponents.table.setData).toHaveBeenCalledWith({
            headers: templateHeadersExpected,
            data: view.getTableData
        });
        expect(view.getComponents.screen.render).toHaveBeenCalled();
    })

    it('Should create and render component', () => {
        // Arrange
        const data = [
            { "id": "id_one", "name": "name_one", "age": "age_one", },
            { "id": "id_two", "name": "name_two", "age": "age_two", },
        ];
        const title = 'Design Patterns with Erick Wendel';

        const setScreenFn = jest.spyOn(LayoutBuilder.prototype, 'setScreen').mockReturnThis();
        const setLayoutComponentFn = jest.spyOn(LayoutBuilder.prototype, 'setLayoutComponent').mockReturnThis();
        const setSearchComponentFn = jest.spyOn(LayoutBuilder.prototype, 'setSearchComponent').mockReturnThis();
        const setTableFn = jest.spyOn(LayoutBuilder.prototype, 'setTable').mockReturnThis();
        const buildFn = jest.spyOn(LayoutBuilder.prototype, 'build').mockReturnValue({
            table: { setData: jest.fn() },
            screen: { render: jest.fn() },
        });

        // Act
        view.render(data);

        // Assert
        const templateHeadersExpected = ['id', 'name', 'age'];
        const templateDataExpected = [
            ["id_one", "name_one", "age_one"],
            ["id_two", "name_two", "age_two"],
        ];
        expect(view.getTableData).toStrictEqual(templateDataExpected);
        expect(view.getComponents.table.setData).not.toHaveBeenCalled();
        expect(view.getComponents.screen.render).not.toHaveBeenCalled();


        expect(setScreenFn).toHaveBeenCalledWith({ title });
        expect(setLayoutComponentFn).toHaveBeenCalled();
        expect(setSearchComponentFn).toHaveBeenCalledWith(view.getOnSearch);
        expect(setTableFn).toHaveBeenCalledWith({
            headers: templateHeadersExpected,
            data: templateDataExpected,
        });
        expect(buildFn).toHaveBeenCalled();
    })

    it('Should just render more data in component', async () => {
        // Arrange
        const data = [
            { "id": "id_one", "name": "name_one", "age": "age_one", },
            { "id": "id_two", "name": "name_two", "age": "age_two", },
        ];

        const setScreenFn = jest.spyOn(LayoutBuilder.prototype, 'setScreen').mockReturnThis();
        const setLayoutComponentFn = jest.spyOn(LayoutBuilder.prototype, 'setLayoutComponent').mockReturnThis();
        const setSearchComponentFn = jest.spyOn(LayoutBuilder.prototype, 'setSearchComponent').mockReturnThis();
        const setTableFn = jest.spyOn(LayoutBuilder.prototype, 'setTable').mockReturnThis();
        const buildFn = jest.spyOn(LayoutBuilder.prototype, 'build').mockReturnValue({
            table: { setData: jest.fn() },
            screen: { render: jest.fn() },
        });

        // assert
        expect(view.getFirstRender).toEqual(true)

        // Act
        view.render(data);

        // assert
        expect(view.getFirstRender).toEqual(false)

        // Act
        view.render(data[0]);

        // Assert
        const templateHeadersExpected = ['id', 'name', 'age'];
        const templateDataExpected = [
            ["id_one", "name_one", "age_one"],
            ["id_two", "name_two", "age_two"],
            ["id_one", "name_one", "age_one"],
        ];

        expect(view.getHeaders).toStrictEqual(templateHeadersExpected);
        expect(view.getTableData).toStrictEqual(templateDataExpected);

        expect(setScreenFn).toHaveBeenCalledTimes(1);
        expect(setLayoutComponentFn).toHaveBeenCalledTimes(1);
        expect(setSearchComponentFn).toHaveBeenCalledTimes(1);
        expect(setTableFn).toHaveBeenCalledTimes(1);
        expect(buildFn).toHaveBeenCalledTimes(1);
    })
})
