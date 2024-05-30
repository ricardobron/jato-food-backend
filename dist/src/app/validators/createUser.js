"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "createUserValidator", {
    enumerable: true,
    get: function() {
        return createUserValidator;
    }
});
const _zodexpressmiddleware = require("zod-express-middleware");
const _zod = require("zod");
const schemaCreateUser = _zod.z.object({
    email: _zod.z.string({
        required_error: 'email is required'
    }).email(),
    password: _zod.z.string({
        required_error: 'password need at least 8 characters'
    }).min(8)
});
const createUserValidator = (0, _zodexpressmiddleware.validateRequest)({
    body: schemaCreateUser
});
