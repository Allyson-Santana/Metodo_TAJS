import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import AnalyticsObserver from '../../../shared/observers/analytics.js';

describe('#Suite AnalyticsObserver', () => {
    let fetchMock;
    let analyticsObserver;
    let url = "http://localhost:9000"

    beforeEach(() => {
        fetchMock = jest.spyOn(global, fetch.name).mockImplementation(() => Promise.resolve());
        analyticsObserver = new AnalyticsObserver({ url })
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('Notify app', async () => {
        // Arrange
        const data = {
            event: "created", sentBy: "user_name"
        }

        // Act
        await analyticsObserver.notify(data)

        // Assert
        const url_expected = `${url}/analytics`
        const init_expected = {
            method: 'POST',
            body: JSON.stringify(data)
        }
        expect(fetchMock).toHaveBeenCalledWith(url_expected, init_expected)
    })
})

