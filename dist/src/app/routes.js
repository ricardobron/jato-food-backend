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
const _auth = /*#__PURE__*/ _interop_require_default(require("./routes/auth"));
const _user = /*#__PURE__*/ _interop_require_default(require("./routes/user"));
const _order = /*#__PURE__*/ _interop_require_default(require("./routes/order"));
const _products = /*#__PURE__*/ _interop_require_default(require("./routes/products"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const routes = (0, _express.Router)();
routes.use('/auth', _auth.default);
routes.use('/order', _order.default);
routes.use('/product', _products.default);
routes.use('/user', _user.default);
const _default = routes;
