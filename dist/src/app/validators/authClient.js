"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "authClientValidator", {
    enumerable: true,
    get: function() {
        return authClientValidator;
    }
});
const _zodexpressmiddleware = require("zod-express-middleware");
const _zod = require("zod");
const _validator = /*#__PURE__*/ _interop_require_default(require("validator"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const schemaAuthClient = _zod.z.object({
    phone_number: _zod.z.string({
        required_error: 'phone number is required'
    }).refine((value)=>_validator.default.isMobilePhone(value, 'pt-PT'), {
        message: 'insert valid phone number '
    }),
    code: _zod.z.string().min(4, {
        message: 'Must have at least 4 characters'
    }).max(8, {
        message: 'Can only have a maximum of 8 characters'
    })
});
const authClientValidator = (0, _zodexpressmiddleware.validateRequest)({
    body: schemaAuthClient
});
