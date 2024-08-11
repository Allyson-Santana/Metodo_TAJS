import { describe, expect, it, jest } from '@jest/globals'
import View from '../../public/src/view.js'

describe('View test suite', () => {
    it('#updateList should append content to card-list innerHTML', () => {
        const innerHTMLSpy = jest.fn()
        const baseHTML = '<div><div/>'
        const querySelectorProxy = new Proxy({
            innerHTML: baseHTML
        }, {
            set(obj, key, value) {
                obj[key] = value

                innerHTMLSpy(obj[key])

                return true
            }
        })
        jest
            .spyOn(document, document.querySelector.name)
            .mockImplementation((key) => {
                if (key !== '#card-list') return;

                return querySelectorProxy
            })

        const view = new View()
        const data = {
            title: 'title',
            imageUrl: 'https://img.com/img.png'
        }
        const generatedContent = `
        <article class="col-md-12 col-lg-4 col-sm-3 top-30">
                <div class="card">
                    <figure>
                        <img class="card-img-top card-img"
                            src="${data.imageUrl}"
                            alt="Image of an ${data.title}">
                        <figcaption>
                            <h4 class="card-title">${data.title}</h4>
                        </figcaption>
                    </figure>
                </div>
            </article>
        `

        view.updateList([data])

        expect(innerHTMLSpy).toHaveBeenNthCalledWith(
            1,
            baseHTML + generatedContent
        )

        view.updateList([data])

        expect(innerHTMLSpy).toHaveBeenNthCalledWith(
            2,
            baseHTML + generatedContent + generatedContent
        )

    })

    it('#initialize should add event listener for all forms found with needs-validation class', () => {
        const addEventListenerMock = jest.fn();
        const formElementMock = { addEventListener: addEventListenerMock };

        jest.spyOn(document, 'querySelectorAll').mockImplementation((selector) => {
            if (selector !== '.needs-validation') return;
            return [formElementMock, formElementMock]
        });

        const view = new View();
        view.initialize();

        expect(addEventListenerMock).toHaveBeenCalledTimes(2);
        expect(addEventListenerMock).toHaveBeenCalledWith('submit', expect.any(Function), false);
    })

    it('#configureOnSubmit should set #submitFn and call it on form submit', () => {
        const formElementMock = {
            addEventListener: jest.fn(),
            checkValidity: jest.fn().mockReturnValue(true),
            classList: {
                add: jest.fn(),
                remove: jest.fn(),
            },
            reset: jest.fn(),
            elements: [],
            title: { value: 'Test Title' },
            imageUrl: { value: 'https://test.com/image.png' },
        };

        const titleElementMock = {
            focus: jest.fn(),
        }

        jest.spyOn(document, 'querySelectorAll').mockImplementation((selector) => {
            if (selector === '.needs-validation') {
                return [formElementMock];
            }
            return [];
        });

        jest.spyOn(document, 'querySelector').mockImplementation((selector) => {
            if (selector === '#title') {
                return titleElementMock;
            }
            return [];
        });

        const view = new View();

        const submitCallback = jest.fn();
        view.configureOnSubmit(submitCallback);

        view.initialize();

        const eventMock = {
            preventDefault: jest.fn(),
            stopPropagation: jest.fn(),
        };

        const onSubmitHandler = formElementMock.addEventListener.mock.calls[0][1];
        onSubmitHandler(eventMock);

        expect(submitCallback).toHaveBeenCalledWith({
            title: 'Test Title',
            imageUrl: 'https://test.com/image.png'
        });
    })

    it('configureOnSubmit should set #submitFn and call it on form submit', () => {
        const formElementMock = {
            addEventListener: jest.fn(),
            checkValidity: jest.fn().mockReturnValue(true),
            classList: {
                add: jest.fn(),
                remove: jest.fn(),
            },
            reset: jest.fn(),
            elements: [],
            title: { value: 'Test Title' },
            imageUrl: { value: 'https://test.com/image.png' },
        };

        const titleElementMock = {
            focus: jest.fn(),
        };

        jest.spyOn(document, 'querySelectorAll').mockImplementation((selector) => {
            if (selector === '.needs-validation') {
                return [formElementMock];
            }
            return [];
        });

        jest.spyOn(document, 'querySelector').mockImplementation((selector) => {
            if (selector === '#title') {
                return titleElementMock;
            }
            return [];
        });

        const view = new View();

        const submitCallback = jest.fn();
        view.configureOnSubmit(submitCallback);

        view.initialize();

        const eventMock = {
            preventDefault: jest.fn(),
            stopPropagation: jest.fn(),
        };

        const onSubmitHandler = formElementMock.addEventListener.mock.calls[0][1];
        onSubmitHandler(eventMock);

        expect(submitCallback).toHaveBeenCalledWith({
            title: 'Test Title',
            imageUrl: 'https://test.com/image.png'
        });
    });

    it('#onSubmit should handle form submission correctly with all elements valid', () => {
        const formElementMock = {
            addEventListener: jest.fn(),
            checkValidity: jest.fn().mockReturnValue(true),
            classList: {
                add: jest.fn(),
                remove: jest.fn(),
            },
            reset: jest.fn(),
            elements: [],
            title: { value: 'Test Title' },
            imageUrl: { value: 'https://test.com/image.png' },
        };

        const titleElementMock = {
            focus: jest.fn(),
        };

        jest.spyOn(document, 'querySelectorAll').mockImplementation((selector) => {
            if (selector === '.needs-validation') {
                return [formElementMock];
            }
            return [];
        });

        jest.spyOn(document, 'querySelector').mockImplementation((selector) => {
            if (selector === '#title') {
                return titleElementMock;
            }
            return [];
        });

        const view = new View();

        const submitCallback = jest.fn();
        view.configureOnSubmit(submitCallback);

        view.initialize();

        const eventMock = {
            preventDefault: jest.fn(),
            stopPropagation: jest.fn(),
        };

        const onSubmitHandler = formElementMock.addEventListener.mock.calls[0][1];
        onSubmitHandler(eventMock);

        expect(eventMock.preventDefault).toHaveBeenCalled();
        expect(eventMock.stopPropagation).toHaveBeenCalled();
        expect(submitCallback).toHaveBeenCalledWith({
            title: 'Test Title',
            imageUrl: 'https://test.com/image.png'
        });
        expect(formElementMock.reset).toHaveBeenCalled();
        expect(titleElementMock.focus).toHaveBeenCalled();
        expect(formElementMock.classList.add).toHaveBeenCalledWith('was-validated');
        expect(formElementMock.classList.remove).toHaveBeenCalledWith('was-validated');
    });

    it.each([
        [[]],
        [[{ checkValidity: jest.fn().mockReturnValue(true) }]],
        [[
            { checkValidity: jest.fn().mockReturnValue(true) }, 
            { checkValidity: jest.fn().mockReturnValue(false),  focus: jest.fn() }
        ]]
    ])('#onSubmit does not should handle form submission correctly with some elements invalid', (
        elements
    ) => {       
        const formElementMock = {
            addEventListener: jest.fn(),
            checkValidity: jest.fn().mockReturnValue(false),
            classList: {
                add: jest.fn(),
                remove: jest.fn(),
            },
            reset: jest.fn(),
            elements: Array.from(elements),
            title: { value: 'Test Title' },
            imageUrl: { value: 'https://test.com/image.png' },
        };

        jest.spyOn(document, 'querySelectorAll').mockImplementation((selector) => {
            if (selector === '.needs-validation') {
                return [formElementMock];
            }
            return [];
        });

        const view = new View();

        const submitCallback = jest.fn();
        view.configureOnSubmit(submitCallback);

        view.initialize();

        const eventMock = {
            preventDefault: jest.fn(),
            stopPropagation: jest.fn(),
        };

        const onSubmitHandler = formElementMock.addEventListener.mock.calls[0][1];
        onSubmitHandler(eventMock);

        expect(eventMock.preventDefault).toHaveBeenCalled();
        expect(eventMock.stopPropagation).toHaveBeenCalled();
        expect(submitCallback).not.toBeCalled();
    });

    it('#getSubmitFn, #getSubmitFn and getOnSubmit initial value', () => {
        const view = new View();
        const submitFn = view.getSubmitFn();
        const onSubmit = view.getOnSubmit();

        expect(typeof onSubmit).toBe('function');

        expect(typeof submitFn).toBe('function');
        expect(() => submitFn()).not.toThrow();
    })
})