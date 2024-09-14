import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import LogObserver from '../../../shared/observers/log.js';

describe('#Suite AnalyticsObserver', () => {
    let logObserver;
    
    beforeEach(() => {
        logObserver = new LogObserver()
    });

    it('Notify Log Observer', () => {
        // Arrange
        const data = {
            event: "created", 
            sentBy: "user_name", 
            payload: {
                id: 1,
                data: []
            }
        }
        consoleMock = jest.spyOn(console, 'log').mockReturnValue()

        // Act
        logObserver.notify(data)

        // Assert
        expect(consoleMock).toHaveBeenCalledWith('[logger]', data)
    })
})

