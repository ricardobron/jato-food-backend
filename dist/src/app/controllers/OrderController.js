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
const _AppError = /*#__PURE__*/ _interop_require_default(require("../errors/AppError"));
const _prisma = /*#__PURE__*/ _interop_require_default(require("../lib/prisma"));
const _websocket = require("../websocket");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
class OrderController {
    async find(req, res) {
        const user = await _prisma.default.user.findUniqueOrThrow({
            where: {
                id: req.user.id
            }
        });
        const response = await _prisma.default.order.findMany({
            where: {
                ...user.role === 'ADMIN' ? {} : {
                    user_id: user.id
                }
            },
            include: {
                order_items: {
                    include: {
                        product: true
                    }
                }
            }
        });
        const formatedResponse = response.map((order)=>({
                ...order,
                order_items: order.order_items.map((item)=>({
                        name: item.product.name,
                        quantity: item.quantity,
                        price: item.product.price
                    }))
            }));
        return res.json(formatedResponse);
    }
    async create(req, res) {
        const { products, table } = req.body;
        const user_id = req.user.id;
        const productIds = products.map((pr)=>pr.id);
        if (productIds.length === 0) throw new _AppError.default('Nenhum produto selecionado');
        const allProducts = await _prisma.default.products.findMany({
            where: {
                id: {
                    in: productIds
                }
            },
            select: {
                id: true,
                price: true,
                name: true
            }
        });
        function productQuantity(product_id) {
            return products.find((_product)=>_product.id === product_id)?.quantity || 0;
        }
        const total = allProducts.reduce((acc, obj)=>acc + obj.price + productQuantity(obj.id), 0);
        const lastOrder = await _prisma.default.order.findFirst({
            orderBy: {
                created_at: 'desc'
            }
        });
        const lastOrderNumber = (lastOrder?.order_number || 0) + 1;
        const createdOrder = await _prisma.default.$transaction(async (tx)=>{
            const order = await tx.order.create({
                data: {
                    table,
                    total,
                    user_id,
                    order_number: lastOrderNumber
                }
            });
            await tx.orderItem.createMany({
                data: allProducts.map((product)=>{
                    return {
                        order_id: order.id,
                        price: product.price,
                        product_id: product.id,
                        quantity: productQuantity(product.id)
                    };
                })
            });
            const dataPrismaTransaction = {
                ...order,
                order_items: allProducts.map((_productItem)=>({
                        name: _productItem.name,
                        price: _productItem.price,
                        quantity: productQuantity(_productItem.id)
                    }))
            };
            return dataPrismaTransaction;
        });
        await (0, _websocket.createOrderSocket)({
            user_id: req.user.id,
            order: createdOrder
        });
        return res.send();
    }
    async update(req, res) {
        const { id } = req.params;
        const { status } = req.body;
        const _order = await _prisma.default.order.update({
            data: {
                status
            },
            where: {
                id
            },
            include: {
                order_items: {
                    select: {
                        quantity: true,
                        price: true,
                        product: {
                            select: {
                                name: true
                            }
                        }
                    }
                }
            }
        });
        (0, _websocket.updateOrderSocket)({
            user_id: _order.user_id,
            order: {
                ..._order,
                order_items: _order.order_items.map((pr)=>({
                        name: pr.product.name,
                        price: pr.price,
                        quantity: pr.quantity
                    }))
            }
        });
        return res.send();
    }
}
const _default = new OrderController();
