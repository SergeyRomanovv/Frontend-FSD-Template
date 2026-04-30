const { default: NodeEnvironment } = require('jest-environment-node');
const { Window } = require('happy-dom');

module.exports = class CustomJSDOMEnvironment extends NodeEnvironment {
    async setup() {
        await super.setup();

        this.window = new Window({
            url: 'http://localhost',
            width: 1920,
            height: 1080,
        });

        const { document } = this.window;

        this.global.window = this.window;
        this.global.document = document;
        this.global.navigator = this.window.navigator;
        this.global.location = this.window.location;
        this.global.history = this.window.history;
        this.global.Element = this.window.Element;
        this.global.HTMLElement = this.window.HTMLElement;
        this.global.localStorage = this.window.localStorage;
        this.global.sessionStorage = this.window.sessionStorage;
        this.global.XMLSerializer = this.window.XMLSerializer;

        this.global.fetch = this.window.fetch;
        this.global.Request = this.window.Request;
        this.global.Response = this.window.Response;
        this.global.Headers = this.window.Headers;
        this.global.URL = this.window.URL;
        this.global.DOMException = this.window.DOMException;

        const { TextEncoder, TextDecoder } = require('util');
        if (typeof this.global.TextEncoder === 'undefined') {
            this.global.TextEncoder = TextEncoder;
        }
        if (typeof this.global.TextDecoder === 'undefined') {
            this.global.TextDecoder = TextDecoder;
        }
    }

    async teardown() {
        this.window?.close?.();
        await super.teardown();
    }
};
