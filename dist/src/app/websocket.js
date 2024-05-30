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
    createOrderSocket: function() {
        return createOrderSocket;
    },
    setupWebsocket: function() {
        return setupWebsocket;
    },
    updateOrderSocket: function() {
        return updateOrderSocket;
    }
});
const _jsonwebtoken = require("jsonwebtoken");
const _auth = /*#__PURE__*/ _interop_require_default(require("./config/auth"));
const _prisma = /*#__PURE__*/ _interop_require_default(require("./lib/prisma"));
const _socketio = require("socket.io");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
let io;
const setupWebsocket = (server)=>{
    io = new _socketio.Server(server, {
        cors: {
            origin: true
        }
    });
    io.use(async (socket, next)=>{
        const token = socket.handshake.query.token;
        if (!token) return next(new Error('User not authenticated'));
        try {
            const decoded = (0, _jsonwebtoken.verify)(token, _auth.default.jwt.secret);
            const subDecoded = JSON.parse(decoded.sub);
            socket.data.user_id = subDecoded.user_id;
            return next();
        } catch  {
            return next(new Error('Token expired'));
        }
    });
    io.on('connection', async (socket)=>{
        const user_id = socket.data.user_id;
        const user = await _prisma.default.user.findUnique({
            where: {
                id: user_id
            }
        });
        if (!user) return;
        if (user.role === 'ADMIN') {
            socket.join('admin');
        } else {
            await _prisma.default.connections.create({
                data: {
                    socket_id: socket.id,
                    user_id
                }
            });
        }
        socket.on('disconnect', async ()=>{
            if (user.role === 'ADMIN') {
                io.in(socket.id).socketsLeave('admin');
            } else {
                const connectionActive = await _prisma.default.connections.findFirst({
                    where: {
                        socket_id: socket.id
                    }
                });
                await _prisma.default.connections.delete({
                    where: {
                        id: connectionActive?.id
                    }
                });
            }
        });
    });
};
const createOrderSocket = async ({ order, user_id })=>{
    const userConnections = await _prisma.default.connections.findMany({
        where: {
            user_id
        }
    });
    const userSocketIds = userConnections.map((pr)=>pr.socket_id);
    io.to([
        'admin',
        ...userSocketIds
    ]).emit('order_created', order);
};
const updateOrderSocket = async ({ order, user_id })=>{
    const userConnections = await _prisma.default.connections.findMany({
        where: {
            user_id
        }
    });
    const userSocketIds = userConnections.map((pr)=>pr.socket_id);
    io.to([
        'admin',
        ...userSocketIds
    ]).emit('order_updated', order);
};
