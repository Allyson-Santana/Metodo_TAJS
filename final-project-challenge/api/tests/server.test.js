import { describe, expect, it } from '@jest/globals';
import { Server } from 'node:http';
import { server } from './../src/server.js';

describe("#Server Suite", () => {
    it('Should return a server configured', () => {
        expect(server).toBeInstanceOf(Server);
    });

    it('Should use a function with two parameters (req, res)', () => {
        const listeners = server.listeners('request');

        expect(listeners.length).toBeGreaterThan(0);
        expect(typeof listeners[0]).toBe('function');

        const firstListener = listeners[0];

        function checkCallbackSignature(fn) {
            return fn.length === 2;
        }

        expect(checkCallbackSignature(firstListener)).toBe(true);
    });
});
