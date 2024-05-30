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
const _express = require("express");
const _AuthController = /*#__PURE__*/ _interop_require_default(require("../controllers/AuthController"));
const _authAdmin = require("../validators/authAdmin");
const _authClient = require("../validators/authClient");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const authRouter = (0, _express.Router)();
authRouter.post('/admin', _authAdmin.authAdminValidator, _AuthController.default.admin);
authRouter.post('/client', _authClient.authClientValidator, _AuthController.default.client);
const _default = authRouter;
