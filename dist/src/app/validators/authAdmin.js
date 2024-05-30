"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "authAdminValidator", {
    enumerable: true,
    get: function() {
        return authAdminValidator;
    }
});
const _zodexpressmiddleware = require("zod-express-middleware");
const _zod = require("zod");
const schemaAuthAdmin = _zod.z.object({
    email: _zod.z.string({
        required_error: 'email is required'
    }).email(),
    password: _zod.z.string({
        required_error: 'password need at least 8 characters'
    }).min(8)
});
const authAdminValidator = (0, _zodexpressmiddleware.validateRequest)({
    body: schemaAuthAdmin
});
