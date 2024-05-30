/* eslint-disable @typescript-eslint/no-namespace */ /* eslint-disable @typescript-eslint/naming-convention */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _client = require("@prisma/client");
// Prevent multiple instances of Prisma Client in development
const prisma = global.prisma || new _client.PrismaClient();
if (process.env.NODE_ENV === 'localhost') global.prisma = prisma;
const _default = prisma;
