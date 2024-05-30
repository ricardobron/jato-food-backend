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
const _UserController = /*#__PURE__*/ _interop_require_default(require("../controllers/UserController"));
const _createUser = require("../validators/createUser");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const userRouter = (0, _express.Router)();
userRouter.post('/', _createUser.createUserValidator, _UserController.default.create);
const _default = userRouter;
