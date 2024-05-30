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
const _bcryptjs = require("bcryptjs");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
class UserController {
    async create(req, res) {
        const { email, password } = req.body;
        const hashedPassword = await (0, _bcryptjs.hash)(password, 8);
        const findedUser = await _prisma.default.user.findUnique({
            where: {
                email
            }
        });
        if (findedUser) {
            throw new _AppError.default('User already registered');
        }
        const user = await _prisma.default.user.create({
            data: {
                email,
                password: hashedPassword,
                role: 'ADMIN'
            }
        });
        return res.json({
            id: user.id,
            email: user.email
        });
    }
}
const _default = new UserController();
