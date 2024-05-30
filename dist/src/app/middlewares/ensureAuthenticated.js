"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    default: function() {
        return is;
    },
    is: function() {
        return is;
    }
});
require("dotenv/config");
const _jsonwebtoken = require("jsonwebtoken");
const _auth = /*#__PURE__*/ _interop_require_default(require("../config/auth"));
const _AppError = /*#__PURE__*/ _interop_require_default(require("../errors/AppError"));
const _prisma = /*#__PURE__*/ _interop_require_default(require("../lib/prisma"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function is(role) {
    const roleAuthorized = async (req, res, next)=>{
        const authHeader = req.headers.authorization || req.query.token;
        if (typeof authHeader !== 'string') {
            throw new _AppError.default('JWT token is missing', 401);
        }
        const BEARER_PREFIX = 'Bearer ';
        const token = authHeader.startsWith(BEARER_PREFIX) ? authHeader.slice(BEARER_PREFIX.length) : authHeader;
        try {
            const decoded = (0, _jsonwebtoken.verify)(token, _auth.default.jwt.secret);
            const subDecoded = JSON.parse(decoded.sub);
            const user = await _prisma.default.user.findUnique({
                where: {
                    id: subDecoded.user_id
                }
            });
            if (!user) {
                throw new _AppError.default('User not found');
            }
            if (!role.includes(user.role)) {
                throw new _AppError.default('User dont have permission');
            }
            req.user = {
                id: subDecoded.user_id
            };
            return next();
        } catch (err) {
            if (err.message === 'jwt expired') {
                throw new _AppError.default('Token expired', 401);
            }
            throw new _AppError.default('JWT not exists', 401);
        }
    };
    return roleAuthorized;
}
