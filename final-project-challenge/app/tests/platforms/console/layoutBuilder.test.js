import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import blessed from 'blessed';
import contrib from 'blessed-contrib';
import LayoutBuilder from '../../../platforms/console/layoutBuilder';

describe('#Suite Layout Builder', () => {
    let layoutBuilder;

    beforeEach(() => {
        layoutBuilder = new LayoutBuilder();
    });

    it('set screen', () => {
        // Arrange
        const title = "My title"
        const key = jest.fn()
        const blessed_screen_mock = jest.spyOn(blessed, 'screen').mockReturnValue({ key })

        // Act
        const result = layoutBuilder.setScreen({ title });

        // Assert
        expect(blessed_screen_mock).toHaveBeenCalledTimes(1);

        const configExpected = { smartCSR: true, title };
        expect(blessed_screen_mock).toHaveBeenCalledWith(configExpected);
        expect(key).toHaveBeenCalledTimes(1)
        expect(key).toHaveBeenCalledWith(['escape', 'q', 'C-c'], expect.any(Function))
        expect(result).toBe(layoutBuilder)
    });


    it('set layout component', () => {
        // Arrange
        const key = jest.fn()
        const blessed_screen_mock = jest.spyOn(blessed, 'screen').mockReturnValue({ key })
        const blessed_layout_mock = jest.spyOn(blessed, 'layout').mockReturnThis();

        // Act
        layoutBuilder.setScreen({ title: 'My title' });
        const result = layoutBuilder.setLayoutComponent();

        // Assert
        expect(blessed_layout_mock).toHaveBeenCalledTimes(1);

        const configExpected = { parent: blessed_screen_mock.mock.results[0].value, width: '100%', height: '100%', };
        expect(blessed_layout_mock).toHaveBeenCalledWith(configExpected);
        expect(result).toBe(layoutBuilder)
    });


    it('set search component', () => {
        // Arrange
        const textarea_key = jest.fn();
        const screen_key = jest.fn();
        const blessed_textarea_mock = jest.spyOn(blessed, 'textarea').mockReturnValue({ key: textarea_key });
        const blessed_screen_mock = jest.spyOn(blessed, 'screen').mockReturnValue({ key: screen_key });
        const onSearch = jest.fn()

        // Act
        layoutBuilder.setScreen({ title: 'My title' });
        const result = layoutBuilder.setSearchComponent(onSearch);

        // Assert
        expect(blessed_screen_mock).toHaveBeenCalledTimes(1);

        const configExpected = {
            parent: blessed_screen_mock.mock.results[0].value,
            bottom: 2,
            height: '15%',
            inputOnFocus: true,
            padding: {
                top: 1,
                left: 2
            },
            style: {
                fg: '#f6f6f6',
                bg: '#353535'
            }
        };
        expect(blessed_textarea_mock).toHaveBeenCalledWith(configExpected);
        expect(textarea_key).toHaveBeenCalledWith('enter', expect.any(Function))
        expect(result).toBe(layoutBuilder)

        textarea_key.mock.calls[0][1]();
        expect(onSearch).toHaveBeenCalledWith(blessed_textarea_mock.mock.results[0].value)
    });


    it('set Table', () => {
        // Arrange
        const key = jest.fn()
        const setData = jest.fn()
        jest.spyOn(blessed, 'screen').mockReturnValue({ key })
        const blessed_layout_mock = jest.spyOn(blessed, 'layout').mockReturnThis()
        const contrib_table_mock = jest.spyOn(contrib, 'table').mockReturnValue({
            setData
        });

        const template = {
            data: [
                ['id', 'name', 'age']
            ]
        }

        // Act
        layoutBuilder.setScreen({ title: 'My title' });
        layoutBuilder.setLayoutComponent();
        const result = layoutBuilder.setTable(template)

        // Assert
        const configExpected = {
            border: 'line',
            mouse: true,
            keys: true,
            top: 0,
            scrollboard: {
                ch: ' ',
                inverse: true
            },
            tags: true,
            parent: blessed_layout_mock.mock.results[0].value,
            keys: true,
            fg: 'white',
            selectedFg: 'white',
            selectedBg: 'blue',
            interactive: true,
            label: 'Users',
            width: '100%',
            height: '75%',
            bottom: 1,
            border: { type: "line", fg: "cyan" },
            columnSpacing: 10,
            columnWidth: [12, 14, 13]
        };

        expect(contrib_table_mock).toHaveBeenCalledWith(configExpected);
        expect(setData).toHaveBeenCalledWith(template)
        expect(result).toBe(layoutBuilder)
    });


    it('Build', () => {
        // Arrange
        const focus_mock = jest.fn();
        const render_mock = jest.fn();
        jest.spyOn(blessed, 'layout').mockReturnThis();

        const blessed_screen_mock = jest.spyOn(blessed, 'screen').mockReturnValue({ 
            key: jest.fn(), render: render_mock
        })
        const blessed_textarea_mock = jest.spyOn(blessed, 'textarea').mockReturnValue({ 
            key: jest.fn(), focus: focus_mock
        });
        const contrib_table_mock = jest.spyOn(contrib, 'table').mockReturnValue({ setData: jest.fn() });

        const template = {
            data: [['id', 'name', 'age']]
        }

        // Act
        layoutBuilder.setScreen({ title: 'My title' });
        layoutBuilder.setLayoutComponent();
        layoutBuilder.setSearchComponent(jest.fn());
        layoutBuilder.setTable(template)
        const result = layoutBuilder.build()

        // Assert
        const components_expected = {
            screen: blessed_screen_mock.mock.results[0].value,
            input: blessed_textarea_mock.mock.results[0].value,
            table: contrib_table_mock.mock.results[0].value,
        }
        
        expect(result).toEqual(components_expected)
        expect(focus_mock).toBeCalled()
        expect(render_mock).toBeCalled()
    });


});
