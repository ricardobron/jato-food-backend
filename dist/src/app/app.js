"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
require("dotenv/config");
const _express = /*#__PURE__*/ _interop_require_default(require("express"));
const _cors = /*#__PURE__*/ _interop_require_default(require("cors"));
require("express-async-errors");
const _nodehttp = /*#__PURE__*/ _interop_require_default(require("node:http"));
const _routes = /*#__PURE__*/ _interop_require_default(require("./routes"));
const _websocket = require("./websocket");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const app = (0, _express.default)();
const server = _nodehttp.default.createServer(app);
const PORT = process.env.PORT || 3333;
(0, _websocket.setupWebsocket)(server);
app.use((0, _cors.default)());
app.use(_express.default.json());
app.use(_routes.default);
app.use(async (err, req, response, _)=>{
    if (err.statusCode) {
        return response.status(err.statusCode).json({
            ...err,
            message: err.message || err.name,
            type: 'AppError'
        });
    }
    console.error(err);
    return response.status(500).json({
        error: 'Internal server error'
    });
});
server.listen(PORT, ()=>{
    console.log(`🚀 Rodando na porta ${PORT}`, new Date());
});
