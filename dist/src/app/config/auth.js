"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _default = {
    jwt: {
        secret: process.env.APP_SECRET || 'app_secret',
        expiresInToken: 7 * 20 * 60 * 60
    }
};
