"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return AppError;
    }
});
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
class AppError extends Error {
    constructor(message, statusCode = 400){
        super();
        _define_property(this, "message", void 0);
        _define_property(this, "statusCode", void 0);
        this.message = message;
        this.statusCode = statusCode;
    }
}
