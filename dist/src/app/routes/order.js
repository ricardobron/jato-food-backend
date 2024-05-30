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
const _OrderController = /*#__PURE__*/ _interop_require_default(require("../controllers/OrderController"));
const _ensureAuthenticated = /*#__PURE__*/ _interop_require_default(require("../middlewares/ensureAuthenticated"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const orderRouter = (0, _express.Router)();
orderRouter.get('/', (0, _ensureAuthenticated.default)([
    'USER',
    'ADMIN'
]), _OrderController.default.find);
orderRouter.post('/', (0, _ensureAuthenticated.default)([
    'USER'
]), _OrderController.default.create);
orderRouter.put('/:id', /*is(['ADMIN']),*/ _OrderController.default.update);
const _default = orderRouter;
