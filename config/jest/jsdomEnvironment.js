const { default: JSDOMEnvironment } = require('jest-environment-jsdom');

module.exports = class CustomJSDOMEnvironment extends JSDOMEnvironment {
    async setup() {
        await super.setup();
        const { TextEncoder, TextDecoder } = require('util');
        if (typeof this.global.TextEncoder === 'undefined') {
            this.global.TextEncoder = TextEncoder;
        }
        if (typeof this.global.TextDecoder === 'undefined') {
            this.global.TextDecoder = TextDecoder;
        }
    }
};
