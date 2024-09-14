import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import Handlers from './../src/handlers.js';
import router from './../src/router.js';


describe("#Router Suite", () => {
    let req, res;
    
    beforeEach(() => {
        req = {
            method: '',
            url: '',
        };

        res = {
            setHeader: jest.fn(),
            writeHead: jest.fn(),
            end: jest.fn(),
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    })

    
    it('Should set CORS headers', async () => {
        req.method = 'OPTIONS';
        req.url = '/';
        
        await router(req, res);

        expect(res.setHeader).toHaveBeenCalledWith('Access-Control-Allow-Origin', '*');
        expect(res.setHeader).toHaveBeenCalledWith('Access-Control-Allow-Methods', '*');
    });

    it('Should call options when method is OPTIONS', async () => {
        req.method = 'OPTIONS';
        req.url = '/';

        const mockOptions = jest.fn().mockResolvedValue();
        Handlers.prototype.options = mockOptions;

        await router(req, res);

        expect(Handlers.prototype.options)
    });

    it('Should return 404 Not Found', async () => {
        await router(req, res);

        expect(res.writeHead).toHaveBeenCalledWith(404, { 'Content-Type': 'text/plain' });
        expect(res.end).toHaveBeenCalledWith('Not Found');
    });

    it('Should call analyticsPost when method is POST and uri /analytics', async () => {
        req.method = 'POST';
        req.url = '/analytics';

        const mockAnalytics = jest.fn().mockResolvedValue();
        Handlers.prototype.analytics = mockAnalytics;

        await router(req, res);

        expect(Handlers.prototype.analytics)
    });
    
    it('Should call generateData when method is POST and uri /faker-data', async () => {
        req.method = 'POST';
        req.url = '/faker-data';

        const mockGenerateData = jest.fn().mockResolvedValue();
        Handlers.prototype.generateData = mockGenerateData;

        await router(req, res);

        expect(Handlers.prototype.generateData)
    });
});
