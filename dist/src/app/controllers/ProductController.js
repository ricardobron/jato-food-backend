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
const _prisma = /*#__PURE__*/ _interop_require_default(require("../lib/prisma"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
class ProductController {
    async find(req, res) {
        const user = await _prisma.default.user.findUniqueOrThrow({
            where: {
                id: req.user.id
            }
        });
        const response = await _prisma.default.products.findMany({
            where: {
                ...user.role === 'ADMIN' ? {
                    deleted_at: null
                } : {
                    active: true,
                    deleted_at: null
                }
            }
        });
        return res.json(response);
    }
    async create(req, res) {
        const { name, price, active } = req.body;
        const product = await _prisma.default.products.create({
            data: {
                name,
                price,
                active
            }
        });
        return res.json(product);
    }
    async update(req, res) {
        const { id } = req.params;
        const { name, price, active } = req.body;
        await _prisma.default.products.update({
            data: {
                name,
                price,
                active
            },
            where: {
                id
            }
        });
        return res.send();
    }
    async delete(req, res) {
        const { id } = req.params;
        await _prisma.default.products.update({
            data: {
                deleted_at: new Date()
            },
            where: {
                id
            }
        });
        return res.send();
    }
}
const _default = new ProductController();
