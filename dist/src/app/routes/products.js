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
const _ProductController = /*#__PURE__*/ _interop_require_default(require("../controllers/ProductController"));
const _ensureAuthenticated = /*#__PURE__*/ _interop_require_default(require("../middlewares/ensureAuthenticated"));
const _products = require("../validators/products");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const productRouter = (0, _express.Router)();
productRouter.get('/', (0, _ensureAuthenticated.default)([
    'ADMIN',
    'USER'
]), _ProductController.default.find);
productRouter.post('/', (0, _ensureAuthenticated.default)([
    'ADMIN'
]), _products.createProductValidator, _ProductController.default.create);
productRouter.put('/:id', (0, _ensureAuthenticated.default)([
    'ADMIN'
]), _ProductController.default.update);
productRouter.delete('/:id', (0, _ensureAuthenticated.default)([
    'ADMIN'
]), _ProductController.default.delete);
const _default = productRouter;
