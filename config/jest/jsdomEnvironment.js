const { default: NodeEnvironment } = require('jest-environment-node');
const { JSDOM } = require('jsdom');

module.exports = class CustomJSDOMEnvironment extends NodeEnvironment {
    async setup() {
        await super.setup();

        this.dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
            url: 'http://localhost',
            pretendToBeVisual: true,
            resources: 'usable',
        });

        const { window } = this.dom;
        const { document } = window;

        this.global.window = window;
        this.global.document = document;
        this.global.navigator = window.navigator;
        this.global.location = window.location;
        this.global.history = window.history;
        this.global.Element = window.Element;
        this.global.HTMLElement = window.HTMLElement;
        this.global.localStorage = window.localStorage;
        this.global.sessionStorage = window.sessionStorage;

        this.global.fetch = window.fetch;
        this.global.Request = window.Request;
        this.global.Response = window.Response;
        this.global.Headers = window.Headers;
        this.global.URL = window.URL;

        const { TextEncoder, TextDecoder } = require('util');
        if (typeof this.global.TextEncoder === 'undefined') {
            this.global.TextEncoder = TextEncoder;
        }
        if (typeof this.global.TextDecoder === 'undefined') {
            this.global.TextDecoder = TextDecoder;
        }
    }

    async teardown() {
        this.dom?.window?.close();
        await super.teardown();
    }
};
