import { afterAll, beforeEach, describe, expect, it, jest } from '@jest/globals';
import View from '../../../platforms/web/view.js';


describe('#Suite Web View', () => {
    let view;
    let document;

    // Elements by querySelector
    let btnSearch;
    let btnClear;
    let filter;
    let container;

    // Elements by getElementById
    let tbody;

    const mountElementProperties = () => ({
        click: jest.fn(),
        addEventListener: jest.fn((_event, callback) => callback()),
        value: '',
        innerHTML: ''
    })

    beforeEach(() => {
        btnSearch = mountElementProperties();
        btnClear = mountElementProperties();
        filter = mountElementProperties();
        container = mountElementProperties();

        tbody = mountElementProperties();
        tbody.innerHTML = '<div></div>'

        document = {
            querySelector: jest.fn().mockImplementation(element => {
                if (element === '#btnSearch') return btnSearch
                if (element === '#btnClear') return btnClear
                if (element === '#filter') return filter
                if (element === '#container') return container

                return jest.fn() // just default
            }),
            getElementById: jest.fn().mockImplementation(element => {
                if (element === 'tbody') return tbody

                return jest.fn() // just default
            })
        }

        global.document = document

        view = new View()
    })

    afterAll(() => {
        jest.resetAllMocks();
        Reflect.deleteProperty(global, 'document');
    });

    it('Instance class View', () => {
        expect(document.querySelector).toBeCalledWith('#btnSearch')
        expect(document.querySelector).toBeCalledWith('#btnClear')
        expect(document.querySelector).toBeCalledWith('#filter')
        expect(document.querySelector).toBeCalledWith('#container')
    })

    it('add event listener click for #btnClear', () => {
        // Arrange
        const onClear = jest.fn()

        // Act
        view.configureOnClearClick(onClear)
        btnClear.click();

        // Assert
        expect(btnClear.addEventListener).toBeCalledTimes(1);
        expect(onClear).toBeCalledTimes(1);
        expect(filter.value).toEqual('');
    })

    it('add event listener click for #btnSearch', () => {
        // Arrange
        const onSearch = jest.fn()
        filter.value = 'my_filter_value'

        // Act
        view.configureOnSearchClick(onSearch)
        btnSearch.click();

        // Assert
        expect(btnSearch.addEventListener).toBeCalledTimes(1);
        expect(onSearch).toBeCalledTimes(1);
        expect(onSearch).toBeCalledWith(filter.value);
    })

    function _assert_build_table_header(data) {
        data = Array.isArray(data) ? data : [data]

        const tHeaders = Object.keys(data[0])
            .map(text => `<th scope=col>${text}</th>`)

        const expected = `
            <table id="table" class="table">
                <thead>
                    <tr>${tHeaders.join('')}</tr>
                </thead>
                <tbody id="tbody">
                </tbody>
            </table>
        `;

        expect(container.innerHTML.replaceAll(' ', '')).toEqual(expected.replaceAll(' ', ''));
    }

    function _assert_build_table_body({ data, cleanFirst }) {
        // Arrange
        data = Array.isArray(data) ? data : [data]

        const tBodyValues = data
            .map(item => Object.values(item))
            .map(item => item.map(value => `<td>${value}</td>`))
            .map(tds => `<tr>${tds.join('')}</tr>`)

        const oldContentInnerHTMLExpected = cleanFirst ? '' : '<div></div>'

        // Assert
        const expected = `${oldContentInnerHTMLExpected}${tBodyValues.join('')}`
        expect(tbody.innerHTML).toEqual(expected)
    }

    it('first render the a Table complete when data is a list', () => {
        // Arrange
        const data = [
            { "id": "id_one", "name": "name_one", "age": "age_one", },
            { "id": "id_two", "name": "name_two", "age": "age_two", },
        ]

        // Act
        view.render(data)

        // Assert
        _assert_build_table_header(data)
        _assert_build_table_body({ data, cleanFirst: Array.isArray(data) })
    })

    it('first render the a Table complete when data is not a list', () => {
        // Arrange
        const data = { "id": "id_one", "name": "name_one", "age": "age_one" }

        // Act
        view.render(data)

        // Assert
        _assert_build_table_header(data)
        _assert_build_table_body({ data, cleanFirst: Array.isArray(data) })
    })

    it('next renders the a Table complete', () => {
        // Arrange
        const data_first_render = [
            { "id": "id_one", "name": "name_one", "age": "age_one", },
            { "id": "id_two", "name": "name_two", "age": "age_two", },
        ]

        const data_second_render = {"id": "id_three", "name": "name_three", "age": "age_three" }

        // Act
        view.render(data_first_render)
        
        container.innerHTML = '<div></div>' // just for testing
        
        view.render(data_second_render)

        // Assert
        expect(tbody.innerHTML).toEqual(
            "<tr><td>id_one</td><td>name_one</td><td>age_one</td></tr>" +
            "<tr><td>id_two</td><td>name_two</td><td>age_two</td></tr>" +
            "<tr><td>id_three</td><td>name_three</td><td>age_three</td></tr>"
        )
        expect(container.innerHTML).toEqual('<div></div>') // Should not be updated again
    })

})