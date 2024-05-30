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
const _auth = /*#__PURE__*/ _interop_require_default(require("../config/auth"));
const _jsonwebtoken = require("jsonwebtoken");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
class AuthController {
    async admin(req, res) {
        const { email, password } = req.body;
        const user = await _prisma.default.user.findUnique({
            where: {
                email
            },
            select: {
                id: true,
                email: true,
                password: true,
                role: true
            }
        });
        if (!user) {
            throw new _AppError.default('User not found');
        }
        if (!user.password || user.role !== 'ADMIN') {
            throw new _AppError.default('User not allowed');
        }
        const passwordMatched = await (0, _bcryptjs.compare)(password, user.password);
        if (!passwordMatched) {
            throw new _AppError.default('Password not match');
        }
        const { expiresInToken, secret } = _auth.default.jwt;
        const token = (0, _jsonwebtoken.sign)({}, secret, {
            subject: JSON.stringify({
                user_id: user.id
            }),
            expiresIn: expiresInToken
        });
        return res.json({
            user: {
                id: user.id,
                email: user.email,
                role: user.role
            },
            token
        });
    }
    async client(req, res) {
        const { phone_number, code } = req.body;
        console.log(req.body);
        let user;
        user = await _prisma.default.user.findFirst({
            where: {
                phone_number
            },
            select: {
                id: true,
                phone_number: true,
                role: true,
                code: true
            }
        });
        if (!user) {
            const codeHashed = await (0, _bcryptjs.hash)(code, 8);
            user = await _prisma.default.user.create({
                data: {
                    code: codeHashed,
                    phone_number
                }
            });
        }
        if (!user.code) {
            throw new _AppError.default('User invalid');
        }
        const codeMatched = await (0, _bcryptjs.compare)(code, user.code);
        if (!codeMatched) {
            throw new _AppError.default('Code not match');
        }
        const { expiresInToken, secret } = _auth.default.jwt;
        const token = (0, _jsonwebtoken.sign)({}, secret, {
            subject: JSON.stringify({
                user_id: user.id
            }),
            expiresIn: expiresInToken
        });
        return res.json({
            user: {
                id: user.id,
                phone_number,
                role: user.role
            },
            token
        });
    }
}
const _default = new AuthController();
