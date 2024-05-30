"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "createProductValidator", {
    enumerable: true,
    get: function() {
        return createProductValidator;
    }
});
const _zodexpressmiddleware = require("zod-express-middleware");
const _zod = require("zod");
const schemaCreateProduct = _zod.z.object({
    name: _zod.z.string({
        required_error: 'name is required'
    }),
    price: _zod.z.number({
        required_error: 'price is required'
    }),
    active: _zod.z.boolean().default(false)
});
const createProductValidator = (0, _zodexpressmiddleware.validateRequest)({
    body: schemaCreateProduct
});
